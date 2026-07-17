import { Document } from '../models/document.model.js';
import { Notification } from '../models/notification.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import Groq from 'groq-sdk';

const groq = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

const TEMPLATE_PROMPTS = {
    notice: `Generate a formal legal notice letter for Nepal. Include: sender details, recipient details, subject line, clear statement of the issue, legal references to relevant Nepali acts, specific demands/requests, a deadline for response, and signature block. Use professional legal language. Format with proper sections.`,

    complaint: `Generate a formal complaint letter for filing with Nepali authorities. Include: complainant details, respondent details, subject, detailed description of the incident, legal provisions violated (cite relevant Nepali laws), evidence/documents attached, prayer/relief sought, signature and date.`,

    affidavit: `Generate an affidavit format as used in Nepali courts. Include: deponent details, oath/solemn affirmation, numbered statements of facts, verification clause, signature before oath commissioner.`,

    agreement: `Generate a legally sound agreement template for Nepal. Include: parties details, recitals/background, defined terms, detailed clauses covering rights and obligations, term, termination, dispute resolution (mention Nepal arbitration), governing law (Nepali law), signatures.`,

    application: `Generate a formal application letter for Nepali government office. Include: applicant details, subject, respectful salutation, clear purpose of application, supporting details, list of attachments, thank you note, signature.`,

    letter: `Generate a professional legal letter for Nepali context. Include: date, addresses, subject, formal salutation, clear body paragraphs, closing, signature.`,
};

export const generateDocument = asyncHandler(async (req, res) => {
    const { type, formData } = req.body;

    if (!type || !formData) {
        throw new ApiError(400, 'Document type and form data are required');
    }

    if (!groq) {
        return ApiResponse.success(res, 'Document template ready', {
            title: `${type.charAt(0).toUpperCase() + type.slice(1)} Template`,
            type,
            content: `# ${type.charAt(0).toUpperCase() + type.slice(1)} Template\n\nFill in the following fields to generate your document:\n\n${Object.entries(formData).map(([k, v]) => `- **${k}**: ${v || '[Your ' + k + ']'}`).join('\n')}`,
            formData,
        });
    }

    const prompt = `${TEMPLATE_PROMPTS[type] || TEMPLATE_PROMPTS.letter}\n\nUse these details:\n${Object.entries(formData).map(([k, v]) => `${k}: ${v || 'N/A'}`).join('\n')}`;

    const completion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: 'You are a legal document assistant for Nepal. Generate documents in English. Use proper legal formatting. Return only the document content.' },
            { role: 'user', content: prompt },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content || '';

    const title = formData.title || `${type.charAt(0).toUpperCase() + type.slice(1)} - ${new Date().toLocaleDateString()}`;

    return ApiResponse.success(res, 'Document generated', { title, type, content, formData });
});

export const saveDocument = asyncHandler(async (req, res) => {
    const { title, type, content, formData } = req.body;
    if (!title || !type || !content) {
        throw new ApiError(400, 'Title, type, and content are required');
    }

    const doc = await Document.create({
        userId: req.user._id,
        title,
        type,
        content,
        formData,
    });

    await Notification.create({
        userId: req.user._id,
        type: 'document_ready',
        title: 'Document saved',
        message: `"${title}" has been saved to your documents.`,
        link: '/auth/settings/documents',
    }).catch(() => {});

    return ApiResponse.success(res, 'Document saved', doc, 201);
});

export const getDocuments = asyncHandler(async (req, res) => {
    const docs = await Document.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .lean();
    return ApiResponse.success(res, 'Documents fetched', docs);
});

export const getDocument = asyncHandler(async (req, res) => {
    const doc = await Document.findById(req.params.id);
    if (!doc) throw new ApiError(404, 'Document not found');
    if (doc.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, 'Not authorized');
    }
    return ApiResponse.success(res, 'Document fetched', doc);
});

export const deleteDocument = asyncHandler(async (req, res) => {
    const doc = await Document.findById(req.params.id);
    if (!doc) throw new ApiError(404, 'Document not found');
    if (doc.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, 'Not authorized');
    }
    await Document.findByIdAndDelete(req.params.id);
    return ApiResponse.success(res, 'Document deleted');
});

export const getTemplates = asyncHandler(async (req, res) => {
    const templates = Object.keys(TEMPLATE_PROMPTS).map(type => ({
        id: type,
        name: type.charAt(0).toUpperCase() + type.slice(1),
        description: getTemplateDescription(type),
        icon: getTemplateIcon(type),
        fields: getTemplateFields(type),
    }));

    return ApiResponse.success(res, 'Templates fetched', templates);
});

function getTemplateDescription(type) {
    const descs = {
        notice: 'Formal legal notice letters for various purposes (eviction, breach of contract, demand, etc.)',
        complaint: 'Complaint letters to file with Nepali authorities or organizations',
        affidavit: 'Sworn affidavit format for legal proceedings in Nepali courts',
        agreement: 'Contracts and agreements with proper legal clauses',
        application: 'Formal applications to government offices and institutions',
        letter: 'General legal correspondence letters',
    };
    return descs[type] || 'Legal document template';
}

function getTemplateIcon(type) {
    const icons = {
        notice: 'FileText',
        complaint: 'AlertCircle',
        affidavit: 'Scale',
        agreement: 'FileSignature',
        application: 'ClipboardList',
        letter: 'Mail',
    };
    return icons[type] || 'FileText';
}

function getTemplateFields(type) {
    const common = [
        { key: 'fullName', label: 'Your Full Name', type: 'text' },
        { key: 'address', label: 'Your Address', type: 'text' },
        { key: 'phone', label: 'Your Phone', type: 'tel' },
        { key: 'email', label: 'Your Email', type: 'email' },
    ];

    const specific = {
        notice: [
            { key: 'recipientName', label: 'Recipient Name', type: 'text' },
            { key: 'recipientAddress', label: 'Recipient Address', type: 'text' },
            { key: 'subject', label: 'Subject', type: 'text' },
            { key: 'issueDescription', label: 'Description of Issue', type: 'textarea' },
            { key: 'demands', label: 'Your Demands/Requests', type: 'textarea' },
            { key: 'deadline', label: 'Response Deadline', type: 'text' },
            { key: 'legalReferences', label: 'Legal References (optional)', type: 'text' },
        ],
        complaint: [
            { key: 'respondentName', label: 'Respondent Name', type: 'text' },
            { key: 'respondentAddress', label: 'Respondent Address', type: 'text' },
            { key: 'subject', label: 'Subject', type: 'text' },
            { key: 'incidentDetails', label: 'Incident Details', type: 'textarea' },
            { key: 'legalProvisions', label: 'Legal Provisions Violated', type: 'text' },
            { key: 'evidence', label: 'Evidence Available', type: 'textarea' },
            { key: 'reliefSought', label: 'Relief/Prayer Sought', type: 'textarea' },
        ],
        affidavit: [
            { key: 'deponentName', label: 'Deponent Name', type: 'text' },
            { key: 'fatherName', label: "Father's Name", type: 'text' },
            { key: 'occupation', label: 'Occupation', type: 'text' },
            { key: 'statements', label: 'Statements to Include', type: 'textarea' },
            { key: 'purpose', label: 'Purpose of Affidavit', type: 'text' },
        ],
        agreement: [
            { key: 'partyAName', label: 'Party A Name', type: 'text' },
            { key: 'partyBName', label: 'Party B Name', type: 'text' },
            { key: 'agreementType', label: 'Type of Agreement', type: 'text' },
            { key: 'term', label: 'Term/Duration', type: 'text' },
            { key: 'consideration', label: 'Payment/Consideration', type: 'text' },
            { key: 'keyTerms', label: 'Key Terms and Conditions', type: 'textarea' },
        ],
        application: [
            { key: 'recipientOffice', label: 'Recipient Office/Authority', type: 'text' },
            { key: 'subject', label: 'Subject', type: 'text' },
            { key: 'purpose', label: 'Purpose of Application', type: 'textarea' },
            { key: 'supportingDocs', label: 'Supporting Documents', type: 'text' },
        ],
        letter: [
            { key: 'recipientName', label: 'Recipient Name', type: 'text' },
            { key: 'recipientAddress', label: 'Recipient Address', type: 'text' },
            { key: 'subject', label: 'Subject', type: 'text' },
            { key: 'message', label: 'Message Body', type: 'textarea' },
        ],
    };
    return [...common, ...(specific[type] || specific.letter)];
}

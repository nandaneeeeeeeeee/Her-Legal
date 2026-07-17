import { useState } from "react";
import { Search, BookOpen, ChevronDown } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import "./LegalGlossary.css";

const TERMS = [
  { term: 'Affidavit', category: 'Court Procedure', definition: 'A written statement confirmed by oath, used as evidence in court. In Nepal, affidavits must be sworn before a notary public or court officer.', nepali: 'हलफनामा' },
  { term: 'Alimony', category: 'Family Law', definition: 'Financial support paid by one spouse to another after separation or divorce. Nepali law entitles a wife to alimony if she cannot support herself.', nepali: 'गुजारा भत्ता' },
  { term: 'Bail', category: 'Criminal Law', definition: 'Temporary release of an accused person awaiting trial, often secured by a monetary guarantee. Nepal\'s Muluki Criminal Code governs bail provisions.', nepali: 'जमानत' },
  { term: 'Benami Transaction', category: 'Property Law', definition: 'A transaction where property is bought in someone else\'s name. Nepal has laws prohibiting benami transactions to prevent money laundering.', nepali: 'बेनामी कारोबार' },
  { term: 'Caveat', category: 'Property Law', definition: 'A legal notice to a court or public officer to prevent certain action (like property transfer) until the person giving notice is heard.', nepali: 'क्याभिएट' },
  { term: 'Child Custody', category: 'Family Law', definition: 'Legal rights and responsibilities regarding the care of a child after parents separate. Nepali courts prioritize the child\'s best interests.', nepali: 'बाल संरक्षण' },
  { term: 'Civil Suit', category: 'Civil Law', definition: 'A legal case between individuals or organizations regarding rights, property, or money, as opposed to criminal matters.', nepali: 'देवानी मुद्दा' },
  { term: 'Compensation', category: 'General', definition: 'Payment awarded to someone for loss, injury, or damage suffered. Nepali law provides for compensation in both civil and criminal cases.', nepali: 'क्षतिपूर्ति' },
  { term: 'Complaint', category: 'Criminal Law', definition: 'A formal statement made to authorities about an offense. In Nepal, FIRs (First Information Reports) can be filed at any police station.', nepali: 'उजुरी' },
  { term: 'Consent', category: 'General', definition: 'Voluntary agreement to do something. In legal contexts, consent must be free, informed, and given without coercion or fraud.', nepali: 'सहमति' },
  { term: 'Constitution', category: 'Constitutional Law', definition: 'The supreme law of Nepal that establishes the structure of government and fundamental rights of citizens. Nepal\'s current constitution was adopted in 2015.', nepali: 'संविधान' },
  { term: 'Contempt of Court', category: 'Court Procedure', definition: 'Action that disrespects or defies a court authority. In Nepal, contempt can lead to fine or imprisonment.', nepali: 'अदालतको अवहेलना' },
  { term: 'Contract', category: 'Civil Law', definition: 'A legally binding agreement between two or more parties. For a contract to be valid in Nepal, it requires offer, acceptance, and consideration.', nepali: 'सम्झौता' },
  { term: 'Copyright', category: 'Intellectual Property', definition: 'Legal right protecting original creative works. Nepal\'s Copyright Act protects literary, musical, and artistic works.', nepali: 'प्रतिलिपि अधिकार' },
  { term: 'Cross-examination', category: 'Court Procedure', definition: 'Questioning of a witness by the opposing party\'s lawyer to test the truthfulness of their testimony.', nepali: 'जिराह' },
  { term: 'Decree', category: 'Court Procedure', definition: 'A formal court judgment that determines the rights of parties in a civil case.', nepali: 'आदेश' },
  { term: 'Defamation', category: 'Civil Law', definition: 'Act of harming someone\'s reputation through false statements. Nepal\'s Muluki Civil Code provides remedies for defamation.', nepali: 'मानहानि' },
  { term: 'Divorce', category: 'Family Law', definition: 'Legal dissolution of marriage. In Nepal, divorce can be filed by mutual consent or on specific grounds like adultery, cruelty, or desertion.', nepali: 'सम्बन्ध विच्छेद' },
  { term: 'Domestic Violence', category: 'Criminal Law', definition: 'Physical, emotional, sexual, or economic abuse within a household. Nepal\'s Domestic Violence Act 2066 provides protection orders.', nepali: 'घरेलु हिंसा' },
  { term: 'Due Diligence', category: 'Property Law', definition: 'Investigation of a property or business before a transaction. In Nepal, due diligence is essential before buying land or investing.', nepali: 'उचित परीक्षण' },
  { term: 'Easement', category: 'Property Law', definition: 'A right to use another person\'s land for a specific purpose, like a right of way. Recognized under Nepali land laws.', nepali: 'सुविधा अधिकार' },
  { term: 'Evidence', category: 'Court Procedure', definition: 'Information presented in court to prove facts. Nepal\'s Evidence Act governs what types of evidence are admissible.', nepali: 'प्रमाण' },
  { term: 'FIR (First Information Report)', category: 'Criminal Law', definition: 'The initial report of a crime filed with police. In Nepal, anyone can file an FIR at any police station.', nepali: 'प्रारम्भिक जानकारी प्रतिवेदन' },
  { term: 'Fundamental Rights', category: 'Constitutional Law', definition: 'Basic human rights guaranteed by Nepal\'s Constitution, including right to equality, education, health, and justice.', nepali: 'मौलिक हक' },
  { term: 'Guardianship', category: 'Family Law', definition: 'Legal authority to care for a minor child or incapacitated person. Nepali law grants guardianship through the court.', nepali: 'अभिभावकत्व' },
  { term: 'Habeas Corpus', category: 'Constitutional Law', definition: 'A legal order requiring a person under arrest to be brought before a judge. It protects against unlawful detention. Guaranteed by Nepal\'s Constitution.', nepali: 'बन्दी प्रत्यक्षीकरण' },
  { term: 'Harassment', category: 'Criminal Law', definition: 'Unwanted behavior that intimidates, threatens, or humiliates. Includes workplace sexual harassment, which is prohibited under Nepali law.', nepali: 'उत्पीडन' },
  { term: 'Inheritance', category: 'Property Law', definition: 'Property received from a deceased person. Under Nepali law, daughters now have equal inheritance rights to sons.', nepali: 'उत्तराधिकार' },
  { term: 'Injunction', category: 'Civil Law', definition: 'A court order requiring someone to do or refrain from doing a specific action. Often used in property disputes.', nepali: 'आदेश' },
  { term: 'Jurisdiction', category: 'Court Procedure', definition: 'The official power of a court to hear and decide cases. In Nepal, jurisdiction is determined by geography and case type.', nepali: 'अधिकार क्षेत्र' },
  { term: 'Land Ceiling', category: 'Property Law', definition: 'Legal limit on the amount of land a person can own. Nepal\'s Land Ceiling Act aims to redistribute land to the landless.', nepali: 'जग्गा जोत' },
  { term: 'Legal Heir', category: 'Property Law', definition: 'A person legally entitled to inherit property. Under Nepali law, spouse, children, and parents are legal heirs.', nepali: 'कानुनी वारिस' },
  { term: 'Litigation', category: 'General', definition: 'The process of taking legal action through the court system. Can be civil or criminal.', nepali: 'मुद्दा मामिला' },
  { term: 'Maternity Leave', category: 'Employment Law', definition: 'Paid time off from work for childbirth. Nepal\'s Labour Act provides 98 days of paid maternity leave for women.', nepali: 'सुत्केरी बिदा' },
  { term: 'Mediation', category: 'Dispute Resolution', definition: 'A process where a neutral third party helps disputing parties reach an agreement. Nepali courts encourage mediation before trial.', nepali: 'मध्यस्थता' },
  { term: 'Minor', category: 'General', definition: 'A person below the legal age of adulthood. In Nepal, a minor is anyone under 18 years old.', nepali: 'नाबालिग' },
  { term: 'MOU (Memorandum of Understanding)', category: 'General', definition: 'A non-binding agreement between parties outlining their understanding. Often a precursor to a formal contract.', nepali: 'सम्झौता पत्र' },
  { term: 'Natural Justice', category: 'General', definition: 'Basic principles of fairness in legal proceedings, including the right to be heard and the right to an impartial decision-maker.', nepali: 'नैसर्गिक न्याय' },
  { term: 'Notary', category: 'General', definition: 'A public officer authorized to certify documents and administer oaths. In Nepal, notarization is required for many legal documents.', nepali: 'नोटरी' },
  { term: 'Order', category: 'Court Procedure', definition: 'A directive from a court requiring action or inaction. Less formal than a judgment.', nepali: 'आदेश' },
  { term: 'Paralegal', category: 'General', definition: 'A trained legal professional who provides legal assistance under the supervision of a lawyer. Many NGOs in Nepal employ paralegals.', nepali: 'पैरालिगल' },
  { term: 'Petition', category: 'Court Procedure', definition: 'A formal written request to a court. Nepal\'s Supreme Court hears public interest litigation petitions.', nepali: 'रिट निवेदन' },
  { term: 'Plaintiff', category: 'Court Procedure', definition: 'The person who brings a case against another in court. Also called a claimant.', nepali: 'वादी' },
  { term: 'Power of Attorney', category: 'Property Law', definition: 'A legal document authorizing someone to act on your behalf. In Nepal, this must often be notarized.', nepali: 'मुद्दती वकालतनामा' },
  { term: 'Probate', category: 'Property Law', definition: 'The legal process of validating a will and administering a deceased person\'s estate.', nepali: 'प्रोबेट' },
  { term: 'Public Interest Litigation', category: 'Constitutional Law', definition: 'A legal action filed on behalf of the public interest. Nepal\'s Supreme Court actively hears PIL cases.', nepali: 'सार्वजनिक सरोकारको मुद्दा' },
  { term: 'Rape', category: 'Criminal Law', definition: 'Non-consensual sexual intercourse. Under Nepali law, marital rape is also a criminal offense.', nepali: 'बलात्कार' },
  { term: 'Remand', category: 'Criminal Law', definition: 'Sending an accused person back to custody while investigation continues. Nepali law limits remand periods.', nepali: 'थुनुवा' },
  { term: 'Restraining Order', category: 'Family Law', definition: 'A court order protecting a person from harassment or abuse. Available under Nepal\'s Domestic Violence Act.', nepali: 'संरक्षण आदेश' },
  { term: 'Sedition', category: 'Criminal Law', definition: 'Speech or action inciting rebellion against state authority. Nepal has laws against sedition.', nepali: 'राजद्रोह' },
  { term: 'Sexual Harassment', category: 'Criminal Law', definition: 'Unwanted sexual advances or conduct. Nepal\'s Sexual Harassment Act prohibits this in workplaces and public spaces.', nepali: 'यौन दुर्व्यवहार' },
  { term: 'Status Quo', category: 'General', definition: 'The existing state of affairs. Courts may order status quo to prevent changes during litigation.', nepali: 'यथास्थिति' },
  { term: 'Stay Order', category: 'Court Procedure', definition: 'A temporary court order stopping an action or proceeding until a full hearing.', nepali: 'रोक लगाउने आदेश' },
  { term: 'Subpoena', category: 'Court Procedure', definition: 'A legal document ordering someone to appear in court or produce evidence.', nepali: 'अदालती आदेश' },
  { term: 'Summary Trial', category: 'Court Procedure', definition: 'A quick court proceeding for minor offenses, without a full trial. Used in some Nepali courts for efficiency.', nepali: 'सारांश सुनुवाइ' },
  { term: 'Summons', category: 'Court Procedure', definition: 'A legal notice requiring a person to appear in court.', nepali: 'सम्मन' },
  { term: 'Testament', category: 'Property Law', definition: 'A legal document (will) disposing of property after death. Must follow formal requirements under Nepali law.', nepali: 'इच्छापत्र' },
  { term: 'Testimony', category: 'Court Procedure', definition: 'Evidence given verbally by a witness under oath in court.', nepali: 'गवाही' },
  { term: 'Tort', category: 'Civil Law', definition: 'A civil wrong causing harm or loss, leading to legal liability. Negligence and defamation are examples.', nepali: 'अपकृत्य' },
  { term: 'Trafficking', category: 'Criminal Law', definition: 'Illegal trade of humans for exploitation. Nepal\'s Human Trafficking Act criminalizes this severely.', nepali: 'मानव बेचबिखन' },
  { term: 'Trial', category: 'Court Procedure', definition: 'A formal court proceeding to determine guilt or liability. In Nepal, trials can be heard in district, appellate, or supreme courts.', nepali: 'सुनुवाइ' },
  { term: 'Trust', category: 'Property Law', definition: 'A legal arrangement where one party holds property for the benefit of another.', nepali: 'ट्रस्ट' },
  { term: 'Verdict', category: 'Court Procedure', definition: 'The final decision of a court after trial.', nepali: 'फैसला' },
  { term: 'Visa', category: 'Immigration', definition: 'Official permission to enter and stay in a country. Nepal issues various visa types for foreigners.', nepali: 'भिसा' },
  { term: 'Warrant', category: 'Criminal Law', definition: 'A legal document authorizing police to arrest someone or search premises. Requires judicial approval in Nepal.', nepali: 'वारेन्ट' },
  { term: 'Will', category: 'Property Law', definition: 'A legal document expressing a person\'s wishes for distribution of their property after death. Must be signed and witnessed.', nepali: 'इच्छापत्र' },
  { term: 'Witness', category: 'Court Procedure', definition: 'A person who sees an event or signs a document and can testify about it in court.', nepali: 'साक्षी' },
  { term: 'Writ', category: 'Constitutional Law', definition: 'A formal court order requiring action or inaction. Nepal\'s Supreme Court issues writs like habeas corpus, mandamus, and certiorari.', nepali: 'रिट' },
  { term: 'Zoning', category: 'Property Law', definition: 'Local laws regulating land use. Nepal\'s municipalities enforce zoning regulations for construction and development.', nepali: 'जोनिङ' },
];

const CATEGORIES = [...new Set(TERMS.map(t => t.category))];

const CATEGORY_LABELS = {
  'Court Procedure': 'glossary.courtProcedure',
  'Family Law': 'glossary.familyLaw',
  'Criminal Law': 'glossary.criminalLaw',
  'Property Law': 'glossary.propertyLaw',
  'Civil Law': 'glossary.civilLaw',
  'Constitutional Law': 'glossary.constitutionalLaw',
  'Intellectual Property': 'glossary.intellectualProperty',
  'Employment Law': 'glossary.employmentLaw',
  'Dispute Resolution': 'glossary.disputeResolution',
  'Immigration': 'glossary.immigration',
};

export default function LegalGlossary() {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [openTerm, setOpenTerm] = useState(null);

  const filtered = TERMS.filter(t => {
    const matchSearch = !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase()) || (t.nepali && t.nepali.includes(search));
    const matchCat = category === 'all' || t.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="glossary-page">
      <div className="glossary-container">
        <div className="glossary-header">
          <BookOpen size={20} />
          <div>
            <h1>{t("glossary.title")}</h1>
            <p className="glossary-subtitle">{t("glossary.subtitle")}</p>
          </div>
        </div>

        <div className="glossary-controls">
          <div className="glossary-search">
            <Search size={16} />
            <input
              type="text"
              placeholder={t("glossary.searchPlaceholder")}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="glossary-cats">
            <button className={`glossary-cat${category === 'all' ? ' active' : ''}`} onClick={() => setCategory('all')}>{t("glossary.terms")}</button>
            {CATEGORIES.map(c => (
              <button key={c} className={`glossary-cat${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>{t(CATEGORY_LABELS[c] || c)}</button>
            ))}
          </div>
        </div>

        <div className="glossary-count">{filtered.length} {t("glossary.terms")}</div>

        <div className="glossary-list">
          {filtered.map((t, i) => (
            <div key={i} className={`glossary-term${openTerm === i ? ' open' : ''}`}>
              <button className="glossary-term-header" onClick={() => setOpenTerm(openTerm === i ? null : i)}>
                <div>
                  <strong>{lang === 'ne' && t.nepali ? t.nepali : t.term}</strong>
                  <span className={`glossary-cat-badge ${lang === 'ne' ? t.category.toLowerCase().replace(/\s+/g, '-') : ''}`}>{t.category}</span>
                </div>
                <div>
                  {t.nepali && lang !== 'ne' && <span className="glossary-nepali">{t.nepali}</span>}
                  {lang === 'ne' && <span className="glossary-nepali" style={{ opacity: 0.6, fontSize: '0.85em' }}>{t.term}</span>}
                  <ChevronDown size={14} className={`glossary-cv${openTerm === i ? ' rot' : ''}`} />
                </div>
              </button>
              <div className="glossary-term-body">
                <p>{t.definition}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

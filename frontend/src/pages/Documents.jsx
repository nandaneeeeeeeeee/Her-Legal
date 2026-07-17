import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FileText, AlertCircle, Scale, FileSignature, ClipboardList, Mail,
  ArrowLeft, Loader, Download, Save, Eye, EyeOff, Plus, ChevronRight, Trash2
} from "lucide-react";
import { getTemplates, generateDocument, saveDocument, getDocuments, deleteDocument } from "../api/documents";
import { useLanguage } from "../LanguageContext";
import "../pages/Auth.css";
import "./Documents.css";

const ICON_MAP = {
  FileText, AlertCircle, Scale, FileSignature, ClipboardList, Mail,
};

export default function Documents() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [view, setView] = useState('list'); // list | create | preview
  const [templates, setTemplates] = useState([]);
  const [docs, setDocs] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadTemplates();
    loadDocuments();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data.data || []);
    } catch {}
  };

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocs(data.data || []);
    } catch {}
  };

  const selectTemplate = (tpl) => {
    setSelectedType(tpl);
    const initial = {};
    tpl.fields.forEach(f => initial[f.key] = "");
    setFormData(initial);
    setResult(null);
    setError("");
    setSaved(false);
    setView('create');
  };

  const updateField = (key) => (e) => {
    setFormData(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleGenerate = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await generateDocument(selectedType.id, formData, lang);
      setResult(data.data);
      setView('preview');
    } catch (err) {
      setError(err.message || t("documents.generationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await saveDocument(result.title, result.type, result.content, result.formData);
      setSaved(true);
      loadDocuments();
    } catch (err) {
      setError(err.message || t("documents.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    if (!result?.content) return;
    const blob = new Blob([result.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title?.replace(/\s+/g, '_') || 'document'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id) => {
    if (!confirm(t("documents.deleteConfirm"))) return;
    try {
      await deleteDocument(id);
      loadDocuments();
    } catch {}
  };

  const templateIcon = (name) => {
    const Icon = ICON_MAP[name] || FileText;
    return <Icon size={22} />;
  };

  if (view === 'create' && selectedType) {
    return (
      <div className="doc-page">
        <div className="doc-card" style={{ maxWidth: 640 }}>
          <button className="auth-back" onClick={() => { setView('list'); setSelectedType(null); }}>
            <ArrowLeft size={16} /> {t("documents.templates")}
          </button>
          <div className="doc-tpl-header">
            <div className="doc-tpl-icon">{templateIcon(selectedType.icon)}</div>
            <div>
              <h1 style={{ fontSize: 24 }}>{selectedType.name}</h1>
              <p className="auth-subtitle">{selectedType.description}</p>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div className="doc-form">
            {selectedType.fields.map(f => (
              <div className="auth-field" key={f.key}>
                <label>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    className="auth-input"
                    style={{ minHeight: 100, padding: 12, resize: 'vertical' }}
                    value={formData[f.key] || ''}
                    onChange={updateField(f.key)}
                    rows={4}
                  />
                ) : (
                  <input
                    className="auth-input"
                    type={f.type || 'text'}
                    value={formData[f.key] || ''}
                    onChange={updateField(f.key)}
                  />
                )}
              </div>
            ))}
          </div>

          <button className="auth-submit" onClick={handleGenerate} disabled={loading}>
            {loading ? <><Loader size={16} className="spin" /> {t("documents.generating")}</> : <><FileText size={16} /> {t("documents.generate")}</>}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'preview' && result) {
    return (
      <div className="doc-page">
        <div className="doc-card" style={{ maxWidth: 720 }}>
          <button className="auth-back" onClick={() => { setView('create'); setResult(null); setSaved(false); }}>
            <ArrowLeft size={16} /> {t("documents.editForm")}
          </button>

          <div className="doc-preview-header">
            <h1 style={{ fontSize: 24 }}>{result.title}</h1>
            <div className="doc-preview-actions">
              <button className="btn btn-secondary" onClick={handleDownload} style={{ height: 36 }}>
                <Download size={14} /> {t("documents.download")}
              </button>
              {saved ? (
                <span className="doc-saved-badge"><Save size={14} /> {t("common.saved")}</span>
              ) : (
                <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ height: 36 }}>
                  {saving ? <Loader size={14} className="spin" /> : <Save size={14} />}
                  {t("common.save")}
                </button>
              )}
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div className="doc-preview-content">
            {result.content.split('\n').map((line, i) => (
              <p key={i} style={{ marginBottom: line.trim() ? 8 : 0 }}>{line || '\u00A0'}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="doc-page">
      <div className="doc-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <Link to="/dashboard" className="auth-link" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginBottom: 8 }}>
              <ArrowLeft size={14} /> {t("common.dashboard")}
            </Link>
            <h1 style={{ fontSize: 24 }}>{t("documents.title")}</h1>
            <p className="auth-subtitle">{t("documents.subtitle")}</p>
          </div>
        </div>

        <h2 className="doc-section-title">{t("documents.documentTemplates")}</h2>
        <div className="doc-templates-grid">
          {templates.map(tpl => (
            <button key={tpl.id} className="doc-template-card" onClick={() => selectTemplate(tpl)}>
              <div className="doc-tpl-icon">{templateIcon(tpl.icon)}</div>
              <strong>{tpl.name}</strong>
              <span>{tpl.description}</span>
              <ChevronRight size={14} className="doc-arrow" />
            </button>
          ))}
        </div>

        <h2 className="doc-section-title" style={{ marginTop: 48 }}>{t("documents.savedDocuments")}</h2>
        {docs.length === 0 ? (
          <div className="doc-empty">
            <FileText size={32} />
            <p>{t("documents.noSaved")}</p>
          </div>
        ) : (
          <div className="doc-saved-list">
            {docs.map(doc => (
              <div key={doc._id} className="doc-saved-item" onClick={() => {
                setResult(doc);
                setView('preview');
              }}>
                <div className="doc-saved-icon">
                  {templateIcon(
                    templates.find(t => t.id === doc.type)?.icon || 'FileText'
                  )}
                </div>
                <div>
                  <strong>{doc.title}</strong>
                  <span>{new Date(doc.createdAt).toLocaleDateString()} · {doc.type}</span>
                </div>
                <button className="btn btn-ghost" style={{ height: 32, width: 32, padding: 0, flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); handleDelete(doc._id); }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

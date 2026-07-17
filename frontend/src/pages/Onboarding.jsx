import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe, Heart, ArrowRight, ArrowLeft, Check, Shield, Lock, Sparkles
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { completeOnboarding } from "../api/settings";
import { useLanguage } from "../LanguageContext";
import "./Onboarding.css";

const interests = [
  "Women's Rights", "Employment", "Marriage", "Property",
  "Domestic Violence", "Cyber Crime", "Citizenship",
  "Consumer Rights", "Family Law",
];

export default function Onboarding() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState("en");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [communityPrefs, setCommunityPrefs] = useState({
    anonymousPosting: true,
    receiveReplies: true,
    receiveNotifications: true,
    receiveLegalUpdates: false,
  });

  const toggleInterest = (item) => {
    setSelectedInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const togglePref = (key) => {
    setCommunityPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleComplete = async () => {
    try {
      const data = await completeOnboarding({
        language: lang,
        interests: selectedInterests,
        communityPrefs,
      });
      updateUser(data.data);
    } catch { /* still navigate even if API fails */ }
    navigate("/dashboard");
  };

  const steps = [
    // Step 0: Language
    <div key="lang" className="onb-step">
      <div className="onb-icon-wrap"><Globe size={32} /></div>
      <h2>{t("onboarding.step0Title")}</h2>
      <p className="onb-desc">{t("onboarding.step0Desc")}</p>
      <div className="onb-lang-grid">
        <button className={`onb-lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>
          <span className="onb-lang-emoji">🇬🇧</span>
          <span className="onb-lang-name">{t("onboarding.english")}</span>
        </button>
        <button className={`onb-lang-btn${lang === 'ne' ? ' active' : ''}`} onClick={() => setLang('ne')}>
          <span className="onb-lang-emoji">🇳🇵</span>
          <span className="onb-lang-name">{t("onboarding.nepali")}</span>
        </button>
      </div>
    </div>,

    // Step 1: Interests
    <div key="interests" className="onb-step">
      <div className="onb-icon-wrap"><Heart size={32} /></div>
      <h2>{t("onboarding.step1Title")}</h2>
      <p className="onb-desc">{t("onboarding.step1Desc")}</p>
      <div className="onb-interests-grid">
        {interests.map(item => (
          <button
            key={item}
            className={`onb-interest-chip${selectedInterests.includes(item) ? ' active' : ''}`}
            onClick={() => toggleInterest(item)}
          >
            {selectedInterests.includes(item) && <Check size={14} />}
            {item}
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Community Preferences
    <div key="prefs" className="onb-step">
      <div className="onb-icon-wrap"><Shield size={32} /></div>
      <h2>{t("onboarding.step2Title")}</h2>
      <p className="onb-desc">{t("onboarding.step2Desc")}</p>
      <div className="onb-prefs">
        {[
          { key: 'anonymousPosting', label: t("onboarding.anonymousPosting"), desc: t("onboarding.anonymousPostingDesc") },
          { key: 'receiveReplies', label: t("onboarding.receiveReplies"), desc: t("onboarding.receiveRepliesDesc") },
          { key: 'receiveNotifications', label: t("onboarding.receiveNotifications"), desc: t("onboarding.receiveNotificationsDesc") },
          { key: 'receiveLegalUpdates', label: t("onboarding.legalUpdates"), desc: t("onboarding.legalUpdatesDesc") },
        ].map(p => (
          <label key={p.key} className="onb-pref-row">
            <div>
              <strong>{p.label}</strong>
              <span>{p.desc}</span>
            </div>
            <input
              type="checkbox"
              checked={communityPrefs[p.key]}
              onChange={() => togglePref(p.key)}
              className="onb-checkbox"
            />
          </label>
        ))}
      </div>
    </div>,

    // Step 3: Privacy & Complete
    <div key="complete" className="onb-step">
      <div className="onb-illustration">
        <div className="onb-icon-wrap" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          <Lock size={32} />
        </div>
      </div>
      <h2>{t("onboarding.step3Title")}</h2>
      <p className="onb-desc">{t("onboarding.step3Desc")}</p>
      <div className="onb-privacy-list">
        <div className="onb-privacy-item">
          <Shield size={16} />
          <span>{t("onboarding.privacyBullet1")}</span>
        </div>
        <div className="onb-privacy-item">
          <Lock size={16} />
          <span>{t("onboarding.privacyBullet2")}</span>
        </div>
        <div className="onb-privacy-item">
          <Sparkles size={16} />
          <span>{t("onboarding.privacyBullet3")}</span>
        </div>
        <div className="onb-privacy-item">
          <Check size={16} />
          <span>{t("onboarding.privacyBullet4")}</span>
        </div>
      </div>
      <p className="onb-ready-text">{t("onboarding.ready")}</p>
    </div>,
  ];

  return (
    <div className="onb-page">
      <div className="onb-card">
        <div className="onb-progress">
          {steps.map((_, i) => (
            <div key={i} className={`onb-dot${i <= step ? ' active' : ''}${i < step ? ' done' : ''}`}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
          ))}
        </div>

        <div className="onb-step-wrap">
          {steps[step]}
        </div>

        <div className="onb-actions">
          {step > 0 && (
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
              <ArrowLeft size={16} /> {t("common.back")}
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < steps.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setStep(s => s + 1)}
              disabled={step === 0 ? false : step === 1 && selectedInterests.length === 0}
            >
              {t("common.continue")} <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleComplete}>
              {t("onboarding.goToDashboard")} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

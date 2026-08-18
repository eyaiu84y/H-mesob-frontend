import { useState } from 'react';
import { organizationsData } from '../data/organizations';
import { useApp } from '../context/AppContext';

function orgName(org, lang) {
  return lang === 'am' ? org.name_am : org.name_en;
}
function svcTitle(svc, lang) {
  return lang === 'am' ? svc.title_am : svc.title_en;
}
function svcDocs(svc, lang) {
  return lang === 'am' ? svc.docs_am : svc.docs_en;
}

function OrgModal({ org, onClose, t, lang }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="org-modal">
      <div className="org-modal-backdrop" onClick={onClose}></div>
      <div className="org-modal-panel">
        <div className="org-modal-header">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {orgName(org, lang)} {t.org_modal_suffix}
          </h3>
          <button type="button" onClick={onClose} className="org-modal-close" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="org-modal-body">
          {org.services.map((svc, i) => (
            <div key={i} className={`svc-item${openIndex === i ? ' open' : ''}`}>
              <button type="button" className="svc-toggle"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <span>{svcTitle(svc, lang)}</span>
                <svg className="svc-chevron" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="svc-panel">
                <div className="svc-meta">
                  <div><span>{t.org_time_label}</span><br /><strong>{svc.time}</strong></div>
                  <div><span>{t.org_fee_label}</span><br /><strong>{svc.fee}</strong></div>
                </div>
                <div className="svc-docs-title">{t.org_docs_label}</div>
                <ul className="svc-docs">
                  {svcDocs(svc, lang).map((doc, j) => <li key={j}>{doc}</li>)}
                </ul>
                {svc.link && svc.link !== '#' && (
                  <a className="svc-link" href={svc.link} target="_blank" rel="noopener noreferrer">
                    {t.org_official}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Organizations() {
  const { t, lang } = useApp();
  const [selectedOrg, setSelectedOrg] = useState(null);

  return (
    <>
      <section id="organizations" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{t.org_title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-3">{t.org_subtitle}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {organizationsData.map((org) => (
              <div key={org.id} className={`org-card org-color-${org.id}`}
                onClick={() => setSelectedOrg(org)}>
                <img src={org.image} alt={orgName(org, lang)}
                  onError={(e) => { e.target.src = '/image/image.jpg'; }} />
                <h5>{orgName(org, lang)}</h5>
                <button type="button" className="org-btn"
                  onClick={(e) => { e.stopPropagation(); setSelectedOrg(org); }}>
                  {t.org_btn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedOrg && (
        <OrgModal org={selectedOrg} onClose={() => setSelectedOrg(null)} t={t} lang={lang} />
      )}
    </>
  );
}

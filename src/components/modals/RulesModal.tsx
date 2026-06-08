import React from 'react';
import '../../styles/modals.css';

interface RulesModalProps {
  onAccept: () => void;
}

export default function RulesModal({ onAccept }: RulesModalProps) {
  const [language, setLanguage] = React.useState<'en' | 'hi'>('en');

  const rules = {
    en: {
      title: 'Mini App Rules',
      rules: [
        '✅ Watch 30 ads (30 seconds each)',
        '✅ Complete 10 tasks daily',
        '✅ Get ₹10 after completing both',
        '❌ Do not skip ads',
        '✅ UPI ID required for withdrawal',
        '✅ Minimum withdrawal: ₹300',
      ],
    },
    hi: {
      title: 'मिनी ऐप नियम',
      rules: [
        '✅ 30 विज्ञापन देखें (प्रत्येक 30 सेकंड)',
        '✅ प्रतिदिन 10 कार्य पूरे करें',
        '✅ दोनों पूरे करने के बाद ₹10 पाएं',
        '❌ विज्ञापन को स्किप न करें',
        '✅ निकासी के लिए UPI ID आवश्यक',
        '✅ न्यूनतम निकासी: ₹300',
      ],
    },
  };

  const content = rules[language];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{content.title}</h2>

        <div className="language-selector">
          <button
            onClick={() => setLanguage('en')}
            className={language === 'en' ? 'active' : ''}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={language === 'hi' ? 'active' : ''}
          >
            हिंदी
          </button>
        </div>

        <ul className="rules-list">
          {content.rules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>

        <button className="btn-primary" onClick={onAccept}>
          I Agree
        </button>
      </div>
    </div>
  );
}

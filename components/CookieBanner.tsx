import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CookieBanner = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
    functional: true,
  });

  useEffect(() => {
    const cookieConsent = Cookies.get('cookie_consent');
    if (cookieConsent) {
      setIsBannerVisible(false);
      const savedPreferences = Cookies.get('cookie_preferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } else {
      setIsBannerVisible(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    Cookies.set('cookie_consent', 'true', { expires: 365 });
    Cookies.set('cookie_preferences', JSON.stringify({
      analytics: true,
      marketing: true,
      functional: true,
    }), { expires: 365 });
    setIsBannerVisible(false);
  };

  const handleRejectCookies = () => {
    Cookies.set('cookie_consent', 'false', { expires: 365 });
    Cookies.set('cookie_preferences', JSON.stringify({
      analytics: false,
      marketing: false,
      functional: true,
    }), { expires: 365 });
    setIsBannerVisible(false);
  };

  const handleCustomizeCookies = () => {
    setIsModalVisible(true);
  };

  const handleSavePreferences = () => {
    Cookies.set('cookie_consent', 'custom', { expires: 365 });
    Cookies.set('cookie_preferences', JSON.stringify(preferences), { expires: 365 });
    setIsModalVisible(false);
    setIsBannerVisible(false);
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: checked,
    }));
  };

  if (!isBannerVisible && !isModalVisible) {
    return null;
  }

  return (
    <div>
      {isBannerVisible && (
        <div className="cookie-banner" role="alert" aria-live="polite">
          <p>We use cookies to ensure you get the best experience while Studying on Lo-Fi.Study.</p>
          <div className="cookie-banner-buttons">
            <button onClick={handleRejectCookies}>Reject</button>
            <button onClick={handleCustomizeCookies}>Customize</button>
            <button onClick={handleAcceptCookies}>Accept</button>
          </div>
        </div>
      )}

      {isModalVisible && (
        <div className="modal" role="dialog" aria-labelledby="modal-title">
          <div className="modal-content">
            <h2 id="modal-title">Customize Cookie Preferences</h2>
            <div className="preferences">
              <label>
                <input
                  type="checkbox"
                  name="analytics"
                  checked={preferences.analytics}
                  onChange={handlePreferenceChange}
                />
                <div>
                  <span className="label-text">Analytics Cookies</span>
                  <span className="description">Helps us understand how our website is used.</span>
                </div>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="marketing"
                  checked={preferences.marketing}
                  onChange={handlePreferenceChange}
                />
                <div>
                  <span className="label-text">Marketing Cookies</span>
                  <span className="description">Used to deliver personalized ads.</span>
                </div>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="functional"
                  checked={preferences.functional}
                  onChange={handlePreferenceChange}
                  disabled
                />
                <div>
                  <span className="label-text">Functional Cookies</span>
                  <span className="description">Necessary for the basic functionality of the site.</span>
                </div>
              </label>
            </div>
            <div className="modal-buttons">
              <button onClick={handleSavePreferences}>Save</button>
              <button onClick={() => setIsModalVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
          color: #fff;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 9999;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          border-radius: 20px 20px 0 0;
        }
        .cookie-banner p {
          margin-bottom: 1rem;
          text-align: center;
        }
        .cookie-banner-buttons {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        }
        button {
          background: #ff7b00;
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          margin: 0.25rem;
          cursor: pointer;
          border-radius: 10px;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background: #ff9900;
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        }
        .modal-content {
          background: #2a2a2a;
          color: #fff;
          padding: 1.5rem;
          border-radius: 10px;
          text-align: center;
          max-width: 90%;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        .preferences {
          text-align: left;
          margin: 1rem 0;
        }
        .preferences label {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        input[type="checkbox"] {
          margin-top: 0.25rem;
          margin-right: 0.5rem;
          flex-shrink: 0;
        }
        .label-text {
          color: #ff9900;
          display: block;
          margin-bottom: 0.25rem;
        }
        .description {
          font-size: 0.9rem;
          color: #ccc;
          display: block;
        }
        .modal-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
        }
        .modal-buttons button {
          flex: 1;
          margin: 0 0.25rem;
        }
        @media (min-width: 768px) {
          .cookie-banner {
            flex-direction: row;
            justify-content: space-between;
          }
          .cookie-banner p {
            margin-bottom: 0;
            margin-right: 1rem;
          }
          .modal-content {
            max-width: 500px;
          }
        }
      `}</style>
    </div>
  );
};

export default CookieBanner;
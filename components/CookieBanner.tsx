import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CookieBanner = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const cookieConsent = Cookies.get('cookie_consent');
    if (!cookieConsent) {
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
        <div className="cookie-banner">
          <p>We use cookies to ensure you get the best experience on our website.</p>
          <div>
            <button onClick={handleAcceptCookies}>Accept Cookies</button>
            <button onClick={handleRejectCookies}>Reject Cookies</button>
            <button onClick={handleCustomizeCookies}>Customize</button>
          </div>
        </div>
      )}

      {isModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Customize Cookie Preferences</h2>
            <div className="preferences">
              <label>
                <input
                  type="checkbox"
                  name="analytics"
                  checked={preferences.analytics}
                  onChange={handlePreferenceChange}
                />
                <span className="label-text">Analytics Cookies</span>
                <span className="description">Helps us understand how our website is used.</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="marketing"
                  checked={preferences.marketing}
                  onChange={handlePreferenceChange}
                />
                <span className="label-text">Marketing Cookies</span>
                <span className="description">Used to deliver personalized ads.</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="functional"
                  checked={preferences.functional}
                  onChange={handlePreferenceChange}
                />
                <span className="label-text">Functional Cookies</span>
                <span className="description">Necessary for the basic functionality of the site.</span>
              </label>
            </div>
            <div className="modal-buttons">
              <button onClick={handleSavePreferences}>Save Preferences</button>
              <button onClick={() => setIsModalVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;700&display=swap');
        
        .cookie-banner {
          font-family: 'Comfortaa', cursive;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
          color: #fff;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 9999;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          border-radius: 20px 20px 0 0;
        }
        button {
          background: #ff7b00;
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          margin-left: 0.5rem;
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
          padding: 2rem;
          border-radius: 10px;
          text-align: center;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        .preferences {
          text-align: left;
          margin: 1rem 0;
        }
        .preferences label {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }
        .label-text {
          flex: 1;
          color: #ff9900;
        }
        .description {
          flex: 2;
          font-size: 0.9rem;
          color: #ccc;
          margin-left: 0.5rem;
        }
        .modal-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
        }
        .modal-buttons button {
          flex: 1;
          margin: 0 0.5rem;
          background: #ff7b00;
          border: none;
          color: #fff;
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-radius: 10px;
          transition: background-color 0.3s ease;
        }
        .modal-buttons button:hover {
          background: #ff9900;
        }
      `}</style>
    </div>
  );
};

export default CookieBanner;

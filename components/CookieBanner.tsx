import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CookieBanner = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = Cookies.get('cookie_consent');
    if (!cookieConsent) {
      setIsBannerVisible(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    Cookies.set('cookie_consent', 'true', { expires: 365 });
    setIsBannerVisible(false);
  };

  if (!isBannerVisible) {
    return null;
  }

  return (
    <div className="cookie-banner">
      <p>We use cookies to ensure you get the best experience on our website.</p>
      <button onClick={handleAcceptCookies}>Accept Cookies</button>
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
          cursor: pointer;
          border-radius: 10px;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background: #ff9900;
        }
      `}</style>
    </div>
  );
};

export default CookieBanner;

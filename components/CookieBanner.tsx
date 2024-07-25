// components/CookieBanner.tsx
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
        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #000;
          color: #fff;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 9999;
        }
        button {
          background: #fff;
          color: #000;
          border: none;
          padding: 0.5rem 1rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default CookieBanner;

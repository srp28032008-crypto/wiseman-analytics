import React, { useState, useEffect } from 'react';
import { BACKEND_API_URL } from '../config/marketData';

const authTranslations = {
  en: {
    titleLogin: "SECURE TRADER PORTAL",
    titleRegister: "CREATE TRADING ACCOUNT",
    btnLoginSubmit: "SIGN IN SECURELY",
    btnRegisterSubmit: "REGISTER TRADING ACCOUNT",
    toggleLoginText: "New to Wiseman? ",
    toggleLoginLink: "Create account",
    toggleRegisterText: "Already registered? ",
    toggleRegisterLink: "Sign in",
    usernameLabel: "Trader Username / ID",
    passwordLabel: "Account Password",
    promoHeading: "Advanced Wealth Analytics.",
    promoSubheading: "AI-Powered Market Intel.",
    promoText: "Access real-time quantitative streams, institutional sweep indicators, and predictive market scanning tools. Securely connected to NSE/BSE & Binance global feeds."
  },
  mr: {
    titleLogin: "सुरक्षित ट्रेडर लॉग-इन",
    titleRegister: "नवीन ट्रेडिंग खाते उघडा",
    btnLoginSubmit: "सुरक्षित लॉग-इन करा",
    btnRegisterSubmit: "ट्रेडिंग खाते उघडा",
    toggleLoginText: "नवीन ट्रेडर? ",
    toggleLoginLink: "खाते तयार करा",
    toggleRegisterText: "आधीच नोंदणी केली आहे? ",
    toggleRegisterLink: "लॉग-इन करा",
    usernameLabel: "ट्रेडर युझरनेम / आयडी",
    passwordLabel: "खाते पासवर्ड",
    promoHeading: "अत्याधुनिक संपत्ती विश्लेषण.",
    promoSubheading: "९८%+ अचूक एआय सिग्नल्स.",
    promoText: "रिअल-टाइम क्वांटिटेटिव्ह फीड्स, संस्थात्मक स्वीप निर्देशक आणि मार्केट स्कॅनिंग टूल्स मिळवा. NSE/BSE आणि Binance ग्लोबल फीड्सशी जोडलेले."
  },
  hi: {
    titleLogin: "सुरक्षित ट्रेडर लॉग-इन",
    titleRegister: "नया ट्रेडिंग खाता खोलें",
    btnLoginSubmit: "सुरक्षित लॉग-इन करें",
    btnRegisterSubmit: "ट्रेडिंग खाता पंजीकृत करें",
    toggleLoginText: "नए ट्रेडर? ",
    toggleLoginLink: "खाता खोलें",
    toggleRegisterText: "पहले से खाता है? ",
    toggleRegisterLink: "लॉग-इन करें",
    usernameLabel: "ट्रेडर यूज़रनेम / आईडी",
    passwordLabel: "खाता पासवर्ड",
    promoHeading: "अत्याधुनिक संपत्ति विश्लेषण।",
    promoSubheading: "९८%+ सटीक एआई सिग्नल्स।",
    promoText: "रियल-टाइम क्वांटिटेटिव फीड्स, संस्थागत स्वीप इंडिकेटर्स और मार्केट स्कैनिंग टूल्स तक पहुंचें। NSE/BSE और Binance ग्लोबल फीड्स से सुरक्षित रूप से जुड़ा हुआ है।"
  },
  es: {
    titleLogin: "PORTAL DE TRADER SEGURO",
    titleRegister: "CREAR CUENTA DE TRADING",
    btnLoginSubmit: "INICIAR SESIÓN SEGURO",
    btnRegisterSubmit: "REGISTRAR CUENTA DE TRADING",
    toggleLoginText: "¿Nuevo en Wiseman? ",
    toggleLoginLink: "Crear cuenta",
    toggleRegisterText: "¿Ya tienes cuenta? ",
    toggleRegisterLink: "Iniciar sesión",
    usernameLabel: "Usuario / ID de Trader",
    passwordLabel: "Contraseña de Cuenta",
    promoHeading: "Análisis de Riqueza Avanzado.",
    promoSubheading: "Inteligencia AI de Mercado.",
    promoText: "Acceda a flujos cuantitativos en tiempo real, indicadores de barrido institucional y herramientas predictivas de escaneo de mercado. Conectado de forma segura a feeds globales de NSE/BSE y Binance."
  }
};

export default function AuthGate({ children, currentLang, setCurrentLang, onAuthSuccess }) {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });
  
  // Drift mock indexes for the investing dashboard feel
  const [niftyPrice, setNiftyPrice] = useState(22450.80);
  const [sensexPrice, setSensexPrice] = useState(73850.50);
  const [bankNiftyPrice, setBankNiftyPrice] = useState(47920.30);

  const dict = authTranslations[currentLang] || authTranslations['en'];

  useEffect(() => {
    const savedToken = localStorage.getItem('wiseman_token');
    if (savedToken) {
      setToken(savedToken);
      if (onAuthSuccess) onAuthSuccess(savedToken);
    }

    // Gentle realistic market walk simulation
    const interval = setInterval(() => {
      setNiftyPrice(prev => prev + (Math.random() - 0.49) * 2.2);
      setSensexPrice(prev => prev + (Math.random() - 0.49) * 7.5);
      setBankNiftyPrice(prev => prev + (Math.random() - 0.49) * 4.8);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAlert({ message: '', type: '' });

    if (!username.trim() || !password.trim()) {
      setAlert({ message: "Username and password parameters are required.", type: 'error' });
      return;
    }

    const endpoint = isRegisterMode ? 'register' : 'login';

    try {
      const response = await fetch(`${BACKEND_API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed. Check credentials.");
      }

      if (isRegisterMode) {
        setIsRegisterMode(false);
        setAlert({ message: "Registration successful. Authenticating session...", type: 'success' });
        
        // Auto-login after registration
        const loginResponse = await fetch(`${BACKEND_API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        const loginData = await loginResponse.json();
        if (!loginResponse.ok) throw new Error(loginData.error);

        if (rememberMe) {
          localStorage.setItem('wiseman_token', loginData.token);
        }
        setToken(loginData.token);
        if (onAuthSuccess) onAuthSuccess(loginData.token);
      } else {
        if (rememberMe) {
          localStorage.setItem('wiseman_token', data.token);
        }
        setAlert({ message: "Access granted. Synchronizing charts...", type: 'success' });
        setTimeout(() => {
          setToken(data.token);
          if (onAuthSuccess) onAuthSuccess(data.token);
        }, 800);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setAlert({ message: err.message, type: 'error' });
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setAlert({
      message: currentLang === 'mr' 
        ? "डेमो मोड सक्रिय: कृपया लॉगिन करण्यासाठी युझरनेम आणि पासवर्ड तयार करा किंवा सिस्टीम ॲडमिनशी संपर्क साधा." 
        : "Demo Mode Active: Please create credentials via Register or contact admin.",
      type: 'error'
    });
  };

  const logout = () => {
    localStorage.removeItem('wiseman_token');
    setToken(null);
    setUsername('');
    setPassword('');
  };

  useEffect(() => {
    window.handleLogout = logout;
    return () => {
      delete window.handleLogout;
    };
  }, []);

  if (token) {
    return <>{children}</>;
  }

  const alertColor = alert.type === 'success' ? '#10b981' : '#ef4444';
  const alertBorder = alert.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
  const alertBg = alert.type === 'success' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)';

  return (
    <div className="login-portal-overlay">
      {/* Premium animated background layers */}
      <div className="neon-grid"></div>
      <div className="scanline-overlay"></div>
      <div className="login-grid-bg"></div>
      <div className="login-orb orb-1"></div>
      <div className="login-orb orb-2"></div>

      {/* Floating particles */}
      <div className="particle p1"></div>
      <div className="particle p2"></div>
      <div className="particle p3"></div>
      <div className="particle p4"></div>
      <div className="particle p5"></div>
      <div className="particle p6"></div>

      <div className="login-split-wrapper">
        {/* Left Side: Modern Premium Stock Terminal Promos & Live Indexes */}
        <div className="login-promo-column">
          <div>
            <div style={styles.promoHeader}>
              <div style={styles.logoBadge}>
                <svg viewBox="0 0 24 24" style={styles.logoSvg}>
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <div>
                <div style={styles.promoTitle}>WISEMAN ANALYTICS</div>
                <div style={styles.promoSubtitle}>QUANTITATIVE INVESTMENTS TERMINAL</div>
              </div>
            </div>

            <h2 style={styles.promoMainHeading}>
              {dict.promoHeading} <br/>
              <span style={{ color: '#10b981' }}>{dict.promoSubheading}</span>
            </h2>
            
            <p style={styles.promoText}>
              {dict.promoText}
            </p>
          </div>

          {/* Interactive Index Tickers Grid */}
          <div style={styles.cardsGrid}>
            {/* Nifty 50 */}
            <div className="glass-card-animated" style={styles.glassCard}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTag}>NSE INDEX</span>
                <span style={styles.liveBadge}><span style={styles.pulseDot}></span>LIVE</span>
              </div>
              <div style={styles.cardSymbolRow}>
                <span style={styles.cardSymbol}>NIFTY 50</span>
                <span style={styles.cardPrice}>₹{niftyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={styles.cardChangeRow}>
                <span style={{ color: '#10b981', fontSize: '10px', fontWeight: '600' }}>+0.52% (+115.80)</span>
                <span style={styles.cardSubtext}>INDIA</span>
              </div>
              <div style={styles.miniSparkline}>
                <svg viewBox="0 0 100 20" style={styles.sparklineSvg}>
                  <path d="M 0 16 Q 15 6, 30 11 T 60 4 T 80 12 T 100 2 L 100 20 L 0 20 Z" />
                </svg>
              </div>
            </div>

            {/* Sensex */}
            <div className="glass-card-animated" style={styles.glassCard}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTag}>BSE INDEX</span>
                <span style={styles.liveBadge}><span style={styles.pulseDot}></span>LIVE</span>
              </div>
              <div style={styles.cardSymbolRow}>
                <span style={styles.cardSymbol}>SENSEX</span>
                <span style={styles.cardPrice}>₹{sensexPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={styles.cardChangeRow}>
                <span style={{ color: '#10b981', fontSize: '10px', fontWeight: '600' }}>+0.48% (+350.25)</span>
                <span style={styles.cardSubtext}>INDIA</span>
              </div>
              <div style={styles.miniSparkline}>
                <svg viewBox="0 0 100 20" style={styles.sparklineSvg}>
                  <path d="M 0 14 Q 15 10, 30 5 T 60 12 T 80 4 T 100 6 L 100 20 L 0 20 Z" />
                </svg>
              </div>
            </div>

            {/* Bank Nifty */}
            <div className="glass-card-animated" style={styles.glassCard}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTag}>NSE DERIVATIVES</span>
                <span style={styles.liveBadge}><span style={styles.pulseDot}></span>LIVE</span>
              </div>
              <div style={styles.cardSymbolRow}>
                <span style={styles.cardSymbol}>NIFTY BANK</span>
                <span style={styles.cardPrice}>₹{bankNiftyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={styles.cardChangeRow}>
                <span style={{ color: '#10b981', fontSize: '10px', fontWeight: '600' }}>+0.64% (+305.10)</span>
                <span style={styles.cardSubtext}>INDIA</span>
              </div>
              <div style={styles.miniSparkline}>
                <svg viewBox="0 0 100 20" style={styles.sparklineSvg}>
                  <path d="M 0 18 Q 15 12, 30 8 T 60 15 T 80 5 T 100 2 L 100 20 L 0 20 Z" />
                </svg>
              </div>
            </div>
          </div>

          <div style={styles.sebiFooter}>
            <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.4' }}>
              🛡️ Institutional data endpoints encrypted via SSL. Registered Securities Advisory Dashboard (Mock Platform).
            </span>
          </div>
        </div>

        {/* Right Side: Clean Form Terminal */}
        <div className="login-form-column">
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <div style={styles.brandGroup}>
                <svg viewBox="0 0 24 24" style={styles.smallLogo}>
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
                <div style={styles.cyberBrand}>WISEMAN</div>
              </div>
              <span style={styles.shieldBadge}>🔒 SSL SECURED</span>
            </div>

            {/* Custom Tab Switcher */}
            <div style={styles.tabContainer}>
              <button 
                type="button" 
                onClick={() => { setIsRegisterMode(false); setAlert({ message: '', type: '' }); }}
                style={{
                  ...styles.tabBtn,
                  color: !isRegisterMode ? '#10b981' : '#64748b',
                  borderBottom: !isRegisterMode ? '2px solid #10b981' : '2px solid transparent'
                }}
              >
                {currentLang === 'mr' ? 'लॉग-इन' : 'Sign In'}
              </button>
              <button 
                type="button" 
                onClick={() => { setIsRegisterMode(true); setAlert({ message: '', type: '' }); }}
                style={{
                  ...styles.tabBtn,
                  color: isRegisterMode ? '#10b981' : '#64748b',
                  borderBottom: isRegisterMode ? '2px solid #10b981' : '2px solid transparent'
                }}
              >
                {currentLang === 'mr' ? 'खाते तयार करा' : 'Register'}
              </button>
            </div>

            <h3 style={styles.formTitle}>
              {isRegisterMode ? dict.titleRegister : dict.titleLogin}
            </h3>

            {alert.message && (
              <div style={{
                color: alertColor,
                borderColor: alertBorder,
                background: alertBg,
                padding: '10px 14px',
                border: '1px solid',
                borderRadius: '8px',
                fontSize: '12px',
                marginBottom: '18px',
                fontFamily: "'Inter', sans-serif",
                lineHeight: '1.4'
              }}>
                {alert.message}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Username Field */}
              <div style={styles.inputWrapper}>
                <label style={styles.inputLabel}>{dict.usernameLabel}</label>
                <div className="login-input-container">
                  <svg viewBox="0 0 24 24" style={styles.inputIcon}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                  <input
                    type="text"
                    className="login-input-field"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={currentLang === 'mr' ? 'युझरनेम एंटर करा...' : 'Enter username...'}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={styles.inputWrapper}>
                <label style={styles.inputLabel}>{dict.passwordLabel}</label>
                <div className="login-input-container" style={{ paddingRight: '6px' }}>
                  <svg viewBox="0 0 24 24" style={styles.inputIcon}>
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={currentLang === 'mr' ? 'पासवर्ड एंटर करा...' : 'Enter password...'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" style={styles.eyeIcon}>
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" style={styles.eyeIcon}>
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.39 2.7-3.14 3.44-5.12-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.72-2.68l4.43 4.43a4.99 4.99 0 0 0-.03-.55c0-2.76-2.24-5-5-5-.18 0-.37.01-.55.03z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Extra Form Actions */}
              <div style={styles.actionsRow}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={styles.checkboxInput}
                  />
                  <span>{currentLang === 'mr' ? 'लॉग-इन लक्षात ठेवा' : 'Remember ID'}</span>
                </label>
                <a href="#" onClick={handleForgotPassword} style={styles.forgotLink}>
                  {currentLang === 'mr' ? 'पासवर्ड विसरलात?' : 'Forgot Password?'}
                </a>
              </div>

              {/* Submit Button */}
              <button type="submit" className="login-btn-animated" style={styles.submitBtn}>
                {isRegisterMode ? dict.btnRegisterSubmit : dict.btnLoginSubmit}
              </button>
            </form>

            <div style={styles.toggleBar}>
              <span style={{ color: '#64748b' }}>{isRegisterMode ? dict.toggleRegisterText : dict.toggleLoginText}</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsRegisterMode(!isRegisterMode);
                  setAlert({ message: '', type: '' });
                }}
                style={styles.toggleLink}
              >
                {isRegisterMode ? dict.toggleRegisterLink : dict.toggleLoginLink}
              </a>
            </div>

            {/* Language Switcher Section */}
            <div style={styles.langSwitcher}>
              <span style={{ color: '#64748b', marginRight: '6px' }}>Language:</span>
              <div style={styles.langBtnGroup}>
                {[
                  { code: 'en', label: 'English' },
                  { code: 'mr', label: 'मराठी' },
                  { code: 'hi', label: 'हिंदी' },
                  { code: 'es', label: 'Español' }
                ].map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      if (setCurrentLang) {
                        setCurrentLang(lang.code);
                      }
                      localStorage.setItem('wiseman_lang', lang.code);
                    }}
                    style={{
                      ...styles.langBtn,
                      color: currentLang === lang.code ? '#10b981' : '#64748b',
                      fontWeight: currentLang === lang.code ? 'bold' : 'normal',
                      backgroundColor: currentLang === lang.code ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                      borderColor: currentLang === lang.code ? 'rgba(16, 185, 129, 0.25)' : 'transparent'
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Security Compliance Footer */}
            <div style={styles.securityFooter}>
              <span style={styles.footerShieldIcon}>🛡️</span>
              <span style={{ fontSize: '9px', color: '#64748b', letterSpacing: '0.5px' }}>
                AES-256 ENCRYPTION &middot; TLS 1.3 CLIENT SECURE HANDSHAKE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  promoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '25px'
  },
  logoBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #10b981, #047857)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)'
  },
  logoSvg: {
    width: '22px',
    height: '22px',
    stroke: '#ffffff',
    strokeWidth: '2.5',
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  },
  promoTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '14px',
    fontWeight: '800',
    letterSpacing: '1px',
    color: '#f8fafc'
  },
  promoSubtitle: {
    fontSize: '8px',
    color: '#64748b',
    letterSpacing: '1px',
    fontWeight: '700',
    marginTop: '2px'
  },
  promoMainHeading: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '24px',
    fontWeight: '800',
    lineHeight: '1.3',
    color: '#f8fafc',
    margin: '0 0 14px 0'
  },
  promoText: {
    fontSize: '12.5px',
    lineHeight: '1.6',
    color: '#cbd5e1',
    margin: '0 0 25px 0',
    maxWidth: '440px',
    fontFamily: "'Inter', sans-serif"
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
    width: '100%',
    maxWidth: '440px'
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '10px 14px',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px'
  },
  cardTag: {
    fontSize: '7.5px',
    fontFamily: "'Inter', sans-serif",
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.5px'
  },
  liveBadge: {
    fontSize: '8px',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: '800',
    color: '#10b981',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  pulseDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 6px #10b981',
    animation: 'scanPulse 1.2s infinite alternate'
  },
  cardSymbolRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
  cardSymbol: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '12px',
    fontWeight: '700',
    color: '#f8fafc'
  },
  cardPrice: {
    fontFamily: 'monospace',
    fontSize: '12px',
    fontWeight: '700',
    color: '#f8fafc'
  },
  cardChangeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '2px'
  },
  cardSubtext: {
    fontSize: '8.5px',
    color: '#64748b'
  },
  miniSparkline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '14px',
    opacity: 0.15,
    pointerEvents: 'none'
  },
  sparklineSvg: {
    width: '100%',
    height: '100%',
    stroke: '#10b981',
    strokeWidth: '1.5',
    fill: 'rgba(16, 185, 129, 0.25)',
    overflow: 'visible'
  },
  sebiFooter: {
    marginTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '12px',
    maxWidth: '440px'
  },
  formCard: {
    width: '100%',
    maxWidth: '350px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 2
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  smallLogo: {
    width: '16px',
    height: '16px',
    fill: 'none',
    stroke: '#10b981',
    strokeWidth: '2.5'
  },
  cyberBrand: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '15px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    color: '#f8fafc'
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  shieldBadge: {
    fontSize: '8px',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: '800',
    background: 'rgba(16, 185, 129, 0.08)',
    color: '#10b981',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  tabContainer: {
    display: 'flex',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '20px'
  },
  tabBtn: {
    flex: 1,
    padding: '10px 0',
    background: 'transparent',
    border: 'none',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s ease',
    outline: 'none'
  },
  formTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '14px',
    fontWeight: '700',
    color: '#f8fafc',
    margin: '0 0 16px 0',
    letterSpacing: '0.5px'
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  inputLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: '0.3px'
  },
  inputIcon: {
    width: '15px',
    height: '15px',
    fill: '#64748b',
    marginRight: '10px',
    flexShrink: 0
  },
  eyeBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none'
  },
  eyeIcon: {
    width: '16px',
    height: '16px',
    fill: '#64748b',
    transition: 'fill 0.2s',
    '&:hover': {
      fill: '#10b981'
    }
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11.5px',
    marginTop: '2px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#94a3b8',
    cursor: 'pointer',
    userSelect: 'none'
  },
  checkboxInput: {
    cursor: 'pointer',
    accentColor: '#10b981'
  },
  forgotLink: {
    color: '#10b981',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'opacity 0.2s'
  },
  submitBtn: {
    height: '42px',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
  },
  toggleBar: {
    display: 'none', // Hidden since we have tabs now
    justifyContent: 'center',
    gap: '4px',
    fontSize: '12px',
    marginTop: '20px'
  },
  toggleLink: {
    color: '#10b981',
    textDecoration: 'none',
    fontWeight: '700'
  },
  langSwitcher: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '15px'
  },
  langBtnGroup: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  },
  langBtn: {
    border: '1px solid transparent',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '10px',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s ease',
    outline: 'none'
  },
  securityFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '15px'
  },
  footerShieldIcon: {
    fontSize: '11px',
    opacity: 0.8
  }
};

// Wiseman Analytics - Cyberpunk Authentication & Session Controller

let isRegisterMode = false;

const authTranslations = {
  en: {
    titleLogin: "SECURED PORTAL ACCESS",
    titleRegister: "CREATE OPERATOR CREDENTIALS",
    btnLoginSubmit: "AUTHENTICATE SESSION",
    btnRegisterSubmit: "INITIALIZE REGISTRATION",
    toggleLoginText: "New Operator? ",
    toggleLoginLink: "Register Credentials",
    toggleRegisterText: "Existing Operator? ",
    toggleRegisterLink: "Login",
    usernameLabel: "Username",
    passwordLabel: "Password"
  },
  mr: {
    titleLogin: "सुरक्षित पोर्टल प्रवेश",
    titleRegister: "नवीन ऑपरेटर खाते तयार करा",
    btnLoginSubmit: "प्रवेश प्रमाणित करा (LOGIN)",
    btnRegisterSubmit: "ऑपरेटर नोंदणी करा (REGISTER)",
    toggleLoginText: "नवीन ऑपरेटर? ",
    toggleLoginLink: "रजिस्टर करा",
    toggleRegisterText: "आधीच खाते आहे? ",
    toggleRegisterLink: "लॉगिन करा",
    usernameLabel: "वापरकर्तानाव (Username)",
    passwordLabel: "पासवर्ड (Password)"
  },
  hi: {
    titleLogin: "सुरक्षित पोर्टल एक्सेस",
    titleRegister: "नया ऑपरेटर खाता बनाएं",
    btnLoginSubmit: "लॉगिन प्रमाणित करें",
    btnRegisterSubmit: "खाता पंजीकृत करें",
    toggleLoginText: "नए ऑपरेटर? ",
    toggleLoginLink: "पंजीकरण करें",
    toggleRegisterText: "पहले से खाता है? ",
    toggleRegisterLink: "लॉगिन करें",
    usernameLabel: "यूज़रनेम (Username)",
    passwordLabel: "पासवर्ड (Password)"
  },
  es: {
    titleLogin: "ACCESO AL PORTAL SEGURO",
    titleRegister: "CREAR CREDENCIALES",
    btnLoginSubmit: "AUTENTICAR SESIÓN",
    btnRegisterSubmit: "REGISTRAR OPERADOR",
    toggleLoginText: "¿Nuevo operador? ",
    toggleLoginLink: "Registrar credenciales",
    toggleRegisterText: "¿Operador existente? ",
    toggleRegisterLink: "Iniciar sesión",
    usernameLabel: "Usuario",
    passwordLabel: "Contraseña"
  }
};

function toggleAuthMode(e) {
  if (e) e.preventDefault();
  isRegisterMode = !isRegisterMode;
  renderAuthLabels();
}

function renderAuthLabels() {
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
  const dict = authTranslations[lang] || authTranslations['en'];
  
  const elTitle = document.getElementById('lblAuthPortalTitle');
  const elBtnSubmit = document.getElementById('btnAuthSubmit');
  const elToggleText = document.getElementById('lblAuthToggleText');
  const elToggleLink = document.getElementById('btnAuthToggle');
  const elUserLabel = document.getElementById('lblUsername');
  const elPassLabel = document.getElementById('lblPassword');
  const elUsernameInput = document.getElementById('authUsername');
  const elPasswordInput = document.getElementById('authPassword');

  if (elTitle) elTitle.innerText = isRegisterMode ? dict.titleRegister : dict.titleLogin;
  if (elBtnSubmit) elBtnSubmit.innerText = isRegisterMode ? dict.btnRegisterSubmit : dict.btnLoginSubmit;
  if (elToggleText) elToggleText.innerText = isRegisterMode ? dict.toggleRegisterText : dict.toggleLoginText;
  if (elToggleLink) elToggleLink.innerText = isRegisterMode ? dict.toggleRegisterLink : dict.toggleLoginLink;
  if (elUserLabel) elUserLabel.innerText = dict.usernameLabel;
  if (elPassLabel) elPassLabel.innerText = dict.passwordLabel;

  if (elUsernameInput) elUsernameInput.placeholder = lang === 'mr' ? 'नाव प्रविष्ट करा...' : 'Enter username...';
  if (elPasswordInput) elPasswordInput.placeholder = lang === 'mr' ? 'पासवर्ड प्रविष्ट करा...' : 'Enter password...';
}

async function handleAuthSubmit(e) {
  if (e) e.preventDefault();
  
  const userEl = document.getElementById('authUsername');
  const passEl = document.getElementById('authPassword');
  const alertEl = document.getElementById('authAlert');

  if (!userEl || !passEl || !alertEl) return;

  const username = userEl.value.trim();
  const password = passEl.value.trim();

  // Hide alert first
  alertEl.style.display = 'none';

  if (!username || !password) {
    showAlert("All security parameters are required.", "var(--red-neon)");
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
      throw new Error(data.error || "Security authentication failed.");
    }

    if (isRegisterMode) {
      // Auto-login upon successful registration
      isRegisterMode = false;
      showAlert("Registration successful. Authenticating session...", "var(--green-neon)");
      setTimeout(() => {
        loginUser(username, password);
      }, 1000);
    } else {
      // Login success
      localStorage.setItem('wiseman_token', data.token);
      showAlert("Session authorized. Loading terminal feeds...", "var(--green-neon)");
      setTimeout(() => {
        checkSession();
      }, 1000);
    }

  } catch (err) {
    console.error("Auth error:", err);
    showAlert(err.message, "var(--red-neon)");
  }
}

async function loginUser(username, password) {
  const alertEl = document.getElementById('authAlert');
  try {
    const response = await fetch(`${BACKEND_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    
    localStorage.setItem('wiseman_token', data.token);
    checkSession();
  } catch (err) {
    if (alertEl) {
      showAlert("Auto-login failed. Please enter credentials to continue.", "var(--red-neon)");
    }
  }
}

function showAlert(message, color) {
  const alertEl = document.getElementById('authAlert');
  if (!alertEl) return;
  alertEl.innerText = message;
  alertEl.style.color = color;
  alertEl.style.borderColor = color.replace('var(--', 'rgba(').replace(')', ', 0.35)').replace('red-neon', '255, 23, 68').replace('green-neon', '0, 230, 118');
  alertEl.style.background = color.replace('var(--', 'rgba(').replace(')', ', 0.04)').replace('red-neon', '255, 23, 68').replace('green-neon', '0, 230, 118');
  alertEl.style.display = 'block';
}

function checkSession() {
  const token = localStorage.getItem('wiseman_token');
  const loginPortal = document.getElementById('loginPortalContainer');
  const dashboard = document.getElementById('mainDashboardContainer');
  const ticker = document.getElementById('mainTickerContainer');

  if (token) {
    if (loginPortal) loginPortal.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
    if (ticker) ticker.style.display = 'flex';
    
    // Trigger canvas resizing once visible to prevent distortion
    if (typeof resizeCanvas === 'function') {
      setTimeout(resizeCanvas, 100);
    }

    // Connect to trusted backend WebSocket server
    if (typeof connectBackendWebsocket === 'function') {
      connectBackendWebsocket();
    }
  } else {
    if (loginPortal) loginPortal.style.display = 'flex';
    if (dashboard) dashboard.style.display = 'none';
    if (ticker) ticker.style.display = 'none';
    
    // Set initial login labels
    renderAuthLabels();
  }
}

function handleLogout() {
  localStorage.removeItem('wiseman_token');
  window.location.reload();
}

// Intercept translateUI call to reload auth labels if login is active
const originalTranslateUI = window.translateUI;
window.translateUI = function(lang) {
  if (typeof originalTranslateUI === 'function') {
    originalTranslateUI(lang);
  }
  renderAuthLabels();
};

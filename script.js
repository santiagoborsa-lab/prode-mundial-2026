// Datos de ejemplo del Mundial 2026
const MATCHES_DATA = {
  "group-phase": {
    title: "Fase de Grupos",
    groups: [
      {
        name: "Grupo A",
        teams: ["🇦🇷 Argentina", "🇵🇦 Panamá", "🇵🇪 Perú", "🇨🇦 Canadá"],
        matches: [
          { id: 1, date: "2026-06-10", time: "20:00", venue: "Los Angeles", team1: "🇦🇷 Argentina", team2: "🇨🇦 Canadá", status: "pending" },
          { id: 2, date: "2026-06-10", time: "20:00", venue: "Los Angeles", team1: "🇵🇪 Perú", team2: "🇵🇦 Panamá", status: "pending" },
          { id: 3, date: "2026-06-15", time: "20:00", venue: "Los Angeles", team1: "🇦🇷 Argentina", team2: "🇵🇦 Panamá", status: "pending" },
          { id: 4, date: "2026-06-15", time: "20:00", venue: "Los Angeles", team1: "🇨🇦 Canadá", team2: "🇵🇪 Perú", status: "pending" },
          { id: 5, date: "2026-06-20", time: "20:00", venue: "Los Angeles", team1: "🇦🇷 Argentina", team2: "🇵🇪 Perú", status: "pending" },
          { id: 6, date: "2026-06-20", time: "20:00", venue: "Los Angeles", team1: "🇨🇦 Canadá", team2: "🇵🇦 Panamá", status: "pending" }
        ]
      },
      {
        name: "Grupo B",
        teams: ["🇪🇸 España", "🇩🇪 Alemania", "🇲🇽 México", "🇲🇦 Marruecos"],
        matches: [
          { id: 7, date: "2026-06-11", time: "20:00", venue: "Dallas", team1: "🇪🇸 España", team2: "🇲🇨 Marruecos", status: "pending" },
          { id: 8, date: "2026-06-11", time: "20:00", venue: "Dallas", team1: "🇩🇪 Alemania", team2: "🇲🇽 México", status: "pending" },
          { id: 9, date: "2026-06-16", time: "20:00", venue: "Dallas", team1: "🇪🇸 España", team2: "🇩🇪 Alemania", status: "pending" },
          { id: 10, date: "2026-06-16", time: "20:00", venue: "Dallas", team1: "🇲🇽 México", team2: "🇲🇦 Marruecos", status: "pending" },
          { id: 11, date: "2026-06-21", time: "20:00", venue: "Dallas", team1: "🇪🇸 España", team2: "🇲🇽 México", status: "pending" },
          { id: 12, date: "2026-06-21", time: "20:00", venue: "Dallas", team1: "🇩🇪 Alemania", team2: "🇲🇦 Marruecos", status: "pending" }
        ]
      }
    ]
  },
  "knockout": {
    title: "Fase Final",
    rounds: [
      {
        title: "Octavos de Final",
        matches: [
          { id: 25, date: "2026-07-01", time: "20:00", venue: "New York", team1: "🇦🇷 Ganador A1", team2: "🇪🇸 Ganador B2", status: "pending" }
        ]
      }
    ]
  }
};

// Estado global
let currentUser = null;
let predictions = JSON.parse(localStorage.getItem('predictions')) || {};
let isLocked = JSON.parse(localStorage.getItem('isLocked')) || false;

// ===== AUTENTICACIÓN =====
function showAuth() {
  document.getElementById('app').innerHTML = `
    <div class="auth-container">
      <div class="auth-box">
        <div class="auth-logo">⚽</div>
        <h1 class="auth-title">PRODE 2026</h1>
        <p class="auth-subtitle">Sistema de Pronósticos Mundial</p>
        
        <div class="auth-toggle">
          <button class="toggle-btn active" data-mode="login">INICIAR SESIÓN</button>
          <button class="toggle-btn" data-mode="register">REGISTRARSE</button>
        </div>

        <form id="authForm">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" id="email" placeholder="tu@email.com" required>
          </div>
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input type="password" class="form-input" id="password" placeholder="••••••••" required>
          </div>
          <div class="form-group" id="nameGroup" style="display: none;">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-input" id="name" placeholder="Tu nombre completo">
          </div>
          <button type="submit" class="btn btn-primary">
            <i class="ti ti-login"></i>
            INGRESAR
          </button>
        </form>
      </div>
    </div>
  `;

  let mode = 'login';
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      mode = e.target.dataset.mode;
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      document.getElementById('nameGroup').style.display = mode === 'register' ? 'block' : 'none';
      document.querySelector('.btn-primary').innerHTML = mode === 'login' ? 
        '<i class="ti ti-login"></i> INGRESAR' : 
        '<i class="ti ti-user-plus"></i> REGISTRARSE';
    });
  });

  document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value || email.split('@')[0];
    currentUser = { email, name, role: 'user' };
    localStorage.setItem('user', JSON.stringify(currentUser));
    showApp();
  });
}

// ===== INTERFAZ PRINCIPAL =====
function showApp() {
  const html = `
    <div class="header">
      <div class="header-left">
        <div class="header-icon">⚽</div>
        <div>
          <h1>PRODE MUNDIAL 2026</h1>
          <p>Sistema de Pronósticos</p>
        </div>
      </div>
      <div class="header-right">
        <div class="user-info">
          <div class="user-avatar">${currentUser.name[0].toUpperCase()}</div>
          <div>
            <div class="user-name">${currentUser.name}</div>
            <div class="user-role">${currentUser.role}</div>
          </div>
        </div>
        <button class="btn-logout" onclick="logout()">
          <i class="ti ti-logout"></i>
          SALIR
        </button>
      </div>
    </div>

    <div class="tabs">
      <div class="tab active" onclick="switchTab('groups')">
        <i class="ti ti-layout-list"></i>
        FASE DE GRUPOS
      </div>
      <div class="tab" onclick="switchTab('knockout')">
        <i class="ti ti-trophy"></i>
        FASE FINAL
      </div>
      ${currentUser.role === 'admin' ? `
        <div class="tab" onclick="switchTab('admin')">
          <i class="ti ti-settings"></i>
          ADMINISTRACIÓN
        </div>
      ` : ''}
    </div>

    <div class="content">
      <div id="groups-content" class="tab-content"></div>
      <div id="knockout-content" class="tab-content" style="display: none;"></div>
      ${currentUser.role === 'admin' ? `<div id="admin-content" class="tab-content" style="display: none;"></div>` : ''}
    </div>
  `;

  document.getElementById('app').innerHTML = html;
  
  // Event listeners para tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });

  renderGroupPhase();
}

// ===== RENDERIZAR FASE DE GRUPOS =====
function renderGroupPhase() {
  const container = document.getElementById('groups-content');
  let html = `
    <div class="card">
      <div class="card-title">
        <i class="ti ti-layout-list"></i>
        ${MATCHES_DATA['group-phase'].title}
      </div>
      ${isLocked ? '<div class="alert alert-locked"><i class="ti ti-lock"></i> Los pronósticos están bloqueados</div>' : ''}
  `;

  MATCHES_DATA['group-phase'].groups.forEach(group => {
    html += `
      <div class="phase-section">
        <div class="phase-header" onclick="togglePhase(this)">
          <div class="phase-header-content">
            <div class="phase-header-title">
              <span>${group.name}</span>
              <span class="phase-match-count">${group.matches.length} partidos</span>
            </div>
          </div>
          <i class="ti ti-chevron-down phase-toggle-icon open"></i>
        </div>
        <div class="phase-content open">
          <div class="phase-content-inner">
            ${group.matches.map(match => renderMatchCard(match)).join('')}
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
  setupMatchInputs();
}

// ===== RENDERIZAR TARJETA DE PARTIDO =====
function renderMatchCard(match) {
  const pred = predictions[match.id] || {};
  const isMatchLocked = isLocked;
  
  return `
    <div class="match-card ${isMatchLocked ? 'locked' : ''}">
      <div class="match-date-venue">
        <div class="match-date-item">
          <i class="ti ti-calendar"></i>
          <span>${match.date} ${match.time}</span>
        </div>
        <div class="match-date-item">
          <i class="ti ti-map-pin"></i>
          <span>${match.venue}</span>
        </div>
      </div>
      
      <div class="pronostico-box">
        <div class="pronostico-row">
          <div class="team-input-group">
            <span class="team-flag-large">${match.team1.split(' ')[0]}</span>
            <span class="team-name-text">${match.team1}</span>
          </div>
          <input type="number" class="team-input" data-match="${match.id}" data-team="1" 
            min="0" max="9" value="${pred.team1 || ''}" ${isMatchLocked ? 'disabled' : ''} 
            placeholder="0">
          <span class="vs-separator">VS</span>
          <input type="number" class="team-input" data-match="${match.id}" data-team="2" 
            min="0" max="9" value="${pred.team2 || ''}" ${isMatchLocked ? 'disabled' : ''} 
            placeholder="0">
          <div class="team-input-group">
            <span class="team-flag-large">${match.team2.split(' ')[0]}</span>
            <span class="team-name-text">${match.team2}</span>
          </div>
        </div>
      </div>
      
      <div class="match-status ${pred.team1 !== undefined ? 'status-predicted' : 'status-pending'}">
        <i class="ti ti-circle-check"></i>
        ${pred.team1 !== undefined ? 'PRONÓSTICO GUARDADO' : 'PENDIENTE'}
      </div>
    </div>
  `;
}

// ===== SETUP INPUTS =====
function setupMatchInputs() {
  document.querySelectorAll('.team-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const matchId = parseInt(e.target.dataset.match);
      const team = e.target.dataset.team;
      
      if (!predictions[matchId]) {
        predictions[matchId] = {};
      }
      
      predictions[matchId][`team${team}`] = e.target.value ? parseInt(e.target.value) : undefined;
      
      localStorage.setItem('predictions', JSON.stringify(predictions));
      
      // Actualizar estado visual
      const card = e.target.closest('.match-card');
      const status = card.querySelector('.match-status');
      const hasPrediction = predictions[matchId].team1 !== undefined && predictions[matchId].team2 !== undefined;
      
      status.className = `match-status ${hasPrediction ? 'status-predicted' : 'status-pending'}`;
      status.innerHTML = hasPrediction ? 
        '<i class="ti ti-circle-check"></i> PRONÓSTICO GUARDADO' : 
        '<i class="ti ti-circle-check"></i> PENDIENTE';
    });
  });
}

// ===== TOGGLE FASE =====
function togglePhase(header) {
  const icon = header.querySelector('.phase-toggle-icon');
  const content = header.nextElementSibling;
  
  icon.classList.toggle('open');
  content.classList.toggle('open');
}

// ===== CAMBIAR TAB =====
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  
  if (tabName === 'groups') {
    document.getElementById('groups-content').style.display = 'block';
    renderGroupPhase();
  } else if (tabName === 'knockout') {
    document.getElementById('knockout-content').style.display = 'block';
    renderKnockout();
  } else if (tabName === 'admin') {
    document.getElementById('admin-content').style.display = 'block';
    renderAdmin();
  }
}

// ===== FASE KNOCKOUT =====
function renderKnockout() {
  const container = document.getElementById('knockout-content');
  let html = `
    <div class="card">
      <div class="card-title">
        <i class="ti ti-trophy"></i>
        ${MATCHES_DATA['knockout'].title}
      </div>
      <div class="bracket-container">
        <div class="bracket">
          <div class="bracket-round">
            <div class="bracket-round-title">Octavos de Final</div>
            <div class="bracket-match">
              <div class="bracket-team">
                <div class="bracket-team-info">
                  <span>🏆</span>
                  <span class="bracket-team-name">Ganador A1 vs B2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// ===== PANEL ADMIN =====
function renderAdmin() {
  const container = document.getElementById('admin-content');
  const totalPredictions = Object.keys(predictions).length;
  
  const html = `
    <div class="card">
      <div class="card-title">
        <i class="ti ti-settings"></i>
        Panel de Administración
      </div>
      
      <div class="admin-grid">
        <div class="admin-stat">
          <i class="ti ti-users" style="font-size: 28px; color: var(--primary)"></i>
          <div class="admin-stat-value">1</div>
          <div class="admin-stat-label">Usuarios Activos</div>
        </div>
        <div class="admin-stat">
          <i class="ti ti-checks" style="font-size: 28px; color: var(--success)"></i>
          <div class="admin-stat-value">${totalPredictions}</div>
          <div class="admin-stat-label">Pronósticos Guardados</div>
        </div>
        <div class="admin-stat">
          <i class="ti ti-calendar" style="font-size: 28px; color: var(--accent)"></i>
          <div class="admin-stat-value">48</div>
          <div class="admin-stat-label">Partidos Totales</div>
        </div>
      </div>

      <div class="control-panel">
        <h3 style="color: var(--text-primary); margin-bottom: 1rem;">
          <i class="ti ti-lock"></i>
          Control de Pronósticos
        </h3>
        <div class="toggle-switch">
          <label class="switch">
            <input type="checkbox" ${isLocked ? 'checked' : ''} onchange="toggleLock(this)">
            <span class="slider"></span>
          </label>
          <span class="lock-status-text">${isLocked ? '🔒 Pronósticos Bloqueados' : '🔓 Pronósticos Abiertos'}</span>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.05)); border: 1px solid var(--border-light); border-radius: 14px; padding: 1.5rem;">
        <h3 style="color: var(--text-primary); margin-bottom: 1rem;">
          <i class="ti ti-trash"></i>
          Peligro
        </h3>
        <button class="btn btn-primary" style="background: linear-gradient(135deg, var(--danger), #dc2626);" onclick="if(confirm('¿Limpiar todos los pronósticos?')) { predictions = {}; localStorage.removeItem('predictions'); location.reload(); }">
          Limpiar Todos los Pronósticos
        </button>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// ===== BLOQUEAR/DESBLOQUEAR =====
function toggleLock(checkbox) {
  isLocked = checkbox.checked;
  localStorage.setItem('isLocked', JSON.stringify(isLocked));
  renderGroupPhase();
}

// ===== LOGOUT =====
function logout() {
  if (confirm('¿Estás seguro de que quieres salir?')) {
    currentUser = null;
    localStorage.removeItem('user');
    init();
  }
}

// ===== INICIALIZACIÓN =====
function init() {
  const savedUser = localStorage.getItem('user');
  
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    // Simular rol admin para pruebas (cambiar según necesites)
    if (currentUser.email.includes('admin')) {
      currentUser.role = 'admin';
    }
    showApp();
  } else {
    showAuth();
  }
}

// Iniciar app
document.addEventListener('DOMContentLoaded', init);

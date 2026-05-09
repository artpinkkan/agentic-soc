// Shannon Sentinel — Shared Utilities

// ── Language ──────────────────────────────────────────────────────────────────
function applyLang(lang) {
  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = lang === 'en' ? el.dataset.en : el.dataset.id;
  });
  const btn = document.getElementById('lang-btn');
  if (btn) btn.textContent = lang === 'en' ? 'ID' : 'EN';
  document.documentElement.lang = lang;
}

function toggleLang() {
  const next = (localStorage.getItem('ss-lang') || 'id') === 'id' ? 'en' : 'id';
  localStorage.setItem('ss-lang', next);
  applyLang(next);
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function logout() {
  sessionStorage.removeItem('ss-session');
  window.location.replace('/agentic-soc/login/');
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function initNav() {
  if (!window.SS) return;
  const name = window.SS.name || '';
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const avatarEl = document.getElementById('nav-avatar');
  if (avatarEl) avatarEl.textContent = initials || '?';
  const nameEl = document.getElementById('nav-name');
  if (nameEl) nameEl.textContent = name;
  const companyEl = document.getElementById('nav-company');
  if (companyEl) companyEl.textContent = window.SS.company || '';
  if (window.SS.tier === 'sprint') {
    const badge = document.getElementById('nav-tier-badge');
    if (badge) {
      badge.className = 'badge badge-sprint';
      badge.setAttribute('data-en', 'Sprint');
      badge.setAttribute('data-id', 'Sprint');
      badge.textContent = 'Sprint';
    }
  }
}

function toggleUserMenu() {
  const m = document.getElementById('user-menu');
  if (m) m.hidden = !m.hidden;
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.ss-nav__user')) {
    const m = document.getElementById('user-menu');
    if (m) m.hidden = true;
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const lang = localStorage.getItem('ss-lang') || 'id';
  // Set lang attr before DOMContentLoaded content renders
  document.documentElement.lang = lang;
  applyLang(lang);
  initNav();
});

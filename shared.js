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

// ── Audience ──────────────────────────────────────────────────────────────────
function setAudience(aud) {
  localStorage.setItem('ss-audience', aud);
  const lang = localStorage.getItem('ss-lang') || 'id';

  // Update tab states
  document.querySelectorAll('.ss-aud-tab').forEach(t =>
    t.classList.toggle('ss-aud-tab--active', t.dataset.aud === aud)
  );

  // data-{aud} pattern — used by elements with .aud-q / .aud-f classes (dashboard)
  document.querySelectorAll('.aud-q, .aud-f').forEach(el => {
    if (el.dataset[aud]) el.textContent = el.dataset[aud];
  });

  // Page-specific content callback
  if (typeof window.onAudienceChange === 'function') {
    window.onAudienceChange(aud, lang);
  }
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

function toggleNav() {
  const nav = document.getElementById('ss-nav');
  if (!nav) return;
  const collapsed = nav.classList.toggle('ss-nav--collapsed');
  localStorage.setItem('ss-nav-collapsed', collapsed ? '1' : '0');
}


// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const lang = localStorage.getItem('ss-lang') || 'id';
  document.documentElement.lang = lang;
  applyLang(lang);
  initNav();
  const nav = document.getElementById('ss-nav');
  if (nav && localStorage.getItem('ss-nav-collapsed') === '1') {
    nav.classList.add('ss-nav--collapsed');
  }
});

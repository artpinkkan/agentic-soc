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

  // Sync select element
  const sel = document.getElementById('audience-select');
  if (sel) sel.value = aud;

  // data-{aud} pattern — elements with .aud-q / .aud-f classes (dashboard)
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

// ── Account switcher ──────────────────────────────────────────────────────────
const _DEMO_ACCOUNTS = {
  free: {
    email: 'rudi@contoh.co.id', name: 'Rudi Hartono',
    company: 'Contoh Corp', slug: 'contoh-corp',
    industry: 'fintech', tier: 'free', state: 'free_active',
    funnel: 'xray', setupComplete: true, domainVerified: true
  },
  sprint: {
    email: 'sari@berkembang.co.id', name: 'Sari Wulandari',
    company: 'Berkembang Corp', slug: 'berkembang-corp',
    industry: 'manufacturing', tier: 'sprint', state: 'sprint_active',
    funnel: 'xray', setupComplete: true, domainVerified: true
  },
  mdr: {
    email: 'budi@majuindustri.co.id', name: 'Budi Santoso',
    company: 'Maju Industri', slug: 'maju-industri',
    industry: 'manufacturing', tier: 'mdr', state: 'mdr_active',
    funnel: 'xray', setupComplete: true, domainVerified: true
  }
};

function toggleAccountMenu() {
  const menu = document.getElementById('nav-account-menu');
  const area = document.getElementById('nav-user-area');
  if (!menu) return;
  const isOpen = !menu.hidden;
  menu.hidden = isOpen;
  if (area) area.classList.toggle('ss-nav__user-area--open', !isOpen);
}

function switchAccount(tier) {
  sessionStorage.setItem('ss-session', JSON.stringify(_DEMO_ACCOUNTS[tier] || _DEMO_ACCOUNTS.free));
  window.location.reload();
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

  const tierMeta = {
    sprint:  { cls: 'badge-sprint', en: 'Sprint',       id: 'Sprint' },
    mdr:     { cls: 'badge-mdr',    en: 'MDR Active',   id: 'MDR Aktif' },
    mdr_ai:  { cls: 'badge-mdr',    en: 'MDR AI Active',id: 'MDR AI Aktif' },
  };
  const tm = tierMeta[window.SS.tier];
  if (tm) {
    const badge = document.getElementById('nav-tier-badge');
    if (badge) {
      badge.className = 'badge ' + tm.cls;
      badge.setAttribute('data-en', tm.en);
      badge.setAttribute('data-id', tm.id);
      const lang = localStorage.getItem('ss-lang') || 'id';
      badge.textContent = lang === 'en' ? tm.en : tm.id;
    }
  }

  // Build account switcher menu
  const menu = document.getElementById('nav-account-menu');
  if (menu) {
    const tierColors = {
      free:   { bg: 'linear-gradient(135deg,#00685f,#008378)', label: 'Free' },
      sprint: { bg: 'linear-gradient(135deg,#3C3489,#5B52C8)', label: 'Sprint' },
      mdr:    { bg: 'linear-gradient(135deg,#7A4800,#C07A20)', label: 'MDR' },
    };
    const items = Object.entries(_DEMO_ACCOUNTS).map(([tier, acc]) => {
      const ini = acc.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
      const tc = tierColors[tier] || tierColors.free;
      const isActive = window.SS.email === acc.email;
      return `<button class="ss-nav__account-item${isActive ? ' ss-nav__account-item--active' : ''}" onclick="switchAccount('${tier}')">
        <div class="ss-nav__account-item-avatar" style="background:${tc.bg}">${ini}</div>
        <div class="ss-nav__account-item-info">
          <span class="ss-nav__account-item-name">${acc.name}</span>
          <span class="ss-nav__account-item-sub">${acc.company} · ${tc.label}</span>
        </div>
        ${isActive ? '<i class="ti ti-check" style="font-size:14px;color:var(--ss-brand);flex-shrink:0;"></i>' : ''}
      </button>`;
    }).join('');
    menu.innerHTML = items + `<div class="ss-nav__account-divider"></div>
      <button class="ss-nav__account-item ss-nav__account-item--signout" onclick="logout()">
        <i class="ti ti-logout" style="font-size:16px;flex-shrink:0;"></i>
        <span data-en="Sign out" data-id="Keluar">Keluar</span>
      </button>`;
  }
}

// Hide/unlock upgrade UI elements based on the active tier
function applyTierUI() {
  if (!window.SS) return;
  const tier = window.SS.tier || 'free';
  const isFree = tier === 'free';

  document.body.setAttribute('data-tier', tier);

  // Nav upgrade nudge
  const nudge = document.getElementById('nav-upgrade-nudge');
  if (nudge) nudge.hidden = !isFree;

  // Cap bars
  if (!isFree) {
    document.querySelectorAll('.ss-cap-bar').forEach(el => { el.hidden = true; });
  }

  // Upgrade ladder + sales CTA: hide for MDR tiers (already subscribed)
  if (tier === 'mdr' || tier === 'mdr_ai') {
    const ladder = document.querySelector('.ss-upgrade-ladder');
    if (ladder) ladder.hidden = true;
    const cta = document.getElementById('sales-cta');
    if (cta) cta.hidden = true;
    const exportBar = document.querySelector('.ss-export-bar');
    if (exportBar) exportBar.hidden = true;
  }

  // Unlock lock-gates for paid tiers
  if (!isFree) {
    document.querySelectorAll('.ss-locked').forEach(container => {
      container.classList.remove('ss-locked');
      container.style.pointerEvents = '';
      container.style.userSelect = '';
      const gate = container.querySelector('.ss-lock-gate');
      if (gate) gate.hidden = true;
      const overlay = container.querySelector('.ss-lock-gate + *');
      if (overlay && overlay.style) overlay.style.opacity = '';
    });
  }

  // Retention/inference notices: hide for non-free
  if (!isFree) {
    document.querySelectorAll('.ss-notice--warning, .ss-notice--info').forEach(el => {
      const txt = el.textContent || '';
      if (txt.includes('3 hari') || txt.includes('3 days') ||
          txt.includes('inferensi bersama') || txt.includes('shared inference')) {
        el.hidden = true;
      }
    });
    // Triage upgrade notice
    document.querySelectorAll('.ss-notice--info').forEach(el => {
      if (el.textContent.includes('tindakan penahanan') || el.textContent.includes('containment actions')) {
        el.hidden = true;
      }
    });
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
  applyTierUI();
  const nav = document.getElementById('ss-nav');
  if (nav && localStorage.getItem('ss-nav-collapsed') === '1') {
    nav.classList.add('ss-nav--collapsed');
  }

  // Close account menu on outside click
  document.addEventListener('click', e => {
    const menu = document.getElementById('nav-account-menu');
    const area = document.getElementById('nav-user-area');
    if (menu && !menu.hidden && area && !area.contains(e.target) && !menu.contains(e.target)) {
      menu.hidden = true;
      area.classList.remove('ss-nav__user-area--open');
    }
  }, true);
});

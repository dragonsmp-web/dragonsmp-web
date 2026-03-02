/* ================================================================
   DRAGON SMP WIKI V2 — app.js
   Logique principale : navigation, sidebar, recherche, markdown
   ================================================================ */

// ── State ────────────────────────────────────────────────────────────────────
let _data   = null;   // { categories, pages, settings }
let _pageId = null;   // page courante

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  _data = await DB.load();
  buildSidebar();
  setupSearch();
  setupHamburger();
  startMCStatus();

  // Page initiale depuis hash ou première page
  const hash = location.hash.replace('#', '') || getFirstPageId();
  if (hash) goTo(hash);
});

window.addEventListener('hashchange', () => {
  const id = location.hash.replace('#', '');
  if (id) goTo(id);
});

// ── Première page dispo ───────────────────────────────────────────────────────
function getFirstPageId() {
  const pages = _data?.pages;
  if (!pages?.length) return null;
  // Cherche la page "accueil" en priorité
  const acc = pages.find(p => p.id === 'accueil');
  return acc ? acc.id : pages[0].id;
}

// ── Construction de la sidebar ────────────────────────────────────────────────
function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  if (!nav || !_data) return;

  const { categories, pages } = _data;
  const sorted = [...categories].sort((a,b) => (a.order||0)-(b.order||0));
  let html = '';

  sorted.forEach(cat => {
    const catPages = pages
      .filter(p => p.categoryId === cat.id)
      .sort((a,b) => (a.order||0)-(b.order||0));
    if (!catPages.length) return;

    const isOpen = catPages.some(p => p.id === _pageId);
    html += `
      <div class="cat-section${isOpen?' open':''}" data-cat="${cat.id}">
        <div class="cat-header" onclick="toggleCat('${cat.id}')">
          <div class="cat-header-left">
            <span class="cat-icon">${cat.icon||'📁'}</span>
            <span class="cat-name">${esc(cat.name)}</span>
          </div>
          <span class="cat-chevron">▶</span>
        </div>
        <div class="cat-pages">`;
    catPages.forEach(p => {
      html += `
          <div class="page-link${p.id===_pageId?' active':''}" data-id="${p.id}" onclick="goTo('${p.id}')">
            <span class="page-link-icon">${p.icon||'📄'}</span>
            ${esc(p.title)}
          </div>`;
    });
    html += `</div></div>`;
  });

  if (!html) {
    html = `<div style="padding:1rem;color:var(--text3);font-size:.82rem">Aucune page disponible.</div>`;
  }

  nav.innerHTML = html;
}

function toggleCat(id) {
  document.querySelector(`.cat-section[data-cat="${id}"]`)?.classList.toggle('open');
}

// ── Navigation ────────────────────────────────────────────────────────────────
function goTo(id) {
  const page = _data?.pages?.find(p => p.id === id || p.slug === id);
  if (!page) return;

  _pageId = page.id;
  location.hash = page.id;

  // Met à jour sidebar
  document.querySelectorAll('.page-link').forEach(el => {
    el.classList.toggle('active', el.dataset.id === page.id);
  });
  // Ouvre la bonne catégorie
  document.querySelectorAll('.cat-section').forEach(s => {
    const hasActive = s.querySelector('.page-link.active');
    if (hasActive) s.classList.add('open');
  });

  // Header nav actif
  document.querySelectorAll('.header-nav-item[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page.id);
  });

  renderPage(page);
  closeMobileMenu();
}

function renderPage(page) {
  const main = document.getElementById('wiki-main');
  if (!main) return;
  main.innerHTML = `
    <div class="page-view">
      <div class="page-view-header">
        <h1>${page.icon||''} ${esc(page.title)}</h1>
        ${page.description ? `<p class="page-view-desc">${esc(page.description)}</p>` : ''}
      </div>
      <div class="wiki-body">${md(page.content||'')}</div>
    </div>`;
}

// ── Markdown parser ───────────────────────────────────────────────────────────
function md(raw) {
  if (!raw) return '';
  let s = raw;

  // Blocs de code (pas d'escape à l'intérieur)
  const codeBlocks = [];
  s = s.replace(/```[\s\S]*?```/g, m => {
    codeBlocks.push(m);
    return `\x00CODE${codeBlocks.length-1}\x00`;
  });

  // Escape HTML sauf dans les blocs protégés
  s = s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  // Inline code
  s = s.replace(/`([^`\n]+)`/g, (_, c) => `<code>${c}</code>`);

  // Images ![alt](url)
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');

  // Liens [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Blockquote
  s = s.replace(/^&gt; (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // HR
  s = s.replace(/^---$/gm, '<hr>');

  // Tableau
  s = s.replace(/(\|.+\|\n)(\|[-| :]+\|\n)((?:\|.+\|\n?)*)/g, (_, head, __, body) => {
    const ths = head.split('|').filter(c=>c.trim()).map(c=>`<th>${c.trim()}</th>`).join('');
    const trs = body.trim().split('\n').map(row=>{
      const tds = row.split('|').filter(c=>c.trim()).map(c=>`<td>${c.trim()}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');
    return `<div style="overflow-x:auto"><table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
  });

  // Titres
  s = s.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  s = s.replace(/^## (.+)$/gm,  '<h2>$1</h2>');
  s = s.replace(/^# (.+)$/gm,   '<h1>$1</h1>');

  // Bold / Italic
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Listes
  s = s.replace(/((?:^- .+\n?)+)/gm, m => {
    const li = m.trim().split('\n').map(l=>`<li>${l.replace(/^- /,'')}</li>`).join('');
    return `<ul>${li}</ul>`;
  });
  s = s.replace(/((?:^\d+\. .+\n?)+)/gm, m => {
    const li = m.trim().split('\n').map(l=>`<li>${l.replace(/^\d+\. /,'')}</li>`).join('');
    return `<ol>${li}</ol>`;
  });

  // Paragraphes
  s = '\n' + s + '\n';
  s = s.replace(/\n\n+/g, '\n\n');
  s = s.replace(/\n\n([^<\n].*?)\n\n/g, '\n\n<p>$1</p>\n\n');

  // Réinsère les blocs de code
  s = s.replace(/\x00CODE(\d+)\x00/g, (_, i) => {
    const code = codeBlocks[+i].replace(/^```[^\n]*\n?/,'').replace(/```$/,'');
    return `<pre><code>${code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`;
  });

  return s.trim();
}

// ── Recherche ─────────────────────────────────────────────────────────────────
function setupSearch() {
  const input = document.getElementById('search-input');
  const drop  = document.getElementById('search-drop');
  if (!input || !drop) return;

  let t;
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => doSearch(input.value.trim()), 200);
  });
  input.addEventListener('focus', () => {
    if (input.value.trim()) doSearch(input.value.trim());
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.header-search')) {
      drop.classList.remove('show');
      input.value = '';
    }
  });
}

function doSearch(q) {
  const drop = document.getElementById('search-drop');
  if (!drop) return;
  if (!q) { drop.classList.remove('show'); return; }

  const ql = q.toLowerCase();
  const results = (_data?.pages||[]).filter(p =>
    p.title.toLowerCase().includes(ql) ||
    (p.description||'').toLowerCase().includes(ql) ||
    (p.content||'').toLowerCase().includes(ql)
  ).slice(0,6);

  if (!results.length) {
    drop.innerHTML = `<div class="search-empty">Aucun résultat pour "${esc(q)}"</div>`;
  } else {
    const cats = {};
    (_data?.categories||[]).forEach(c => cats[c.id] = c.name);
    drop.innerHTML = results.map(p => `
      <div class="search-item" onclick="goTo('${p.id}');document.getElementById('search-drop').classList.remove('show');document.getElementById('search-input').value=''">
        <div class="search-item-title">${p.icon||''} ${esc(p.title)}</div>
        <div class="search-item-cat">${cats[p.categoryId]||''}</div>
      </div>`).join('');
  }
  drop.classList.add('show');
}

// ── Hamburger menu ────────────────────────────────────────────────────────────
function setupHamburger() {
  const btn = document.getElementById('hamburger');
  const overlay = document.getElementById('mob-overlay');
  if (btn) btn.addEventListener('click', toggleMobileMenu);
  if (overlay) overlay.addEventListener('click', closeMobileMenu);
}

function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar') || document.getElementById('adm-sidebar');
  const btn = document.getElementById('hamburger');
  const overlay = document.getElementById('mob-overlay');
  sidebar?.classList.toggle('open');
  btn?.classList.toggle('open');
  overlay?.classList.toggle('show');
}

function closeMobileMenu() {
  const sidebar = document.getElementById('sidebar') || document.getElementById('adm-sidebar');
  const btn = document.getElementById('hamburger');
  const overlay = document.getElementById('mob-overlay');
  sidebar?.classList.remove('open');
  btn?.classList.remove('open');
  overlay?.classList.remove('show');
}

// ── Statut serveur MC ─────────────────────────────────────────────────────────
function startMCStatus() {
  updateMCStatus();
  setInterval(updateMCStatus, 60000);
}

async function updateMCStatus() {
  const el = document.getElementById('mc-status');
  if (!el || !_data) return;

  const s = _data.settings;

  if (s.maintenance) {
    el.innerHTML = `
      <div class="mc-label"><span class="mc-indicator maintenance"></span>Maintenance</div>
      <div class="mc-ip">${esc(s.mcDisplayIp||'')}</div>`;
    return;
  }

  // Ping via mcstatus.io (API publique, pas de CORS)
  try {
    const r = await fetch(`https://api.mcstatus.io/v2/status/java/${s.mcHost}:${s.mcPort}`);
    const j = await r.json();
    if (j.online) {
      const players = j.players?.online ?? 0;
      const max = j.players?.max ?? 0;
      el.innerHTML = `
        <div class="mc-label"><span class="mc-indicator online"></span>En ligne — ${players}/${max} joueurs</div>
        <div class="mc-ip">${esc(s.mcDisplayIp||'')}</div>`;
    } else {
      throw new Error('offline');
    }
  } catch {
    el.innerHTML = `
      <div class="mc-label"><span class="mc-indicator offline"></span>Hors ligne</div>
      <div class="mc-ip">${esc(s.mcDisplayIp||'')}</div>`;
  }
}

// ── Utils ─────────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s||'')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function toast(msg, type='ok') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.className = `show ${type}`;
  setTimeout(() => t.className='', 3000);
}

function genId(title) {
  return title.toLowerCase()
    .replace(/[àáâãäå]/g,'a').replace(/[èéêë]/g,'e')
    .replace(/[ìíîï]/g,'i').replace(/[òóôõö]/g,'o')
    .replace(/[ùúûü]/g,'u').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
    || 'page-' + Date.now();
}

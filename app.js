/* ================================================================
   DRAGON SMP WIKI — app.js
   Gestion des pages, navigation, recherche et markdown
   ================================================================ */

// ── Données par défaut (chargées si localStorage vide) ──────────────────────
const DEFAULT_PAGES = [
  {
    id: 'accueil',
    title: 'Accueil',
    icon: '🏠',
    slug: 'accueil',
    category: 'general',
    description: 'Bienvenue sur le Wiki du Dragon SMP',
    content: `## Bienvenue sur le Dragon SMP

Le **Dragon SMP** est un serveur Minecraft Survie communautaire francophone où l'aventure, la construction et l'entraide sont au cœur de l'expérience.

### Informations essentielles

**IP du serveur :** \`connect.axohosts.fr:25883\`
**Version :** Java 1.21+
**Type :** Survie Vanilla améliorée

### Comment démarrer ?

1. Lance Minecraft Java Edition
2. Va dans **Multijoueur**
3. Clique sur **Ajouter un serveur**
4. Entre l'IP : \`connect.axohosts.fr:25883\`
5. Connecte-toi et profite !

> **Conseil :** Rejoins notre Discord pour t'intégrer à la communauté et ne rater aucun event !

### Liens utiles

- 📋 Lis le **Règlement** avant de jouer
- 🎓 Consulte le **Guide débutant** pour bien démarrer
- 💬 Rejoins notre **Discord** pour discuter avec la communauté`
  },
  {
    id: 'reglement',
    title: 'Règlement',
    icon: '📋',
    slug: 'reglement',
    category: 'general',
    description: 'Les règles du serveur',
    content: `## Règlement du Dragon SMP

Le respect de ces règles est **obligatoire** pour tous les joueurs. Toute infraction peut entraîner un avertissement, un kick ou un ban définitif.

### Règles générales

**1. Respect mutuel**
Aucune insulte, discrimination, harcèlement ou propos haineux ne sera toléré. Nous sommes une communauté bienveillante.

**2. Pas de triche**
L'utilisation de hacks, cheats, exploits ou mods donnant un avantage déloyal est strictement interdite.

**3. Pas de grief**
Détruire ou modifier les constructions d'autres joueurs sans leur accord est interdit.

**4. Pas de spam**
Ni dans le chat Minecraft, ni sur Discord.

**5. PvP fair-play**
Le PvP n'est autorisé qu'avec l'accord des deux parties, sauf dans les zones PvP dédiées.

**6. Respect des admins**
Les décisions de l'équipe de modération sont finales. Tout litige se règle en message privé.

### Sanctions

| Infraction | Sanction |
|-----------|----------|
| 1er avertissement | Warn |
| 2ème avertissement | Kick |
| 3ème avertissement | Ban temporaire |
| Infraction grave | Ban définitif |

> En jouant sur le Dragon SMP, tu acceptes ces règles.`
  },
  {
    id: 'guide-debutant',
    title: 'Guide débutant',
    icon: '🎓',
    slug: 'guide-debutant',
    category: 'guides',
    description: 'Tout ce qu\'il faut savoir pour bien débuter',
    content: `## Guide du débutant

### Tes premiers pas sur le serveur

Quand tu arrives pour la première fois sur le Dragon SMP, tu apparais au **spawn**. Prends le temps de lire les panneaux d'information.

### Trouver un terrain

Éloigne-toi du spawn (minimum 500 blocs) pour construire ta base. Utilise la commande \`/rtp\` pour te téléporter aléatoirement dans le monde.

### Protéger ta base

Utilise le système de **claim** pour protéger ta construction :
- \`/claim\` : Protège la chunk sur laquelle tu te trouves
- \`/unclaim\` : Retire la protection
- \`/trust [joueur]\` : Donne accès à un ami

### Commandes utiles

\`/spawn\` — Retour au spawn
\`/home\` — Retour chez toi
\`/sethome\` — Définit ton home
\`/tpa [joueur]\` — Demande de téléportation
\`/msg [joueur] [message]\` — Message privé

### L'économie

Gagne de l'argent en :
- Vendant des ressources au spawn shop
- Créant ton propre shop
- Participant aux events

> **Astuce :** Rejoins une ville existante pour débuter plus facilement !`
  },
  {
    id: 'grades',
    title: 'Grades & Rôles',
    icon: '👑',
    slug: 'grades',
    category: 'general',
    description: 'Les différents grades sur le serveur',
    content: `## Grades & Rôles

### Grades joueurs

**🌱 Nouveau**
Grade attribué automatiquement à l'arrivée sur le serveur.

**⚔️ Aventurier**
Obtenu après 5h de jeu. Accès aux commandes de base supplémentaires.

**🏰 Bâtisseur**
Récompense les joueurs avec de belles constructions. Attribué par les admins.

**💎 Vétéran**
Joueur fidèle avec plus de 50h de jeu. Avantages exclusifs.

**🐉 Légendaire**
Grade suprême, attribué aux joueurs les plus impliqués dans la communauté.

### Grades Staff

**🔨 Helper**
Aide les nouveaux joueurs et répond aux questions.

**⚡ Modérateur**
Fait respecter le règlement et gère les litiges.

**👑 Administrateur**
Gère le serveur, les events et le développement.

### Comment obtenir un grade ?

La plupart des grades s'obtiennent automatiquement avec le temps de jeu. Les grades spéciaux comme Bâtisseur et Légendaire sont attribués manuellement par l'équipe.`
  },
  {
    id: 'economie',
    title: 'Économie',
    icon: '💰',
    slug: 'economie',
    category: 'guides',
    description: 'Le système économique du serveur',
    content: `## Système économique

### La monnaie : les Écailles 🐉

La monnaie officielle du Dragon SMP s'appelle les **Écailles**. Tu en gagnes en jouant, vendant des ressources et participant aux events.

### Gagner des Écailles

**Vente au spawn shop**
Des PNJ au spawn achètent tes ressources. C'est la méthode la plus simple.

**Shops joueurs**
Crée ton propre shop pour vendre aux autres joueurs. Utile pour des ressources rares.

**Events**
Participe aux events et tournois pour des récompenses en Écailles.

**Vote**
Vote pour le serveur sur Disboard et d'autres sites pour obtenir des bonus quotidiens.

### Commandes économie

\`/money\` — Voir ton solde
\`/pay [joueur] [montant]\` — Payer un joueur
\`/shop\` — Ouvrir le shop spawn
\`/baltop\` — Classement des plus riches

### Créer un shop

1. Place un coffre
2. Tiens l'item à vendre
3. Fais \`/shop create [prix]\` en regardant le coffre
4. Remplis le coffre avec l'item`
  }
];

// ── Catégories de navigation ─────────────────────────────────────────────────
const CATEGORIES = {
  general: { label: 'Général', icon: '📖' },
  guides:  { label: 'Guides',  icon: '📚' },
  custom:  { label: 'Autre',   icon: '📄' }
};

// ── State ────────────────────────────────────────────────────────────────────
let pages = [];
let currentPage = null;

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadPages();
  renderSidebar();
  setupSearch();
  setupMobileMenu();

  // Page initiale depuis l'URL ou accueil
  const hash = window.location.hash.replace('#', '') || 'accueil';
  navigateTo(hash);
});

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '') || 'accueil';
  navigateTo(hash);
});

// ── Chargement des pages depuis localStorage ─────────────────────────────────
function loadPages() {
  const stored = localStorage.getItem('dsmp_pages');
  if (stored) {
    try { pages = JSON.parse(stored); }
    catch { pages = [...DEFAULT_PAGES]; savePages(); }
  } else {
    pages = [...DEFAULT_PAGES];
    savePages();
  }
}

function savePages() {
  localStorage.setItem('dsmp_pages', JSON.stringify(pages));
}

// ── Rendu de la sidebar ───────────────────────────────────────────────────────
function renderSidebar() {
  const sidebar = document.getElementById('sidebar-nav');
  if (!sidebar) return;

  // Grouper par catégorie
  const grouped = {};
  pages.forEach(p => {
    const cat = p.category || 'custom';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });

  let html = '';
  Object.keys(grouped).forEach(cat => {
    const catInfo = CATEGORIES[cat] || { label: cat, icon: '📄' };
    html += `<div class="sidebar-section">
      <div class="sidebar-heading">${catInfo.icon} ${catInfo.label}</div>`;
    grouped[cat].forEach(p => {
      html += `<div class="sidebar-item${currentPage === p.id ? ' active' : ''}"
        onclick="navigateTo('${p.id}')" data-id="${p.id}">
        <span class="item-icon">${p.icon || '📄'}</span>
        ${escHtml(p.title)}
      </div>`;
    });
    html += `</div><div class="sidebar-divider"></div>`;
  });

  sidebar.innerHTML = html;
}

// ── Navigation ────────────────────────────────────────────────────────────────
function navigateTo(id) {
  const page = pages.find(p => p.id === id || p.slug === id);
  if (!page) {
    navigateTo('accueil');
    return;
  }

  currentPage = page.id;
  window.location.hash = page.id;

  // Met à jour la sidebar
  document.querySelectorAll('.sidebar-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === page.id);
  });

  // Affiche le contenu
  renderPage(page);

  // Ferme le menu mobile
  closeMobileMenu();
}

function renderPage(page) {
  const container = document.getElementById('page-container');
  if (!container) return;

  const html = `
    <div class="page-content active">
      <div class="page-header">
        <h1>${page.icon || ''} ${escHtml(page.title)}</h1>
        ${page.description ? `<p class="page-desc">${escHtml(page.description)}</p>` : ''}
      </div>
      <div class="wiki-content">
        ${parseMarkdown(page.content || '')}
      </div>
    </div>`;
  container.innerHTML = html;
}

// ── Markdown parser (simple) ─────────────────────────────────────────────────
function parseMarkdown(md) {
  if (!md) return '';
  let html = escHtml(md);

  // Blocs de code
  html = html.replace(/```[\s\S]*?```/g, m => {
    const code = m.replace(/^```[^\n]*\n?/, '').replace(/```$/, '');
    return `<pre style="background:var(--dark4);border:1px solid var(--border);border-radius:6px;padding:1rem;overflow-x:auto;margin:1rem 0"><code style="color:var(--ember);font-family:'Courier New',monospace;font-size:.87rem">${code}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Blockquote
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // HR
  html = html.replace(/^---$/gm, '<hr>');

  // Tableau simple
  html = html.replace(/(\|.+\|\n)(\|[-| :]+\|\n)((?:\|.+\|\n?)*)/g, (m, head, sep, body) => {
    const headers = head.split('|').filter(c => c.trim()).map(c => `<th style="padding:.5rem .8rem;border:1px solid var(--border);color:var(--ember)">${c.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<td style="padding:.5rem .8rem;border:1px solid var(--border)">${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<div style="overflow-x:auto;margin:1rem 0"><table style="width:100%;border-collapse:collapse;font-size:.9rem"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  });

  // Titres
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 style="font-family:\'Cinzel\',serif;font-size:1.6rem;color:var(--gold);margin-bottom:1rem">$1</h1>');

  // Bold / Italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Listes non ordonnées
  html = html.replace(/((?:^- .+\n?)+)/gm, m => {
    const items = m.trim().split('\n').map(l => `<li>${l.replace(/^- /, '')}</li>`).join('');
    return `<ul>${items}</ul>`;
  });

  // Listes ordonnées
  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, m => {
    const items = m.trim().split('\n').map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('');
    return `<ol>${items}</ol>`;
  });

  // Paragraphes
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p>\s*(<(?:h[1-6]|ul|ol|pre|blockquote|hr|div|table)[^>]*>)/g, '$1');
  html = html.replace(/(<\/(?:h[1-6]|ul|ol|pre|blockquote|hr|div|table)>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

// ── Recherche ─────────────────────────────────────────────────────────────────
function setupSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.classList.remove('visible'); return; }

    const matches = pages.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.content || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    ).slice(0, 6);

    if (!matches.length) {
      results.innerHTML = `<div class="search-no-result">Aucun résultat pour "${escHtml(q)}"</div>`;
    } else {
      results.innerHTML = matches.map(p => {
        const preview = (p.content || '').replace(/[#*`>]/g, '').slice(0, 80) + '...';
        return `<div class="search-result-item" onclick="navigateTo('${p.id}');closeSearch()">
          <div class="search-result-title">${p.icon || ''} ${escHtml(p.title)}</div>
          <div class="search-result-preview">${escHtml(preview)}</div>
        </div>`;
      }).join('');
    }
    results.classList.add('visible');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.header-search')) closeSearch();
  });
}

function closeSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (input) input.value = '';
  if (results) results.classList.remove('visible');
}

// ── Menu mobile ───────────────────────────────────────────────────────────────
function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  if (toggle) toggle.addEventListener('click', toggleMobileMenu);
  if (overlay) overlay.addEventListener('click', closeMobileMenu);
}

function toggleMobileMenu() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('sidebar-overlay')?.classList.toggle('show');
}

function closeMobileMenu() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('show');
}

// ── Utils ─────────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `show ${type}`;
  setTimeout(() => t.className = '', 3000);
}

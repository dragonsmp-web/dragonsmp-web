/* ================================================================
   DRAGON SMP WIKI V2 — db.js
   Couche de persistance via JSONbin.io (gratuit)
   Fallback sur localStorage si hors ligne
   ================================================================ */

const DB = (() => {

  // ── Config JSONbin ───────────────────────────────────────────────────────
  // 1. Va sur https://jsonbin.io et crée un compte gratuit
  // 2. Crée un "bin" avec le JSON initial ci-dessous
  // 3. Copie l'ID du bin et ta clé API ici
  const BIN_ID  = localStorage.getItem('dsmp_bin_id')  || '';
  const API_KEY = localStorage.getItem('dsmp_api_key') || '';
  const BASE    = 'https://api.jsonbin.io/v3/b';

  let _online = BIN_ID && API_KEY;

  // ── Données par défaut ───────────────────────────────────────────────────
  const DEFAULTS = {
    categories: [
      { id: 'general', name: 'Général',  icon: '📖', order: 0 },
      { id: 'guides',  name: 'Guides',   icon: '📚', order: 1 },
      { id: 'serveur', name: 'Serveur',  icon: '⚔️',  order: 2 }
    ],
    pages: [
      {
        id: 'accueil', categoryId: 'general', title: 'Accueil', icon: '🏠',
        description: 'Bienvenue sur le Wiki officiel du Dragon SMP',
        content: `## Bienvenue sur le Dragon SMP\n\nLe **Dragon SMP** est un serveur Minecraft Survie communautaire francophone.\n\n### IP du serveur\n\n\`connect.axohosts.fr:25883\`\n\n### Comment rejoindre ?\n\n1. Lance Minecraft Java Edition\n2. Va dans **Multijoueur**\n3. Ajoute l'IP du serveur\n4. Connecte-toi !\n\n> Rejoins notre Discord pour ne rien rater des events !`,
        order: 0
      },
      {
        id: 'reglement', categoryId: 'general', title: 'Règlement', icon: '📋',
        description: 'Les règles à respecter sur le serveur',
        content: `## Règlement du Dragon SMP\n\n### 1. Respect mutuel\nAucune insulte ni harcèlement.\n\n### 2. Pas de triche\nHacks et exploits sont interdits.\n\n### 3. Pas de grief\nNe détruis pas les constructions des autres.\n\n### 4. PvP fair-play\nAvec accord mutuel uniquement hors zones PvP.\n\n### 5. Respect du staff\nLes décisions du staff sont finales.`,
        order: 1
      },
      {
        id: 'commandes', categoryId: 'guides', title: 'Commandes', icon: '⌨️',
        description: 'Toutes les commandes disponibles',
        content: `## Commandes utiles\n\n### Téléportation\n\n\`/spawn\` — Retour au spawn\n\`/home\` — Retour chez toi\n\`/sethome\` — Définit ton home\n\`/tpa [joueur]\` — Demande de TP\n\n### Économie\n\n\`/money\` — Voir ton solde\n\`/pay [joueur] [montant]\` — Payer\n\n### Claim\n\n\`/claim\` — Protéger une chunk\n\`/trust [joueur]\` — Donner accès`,
        order: 0
      }
    ],
    settings: {
      maintenance: false,
      maintenanceMsg: 'Le serveur est en maintenance. Revenez bientôt !',
      mcHost: '163.5.141.232',
      mcPort: 25816,
      mcDisplayIp: 'connect.axohosts.fr:25883'
    }
  };

  // ── Lire depuis JSONbin ──────────────────────────────────────────────────
  async function fetchRemote() {
    if (!_online) return null;
    try {
      const r = await fetch(`${BASE}/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
      });
      if (!r.ok) throw new Error('fetch failed');
      const j = await r.json();
      return j.record;
    } catch { return null; }
  }

  // ── Écrire vers JSONbin ──────────────────────────────────────────────────
  async function pushRemote(data) {
    if (!_online) return false;
    try {
      const r = await fetch(`${BASE}/${BIN_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
        body: JSON.stringify(data)
      });
      return r.ok;
    } catch { return false; }
  }

  // ── Cache local ──────────────────────────────────────────────────────────
  function readLocal() {
    try {
      const s = localStorage.getItem('dsmp_data');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  }

  function writeLocal(data) {
    try { localStorage.setItem('dsmp_data', JSON.stringify(data)); } catch {}
  }

  // ── API publique ─────────────────────────────────────────────────────────
  let _cache = null;

  async function load() {
    // 1. Essai remote
    const remote = await fetchRemote();
    if (remote) { _cache = remote; writeLocal(remote); return _cache; }
    // 2. Fallback local
    const local = readLocal();
    if (local) { _cache = local; return _cache; }
    // 3. Défaut
    _cache = JSON.parse(JSON.stringify(DEFAULTS));
    writeLocal(_cache);
    return _cache;
  }

  async function save() {
    if (!_cache) return;
    writeLocal(_cache);
    if (_online) await pushRemote(_cache);
  }

  function get() { return _cache || JSON.parse(JSON.stringify(DEFAULTS)); }

  function configureRemote(binId, apiKey) {
    localStorage.setItem('dsmp_bin_id', binId);
    localStorage.setItem('dsmp_api_key', apiKey);
    _online = true;
  }

  function isConfigured() { return !!BIN_ID && !!API_KEY; }

  return { load, save, get, configureRemote, isConfigured, DEFAULTS };
})();

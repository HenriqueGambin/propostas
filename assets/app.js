/* Propostas · DelloPlast */
'use strict';
(() => {

/* ================================================================
   Constantes
   ================================================================ */
const CFG = window.DP_CONFIG || {};
const DEMO = !(CFG.supabaseUrl && CFG.supabaseAnonKey) || new URLSearchParams(location.search).has('demo');
const TABS = ['propostas', 'clientes', 'config'];

// dados fixos da Dello que aparecem no topo do PDF
const EMPRESA = {
  razao: 'Delo Indústria e Comércio Ltda',
  endereco: 'Estrada Remígio Olivotti, 1145 - Barreiro',
  cidade: 'Extrema - MG - CEP 37647-004',
  fone: '35 3435-8900',
  whatsapp: '35 99764-2629',
  cnpj: '01.856.241/0001-08',
  ie: '251.674.233.0088',
  site: 'www.delloplast.com.br',
  email: 'vendastecnicas@dello.com.br',
};

const PADROES = {
  emissor: { nome: 'GUSTAVO GAMBIN DICELIO', email: 'gustavo.dicelio@dello.com.br' },
  numero_inicial: 560,
  condicoes: {
    finalidade: 'INDUSTRIALIZAÇÃO', icms: 12, icms_modo: 'Incluso', ipi: 9.75, ipi_modo: 'Adicional', pis: 1.65, cofins: 7.6,
    pagamento: '21/28/35/42/49/56/63', prazo: '20 dias', frete: 'CIF', validade: '10 DIAS A PARTIR DA DATA DE ENVIO',
  },
  item: { ncm: '3921.19.00', unidade: 'PC', cor: 'AZUL', esp: null, gram: null, preco_kg: 26 },
  observacao: '',
};

const AVISOS = [
  'Todos os pedidos são feitos sob encomenda, não aceitamos cancelamentos e alterações.',
  'Sujeito a análise de crédito.',
];
const TOLERANCIAS = [['+/- 3 mm', 'Largura'], ['+/- 20 mm', 'Comprimento'], ['+/- 0,2 mm', 'Espessura'], ['5% a 10%', 'Gramatura'], ['+/- 3 mm', 'Diagonal'], ['42 dynas', 'Tratamento corona']];
const ESPESSURAS = [2, 2.5, 3, 3.5, 4, 4.5, 5];
const TAB_GRAM = {
  300: [2], 350: [2], 400: [2, 2.5], 450: [2.5], 500: [2.5, 3], 600: [3], 700: [3, 3.5], 800: [3.5, 4],
  900: [4], 1000: [4, 4.5], 1100: [4, 4.5], 1200: [4, 4.5, 5], 1300: [4.5, 5], 1500: [4.5, 5], 2000: [5],
};
const PALETIZACAO = ['Com cantoneira', 'Carga batida', 'Estrechado'];
const ORIENTACOES = [
  { id: 'chapa-1', nome: 'Opção 1 · sentido da onda', img: 'assets/img/chapa-1.webp' },
  { id: 'chapa-2', nome: 'Opção 2 · canais no comprimento', img: 'assets/img/chapa-2.webp' },
  { id: 'chapa-3', nome: 'Opção 3 · canais na largura', img: 'assets/img/chapa-3.webp' },
];
const STATUS = {
  rascunho: { nome: 'Rascunho', cor: 'gray' },
  enviada: { nome: 'Enviada', cor: 'blue' },
  aprovada: { nome: 'Aprovada', cor: 'green' },
  perdida: { nome: 'Perdida', cor: 'red' },
};
const OPC = {
  unidade: ['PC', 'UN', 'CX', 'KG', 'M²'],
  finalidade: ['INDUSTRIALIZAÇÃO', 'REVENDA', 'USO E CONSUMO'],
  frete: ['CIF', 'FOB'],
  validade: ['5 DIAS A PARTIR DA DATA DE ENVIO', '7 DIAS A PARTIR DA DATA DE ENVIO', '10 DIAS A PARTIR DA DATA DE ENVIO', '15 DIAS A PARTIR DA DATA DE ENVIO', '30 DIAS A PARTIR DA DATA DE ENVIO'],
  modo: ['Incluso', 'Adicional'],
};
const CORES = ['AZUL', 'BRANCO', 'PRETO', 'CINZA', 'NATURAL', 'TRANSLÚCIDO', 'VERDE', 'AMARELO', 'VERMELHO', 'LARANJA'];
const PAGAMENTOS = ['À VISTA', '28 DDL', '28/35/42', '21/28/35/42/49/56/63', '30/60/90'];
const MEDIDAS_PALETE = ['1,00 x 1,00 m', '1,10 x 1,10 m', '1,20 x 1,00 m', '1,20 x 0,80 m'];
const CAMPOS_CLI = ['nome', 'cnpj', 'ie', 'contato', 'telefone', 'email', 'endereco', 'cep'];

const ICONS = {
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  pdf: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 12v6"/><path d="m9 15 3 3 3-3"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
  sliders: '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M2 14h4"/><path d="M10 8h4"/><path d="M18 16h4"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  back: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>',
  pallet: '<rect x="3" y="4" width="18" height="10" rx="1"/><path d="M2 17h20M4 17v3M12 17v3M20 17v3"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  note: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  pen: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
  eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2"/><path d="M6.6 6.6A17.4 17.4 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  printer: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
};
const ic = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ================================================================
   Utilidades
   ================================================================ */
const root = document.getElementById('root');
const S = { api: null, user: null, db: { propostas: [], clientes: [], config: [] }, ed: null, edPendente: null, filtro: { q: '', status: '' }, filtroCli: '' };
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16);
}));
const clone = o => JSON.parse(JSON.stringify(o));
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const digitos = s => String(s ?? '').replace(/\D/g, '');
const agoraISO = () => new Date().toISOString();
const hojeISO = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const fData = v => {
  if (!v) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  const d = new Date(v); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};
const fQuando = v => { if (!v) return ''; const d = new Date(v); return `${fData(v)} às ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const plural = (n, s, p) => `${n} ${n === 1 ? s : (p || s + 's')}`;
const iniciais = s => String(s || '?').split(/[\s@.]+/).filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase();
const r2 = v => Math.round((v + Number.EPSILON) * 100) / 100;
const n0 = v => (Number.isFinite(+v) && v !== null && v !== '' ? +v : 0);

/* números no padrão brasileiro */
const nf = (v, min = 0, max = min) => (Number.isFinite(v) ? v.toLocaleString('pt-BR', { minimumFractionDigits: min, maximumFractionDigits: max }) : '');
const fMoeda = v => 'R$ ' + nf(n0(v), 2, 2);
const fPct = v => nf(n0(v), 0, 2) + '%';
function parseNum(s) {
  if (typeof s === 'number') return Number.isFinite(s) ? s : null;
  let t = String(s ?? '').trim().replace(/\s|R\$|%/g, '');
  if (!t) return null;
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, '');
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
const fmtSpec = (v, spec) => { if (v === null || v === undefined || v === '') return ''; if (spec === 'i') return String(Math.round(+v)); const [a, b] = String(spec).split(',').map(Number); return nf(+v, a, b ?? a); };

function getP(o, p) { return p.split('.').reduce((a, k) => (a == null ? a : a[k]), o); }
function setP(o, p, v) { const ks = p.split('.'); let a = o; for (let i = 0; i < ks.length - 1; i++) { if (a[ks[i]] == null) a[ks[i]] = {}; a = a[ks[i]]; } a[ks[ks.length - 1]] = v; }

function msgErro(e) {
  const m = String((e && (e.message || e.error_description)) || e || '');
  if (e && e.code === '23505') return 'Já existe uma proposta com esse número e versão.';
  if (/Invalid login credentials/i.test(m)) return 'E-mail ou senha incorretos.';
  if (/Email not confirmed/i.test(m)) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
  if (/Signups not allowed|signup.*disabled/i.test(m)) return 'O cadastro de novas contas está desativado.';
  if (/rate limit|too many/i.test(m)) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
  if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return 'Sem conexão com a internet. Tente de novo.';
  if (/JWT|expired/i.test(m)) return 'Sua sessão expirou. Entre de novo.';
  return m || 'Algo deu errado. Tente de novo.';
}

/* ---------- toast / modal / confirmação ---------- */
function toast(msg, tipo) {
  let box = $('.toasts');
  if (!box) { box = document.createElement('div'); box.className = 'toasts'; document.body.append(box); }
  const t = document.createElement('div');
  t.className = 'toast' + (tipo === 'erro' ? ' erro' : '');
  t.innerHTML = ic(tipo === 'erro' ? 'alert' : 'check') + `<span>${esc(msg)}</span>`;
  box.append(t);
  setTimeout(() => t.remove(), tipo === 'erro' ? 5000 : 2600);
}

function modal({ titulo, corpo, rodape = '', tamanho = '', aoAbrir, aoFechar }) {
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `<div class="modal ${tamanho}" role="dialog" aria-modal="true" aria-label="${esc(titulo)}">
    <div class="modal-h"><h3>${esc(titulo)}</h3><button type="button" class="icon-btn" data-x aria-label="Fechar">${ic('x')}</button></div>
    <div class="modal-b">${corpo}</div>${rodape ? `<div class="modal-f">${rodape}</div>` : ''}</div>`;
  const onKey = e => { if (e.key === 'Escape' && $$('.modal-bg').pop() === bg) fechar(); };
  function fechar() { bg.remove(); document.removeEventListener('keydown', onKey); aoFechar && aoFechar(); }
  bg.addEventListener('mousedown', e => { if (e.target === bg) bg.dataset.fora = '1'; else delete bg.dataset.fora; });
  bg.addEventListener('click', e => {
    if (e.target.closest('[data-x],[data-cancelar]') || (e.target === bg && bg.dataset.fora)) fechar();
  });
  document.addEventListener('keydown', onKey);
  document.body.append(bg);
  const m = { el: bg, fechar, $: s => $(s, bg), $$: s => $$(s, bg) };
  if (aoAbrir) aoAbrir(m);
  if (!matchMedia('(max-width: 640px)').matches) {
    const f = $('[autofocus]', bg) || $('.modal-b input:not([type=hidden]):not([type=radio]):not([type=checkbox]), .modal-b textarea', bg);
    if (f) setTimeout(() => f.focus(), 40);
  }
  return m;
}

function confirmar(msg, { titulo = 'Tem certeza?', ok = 'Excluir' } = {}) {
  return new Promise(res => {
    let r = false;
    modal({
      titulo, tamanho: 'sm',
      corpo: `<p style="margin:0;color:var(--ink-2)">${msg}</p>`,
      rodape: `<button type="button" class="btn" data-cancelar>Cancelar</button><button type="button" class="btn primary" data-ok>${esc(ok)}</button>`,
      aoAbrir: m => { m.$('[data-ok]').onclick = () => { r = true; m.fechar(); }; setTimeout(() => m.$('[data-ok]').focus(), 40); },
      aoFechar: () => res(r),
    });
  });
}

function ocupado(btn, sim, texto = 'Salvando…') {
  if (!btn) return;
  if (sim) { btn.dataset.txt = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<span class="spinner" style="width:16px;height:16px;border-width:2px"></span>${esc(texto)}`; }
  else { btn.disabled = false; if (btn.dataset.txt) btn.innerHTML = btn.dataset.txt; }
}

function temaBotao() {
  return `<button type="button" class="tema" data-tema aria-label="Alternar tema claro/escuro" title="Tema claro / escuro">${ic('moon', 'i lua')}${ic('sun', 'i sol')}</button>`;
}
document.addEventListener('click', e => {
  if (!e.target.closest('[data-tema]')) return;
  const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('dp.tema', t); } catch (er) { /* sem armazenamento */ }
});

/* ================================================================
   Banco de dados — Supabase ou demonstração (no navegador)
   ================================================================ */
function SupaAPI() {
  const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  const ok = ({ data, error }) => { if (error) throw error; return data; };
  const base = () => location.origin + location.pathname;
  // as tabelas ficam no projeto "dello-eventos", com prefixo próprio
  const T = { propostas: 'propostas', clientes: 'propostas_clientes', config: 'propostas_config' };
  const tb = t => T[t] || t;
  return {
    demo: false,
    async liberado() { return !!ok(await sb.rpc('propostas_liberado')); },
    async sessao() { return ok(await sb.auth.getSession()).session; },
    aoMudarAuth(cb) { sb.auth.onAuthStateChange((ev, s) => setTimeout(() => cb(ev, s), 0)); },
    async entrar(email, senha) { ok(await sb.auth.signInWithPassword({ email, password: senha })); },
    async recuperar(email) { ok(await sb.auth.resetPasswordForEmail(email, { redirectTo: base() })); },
    async trocarSenha(senha) { ok(await sb.auth.updateUser({ password: senha })); },
    async sair() { await sb.auth.signOut(); },
    async listar(tab) {
      let out = [];
      for (let de = 0; ; de += 1000) {
        const d = ok(await sb.from(tb(tab)).select('*').order('criado_em', { ascending: true }).range(de, de + 999));
        out = out.concat(d);
        if (d.length < 1000) break;
      }
      return out;
    },
    async inserir(tab, row) { return ok(await sb.from(tb(tab)).insert(row).select().single()); },
    async atualizar(tab, id, patch) { return ok(await sb.from(tb(tab)).update(patch).eq('id', id).select().single()); },
    async excluir(tab, id) { ok(await sb.from(tb(tab)).delete().eq('id', id)); },
    async salvarConfig(id, valor) { return ok(await sb.from(tb('config')).upsert({ id, valor }).select().single()); },
  };
}

function DemoAPI() {
  const K = 'dp.demo.v1';
  let db = null;
  try { db = JSON.parse(localStorage.getItem(K)); } catch (e) { db = null; }
  if (!db) { db = demoSeed(); gravar(); }
  function gravar() { try { localStorage.setItem(K, JSON.stringify(db)); } catch (e) { /* cheio ou bloqueado */ } }
  const chave = r => `${r.ano}|${r.numero}|${r.versao}`;
  return {
    demo: true,
    async sessao() { return { user: { id: 'demo', email: 'gustavo.dicelio@dello.com.br', user_metadata: { nome: 'Gustavo' } } }; },
    aoMudarAuth() {},
    async liberado() { return true; },
    async entrar() {}, async recuperar() {}, async trocarSenha() {},
    async sair() { try { localStorage.removeItem(K); } catch (e) { /* ok */ } location.reload(); },
    async listar(tab) { return clone(db[tab] || []); },
    async inserir(tab, row) {
      if (tab === 'propostas' && db.propostas.some(p => chave(p) === chave(row))) throw { code: '23505', message: 'duplicate' };
      const r = { id: uid(), criado_em: agoraISO(), atualizado_em: agoraISO(), ...row };
      (db[tab] || (db[tab] = [])).push(r); gravar(); return clone(r);
    },
    async atualizar(tab, id, patch) {
      const r = (db[tab] || []).find(x => x.id === id);
      if (!r) throw new Error('Registro não encontrado');
      if (tab === 'propostas' && db.propostas.some(p => p.id !== id && chave(p) === chave({ ...r, ...patch }))) throw { code: '23505', message: 'duplicate' };
      Object.assign(r, patch, { atualizado_em: agoraISO() }); gravar(); return clone(r);
    },
    async excluir(tab, id) { db[tab] = (db[tab] || []).filter(x => x.id !== id); gravar(); },
    async salvarConfig(id, valor) {
      let r = db.config.find(x => x.id === id);
      if (r) Object.assign(r, { valor, atualizado_em: agoraISO() });
      else { r = { id, valor, criado_em: agoraISO(), atualizado_em: agoraISO() }; db.config.push(r); }
      gravar(); return clone(r);
    },
  };
}

function demoSeed() {
  // cliente fictício (o site é público; nada de dados reais aqui)
  const cli = { id: uid(), nome: 'EMBALAGENS EXEMPLO LTDA', cnpj: '00.000.000/0001-00', ie: '000.000.000.000', contato: 'COMPRAS', telefone: '(11) 90000-0000', email: 'compras@exemplo.com.br', endereco: 'SÃO PAULO - SP', cep: '00000-000', criado_em: agoraISO(), atualizado_em: agoraISO() };
  const it = (identificacao, descricao, quantidade, larg, comp) => ({ id: uid(), identificacao, descricao, ncm: '3921.19.00', unidade: 'PC', cor: 'AZUL', quantidade, larg, comp, esp: 3, gram: 500, preco_kg: 26, preco_manual: null, ipi: 9.75, icms: 12 });
  const dados = novaBase();
  Object.assign(dados, {
    data: hojeISO(),
    cliente: Object.fromEntries(CAMPOS_CLI.map(k => [k, cli[k]])),
    itens: [
      it('FT00001 FACA001 G001', 'TAMPA CX\n355x265x105', 19800, 815, 725),
      it('FT00001 FACA002 G002', 'FUNDO CX\n346x240x91mm', 19800, 540, 655),
      it('FT00002 FACA003 G003', 'TAMPA CX\n459x325x161mm', 2750, 1150, 1010),
      it('FT00002 FACA004 G004', 'FUNDO CX\n445x293x149mm', 2750, 945, 755),
    ],
    orientacao: 'chapa-2',
    paletizacao: { opcoes: ['Com cantoneira', 'Estrechado'], outros: '' },
    paletes: { usar: true, itens: [{ id: uid(), medida: '1,20 x 1,00 m', quantidade: 12, valor: 85, retorna: true }] },
  });
  const p = { id: uid(), numero: 559, ano: new Date().getFullYear(), versao: 0, status: 'enviada', cliente_nome: cli.nome, total: totais(dados).total, dados, criado_em: agoraISO(), atualizado_em: agoraISO() };
  return { propostas: [p], clientes: [cli], config: [] };
}

/* ================================================================
   Regras: cálculo da proposta
   ================================================================ */
function padroes() {
  const c = (S.db.config.find(x => x.id === 'padroes') || {}).valor || {};
  return {
    emissor: { ...PADROES.emissor, ...(c.emissor || {}) },
    numero_inicial: c.numero_inicial || PADROES.numero_inicial,
    condicoes: { ...PADROES.condicoes, ...(c.condicoes || {}) },
    item: { ...PADROES.item, ...(c.item || {}) },
    observacao: c.observacao ?? PADROES.observacao,
  };
}

function novoItem(base) {
  const P = padroes(), cond = (S.ed && S.ed.d.condicoes) || P.condicoes;
  return {
    id: uid(), identificacao: '', descricao: '', ncm: P.item.ncm, unidade: P.item.unidade, cor: P.item.cor,
    quantidade: null, larg: null, comp: null, esp: P.item.esp, gram: P.item.gram, preco_kg: P.item.preco_kg, preco_manual: null,
    ipi: cond.ipi, icms: cond.icms, ...(base || {}),
  };
}

function novaBase() {
  const P = padroes();
  return {
    data: hojeISO(),
    cliente: Object.fromEntries(CAMPOS_CLI.map(k => [k, ''])),
    itens: [],
    icms_st: 0,
    condicoes: clone(P.condicoes),
    paletes: { usar: false, itens: [] },
    paletizacao: { opcoes: [], outros: '' },
    orientacao: '',
    observacao: P.observacao,
    emissor: clone(P.emissor),
  };
}

// completa campos que faltam (propostas antigas ou incompletas)
function normalizar(d) {
  const b = novaBase();
  const o = { ...b, ...d };
  o.cliente = { ...b.cliente, ...(d.cliente || {}) };
  o.condicoes = { ...b.condicoes, ...(d.condicoes || {}) };
  o.paletes = { ...b.paletes, ...(d.paletes || {}) };
  o.paletes.itens = (o.paletes.itens || []).map(x => ({ id: uid(), medida: '', quantidade: null, valor: null, retorna: false, ...x }));
  o.paletizacao = { ...b.paletizacao, ...(d.paletizacao || {}) };
  o.emissor = { ...b.emissor, ...(d.emissor || {}) };
  o.itens = (d.itens || []).map(x => ({ id: uid(), ...x }));
  return o;
}

function calcItem(it) {
  const peso = n0(it.larg) * n0(it.comp) * n0(it.gram) / 1e9;   // kg por chapa (mm × mm × g/m²)
  const precoCalc = peso * n0(it.preco_kg);
  const preco = r2(precoCalc);
  const subtotal = r2(preco * n0(it.quantidade));
  return { peso, precoCalc, preco, subtotal, pesoTotal: peso * n0(it.quantidade) };
}

function totais(d) {
  let produtos = 0, icms = 0, ipi = 0, peso = 0;
  (d.itens || []).forEach(it => {
    const c = calcItem(it);
    produtos += c.subtotal; icms += c.subtotal * n0(it.icms) / 100; ipi += c.subtotal * n0(it.ipi) / 100; peso += c.pesoTotal;
  });
  produtos = r2(produtos); icms = r2(icms); ipi = r2(ipi);
  const st = r2(n0(d.icms_st));
  let palCobrado = 0, palRetorna = 0, palQtd = 0;
  if (d.paletes && d.paletes.usar) (d.paletes.itens || []).forEach(p => {
    const v = r2(n0(p.quantidade) * n0(p.valor)); palQtd += n0(p.quantidade);
    if (p.retorna) palRetorna += v; else palCobrado += v;
  });
  const cond = d.condicoes || {};
  const total = r2(produtos + (cond.icms_modo === 'Adicional' ? icms : 0) + (cond.ipi_modo === 'Incluso' ? 0 : ipi) + st + palCobrado);
  return { produtos, icms, ipi, st, palCobrado: r2(palCobrado), palRetorna: r2(palRetorna), palQtd, total, peso };
}

const gramOk = (gram, esp) => { const g = TAB_GRAM[n0(gram)]; return !g || !n0(esp) || g.includes(n0(esp)); };
const codigo = p => `${p.numero ?? '?'}_${String(p.ano ?? '').slice(-2)}_V${p.versao ?? 0}`;
const tituloItem = it => (it.identificacao || String(it.descricao || '').split('\n')[0] || 'Novo item');
const pdD = p => normalizar({ ...p.dados, numero: p.numero, ano: p.ano, versao: p.versao, status: p.status });
function proximoNumero(ano) {
  const ns = S.db.propostas.filter(p => p.ano === ano).map(p => p.numero);
  return Math.max(ns.length ? Math.max(...ns) + 1 : 0, padroes().numero_inicial);
}
const proximaVersao = (ano, numero) => Math.max(-1, ...S.db.propostas.filter(p => p.ano === ano && p.numero === numero).map(p => p.versao)) + 1;
const ehUltima = p => !S.db.propostas.some(o => o.ano === p.ano && o.numero === p.numero && o.versao > p.versao);

/* ================================================================
   Login
   ================================================================ */
function renderAuth(modo = 'entrar', aviso = '') {
  const titulos = { entrar: ['Entrar', 'Use seu e-mail e senha.'], recuperar: ['Recuperar senha', 'Enviaremos um link para criar uma nova senha.'] };
  const [h, sub] = titulos[modo];
  root.innerHTML = `<div class="auth">
    <section class="auth-art">
      <div style="position:relative;z-index:1"><img class="logo" src="assets/img/logo-branco.png" alt="DelloPlast"></div>
      <div style="position:relative;z-index:1">
        <h1>Propostas comerciais,<br>organizadas.</h1>
        <p>Preencha os itens, o sistema calcula o preço pelo peso da chapa e gera o PDF pronto para mandar ao cliente.</p>
        <ul>
          <li><span>${ic('check')}</span>Preço calculado por largura × comprimento × gramatura</li>
          <li><span>${ic('check')}</span>PDF com a cara da Dello em um clique</li>
          <li><span>${ic('check')}</span>Histórico de propostas, versões e clientes</li>
        </ul>
      </div>
      <div class="rodape">© ${new Date().getFullYear()} DelloPlast · Delo Indústria e Comércio Ltda</div>
    </section>
    <section class="auth-side">
      <div class="tema-wrap">${temaBotao()}</div>
      <div class="auth-box">
        <h2>${h}</h2><p class="sub">${sub}</p>
        <div id="auth-msg">${aviso}</div>
        <form class="form" id="fauth" novalidate>
          <label class="fld"><span>E-mail</span><input name="email" type="email" required autocomplete="email" placeholder="voce@dello.com.br"></label>
          ${modo === 'entrar' ? '<label class="fld"><span>Senha</span><input name="senha" type="password" required autocomplete="current-password"></label><div style="text-align:right;margin-top:-6px"><button type="button" class="link" data-modo="recuperar">Esqueci minha senha</button></div>' : ''}
          <button class="btn primary block" type="submit" style="height:46px">${modo === 'entrar' ? 'Entrar' : 'Enviar link'}</button>
        </form>
        ${modo !== 'entrar' ? '<div class="alt"><button type="button" class="link" data-modo="entrar">Voltar para o login</button></div>' : ''}
      </div>
    </section>
  </div>`;
  $$('[data-modo]').forEach(b => { b.onclick = () => renderAuth(b.dataset.modo); });
  const msg = (t, erro) => { $('#auth-msg').innerHTML = `<div class="aviso ${erro ? 'erro' : ''}" style="margin-bottom:14px">${ic(erro ? 'alert' : 'info')}<span>${esc(t)}</span></div>`; };
  $('#fauth').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = String(fd.get('email') || '').trim(), senha = String(fd.get('senha') || '');
    if (!email) return msg('Informe seu e-mail.', true);
    if (modo === 'entrar' && !senha) return msg('Informe sua senha.', true);
    const btn = $('#fauth .btn'); ocupado(btn, true, 'Aguarde…');
    try {
      if (modo === 'entrar') { await S.api.entrar(email, senha); const s = await S.api.sessao(); if (s) await iniciar(s); }
      else { await S.api.recuperar(email); ocupado(btn, false); msg('Se esse e-mail tiver conta, você vai receber um link para criar uma nova senha.'); }
    } catch (err) { ocupado(btn, false); msg(msgErro(err), true); }
  });
}

function pedirNovaSenha() {
  modal({
    titulo: 'Nova senha', tamanho: 'sm',
    corpo: '<form class="form" id="fns"><label class="fld"><span>Nova senha</span><input type="password" name="s1" minlength="8" required autocomplete="new-password" placeholder="Mínimo de 8 caracteres"></label><label class="fld"><span>Repita a senha</span><input type="password" name="s2" required autocomplete="new-password"></label></form>',
    rodape: '<button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" form="fns" class="btn primary">Salvar senha</button>',
    aoAbrir: m => m.$('#fns').addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      if (String(fd.get('s1')).length < 8) return toast('A senha precisa ter pelo menos 8 caracteres.', 'erro');
      if (fd.get('s1') !== fd.get('s2')) return toast('As senhas não são iguais.', 'erro');
      const btn = m.$('.btn.primary'); ocupado(btn, true);
      try { await S.api.trocarSenha(String(fd.get('s1'))); m.fechar(); toast('Senha alterada.'); }
      catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
    }),
  });
}

/* ================================================================
   Estrutura (menu lateral + barra do topo)
   ================================================================ */
const nomeUsuario = () => (S.user && ((S.user.user_metadata || {}).nome || String(S.user.email || '').split('@')[0])) || 'Usuário';

/* ---------- instalar como aplicativo ---------- */
let promptInstalar = null;
const jaInstalado = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const ehIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const mostrarInstalar = () => !jaInstalado() && (!!promptInstalar || ehIOS());
function atualizarBotaoInstalar() { const b = $('#btn-instalar'); if (b) b.classList.toggle('hidden', !mostrarInstalar()); }
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); promptInstalar = e; atualizarBotaoInstalar(); });
window.addEventListener('appinstalled', () => { promptInstalar = null; atualizarBotaoInstalar(); toast('Aplicativo instalado.'); });
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { /* sem app offline */ }));
}
async function instalarApp() {
  if (promptInstalar) {
    promptInstalar.prompt();
    await promptInstalar.userChoice;
    promptInstalar = null; atualizarBotaoInstalar();
    return;
  }
  modal({
    titulo: 'Instalar aplicativo', tamanho: 'sm',
    corpo: ehIOS()
      ? `<ol class="passos"><li>Abra este site no <b>Safari</b>.</li><li>Toque em <b>Compartilhar</b> (o quadrado com a seta para cima).</li><li>Escolha <b>Adicionar à Tela de Início</b> e toque em <b>Adicionar</b>.</li></ol>`
      : `<ol class="passos"><li>No Chrome ou no Edge, abra o menu <b>⋮</b> no canto de cima.</li><li>Escolha <b>Instalar Propostas Dello</b> (ou “Transmitir, salvar e compartilhar → Instalar página como app”).</li></ol>`,
    rodape: '<button type="button" class="btn primary" data-cancelar>Entendi</button>',
  });
}

function renderShell() {
  root.innerHTML = `<div class="shell">
    <aside class="side">
      <a class="brand" href="#/propostas" aria-label="Propostas"><img src="assets/img/logo-branco.png" alt="DelloPlast"><small>Propostas comerciais</small></a>
      <a class="btn primary novo" href="#/proposta/nova">${ic('plus')}Nova proposta</a>
      <nav class="nav">
        <div class="grp">Vendas</div>
        <a href="#/propostas" data-r="propostas">${ic('file')}Propostas<span class="cnt hidden" data-cnt="abertas"></span></a>
        <a href="#/clientes" data-r="clientes">${ic('users')}Clientes</a>
        <div class="grp">Configurar</div>
        <a href="#/ajustes" data-r="ajustes">${ic('sliders')}Padrões</a>
      </nav>
      <div class="foot">
        ${S.api.demo ? '<div class="demo-flag">Modo demonstração · dados salvos só neste navegador</div>' : ''}
        <button type="button" class="instalar${mostrarInstalar() ? '' : ' hidden'}" id="btn-instalar">${ic('download')}<span>Instalar aplicativo</span></button>
        <div class="user">
          <div class="avatar">${esc(iniciais(nomeUsuario()))}</div>
          <div><div class="nm">${esc(nomeUsuario())}</div><div class="em">${esc(S.user.email || '')}</div></div>
          <button type="button" class="icon-btn" id="btn-sair" title="${S.api.demo ? 'Reiniciar demonstração' : 'Sair'}">${ic('logout')}</button>
        </div>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <button type="button" class="icon-btn menu-btn" id="btn-menu" aria-label="Menu">${ic('menu')}</button>
        <div class="ttl"><h1 id="pg-titulo"></h1><div class="sub" id="pg-sub"></div></div>
        <div class="acoes"><span id="pg-acao" style="display:flex;gap:10px"></span>${temaBotao()}</div>
      </header>
      <main class="content" id="view"></main>
    </div>
  </div>`;
  $('#btn-menu').onclick = () => $('.shell').classList.toggle('menu-aberto');
  $('.shell').addEventListener('click', e => { if (e.target.classList.contains('shell') || e.target.closest('.side a')) $('.shell').classList.remove('menu-aberto'); });
  $('#btn-instalar').onclick = instalarApp;
  $('#btn-sair').onclick = async () => {
    if (S.api.demo) { if (await confirmar('Apagar as alterações e voltar aos dados de exemplo?', { titulo: 'Reiniciar demonstração', ok: 'Reiniciar' })) S.api.sair(); return; }
    if (await confirmar('Deseja sair da sua conta neste aparelho?', { titulo: 'Sair', ok: 'Sair' })) { await S.api.sair(); S.user = null; renderAuth(); }
  };
}
function setPage(titulo, sub = '', acao = '') {
  $('#pg-titulo').innerHTML = titulo;
  $('#pg-sub').textContent = sub;
  $('#pg-acao').innerHTML = acao;
  document.title = `${$('#pg-titulo').textContent} · Propostas Dello`;
}
function atualizarContadores() {
  const el = $('[data-cnt="abertas"]'); if (!el) return;
  const n = S.db.propostas.filter(p => ehUltima(p) && (p.status === 'enviada' || p.status === 'rascunho')).length;
  el.textContent = n; el.classList.toggle('hidden', !n);
}

/* ================================================================
   Rotas
   ================================================================ */
function route() {
  if (S.ed && S.ed.sujo && location.hash !== S.ed.hash) {
    if (!window.confirm('Esta proposta tem alterações não salvas. Sair mesmo assim?')) { history.replaceState(null, '', S.ed.hash); return; }
  }
  S.ed = null;
  const v = $('#view');
  v.onclick = null; $('#pg-acao').onclick = null;
  const h = (location.hash || '#/propostas').replace(/^#\/?/, '');
  const [r, a] = h.split('/');
  $$('.nav a').forEach(x => x.classList.toggle('on', x.dataset.r === r || (r === 'proposta' && x.dataset.r === 'propostas')));
  window.scrollTo(0, 0);
  if (r === 'proposta') pgEditor(v, a || 'nova');
  else if (r === 'clientes') pgClientes(v);
  else if (r === 'ajustes') pgAjustes(v);
  else pgPropostas(v);
  atualizarContadores();
}
window.addEventListener('beforeunload', e => { if (S.ed && S.ed.sujo) { e.preventDefault(); e.returnValue = ''; } });

/* ================================================================
   Lista de propostas
   ================================================================ */
const tagStatus = s => { const x = STATUS[s] || STATUS.rascunho; return `<span class="tag ${x.cor}">${x.nome}</span>`; };

function pgPropostas(v) {
  setPage('Propostas', 'Todas as propostas enviadas aos clientes', `<a class="btn primary" href="#/proposta/nova">${ic('plus')}<span>Nova proposta</span></a>`);
  const ult = S.db.propostas.filter(ehUltima);
  const agora = new Date(), mes = `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}`;
  const doMes = ult.filter(p => String(p.dados.data || p.criado_em).slice(0, 7) === mes);
  const soma = arr => arr.reduce((s, p) => s + n0(p.total), 0);
  const enviadas = ult.filter(p => p.status === 'enviada');
  const aprov = ult.filter(p => p.status === 'aprovada' && p.ano === agora.getFullYear());
  const rasc = ult.filter(p => p.status === 'rascunho');
  v.innerHTML = `
    <div class="kpis">
      <div class="card kpi"><div class="ic">${ic('file')}</div><div><div class="lb">Propostas no mês</div><div class="vl">${doMes.length}</div><div class="ds">${fMoeda(soma(doMes))}</div></div></div>
      <div class="card kpi"><div class="ic">${ic('send')}</div><div><div class="lb">Aguardando cliente</div><div class="vl">${enviadas.length}</div><div class="ds">${fMoeda(soma(enviadas))}</div></div></div>
      <div class="card kpi"><div class="ic green">${ic('trophy')}</div><div><div class="lb">Aprovadas no ano</div><div class="vl">${aprov.length}</div><div class="ds">${fMoeda(soma(aprov))}</div></div></div>
      <div class="card kpi"><div class="ic gray">${ic('pen')}</div><div><div class="lb">Rascunhos</div><div class="vl">${rasc.length}</div><div class="ds">${rasc.length ? 'Falta enviar' : 'Nenhum pendente'}</div></div></div>
    </div>
    <div class="card">
      <div class="toolbar">
        <div class="busca">${ic('search')}<input class="inp" id="q" placeholder="Pesquisar número, cliente, CNPJ ou item…" value="${esc(S.filtro.q)}" autocomplete="off"></div>
        <div class="chips" id="chips"></div>
      </div>
      <div id="lista"></div>
    </div>`;
  const desenhar = () => {
    const q = norm(S.filtro.q), qd = digitos(S.filtro.q);
    const base = S.db.propostas.filter(p => {
      if (!q) return true;
      const d = p.dados || {}, c = d.cliente || {};
      const txt = norm([codigo(p), p.numero, c.nome, c.contato, c.endereco, ...(d.itens || []).map(i => `${i.identificacao} ${i.descricao}`)].join(' '));
      return txt.includes(q) || (qd.length >= 3 && digitos(c.cnpj).includes(qd));
    });
    const cnt = s => base.filter(p => !s || p.status === s).length;
    $('#chips').innerHTML = [['', 'Todas'], ...Object.entries(STATUS).map(([k, x]) => [k, x.nome])]
      .map(([k, n]) => `<button type="button" class="chip ${S.filtro.status === k ? 'on' : ''}" data-st="${k}">${n} <span class="n">${cnt(k)}</span></button>`).join('');
    const lista = base.filter(p => !S.filtro.status || p.status === S.filtro.status)
      .sort((a, b) => b.ano - a.ano || b.numero - a.numero || b.versao - a.versao);
    $('#lista').innerHTML = lista.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Proposta</th><th>Cliente</th><th>Data</th><th>Itens</th><th class="right">Valor total</th><th>Situação</th><th></th></tr></thead><tbody>
      ${lista.map(p => {
        const d = p.dados || {}, c = d.cliente || {}, ult = ehUltima(p);
        return `<tr class="${ult ? '' : 'antiga'}">
          <td class="cod" data-l="Proposta"><a href="#/proposta/${p.id}">${esc(codigo(p))}</a>${ult ? '' : ' <span class="ver" title="Existe versão mais nova">antiga</span>'}</td>
          <td class="cli full" data-l="Cliente"><b>${esc(c.nome || 'Sem cliente')}</b><small>${esc([c.contato, c.endereco].filter(Boolean).join(' · '))}</small></td>
          <td data-l="Data" class="nowrap">${fData(d.data || p.criado_em)}</td>
          <td data-l="Itens">${(d.itens || []).length}</td>
          <td data-l="Valor total" class="right num nowrap"><b>${fMoeda(p.total)}</b></td>
          <td data-l="Situação">${tagStatus(p.status)}</td>
          <td class="c-acts"><div class="acts">
            <button type="button" class="icon-btn" data-ac="pdf" data-id="${p.id}" title="Ver PDF">${ic('pdf')}</button>
            <a class="icon-btn" href="#/proposta/${p.id}" title="Abrir">${ic('edit')}</a>
            <button type="button" class="icon-btn" data-ac="versao" data-id="${p.id}" title="Nova versão (V${proximaVersao(p.ano, p.numero)})">${ic('layers')}</button>
            <button type="button" class="icon-btn" data-ac="duplicar" data-id="${p.id}" title="Duplicar como nova proposta">${ic('copy')}</button>
            <button type="button" class="icon-btn danger" data-ac="excluir" data-id="${p.id}" title="Excluir">${ic('trash')}</button>
          </div></td></tr>`;
      }).join('')}</tbody></table></div>`
      : `<div class="vazio">${ic('file')}<b>${S.db.propostas.length ? 'Nada encontrado' : 'Nenhuma proposta ainda'}</b>${S.db.propostas.length ? 'Tente outra pesquisa ou situação.' : '<a class="btn primary" style="margin-top:14px" href="#/proposta/nova">' + ic('plus') + 'Criar a primeira proposta</a>'}</div>`;
  };
  desenhar();
  $('#q').addEventListener('input', e => { S.filtro.q = e.target.value; desenhar(); });
  v.onclick = async e => {
    const st = e.target.closest('[data-st]');
    if (st) { S.filtro.status = st.dataset.st; desenhar(); return; }
    const b = e.target.closest('[data-ac]'); if (!b) return;
    const p = S.db.propostas.find(x => x.id === b.dataset.id); if (!p) return;
    if (b.dataset.ac === 'pdf') abrirPreview(pdD(p));
    else if (b.dataset.ac === 'versao') abrirNovaVersao(pdD(p));
    else if (b.dataset.ac === 'duplicar') abrirDuplicada(pdD(p));
    else if (b.dataset.ac === 'excluir') {
      if (!await confirmar(`Excluir a proposta <b>${esc(codigo(p))}</b> de ${esc(p.cliente_nome || 'sem cliente')}? Isso não pode ser desfeito.`)) return;
      try { await S.api.excluir('propostas', p.id); S.db.propostas = S.db.propostas.filter(x => x.id !== p.id); toast('Proposta excluída.'); desenhar(); atualizarContadores(); }
      catch (err) { toast(msgErro(err), 'erro'); }
    }
  };
}

function abrirNovaVersao(d) {
  const n = clone(d);
  n.versao = proximaVersao(n.ano, n.numero); n.status = 'rascunho'; n.data = hojeISO();
  S.edPendente = n; location.hash = '#/proposta/nova';
}
function abrirDuplicada(d) {
  const n = clone(d);
  n.ano = new Date().getFullYear(); n.numero = proximoNumero(n.ano); n.versao = 0; n.status = 'rascunho'; n.data = hojeISO();
  n.itens.forEach(i => { i.id = uid(); });
  S.edPendente = n; location.hash = '#/proposta/nova';
}

/* ================================================================
   Editor da proposta
   ================================================================ */
const inp = (k, v, o = {}) => `<input data-k="${k}" value="${esc(v ?? '')}"${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}${o.list ? ` list="${o.list}"` : ''}${o.tipo ? ` type="${o.tipo}"` : ''}${o.cls ? ` class="${o.cls}"` : ''}${o.extra ? ' ' + o.extra : ''} autocomplete="off">`;
const inum = (k, v, spec, o = {}) => `${o.pre ? `<span class="pre">${o.pre}</span>` : ''}${o.suf ? `<span class="suf">${o.suf}</span>` : ''}<input data-k="${k}" data-num="${spec}" inputmode="decimal" class="n${o.pre ? ' has-pre' : ''}${o.suf ? ' has-suf' : ''}${o.cls ? ' ' + o.cls : ''}" value="${esc(fmtSpec(v, spec))}"${o.ph ? ` placeholder="${esc(o.ph)}"` : ''} autocomplete="off">`;
const fld = (rotulo, campo, cls = '') => `<label class="fld ${cls}"><span>${rotulo}</span>${campo}</label>`;
const sel = (k, v, opcoes) => {
  const ops = opcoes.includes(v) || !v ? opcoes : [...opcoes, v];
  return `<select data-k="${k}">${ops.map(o => `<option${o === v ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
};
// lista com opção "Outro…" que abre um campo de texto
const selOutro = (k, v, opcoes) => {
  const outro = !!v && !opcoes.includes(v);
  return `<div style="display:flex;flex-direction:column;gap:6px"><select data-selo="${k}">${opcoes.map(o => `<option${o === v ? ' selected' : ''}>${esc(o)}</option>`).join('')}<option value="__outro"${outro ? ' selected' : ''}>Outro…</option></select>
    <input data-k="${k}" value="${esc(v ?? '')}" class="${outro ? '' : 'hidden'}" placeholder="Escreva aqui" autocomplete="off"></div>`;
};
const segm = (k, v, opcoes) => `<div class="seg" role="radiogroup">${opcoes.map(([val, txt]) => `<label><input type="radio" name="${k}" data-k="${k}" value="${esc(val)}"${String(v) === String(val) ? ' checked' : ''}><span>${esc(txt)}</span></label>`).join('')}</div>`;

function pgEditor(v, id) {
  let d, row = null;
  if (id === 'nova') {
    if (S.edPendente) { d = normalizar(S.edPendente); S.edPendente = null; }
    else {
      d = novaBase();
      d.ano = new Date().getFullYear(); d.numero = proximoNumero(d.ano); d.versao = 0; d.status = 'rascunho';
      d.itens = [novoItem({ ipi: d.condicoes.ipi, icms: d.condicoes.icms })];
    }
  } else {
    row = S.db.propostas.find(p => p.id === id);
    if (!row) { v.innerHTML = `<div class="card vazio">${ic('file')}<b>Proposta não encontrada</b>Ela pode ter sido excluída. <a href="#/propostas">Voltar</a></div>`; setPage('Proposta'); return; }
    d = pdD(row);
  }
  S.ed = { id: row ? row.id : null, d, sujo: id === 'nova' && !!d.cliente.nome, hash: location.hash || '#/proposta/nova' };

  setPage('', '', `<a class="btn" href="#/propostas">${ic('back')}<span>Propostas</span></a>`);
  v.innerHTML = `<datalist id="dl-cores">${CORES.map(c => `<option value="${c}">`).join('')}</datalist>
    <datalist id="dl-pag">${PAGAMENTOS.map(c => `<option value="${c}">`).join('')}</datalist>
    <datalist id="dl-pal">${MEDIDAS_PALETE.map(c => `<option value="${c}">`).join('')}</datalist>
    <div class="editor" id="ed">
    <div class="col">
      <section class="card">
        <div class="card-h"><h3><span class="n">1</span>Proposta</h3><span class="sub">O número segue a sequência sozinho; a versão muda quando você revisa.</span></div>
        <div class="card-b"><div class="numero">
          ${fld('Número', inum('numero', d.numero, 'i'))}
          ${fld('Ano', inum('ano', d.ano, 'i'))}
          ${fld('Versão', `<span class="pre">V</span><input data-k="versao" data-num="i" inputmode="numeric" class="n has-pre" value="${esc(d.versao)}" autocomplete="off">`)}
          ${fld('Data', inp('data', d.data, { tipo: 'date' }))}
          ${fld('Situação', `<select data-k="status">${Object.entries(STATUS).map(([k, x]) => `<option value="${k}"${d.status === k ? ' selected' : ''}>${x.nome}</option>`).join('')}</select>`)}
        </div></div>
      </section>

      <section class="card">
        <div class="card-h"><h3><span class="n">2</span>Cliente</h3><span class="sub">Comece a digitar o nome para puxar um cliente já cadastrado.</span></div>
        <div class="card-b"><div class="grid4">
          <label class="fld span2"><span>Cliente (razão social)</span>${inp('cliente.nome', d.cliente.nome, { ph: 'Ex.: EMBALAGENS EXEMPLO LTDA', extra: 'id="cli-nome"' })}<div class="sugest hidden" id="cli-sug"></div></label>
          ${fld('CNPJ', inp('cliente.cnpj', d.cliente.cnpj, { ph: '00.000.000/0000-00' }))}
          ${fld('Inscrição estadual', inp('cliente.ie', d.cliente.ie))}
          ${fld('Contato', inp('cliente.contato', d.cliente.contato))}
          ${fld('Telefone', inp('cliente.telefone', d.cliente.telefone, { ph: '(00) 00000-0000' }))}
          ${fld('E-mail', inp('cliente.email', d.cliente.email, { tipo: 'email' }), 'span2')}
          ${fld('Endereço / cidade', inp('cliente.endereco', d.cliente.endereco), 'span3')}
          ${fld('CEP', inp('cliente.cep', d.cliente.cep, { ph: '00000-000' }))}
        </div></div>
      </section>

      <section class="card">
        <div class="card-h"><h3><span class="n">3</span>Itens</h3><span class="sub">O preço unitário vem do bloco interno abaixo: peso da chapa × preço do kg.</span></div>
        <div class="planilha-wrap"><table class="planilha" id="itens"></table></div>
      </section>

      <section class="card interno">
        <div class="card-h"><h3><span class="n">3b</span>Dados internos Dello</h3><span class="tag amber sem">${ic('eyeOff')}Não sai no PDF</span><span class="sub">Só o <b class="vermelho">preço kg</b> (em vermelho) é preenchido aqui; o resto é calculado a partir dos itens.</span></div>
        <div class="int-bloco">
          <div class="int-t">Orçamento do cliente</div>
          <div class="planilha-wrap"><table class="planilha ro" id="int-orc"></table></div>
          <div class="int-t">Dados cadastrais (interno Dello)</div>
          <div class="planilha-wrap"><table class="planilha ro" id="int-cad"></table></div>
        </div>
      </section>

      <section class="card">
        <div class="card-h"><h3><span class="n">4</span>Condições gerais</h3><span class="sub">ICMS e IPI daqui valem para os itens novos (e atualizam os que estavam iguais).</span></div>
        <div class="card-b"><div class="cond">
          ${fld('Finalidade', selOutro('condicoes.finalidade', d.condicoes.finalidade, OPC.finalidade))}
          <div class="imp">${fld('ICMS', inum('condicoes.icms', d.condicoes.icms, '0,2', { suf: '%' }))}${segm('condicoes.icms_modo', d.condicoes.icms_modo, [['Incluso', 'Incluso'], ['Adicional', 'Adicional']])}</div>
          <div class="imp">${fld('IPI', inum('condicoes.ipi', d.condicoes.ipi, '0,2', { suf: '%' }))}${segm('condicoes.ipi_modo', d.condicoes.ipi_modo, [['Adicional', 'Adicional'], ['Incluso', 'Incluso']])}</div>
          <div class="grid2">${fld('PIS', inum('condicoes.pis', d.condicoes.pis, '2', { suf: '%' }))}${fld('COFINS', inum('condicoes.cofins', d.condicoes.cofins, '2', { suf: '%' }))}</div>
          ${fld('Condição de pagamento', inp('condicoes.pagamento', d.condicoes.pagamento, { list: 'dl-pag' }))}
          ${fld('Prazo de entrega', inp('condicoes.prazo', d.condicoes.prazo, { ph: '20 dias' }))}
          ${fld('Frete', selOutro('condicoes.frete', d.condicoes.frete, OPC.frete))}
          ${fld('Validade da proposta', selOutro('condicoes.validade', d.condicoes.validade, OPC.validade))}
          ${fld('ICMS ST (valor)', inum('icms_st', d.icms_st, '2', { pre: 'R$', ph: '0,00' }))}
        </div></div>
      </section>

      <section class="card">
        <div class="card-h"><h3><span class="n">5</span>Paletes e paletização</h3>
          <div class="r">${segm('paletes.usar', d.paletes.usar ? 'sim' : 'nao', [['nao', 'Sem paletes'], ['sim', 'Com paletes']])}</div></div>
        <div class="card-b">
          <div id="paletes"></div>
          <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--line)">
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
              <b style="font-size:13.5px">Paletização</b>
              <div class="chips-sel" id="pz-sel"></div>
              <button type="button" class="btn sm" data-ac="paletizacao" style="margin-left:auto">${ic('pallet')}Escolher paletização</button>
            </div>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-h"><h3><span class="n">6</span>Orientação da chapa</h3><span class="sub">A imagem escolhida vai no PDF.</span></div>
        <div class="card-b"><div class="ori">
          ${ORIENTACOES.map(o => `<label><input type="radio" name="orientacao" data-k="orientacao" value="${o.id}"${d.orientacao === o.id ? ' checked' : ''}><span class="box"><span class="im"><img src="${o.img}" alt="${esc(o.nome)}"></span><span class="tx">${esc(o.nome)}</span></span></label>`).join('')}
          <label><input type="radio" name="orientacao" data-k="orientacao" value=""${!d.orientacao ? ' checked' : ''}><span class="box"><span class="im none">${ic('image')}</span><span class="tx">Não mostrar</span></span></label>
        </div></div>
      </section>

      <section class="card">
        <div class="card-h"><h3><span class="n">7</span>Observações</h3><span class="sub">Aparece no PDF, num quadro próprio. Deixe vazio se não tiver.</span></div>
        <div class="card-b"><label class="fld"><textarea data-k="observacao" rows="3" placeholder="Ex.: Arte e faca por conta do cliente. Entrega programada em 2 lotes.">${esc(d.observacao)}</textarea></label></div>
      </section>
    </div>

    <div class="barra">
      <div class="b-st"><span class="salvo" id="salvo"></span></div>
      <div class="b-tot" id="tot"></div>
      <div class="b-acts">
        <button type="button" class="icon-btn" data-ac="versao" title="Nova versão desta proposta">${ic('layers')}</button>
        <button type="button" class="icon-btn" data-ac="duplicar" title="Duplicar como nova proposta">${ic('copy')}</button>
        <button type="button" class="btn" data-ac="salvar">${ic('save')}Salvar</button>
        <button type="button" class="btn navy" data-ac="pdf">${ic('pdf')}Gerar PDF</button>
      </div>
    </div>
  </div>`;

  desenharItens(); desenharPaletes(); desenharPaletizacao(); recalc(); marcarSalvo();
  ligarEditor($('#ed'));
}

const valCampo = (v, spec, suf) => { const t = fmtSpec(v, spec); return t && suf ? t + suf : t; };

function linhaHTML(it, i, n) {
  const k = f => `itens.${i}.${f}`;
  const tx = (f, o = {}) => `<td${o.td ? ` class="${o.td}"` : ''}><input class="c" data-k="${k(f)}" value="${esc(it[f] ?? '')}"${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}${o.list ? ` list="${o.list}"` : ''} autocomplete="off"></td>`;
  const ar = (f, o = {}) => `<td><textarea class="c${o.cls ? ' ' + o.cls : ''}" rows="2" data-k="${k(f)}"${o.ph ? ` placeholder="${o.ph}"` : ''}>${esc(it[f] ?? '')}</textarea></td>`;
  const nm = (f, spec, o = {}) => `<td${o.td ? ` class="${o.td}"` : ''}><input class="c n${o.cls ? ' ' + o.cls : ''}" data-k="${k(f)}" data-num="${spec}"${o.suf ? ` data-suf="${o.suf}"` : ''} inputmode="decimal" value="${esc(valCampo(it[f], spec, o.suf))}"${o.ph ? ` placeholder="${esc(o.ph)}"` : ''} autocomplete="off"></td>`;
  const uns = OPC.unidade.includes(it.unidade) || !it.unidade ? OPC.unidade : [...OPC.unidade, it.unidade];
  return `<tr data-i="${i}">
    <td class="ix"><span>${i + 1}</span><div class="mv">
      <button type="button" data-ac="item-up" title="Subir"${i === 0 ? ' disabled' : ''}>${ic('up')}</button>
      <button type="button" data-ac="item-down" title="Descer"${i === n - 1 ? ' disabled' : ''}>${ic('down')}</button></div></td>
    ${ar('identificacao', { ph: 'FT00001 FACA001 G001', cls: 'uma-linha' })}
    ${tx('ncm')}
    <td><select class="c" data-k="${k('unidade')}">${uns.map(o => `<option${o === it.unidade ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select></td>
    ${ar('descricao', { ph: 'TAMPA CX&#10;355x265x105' })}
    ${nm('quantidade', '0')}
    ${tx('cor', { list: 'dl-cores' })}
    ${nm('larg', '0')}${nm('comp', '0')}${nm('esp', '1,2')}${nm('gram', '0', { td: 'gram' })}
    <td class="calc-ro" data-o="preco"></td>
    ${nm('ipi', '0,2', { suf: '%' })}${nm('icms', '0,2', { suf: '%' })}
    <td class="sub" data-o="sub"></td>
    <td class="acts">
      <button type="button" class="icon-btn" data-ac="item-dup" title="Duplicar linha">${ic('copy')}</button>
      <button type="button" class="icon-btn danger" data-ac="item-del" title="Remover linha">${ic('trash')}</button>
    </td>
  </tr>`;
}

function desenharItens() {
  const its = S.ed.d.itens;
  $('#itens').innerHTML = `<colgroup><col style="width:28px"><col><col style="width:80px"><col style="width:56px"><col><col style="width:68px"><col style="width:58px"><col style="width:54px"><col style="width:54px"><col style="width:42px"><col style="width:48px"><col style="width:76px"><col style="width:54px"><col style="width:50px"><col style="width:104px"><col style="width:34px"></colgroup>
    <thead><tr><th></th><th class="tl">Identificação</th><th>NCM</th><th>Unid.</th><th class="tl">Descrição</th><th>Quant.</th><th>Cor</th><th>Larg</th><th>Comp</th><th>Esp</th><th>Gram</th>
      <th title="Preço unitário (calculado)">Preço unit</th><th>IPI</th><th>ICMS</th><th class="tr">Subtotal</th><th></th></tr></thead>
    <tbody>${its.length ? its.map((it, i) => linhaHTML(it, i, its.length)).join('') : `<tr class="vazio-l"><td colspan="16">Nenhum item. Clique em “Adicionar item”.</td></tr>`}</tbody>
    <tfoot><tr>
      <td colspan="5"><div class="tf"><button type="button" class="btn dashed sm" data-ac="item-add">${ic('plus')}Adicionar item</button><span class="peso" data-o="tot-peso"></span></div></td>
      <td class="tr" data-o="tot-qtd"></td><td colspan="8" class="tr lbl">Total dos produtos</td><td class="sub" data-o="tot-sub"></td><td></td>
    </tr></tfoot>`;
  desenharInterno();
}

// bloco interno (igual às colunas P–AM da planilha): só o preço kg é editável
function desenharInterno() {
  const its = S.ed.d.itens;
  const vazio = n => `<tr class="vazio-l"><td colspan="${n}">Sem itens.</td></tr>`;
  const o = (k, cls = '') => `<td class="${cls}" data-o="${k}"></td>`;
  $('#int-orc').innerHTML = `<colgroup><col style="width:28px"><col><col><col><col><col><col style="width:110px"><col><col></colgroup>
    <thead><tr><th></th><th>Largura</th><th>Comprimento</th><th>Gramatura</th><th>Variável</th><th>Peso chapa (kg)</th><th class="red">Preço kg</th><th>Valor unit</th><th>Peso total (kg)</th></tr></thead>
    <tbody>${its.length ? its.map((it, i) => `<tr data-i="${i}"><td class="ix"><span>${i + 1}</span></td>
      ${o('larg', 'n')}${o('comp', 'n')}${o('gram', 'n')}<td class="n">${nf(1e9)}</td>${o('peso', 'n')}
      <td class="red"><input class="c n" data-k="itens.${i}.preco_kg" data-num="2,4" inputmode="decimal" value="${esc(fmtSpec(it.preco_kg, '2,4'))}" placeholder="0,00" autocomplete="off"></td>
      ${o('preco', 'n')}${o('pesoT', 'n')}</tr>`).join('') : vazio(9)}</tbody>
    <tfoot><tr><td colspan="8" class="tr lbl">Peso total</td><td class="tr" data-o="int-peso"></td></tr></tfoot>`;
  $('#int-cad').innerHTML = `<colgroup><col style="width:28px"><col style="width:13%"><col style="width:9%"><col style="width:13%"><col><col><col><col><col><col><col><col style="width:9%"><col><col style="width:9%"></colgroup>
    <thead><tr><th></th><th>Código Dello</th><th>Código cliente</th><th>Descrição</th><th>Quant</th><th>Cor</th><th>Larg</th><th>Comp</th><th>Esp</th><th>Gram</th><th>Peso calculado</th><th>Preço de venda</th><th>Faca / Cav</th><th>Tratamento corona</th></tr></thead>
    <tbody>${its.length ? its.map((it, i) => `<tr data-i="${i}"><td class="ix"><span>${i + 1}</span></td>
      ${o('identificacao', 'tx')}${o('ncm')}${o('descricao', 'tx')}${o('quantidade', 'n')}${o('cor')}${o('larg', 'n')}${o('comp', 'n')}${o('esp', 'n')}${o('gram', 'n')}${o('peso', 'n')}${o('preco', 'n')}
      <td>NÃO</td><td class="tx">Mínimo 42 dynas</td></tr>`).join('') : vazio(14)}</tbody>`;
}

function desenharPaletes() {
  const p = S.ed.d.paletes, box = $('#paletes');
  if (!p.usar) { box.innerHTML = '<p class="muted small" style="margin:0">Sem paletes nesta proposta. Escolha “Com paletes” para informar medida, quantidade e valor.</p>'; return; }
  if (!p.itens.length) p.itens.push({ id: uid(), medida: '', quantidade: null, valor: null, retorna: false });
  box.innerHTML = `<div>${p.itens.map((x, i) => {
    const k = f => `paletes.itens.${i}.${f}`;
    return `<div class="pal-row" data-pi="${i}">
      ${fld('Medida do palete', inp(k('medida'), x.medida, { list: 'dl-pal', ph: '1,20 x 1,00 m' }))}
      ${fld('Quantidade', inum(k('quantidade'), x.quantidade, '0'))}
      ${fld('Valor unit.', inum(k('valor'), x.valor, '2', { pre: 'R$' }))}
      <div class="fld"><span>Retornável?</span>${segm(k('retorna'), x.retorna ? 'sim' : 'nao', [['nao', 'Não'], ['sim', 'Sim']])}</div>
      <div class="tt" data-o="pal-tot"></div>
      <button type="button" class="icon-btn danger" data-ac="pal-del" title="Remover" style="margin-bottom:3px">${ic('trash')}</button>
    </div>`;
  }).join('')}</div>
  <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:8px">
    <button type="button" class="btn dashed sm" data-ac="pal-add">${ic('plus')}Outra medida de palete</button>
    <span class="muted small">Retornável: não soma no total; no PDF aparece como valor cobrado se o palete não voltar.</span>
  </div>`;
}

function desenharPaletizacao() {
  const pz = S.ed.d.paletizacao;
  const lst = [...pz.opcoes, ...(pz.outros ? [pz.outros] : [])];
  $('#pz-sel').innerHTML = lst.length ? lst.map(o => `<span class="pz">${ic('check')}${esc(o)}</span>`).join('') : '<span class="muted small">Nenhuma escolhida</span>';
}

function recalc() {
  const d = S.ed.d;
  $$('#itens tbody tr[data-i]').forEach(el => {
    const it = d.itens[+el.dataset.i]; if (!it) return;
    const c = calcItem(it);
    $('[data-o=sub]', el).textContent = fMoeda(c.subtotal);
    const tdP = $('[data-o=preco]', el);
    tdP.textContent = n0(it.preco_kg) ? fMoeda(c.preco) : '—';
    tdP.title = `Peso da chapa ${nf(c.peso, 3, 3)} kg × R$ ${nf(n0(it.preco_kg), 2, 4)}/kg`;
    const tdG = $('td.gram', el), ok = gramOk(it.gram, it.esp);
    tdG.classList.toggle('erro', !ok);
    tdG.title = ok ? '' : `Gramatura ${nf(n0(it.gram))} fora da tabela para ${nf(n0(it.esp), 1, 1)} mm`;
  });
  const setO = (el, k, v) => { const x = $(`[data-o=${k}]`, el); if (x) x.textContent = v; };
  $$('#int-orc tbody tr[data-i], #int-cad tbody tr[data-i]').forEach(el => {
    const it = d.itens[+el.dataset.i]; if (!it) return;
    const c = calcItem(it), num = (v, a = 0, b = a) => (v === null || v === undefined || v === '' ? '' : nf(+v, a, b));
    setO(el, 'larg', num(it.larg)); setO(el, 'comp', num(it.comp)); setO(el, 'gram', num(it.gram)); setO(el, 'esp', num(it.esp, 1, 2));
    setO(el, 'quantidade', num(it.quantidade)); setO(el, 'cor', it.cor || ''); setO(el, 'ncm', it.ncm || '');
    setO(el, 'identificacao', it.identificacao || ''); setO(el, 'descricao', String(it.descricao || '').replace(/\n/g, ' '));
    setO(el, 'peso', nf(c.peso, 3, 3)); setO(el, 'preco', fMoeda(c.preco)); setO(el, 'pesoT', nf(c.pesoTotal, 2, 2));
  });
  const ip = $('[data-o=int-peso]'); if (ip) ip.textContent = `${nf(d.itens.reduce((s, it) => s + calcItem(it).pesoTotal, 0), 2, 2)} kg`;
  $$('#paletes [data-pi]').forEach(el => {
    const x = d.paletes.itens[+el.dataset.pi]; if (!x) return;
    $('[data-o=pal-tot]', el).innerHTML = `Total <b>${fMoeda(n0(x.quantidade) * n0(x.valor))}</b>${x.retorna ? '<br><span class="muted small">não soma</span>' : ''}`;
  });
  const t = totais(d), c = d.condicoes;
  const qtd = d.itens.reduce((s, it) => s + n0(it.quantidade), 0);
  const fq = $('[data-o=tot-qtd]'); if (fq) fq.textContent = nf(qtd);
  const fs = $('[data-o=tot-sub]'); if (fs) fs.textContent = fMoeda(t.produtos);
  const fp = $('[data-o=tot-peso]'); if (fp) fp.textContent = d.itens.length ? `Peso total ${nf(t.peso, 1, 1)} kg` : '';
  $('#tot').innerHTML = `
    <div class="l"><span>Produtos</span><b>${fMoeda(t.produtos)}</b></div>
    <div class="l"><span>ICMS ${esc(String(c.icms_modo).toLowerCase())}</span><b>${fMoeda(t.icms)}</b></div>
    <div class="l"><span>IPI ${esc(String(c.ipi_modo).toLowerCase())}</span><b>${fMoeda(t.ipi)}</b></div>
    ${t.st ? `<div class="l"><span>ICMS ST</span><b>${fMoeda(t.st)}</b></div>` : ''}
    ${t.palCobrado ? `<div class="l"><span>Paletes</span><b>${fMoeda(t.palCobrado)}</b></div>` : ''}
    <div class="l fim"><span>Valor total</span><b>${fMoeda(t.total)}</b></div>`;
  const cod = codigo(d);
  setPageTitulo(cod, d);
}

function setPageTitulo(cod, d) {
  $('#pg-titulo').innerHTML = `Proposta ${esc(cod)} ${tagStatus(d.status)}`;
  $('#pg-sub').textContent = d.cliente.nome || 'Cliente não informado';
  document.title = `Proposta ${cod} · Propostas Dello`;
}

function marcarSalvo() {
  const el = $('#salvo'); if (!el) return;
  el.classList.toggle('sujo', S.ed.sujo);
  el.textContent = S.ed.sujo ? 'Não salvo' : (S.ed.id ? 'Salvo' : 'Novo');
  const row = S.ed.id && S.db.propostas.find(p => p.id === S.ed.id);
  el.title = row ? `Criada em ${fQuando(row.criado_em)} · atualizada em ${fQuando(row.atualizado_em)}` : 'Ainda não foi salva.';
}
function sujar() { if (!S.ed.sujo) { S.ed.sujo = true; marcarSalvo(); } }

function ligarEditor(ed) {
  const aoMudar = e => {
    const el = e.target;
    if (el.dataset.selo) {
      const k = el.dataset.selo, campo = $(`input[data-k="${k}"]`, el.parentNode);
      if (el.value === '__outro') { campo.classList.remove('hidden'); campo.value = ''; setP(S.ed.d, k, ''); campo.focus(); }
      else { campo.classList.add('hidden'); campo.value = el.value; setP(S.ed.d, k, el.value); }
      sujar(); recalc(); return;
    }
    if (!el.dataset.k) return;
    const k = el.dataset.k;
    let val;
    if (el.type === 'radio') { if (!el.checked) return; val = el.value; }
    else if (el.dataset.num !== undefined) val = parseNum(el.value);
    else val = el.classList.contains('uma-linha') ? el.value.replace(/\n/g, ' ') : el.value;
    if (k === 'paletes.usar') { S.ed.d.paletes.usar = val === 'sim'; desenharPaletes(); sujar(); recalc(); return; }
    if (/^paletes\.itens\.\d+\.retorna$/.test(k)) val = val === 'sim';
    if (['numero', 'ano', 'versao'].includes(k) && val !== null) val = Math.round(val);
    const ant = getP(S.ed.d, k);
    if (ant === val && e.type === 'change') return;
    setP(S.ed.d, k, val);
    // ICMS/IPI das condições: atualiza os itens que tinham o valor antigo
    if (k === 'condicoes.icms' || k === 'condicoes.ipi') {
      const f = k.split('.')[1];
      S.ed.d.itens.forEach((it, i) => {
        if (it[f] === ant || it[f] === null || it[f] === undefined) {
          it[f] = val;
          const x = $(`[data-k="itens.${i}.${f}"]`, ed); if (x && document.activeElement !== x) x.value = valCampo(val, '0,2', '%');
        }
      });
    }
    sujar(); recalc();
  };
  ed.addEventListener('input', aoMudar);
  ed.addEventListener('change', aoMudar);
  ed.addEventListener('focusout', e => {
    const el = e.target;
    if (el.dataset.num !== undefined && el.dataset.k) el.value = valCampo(getP(S.ed.d, el.dataset.k), el.dataset.num, el.dataset.suf);
  });
  ed.addEventListener('keydown', e => {
    // Enter num campo numérico vai para o próximo campo
    if (e.key === 'Enter' && e.target.matches('input, textarea.uma-linha')) {
      e.preventDefault();
      const campos = $$('input:not([type=radio]):not(.hidden), textarea, select', ed).filter(x => x.offsetParent);
      const i = campos.indexOf(e.target); if (i >= 0 && campos[i + 1]) campos[i + 1].focus();
    }
  });
  ed.addEventListener('click', async e => {
    const b = e.target.closest('[data-ac]'); if (!b) return;
    const d = S.ed.d, ac = b.dataset.ac;
    const itemEl = b.closest('tr[data-i]'), i = itemEl ? +itemEl.dataset.i : -1;
    if (ac === 'item-add') {
      const ult = d.itens[d.itens.length - 1];
      d.itens.push(novoItem(ult ? { ncm: ult.ncm, unidade: ult.unidade, cor: ult.cor, esp: ult.esp, gram: ult.gram, preco_kg: ult.preco_kg, ipi: ult.ipi, icms: ult.icms } : { ipi: d.condicoes.ipi, icms: d.condicoes.icms }));
      desenharItens(); recalc(); sujar();
      const novo = $$('#itens tbody tr[data-i]').pop(); if (novo) { novo.scrollIntoView({ behavior: 'smooth', block: 'center' }); $('textarea', novo).focus({ preventScroll: true }); }
    } else if (ac === 'item-dup') {
      d.itens.splice(i + 1, 0, { ...clone(d.itens[i]), id: uid() }); desenharItens(); recalc(); sujar();
    } else if (ac === 'item-del') {
      const it = d.itens[i];
      if ((it.identificacao || it.larg || it.quantidade) && !await confirmar(`Remover o item <b>${esc(tituloItem(it))}</b>?`, { titulo: 'Remover item', ok: 'Remover' })) return;
      d.itens.splice(i, 1); desenharItens(); recalc(); sujar();
    } else if (ac === 'item-up' || ac === 'item-down') {
      const j = ac === 'item-up' ? i - 1 : i + 1; if (j < 0 || j >= d.itens.length) return;
      [d.itens[i], d.itens[j]] = [d.itens[j], d.itens[i]]; desenharItens(); recalc(); sujar();
    } else if (ac === 'pal-add') {
      d.paletes.itens.push({ id: uid(), medida: '', quantidade: null, valor: null, retorna: false }); desenharPaletes(); recalc(); sujar();
    } else if (ac === 'pal-del') {
      d.paletes.itens.splice(+b.closest('[data-pi]').dataset.pi, 1);
      if (!d.paletes.itens.length) d.paletes.usar = false;
      if (!d.paletes.usar) { const r = $('input[name="paletes.usar"][value="nao"]', ed); if (r) r.checked = true; }
      desenharPaletes(); recalc(); sujar();
    } else if (ac === 'paletizacao') escolherPaletizacao();
    else if (ac === 'salvar') salvarProposta(b);
    else if (ac === 'pdf') { if (await salvarProposta(b, true)) abrirPreview(S.ed.d); }
    else if (ac === 'versao' || ac === 'duplicar') {
      if (S.ed.sujo && !await salvarProposta(null, true)) return;
      if (ac === 'versao') abrirNovaVersao(S.ed.d); else abrirDuplicada(S.ed.d);
    }
  });
  ligarClienteSugestao();
  document.onkeydown = e => {
    if (!S.ed || !(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 's') return;
    e.preventDefault(); salvarProposta($('[data-ac=salvar]'));
  };
}

function ligarClienteSugestao() {
  const inpNome = $('#cli-nome'), box = $('#cli-sug');
  let lista = [], sel = -1;
  const fechar = () => { box.classList.add('hidden'); sel = -1; };
  const desenhar = () => {
    const q = norm(inpNome.value), qd = digitos(inpNome.value);
    if (q.length < 2) return fechar();
    lista = S.db.clientes.filter(c => norm(c.nome).includes(q) || (qd.length >= 3 && digitos(c.cnpj).includes(qd))).slice(0, 6);
    if (!lista.length || (lista.length === 1 && norm(lista[0].nome) === q)) return fechar();
    box.innerHTML = lista.map((c, i) => `<button type="button" data-ci="${i}" class="${i === sel ? 'sel' : ''}"><b>${esc(c.nome)}</b><small>${esc([c.cnpj, c.contato, c.endereco].filter(Boolean).join(' · '))}</small></button>`).join('');
    box.classList.remove('hidden');
  };
  const escolher = c => {
    CAMPOS_CLI.forEach(k => {
      S.ed.d.cliente[k] = c[k] || '';
      const x = $(`[data-k="cliente.${k}"]`); if (x) x.value = c[k] || '';
    });
    fechar(); sujar(); recalc();
  };
  inpNome.addEventListener('input', () => { sel = -1; desenhar(); });
  inpNome.addEventListener('blur', () => setTimeout(fechar, 150));
  inpNome.addEventListener('keydown', e => {
    if (box.classList.contains('hidden')) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, lista.length - 1); desenhar(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); desenhar(); }
    else if (e.key === 'Enter' && sel >= 0) { e.preventDefault(); e.stopPropagation(); escolher(lista[sel]); }
    else if (e.key === 'Escape') fechar();
  });
  box.addEventListener('mousedown', e => { const b = e.target.closest('[data-ci]'); if (b) { e.preventDefault(); escolher(lista[+b.dataset.ci]); } });
}

function escolherPaletizacao() {
  const pz = S.ed.d.paletizacao;
  modal({
    titulo: 'Paletização', tamanho: 'sm',
    corpo: `<p class="muted small" style="margin:0 0 12px">Marque como a carga vai ser montada. Pode marcar mais de uma.</p><div class="opcoes">
      ${PALETIZACAO.map(o => `<label class="opc"><input type="checkbox" value="${esc(o)}"${pz.opcoes.includes(o) ? ' checked' : ''}><span>${esc(o)}</span></label>`).join('')}
      <label class="opc"><input type="checkbox" id="pz-outro"${pz.outros ? ' checked' : ''}><span>Outros…<small>Escreva a forma de paletização</small></span></label>
      <label class="fld${pz.outros ? '' : ' hidden'}" id="pz-outro-f"><span>Descreva</span><input id="pz-outro-t" value="${esc(pz.outros)}" placeholder="Ex.: Fitado com 4 fitas, separado por item" autocomplete="off"></label>
    </div>`,
    rodape: '<button type="button" class="btn" data-cancelar>Cancelar</button><button type="button" class="btn primary" data-ok>Aplicar</button>',
    aoAbrir: m => {
      const chk = m.$('#pz-outro');
      chk.onchange = () => { m.$('#pz-outro-f').classList.toggle('hidden', !chk.checked); if (chk.checked) m.$('#pz-outro-t').focus(); };
      m.$('[data-ok]').onclick = () => {
        pz.opcoes = m.$$('.opc input[value]').filter(x => x.checked).map(x => x.value);
        pz.outros = chk.checked ? m.$('#pz-outro-t').value.trim() : '';
        desenharPaletizacao(); sujar(); m.fechar();
      };
    },
  });
}

async function salvarProposta(btn, silencioso) {
  const ed = S.ed; if (!ed) return false;
  if (!ed.sujo && ed.id) return true;
  const d = ed.d;
  if (!d.numero || !d.ano) { toast('Informe o número e o ano da proposta.', 'erro'); return false; }
  if (d.versao === null || d.versao === undefined || d.versao < 0) d.versao = 0;
  const dup = S.db.propostas.find(p => p.id !== ed.id && p.ano === d.ano && p.numero === d.numero && p.versao === d.versao);
  if (dup) { toast(`Já existe a proposta ${codigo(d)}. Mude a versão ou o número.`, 'erro'); return false; }
  const { numero, ano, versao, status, ...dados } = d;
  const row = { numero, ano, versao, status: status || 'rascunho', cliente_nome: d.cliente.nome || null, total: totais(d).total, dados };
  ocupado(btn, true);
  try {
    let r;
    if (ed.id) { r = await S.api.atualizar('propostas', ed.id, row); S.db.propostas = S.db.propostas.map(p => (p.id === r.id ? r : p)); }
    else { r = await S.api.inserir('propostas', row); S.db.propostas.push(r); ed.id = r.id; }
    ed.hash = `#/proposta/${r.id}`;
    history.replaceState(null, '', ed.hash);
    ed.sujo = false;
    ocupado(btn, false); marcarSalvo(); atualizarContadores();
    guardarCliente(d.cliente);
    if (!silencioso) toast(`Proposta ${codigo(d)} salva.`);
    return true;
  } catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); return false; }
}

// guarda/atualiza o cliente no cadastro para puxar nas próximas propostas
async function guardarCliente(c) {
  if (!c || !String(c.nome || '').trim()) return;
  const ex = S.db.clientes.find(x => (digitos(c.cnpj) && digitos(x.cnpj) === digitos(c.cnpj)) || norm(x.nome) === norm(c.nome));
  const dados = Object.fromEntries(CAMPOS_CLI.map(k => [k, String(c[k] || '').trim()]));
  try {
    if (!ex) S.db.clientes.push(await S.api.inserir('clientes', dados));
    else {
      const patch = {}; CAMPOS_CLI.forEach(k => { if (dados[k] && dados[k] !== ex[k]) patch[k] = dados[k]; });
      if (Object.keys(patch).length) { const r = await S.api.atualizar('clientes', ex.id, patch); S.db.clientes = S.db.clientes.map(x => (x.id === r.id ? r : x)); }
    }
  } catch (e) { console.warn('Não foi possível guardar o cliente', e); }
}

/* ================================================================
   Folha A4 (PDF)
   ================================================================ */
function folhaHTML(d) {
  const t = totais(d), c = d.cliente, cond = d.condicoes, cod = codigo(d);
  const ori = ORIENTACOES.find(o => o.id === d.orientacao);
  const usados = new Set(d.itens.map(it => `${n0(it.gram)}|${n0(it.esp)}`));
  const linhasCli = [['Cliente', c.nome], ['CNPJ', c.cnpj], ['Contato', c.contato], ['I.E.', c.ie], ['Telefone', c.telefone], ['Endereço', c.endereco], ['E-mail', c.email], ['CEP', c.cep]];
  const desc = s => { const [a, ...r] = String(s || '').split('\n'); return `${esc(a)}${r.length ? `<small>${esc(r.join(' '))}</small>` : ''}`; };
  const pz = [...d.paletizacao.opcoes, ...(d.paletizacao.outros ? [d.paletizacao.outros] : [])];
  const pals = d.paletes.usar ? d.paletes.itens.filter(p => p.medida || p.quantidade || p.valor) : [];
  const temPal = pals.length || pz.length;
  return `<div class="folha">
    <header class="f-top">
      <div class="lg"><img src="assets/img/logo.png" alt="DelloPlast"></div>
      <div class="f-emp"><b>${esc(EMPRESA.razao)}</b><div class="cols">
        <span>${esc(EMPRESA.endereco)}</span><span><i>CNPJ</i>${esc(EMPRESA.cnpj)}</span>
        <span>${esc(EMPRESA.cidade)}</span><span><i>I.E.</i>${esc(EMPRESA.ie)}</span>
        <span><i>Fone</i>${esc(EMPRESA.fone)}</span><span><i>WhatsApp</i>${esc(EMPRESA.whatsapp)}</span>
        <span><a href="https://${EMPRESA.site}">${esc(EMPRESA.site)}</a></span><span><a href="mailto:${EMPRESA.email}">${esc(EMPRESA.email)}</a></span>
      </div></div>
      <div class="f-num"><div class="k">Proposta comercial</div><div class="n">Nº ${esc(cod)}</div><div class="d">Data <b>${fData(d.data)}</b></div></div>
    </header>

    <section>
      <div class="f-sec-t">Cliente</div>
      <div class="f-cli">${linhasCli.map(([k, val]) => `<div class="r"><i>${k}</i><b>${esc(val || '')}</b></div>`).join('')}</div>
    </section>

    <section>
      <div class="f-sec-t">Itens da proposta</div>
      <table class="f-itens">
        <colgroup><col style="width:23mm"><col style="width:15mm"><col style="width:7mm"><col style="width:24mm"><col style="width:14mm"><col style="width:11mm"><col style="width:10mm"><col style="width:10mm"><col style="width:7mm"><col style="width:9mm"><col style="width:15mm"><col style="width:11mm"><col style="width:10mm"><col style="width:22mm"></colgroup>
        <thead>
          <tr><th rowspan="2">Identificação</th><th rowspan="2">NCM</th><th rowspan="2">Un.</th><th rowspan="2">Descrição</th><th rowspan="2">Quant.</th><th rowspan="2">Cor</th><th colspan="3" class="g">Medidas (mm)</th><th rowspan="2">Gram.</th><th rowspan="2">Preço unit.</th><th rowspan="2">IPI</th><th rowspan="2">ICMS</th><th rowspan="2">Subtotal</th></tr>
          <tr><th class="g">Larg.</th><th class="g">Comp.</th><th class="g">Esp.</th></tr>
        </thead>
        <tbody>${d.itens.map(it => {
          const x = calcItem(it);
          return `<tr>
            <td class="tl idn">${esc(it.identificacao)}</td><td>${esc(it.ncm)}</td><td>${esc(it.unidade)}</td><td class="desc">${desc(it.descricao)}</td>
            <td class="tr">${nf(n0(it.quantidade))}</td><td>${esc(it.cor)}</td>
            <td>${nf(n0(it.larg))}</td><td>${nf(n0(it.comp))}</td><td>${fmtSpec(it.esp, '1,2')}</td><td>${nf(n0(it.gram))}</td>
            <td class="tr"><span class="rs">R$</span>${nf(x.preco, 2, 2)}</td><td>${fPct(it.ipi)}</td><td>${fPct(it.icms)}</td>
            <td class="tr sub"><span class="rs">R$</span>${nf(x.subtotal, 2, 2)}</td></tr>`;
        }).join('')}</tbody>
      </table>
    </section>

    <div class="f-meio">
      <div class="f-esq"><div class="f-avisos">${AVISOS.map(a => `<p>${esc(a)}</p>`).join('')}</div>
        <div class="f-box b-tol"><h4>Tolerâncias</h4><div class="f-tol">${TOLERANCIAS.map(([a, b]) => `<b>${a}</b><span>${b}</span>`).join('')}</div></div></div>
      <div class="f-tot">
        <div class="l"><span>Valor dos produtos</span><b>${fMoeda(t.produtos)}</b></div>
        <div class="l"><span>Valor ICMS (${esc(String(cond.icms_modo).toLowerCase())})</span><b>${fMoeda(t.icms)}</b></div>
        <div class="l"><span>Valor IPI</span><b>${fMoeda(t.ipi)}</b></div>
        <div class="l"><span>Valor ICMS (ST)</span><b>${t.st ? fMoeda(t.st) : 'R$ –'}</b></div>
        ${t.palCobrado ? `<div class="l"><span>Paletes</span><b>${fMoeda(t.palCobrado)}</b></div>` : ''}
        <div class="l fim"><span>Valor total</span><b>${fMoeda(t.total)}</b></div>
      </div>
    </div>

    <div class="f-grid${ori ? '' : ' sem-ori'}">
      <div class="f-box b-cond"><h4>Condições gerais</h4><div class="f-kv">
        <i>Finalidade</i><b>${esc(cond.finalidade)}</b>
        <i>ICMS</i><b>${fPct(cond.icms)}<small>${esc(cond.icms_modo)}</small></b>
        <i>IPI</i><b>${fPct(cond.ipi)}<small>${esc(cond.ipi_modo)}</small></b>
        <i>PIS</i><b>${nf(n0(cond.pis), 2, 2)}%</b>
        <i>COFINS</i><b>${nf(n0(cond.cofins), 2, 2)}%</b>
        <i>Cond. de pagto.</i><b>${esc(cond.pagamento)}</b>
        <i>Prazo de entrega</i><b>${esc(cond.prazo)}</b>
        <i>Frete</i><b>${esc(cond.frete)}</b>
        <i>Validade</i><b>${esc(cond.validade)}</b>
      </div></div>
      ${ori ? `<div class="f-box b-ori"><h4>Orientação da chapa</h4><div class="f-ori"><img src="${ori.img}" alt="Orientação da chapa"></div></div>` : ''}
      <div class="f-box b-gram"><h4>Tabela de gramaturas</h4>
        <table class="f-gram"><thead><tr><th rowspan="2">g/m²</th><th colspan="${ESPESSURAS.length}">Espessura (mm)</th></tr><tr>${ESPESSURAS.map(e => `<th>${nf(e, 1, 1)}</th>`).join('')}</tr></thead>
        <tbody>${Object.entries(TAB_GRAM).map(([g, es]) => `<tr><th>${g}</th>${ESPESSURAS.map(e => `<td class="${es.includes(e) ? 'on' : ''}${es.includes(e) && usados.has(`${g}|${e}`) ? ' hl' : ''}"></td>`).join('')}</tr>`).join('')}</tbody>
        ${[...usados].some(u => { const [g, e] = u.split('|').map(Number); return (TAB_GRAM[g] || []).includes(e); }) ? '<caption>Em amarelo: gramatura e espessura desta proposta.</caption>' : ''}</table>
      </div>
      ${temPal ? `<div class="f-box full"><h4>Paletes e paletização</h4>
        ${pals.length ? `<table class="f-pal"><thead><tr><th>Medida</th><th class="tr">Quant.</th><th class="tr">Valor unit.</th><th>Retornável</th><th class="tr">Total</th></tr></thead><tbody>
          ${pals.map(p => `<tr><td>${esc(p.medida)}</td><td class="tr">${nf(n0(p.quantidade))}</td><td class="tr">${fMoeda(p.valor)}</td>
            <td>${p.retorna ? 'Sim, cobrado apenas se não houver devolução' : 'Não'}</td><td class="tr"><b>${fMoeda(n0(p.quantidade) * n0(p.valor))}</b></td></tr>`).join('')}
        </tbody></table>` : ''}
        ${pz.length ? `<div class="f-pz"><span class="k">Paletização:</span>${pz.map(o => `<span>${esc(o)}</span>`).join('')}</div>` : ''}
      </div>` : ''}
      ${String(d.observacao || '').trim() ? `<div class="f-box full"><h4>Observações</h4><div class="f-obs">${esc(d.observacao.trim())}</div></div>` : ''}
    </div>

    <footer class="f-rodape">
      <div><span class="k">Orçamento emitido por</span><b>${esc(d.emissor.nome)}</b></div>
      <div><span class="k">E-mail</span><a href="mailto:${esc(d.emissor.email)}">${esc(d.emissor.email)}</a></div>
      <div><span class="k">Data</span><b>${fData(d.data)}</b></div>
    </footer>
  </div>`;
}

const nomeArquivo = d => `Proposta ${codigo(d)} - ${String(d.cliente.nome || 'cliente').replace(/[\\/:*?"<>|]+/g, ' ').trim()}`;

function abrirPreview(d) {
  const bg = document.createElement('div');
  bg.className = 'prev-bg';
  bg.innerHTML = `<div class="prev-bar">
      <div class="t"><b>Proposta ${esc(codigo(d))}</b><small>${esc(d.cliente.nome || 'Sem cliente')} · ${fMoeda(totais(d).total)}</small></div>
      <button type="button" class="btn" data-x>${ic('x')}Fechar</button>
      <button type="button" class="btn primary" data-print>${ic('download')}Baixar PDF</button>
    </div>
    <div class="prev-scroll"><p class="prev-dica">Ao clicar em “Baixar PDF”, escolha <b>Salvar como PDF</b> no destino da impressão.</p>${folhaHTML(d)}</div>`;
  document.body.append(bg);
  document.body.style.overflow = 'hidden';
  const ajustar = () => {
    const f = $('.folha', bg), w = $('.prev-scroll', bg).clientWidth - 16;
    f.style.zoom = ''; const fw = f.offsetWidth; if (fw > w) f.style.zoom = String(w / fw);
  };
  ajustar(); window.addEventListener('resize', ajustar);
  const fechar = () => { bg.remove(); document.body.style.overflow = ''; window.removeEventListener('resize', ajustar); document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape' && !$('.modal-bg')) fechar(); };
  document.addEventListener('keydown', onKey);
  $('[data-x]', bg).onclick = fechar;
  $('[data-print]', bg).onclick = () => imprimir(d);
}

async function imprimir(d) {
  let box = $('#impressao');
  if (!box) { box = document.createElement('div'); box.id = 'impressao'; document.body.append(box); }
  box.innerHTML = folhaHTML(d);
  await Promise.all($$('img', box).map(i => (i.decode ? i.decode().catch(() => {}) : null)));
  const tituloAntes = document.title;
  document.title = nomeArquivo(d);
  const fim = () => { document.title = tituloAntes; box.innerHTML = ''; window.removeEventListener('afterprint', fim); };
  window.addEventListener('afterprint', fim);
  window.print();
}

/* ================================================================
   Clientes
   ================================================================ */
function pgClientes(v) {
  setPage('Clientes', 'Cadastrados automaticamente ao salvar uma proposta', `<button type="button" class="btn primary" data-ac="novo-cli">${ic('plus')}<span>Novo cliente</span></button>`);
  v.innerHTML = `<div class="card"><div class="toolbar"><div class="busca">${ic('search')}<input class="inp" id="qc" placeholder="Pesquisar nome, CNPJ, contato ou cidade…" value="${esc(S.filtroCli)}" autocomplete="off"></div></div><div id="lista-cli"></div></div>`;
  const doCliente = c => S.db.propostas.filter(p => { const x = (p.dados || {}).cliente || {}; return (digitos(c.cnpj) && digitos(x.cnpj) === digitos(c.cnpj)) || norm(x.nome) === norm(c.nome); });
  const desenhar = () => {
    const q = norm(S.filtroCli), qd = digitos(S.filtroCli);
    const lista = S.db.clientes.filter(c => !q || norm([c.nome, c.contato, c.endereco, c.email].join(' ')).includes(q) || (qd.length >= 3 && digitos(c.cnpj).includes(qd)))
      .sort((a, b) => norm(a.nome).localeCompare(norm(b.nome)));
    $('#lista-cli').innerHTML = lista.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Cliente</th><th>CNPJ</th><th>Contato</th><th>Telefone</th><th>Propostas</th><th></th></tr></thead><tbody>
      ${lista.map(c => { const ps = doCliente(c); return `<tr>
        <td class="cli full" data-l="Cliente"><b>${esc(c.nome)}</b><small>${esc([c.endereco, c.email].filter(Boolean).join(' · '))}</small></td>
        <td data-l="CNPJ" class="nowrap">${esc(c.cnpj)}</td><td data-l="Contato">${esc(c.contato)}</td><td data-l="Telefone" class="nowrap">${esc(c.telefone)}</td>
        <td data-l="Propostas">${ps.length ? `${ps.length} · <span class="muted">${fMoeda(ps.filter(ehUltima).reduce((s, p) => s + n0(p.total), 0))}</span>` : '<span class="muted">—</span>'}</td>
        <td class="c-acts"><div class="acts">
          <button type="button" class="icon-btn" data-ac="prop-cli" data-id="${c.id}" title="Nova proposta para este cliente">${ic('plus')}</button>
          <button type="button" class="icon-btn" data-ac="ed-cli" data-id="${c.id}" title="Editar">${ic('edit')}</button>
          <button type="button" class="icon-btn danger" data-ac="del-cli" data-id="${c.id}" title="Excluir">${ic('trash')}</button>
        </div></td></tr>`; }).join('')}</tbody></table></div>`
      : `<div class="vazio">${ic('users')}<b>${S.db.clientes.length ? 'Nada encontrado' : 'Nenhum cliente ainda'}</b>${S.db.clientes.length ? 'Tente outra pesquisa.' : 'Eles aparecem aqui quando você salva uma proposta.'}</div>`;
  };
  desenhar();
  $('#qc').addEventListener('input', e => { S.filtroCli = e.target.value; desenhar(); });
  const clique = async e => {
    const b = e.target.closest('[data-ac]'); if (!b) return;
    const c = S.db.clientes.find(x => x.id === b.dataset.id);
    if (b.dataset.ac === 'novo-cli') formCliente(null, desenhar);
    else if (b.dataset.ac === 'ed-cli') formCliente(c, desenhar);
    else if (b.dataset.ac === 'prop-cli') {
      const d = novaBase(); d.ano = new Date().getFullYear(); d.numero = proximoNumero(d.ano); d.versao = 0; d.status = 'rascunho';
      d.cliente = Object.fromEntries(CAMPOS_CLI.map(k => [k, c[k] || ''])); d.itens = [novoItem({ ipi: d.condicoes.ipi, icms: d.condicoes.icms })];
      S.edPendente = d; location.hash = '#/proposta/nova';
    } else if (b.dataset.ac === 'del-cli') {
      if (!await confirmar(`Excluir <b>${esc(c.nome)}</b> do cadastro? As propostas já feitas continuam guardadas.`)) return;
      try { await S.api.excluir('clientes', c.id); S.db.clientes = S.db.clientes.filter(x => x.id !== c.id); toast('Cliente excluído.'); desenhar(); }
      catch (err) { toast(msgErro(err), 'erro'); }
    }
  };
  v.onclick = clique; $('#pg-acao').onclick = clique;
}

function formCliente(c, depois) {
  const x = c || Object.fromEntries(CAMPOS_CLI.map(k => [k, '']));
  const f = (k, rot, cls = '', ph = '') => `<label class="fld ${cls}"><span>${rot}</span><input name="${k}" value="${esc(x[k])}" placeholder="${esc(ph)}" autocomplete="off"></label>`;
  modal({
    titulo: c ? 'Editar cliente' : 'Novo cliente',
    corpo: `<form class="grid2" id="fcli">${f('nome', 'Cliente (razão social)', 'full')}${f('cnpj', 'CNPJ', '', '00.000.000/0000-00')}${f('ie', 'Inscrição estadual')}${f('contato', 'Contato')}${f('telefone', 'Telefone')}${f('email', 'E-mail', 'full')}${f('endereco', 'Endereço / cidade')}${f('cep', 'CEP')}</form>`,
    rodape: '<button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" form="fcli" class="btn primary">Salvar</button>',
    aoAbrir: m => m.$('#fcli').addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const dados = Object.fromEntries(CAMPOS_CLI.map(k => [k, String(fd.get(k) || '').trim()]));
      if (!dados.nome) return toast('Informe o nome do cliente.', 'erro');
      const btn = m.$('.btn.primary'); ocupado(btn, true);
      try {
        if (c) { const r = await S.api.atualizar('clientes', c.id, dados); S.db.clientes = S.db.clientes.map(y => (y.id === r.id ? r : y)); }
        else S.db.clientes.push(await S.api.inserir('clientes', dados));
        m.fechar(); toast('Cliente salvo.'); depois && depois();
      } catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
    }),
  });
}

/* ================================================================
   Padrões (configurações)
   ================================================================ */
function pgAjustes(v) {
  setPage('Padrões', 'Valores que já vêm preenchidos em toda proposta nova');
  const P = padroes(), c = P.condicoes, it = P.item;
  const f = (n, rot, val, o = {}) => `<label class="fld ${o.cls || ''}"><span>${rot}</span>${o.pre ? `<span class="pre">${o.pre}</span>` : ''}${o.suf ? `<span class="suf">${o.suf}</span>` : ''}<input name="${n}" value="${esc(val ?? '')}"${o.num ? ` data-num="${o.num}" inputmode="decimal" class="n${o.pre ? ' has-pre' : ''}${o.suf ? ' has-suf' : ''}"` : ''}${o.list ? ` list="${o.list}"` : ''} autocomplete="off"></label>`;
  const fn = (n, rot, val, spec, o = {}) => f(n, rot, fmtSpec(val, spec), { ...o, num: spec });
  v.innerHTML = `<datalist id="dl-pag">${PAGAMENTOS.map(x => `<option value="${x}">`).join('')}</datalist><datalist id="dl-cores">${CORES.map(x => `<option value="${x}">`).join('')}</datalist>
  <form id="faj" class="aj-grid">
    <div style="display:flex;flex-direction:column;gap:20px">
      <section class="card"><div class="card-h"><h3>Quem emite</h3><span class="sub">Rodapé do PDF</span></div><div class="card-b"><div class="grid2">
        ${f('emissor.nome', 'Nome', P.emissor.nome)}${f('emissor.email', 'E-mail', P.emissor.email)}</div></div></section>
      <section class="card"><div class="card-h"><h3>Numeração</h3></div><div class="card-b"><div class="grid2">
        ${fn('numero_inicial', 'Começar a contar a partir de', P.numero_inicial, 'i')}
        <div class="fld"><span>Próxima proposta</span><div class="aviso" style="height:40px;align-items:center">${ic('info')}<span>${proximoNumero(new Date().getFullYear())}_${String(new Date().getFullYear()).slice(-2)}_V0</span></div></div>
      </div><p class="muted small" style="margin:10px 0 0">O sistema usa o maior entre este número e o último número salvo + 1.</p></div></section>
      <section class="card"><div class="card-h"><h3>Item novo</h3></div><div class="card-b"><div class="grid3">
        ${f('item.ncm', 'NCM', it.ncm)}${f('item.unidade', 'Unidade', it.unidade)}${f('item.cor', 'Cor', it.cor, { list: 'dl-cores' })}
        ${fn('item.esp', 'Espessura (mm)', it.esp, '1,2')}${fn('item.gram', 'Gramatura (g/m²)', it.gram, '0')}${fn('item.preco_kg', 'R$ / kg', it.preco_kg, '2,4', { pre: 'R$' })}
      </div></div></section>
    </div>
    <div style="display:flex;flex-direction:column;gap:20px">
      <section class="card"><div class="card-h"><h3>Condições gerais</h3></div><div class="card-b"><div class="grid2">
        ${f('condicoes.finalidade', 'Finalidade', c.finalidade)}${f('condicoes.frete', 'Frete', c.frete)}
        ${fn('condicoes.icms', 'ICMS', c.icms, '0,2', { suf: '%' })}${f('condicoes.icms_modo', 'ICMS (Incluso / Adicional)', c.icms_modo)}
        ${fn('condicoes.ipi', 'IPI', c.ipi, '0,2', { suf: '%' })}${f('condicoes.ipi_modo', 'IPI (Adicional / Incluso)', c.ipi_modo)}
        ${fn('condicoes.pis', 'PIS', c.pis, '2', { suf: '%' })}${fn('condicoes.cofins', 'COFINS', c.cofins, '2', { suf: '%' })}
        ${f('condicoes.pagamento', 'Condição de pagamento', c.pagamento, { list: 'dl-pag' })}${f('condicoes.prazo', 'Prazo de entrega', c.prazo)}
        ${f('condicoes.validade', 'Validade da proposta', c.validade, { cls: 'full' })}
      </div></div></section>
      <section class="card"><div class="card-h"><h3>Observação padrão</h3></div><div class="card-b"><label class="fld"><textarea name="observacao" rows="3" placeholder="Opcional">${esc(P.observacao)}</textarea></label></div></section>
      <div style="display:flex;justify-content:flex-end"><button type="submit" class="btn primary">${ic('save')}Salvar padrões</button></div>
    </div>
  </form>`;
  $('#faj').addEventListener('focusout', e => { const el = e.target; if (el.dataset.num !== undefined) { const n = parseNum(el.value); el.value = fmtSpec(n, el.dataset.num); } });
  $('#faj').addEventListener('submit', async e => {
    e.preventDefault();
    const out = {};
    $$('#faj [name]').forEach(el => setP(out, el.name, el.dataset.num !== undefined ? parseNum(el.value) : el.value.trim()));
    out.condicoes.icms_modo = /adic/i.test(out.condicoes.icms_modo) ? 'Adicional' : 'Incluso';
    out.condicoes.ipi_modo = /incl/i.test(out.condicoes.ipi_modo) ? 'Incluso' : 'Adicional';
    out.numero_inicial = Math.round(n0(out.numero_inicial)) || PADROES.numero_inicial;
    const btn = $('#faj [type=submit]'); ocupado(btn, true);
    try {
      const r = await S.api.salvarConfig('padroes', out);
      S.db.config = [...S.db.config.filter(x => x.id !== 'padroes'), r];
      ocupado(btn, false); toast('Padrões salvos.'); pgAjustes(v);
    } catch (err) { ocupado(btn, false); toast(msgErro(err), 'erro'); }
  });
}

/* ================================================================
   Início do app
   ================================================================ */
async function carregarTudo() {
  const r = await Promise.all(TABS.map(t => S.api.listar(t)));
  TABS.forEach((t, i) => { S.db[t] = r[i]; });
  S.db.propostas.forEach(p => { p.numero = +p.numero; p.ano = +p.ano; p.versao = +p.versao; p.total = +p.total; p.dados = p.dados || {}; });
  S.carregadoEm = Date.now();
}

async function iniciar(sess) {
  if (S.iniciando || (S.user && S.user.id === sess.user.id && $('.shell'))) return;
  S.iniciando = true;
  S.user = sess.user;
  root.innerHTML = '<div class="boot"><img class="logo-claro" src="assets/img/logo.png" alt="DelloPlast"><img class="logo-escuro" src="assets/img/logo-branco.png" alt=""><div class="spinner"></div></div>';
  try {
    if (!await S.api.liberado()) {
      S.iniciando = false;
      root.innerHTML = `<div class="boot"><img class="logo-claro" src="assets/img/logo.png" alt="DelloPlast"><img class="logo-escuro" src="assets/img/logo-branco.png" alt="">
        <div class="aviso erro" style="max-width:440px">${ic('alert')}<span>O e-mail <b>${esc(sess.user.email || '')}</b> não tem acesso ao sistema de propostas. Peça para liberarem o seu e-mail.</span></div>
        <button class="btn" id="sair-sem-acesso">${ic('logout')}Sair</button></div>`;
      $('#sair-sem-acesso').onclick = async () => { await S.api.sair(); S.user = null; renderAuth(); };
      return;
    }
    await carregarTudo();
  }
  catch (e) {
    S.iniciando = false;
    root.innerHTML = `<div class="boot"><div class="aviso erro" style="max-width:420px">${ic('alert')}<span>Não foi possível carregar os dados: ${esc(msgErro(e))}</span></div><button class="btn primary" id="recarregar">Tentar de novo</button></div>`;
    $('#recarregar').onclick = () => location.reload();
    return;
  }
  S.iniciando = false;
  renderShell();
  window.onhashchange = route;
  route();
}

async function boot() {
  try { S.api = DEMO ? DemoAPI() : SupaAPI(); }
  catch (e) { root.innerHTML = `<div class="boot"><div class="aviso erro">${ic('alert')}<span>Falha ao iniciar: ${esc(msgErro(e))}</span></div></div>`; return; }
  S.api.aoMudarAuth((ev, sess) => {
    if (ev === 'PASSWORD_RECOVERY') { if (sess && !S.user) iniciar(sess).then(pedirNovaSenha); else pedirNovaSenha(); }
    else if (ev === 'SIGNED_OUT') { S.user = null; renderAuth(); }
    else if (ev === 'SIGNED_IN' && sess && !S.user && !S.iniciando) iniciar(sess);
  });
  let sess = null;
  try { sess = await S.api.sessao(); } catch (e) { /* sem sessão */ }
  if (sess) iniciar(sess); else renderAuth();
}

// recarrega os dados quando a aba volta a ficar visível (ex.: proposta feita em outro computador)
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState !== 'visible' || !S.user || !$('.shell') || S.api.demo) return;
  if (Date.now() - S.carregadoEm < 2 * 60e3 || $('.modal-bg') || $('.prev-bg') || S.ed) return;
  try { await carregarTudo(); route(); } catch (e) { /* tenta depois */ }
});

boot();
})();

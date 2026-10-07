document.documentElement.dataset.theme=localStorage.getItem('pj_theme')||'';
const DIAS=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const ORDEN=[1,2,3,4,5,6,0];
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let DB={casas:[],hermanos:[]},SHA=null;

const cfg=()=>{
  let g={owner:'',repo:'',branch:'main',path:'data.json'};
  if(location.hostname.endsWith('.github.io')){g.owner=location.hostname.split('.')[0];g.repo=location.pathname.split('/')[1]||'';}
  let s={};try{s=JSON.parse(localStorage.getItem('pj_cfg')||'{}');}catch{}
  return {...g,...s};
};

async function load(){
  const c=cfg();
  try{
    if(c.token&&c.owner&&c.repo){
      const r=await fetch(`https://api.github.com/repos/${c.owner}/${c.repo}/contents/${c.path}?ref=${c.branch}`,{headers:{Authorization:'Bearer '+c.token}});
      if(r.ok){const j=await r.json();SHA=j.sha;DB=JSON.parse(decodeURIComponent(escape(atob(j.content.replace(/\n/g,'')))));return DB;}
    }
    DB=await (await fetch('data.json?'+Date.now())).json();
  }catch(e){console.error(e);}
  return DB;
}

async function save(msg='Actualiza casas y hermanos'){
  const c=cfg();
  if(!c.token)throw new Error('Falta el token de GitHub (⚙️ Ajustes de guardado)');
  const body={message:msg,branch:c.branch,content:btoa(unescape(encodeURIComponent(JSON.stringify(DB,null,2))))};
  if(SHA)body.sha=SHA;
  const r=await fetch(`https://api.github.com/repos/${c.owner}/${c.repo}/contents/${c.path}`,{method:'PUT',headers:{Authorization:'Bearer '+c.token,'Content-Type':'application/json'},body:JSON.stringify(body)});
  const j=await r.json();
  if(!r.ok)throw new Error(j.message);
  SHA=j.content.sha;
}

function shell(active){
  document.head.insertAdjacentHTML('beforeend',`<meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name=theme-color content="#1B6B5B" media="(prefers-color-scheme: light)"><meta name=theme-color content="#101412" media="(prefers-color-scheme: dark)"><meta name=apple-mobile-web-app-capable content=yes><meta name=apple-mobile-web-app-title content=Curauma>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%231B6B5B'/%3E%3Ctext x='16' y='21' text-anchor='middle' font-family='Georgia,serif' font-size='13' font-weight='700' fill='white'%3ECC%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{
 --bg:#F5F4F0;--card:#FFFEFB;--ink:#1A221E;--soft:#4A544E;--line:#E4E6DF;--fill:#F0F1EC;
 --brand:#1B6B5B;--brand-2:#145247;--brand-bg:#D8EDE6;--on-brand:#fff;
 --bad:#B33A2E;--bad-bg:#F9E6E2;--gold:#A87B2E;--gold-bg:#F4E8CC;
 --shadow:0 1px 2px rgba(20,30,25,.04),0 6px 20px -10px rgba(20,30,25,.1);
 --r:12px;--serif:'Fraunces',Georgia,serif;--mono:'IBM Plex Mono',ui-monospace,monospace}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){
 --bg:#101412;--card:#181D1A;--ink:#EAEDEA;--soft:#A8B2AB;--line:#2A312C;--fill:#222925;
 --brand:#4BB89F;--brand-2:#6AC4B0;--brand-bg:#1C302B;--on-brand:#0A1411;
 --gold:#D0A44E;--gold-bg:#372C14;--bad:#E17A6E;--bad-bg:#382320;
 --shadow:0 1px 2px rgba(0,0,0,.35),0 8px 24px -12px rgba(0,0,0,.55)}}
:root[data-theme="dark"]{
 --bg:#101412;--card:#181D1A;--ink:#EAEDEA;--soft:#A8B2AB;--line:#2A312C;--fill:#222925;
 --brand:#4BB89F;--brand-2:#6AC4B0;--brand-bg:#1C302B;--on-brand:#0A1411;
 --gold:#D0A44E;--gold-bg:#372C14;--bad:#E17A6E;--bad-bg:#382320;
 --shadow:0 1px 2px rgba(0,0,0,.35),0 8px 24px -12px rgba(0,0,0,.55)}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:72px}
body{margin:0;background:var(--bg);color:var(--ink);font:14.5px/1.55 Inter,system-ui,-apple-system,'Segoe UI',sans-serif;font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased}
[hidden]{display:none!important}
.skip{position:absolute;left:-999px}.skip:focus{left:12px;top:12px;z-index:100;background:var(--card);padding:8px 12px;border-radius:8px}

/* ---- Top bar ---- */
header.top{position:sticky;top:0;z-index:40;background:color-mix(in srgb,var(--bg) 90%,transparent);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);padding-top:env(safe-area-inset-top,0px)}
.top-in{max-width:1080px;margin:0 auto;display:flex;align-items:center;gap:10px;padding:11px 22px}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;white-space:nowrap;color:var(--ink);text-decoration:none}
.brand span:last-child{font-family:var(--serif);font-size:15.5px;letter-spacing:-.01em}
.logo{width:28px;height:28px;border-radius:8px;background:var(--brand);color:var(--on-brand);display:grid;place-items:center;font:600 11px var(--serif)}
nav{display:flex;gap:2px;margin-left:auto}
nav a{padding:6px 11px;border-radius:8px;color:var(--soft);text-decoration:none;font-weight:500;font-size:13px;white-space:nowrap;transition:color .15s,background .15s}
nav a:hover{color:var(--ink);background:var(--fill)}
nav a[aria-current="true"]{background:var(--brand-bg);color:var(--brand);font-weight:600}
.icon-btn{flex:none;height:34px;min-width:34px;border-radius:9px;border:1px solid var(--line);background:var(--card);color:var(--ink);cursor:pointer;font-size:15px;padding:0 10px;display:inline-flex;align-items:center;gap:6px;transition:border-color .2s}
.icon-btn:hover{border-color:var(--brand)}
.theme-btn-label{font-size:12px;font-weight:600}
@media(max-width:700px){.theme-btn-label,.brand span:last-child{display:none}}

/* ---- Layout ---- */
main{max-width:1080px;margin:0 auto;padding:32px 22px 80px}
body:has(#editBar:not([hidden])) main{padding-bottom:140px}
.map{display:block;width:100%;height:min(55vh,460px);border:0;border-bottom:1px solid var(--line)}
.hero{margin-bottom:28px;padding-bottom:8px;animation:rise .5s both}
.eyebrow{display:flex;align-items:center;gap:9px;margin:0 0 10px;font:600 11px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--brand)}
.eyebrow::before{content:'';width:18px;height:1.5px;border-radius:1px;background:currentColor}
h1{font:600 clamp(32px,5.5vw,48px)/1.08 var(--serif);letter-spacing:-.03em;margin:0 0 8px;color:var(--ink)}
h1 em{font-style:italic;font-weight:500;color:var(--brand)}
h2{font:600 20px/1.25 var(--serif);letter-spacing:-.015em;margin:0 0 3px;color:var(--ink)}
h3{font:600 12px/1.2 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--soft);margin:18px 0 6px}
.sub,.hint{color:var(--soft);font-size:13px;margin:0 0 16px;line-height:1.45}
.hero .sub{font-size:15px;max-width:48ch;margin:0}
small{color:var(--soft)}
.card{min-width:0;background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:20px 22px;box-shadow:var(--shadow);margin-bottom:18px;animation:rise .5s both}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:18px}
.badge{background:var(--brand-bg);color:var(--brand);border-radius:99px;padding:2px 10px;font:600 12px var(--mono);vertical-align:middle;margin-left:4px}
.sp{flex:1}.mut{color:var(--soft)}

/* ---- Forms ---- */
input:not([type=checkbox]):not([type=radio]),select,textarea{font:inherit;font-size:13px;color:var(--ink);background:var(--card);border:1px solid var(--line);border-radius:9px;padding:8px 11px;max-width:100%;transition:border-color .15s,box-shadow .15s}
input:focus,select:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-bg)}
input[type=search]{width:100%;margin:4px 0 8px;font-size:14px}
input[type=checkbox]{accent-color:var(--brand);width:15px;height:15px}
.chk{display:inline-flex;gap:6px;align-items:center;font-size:13px;cursor:pointer}
form{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 12px}
label.chk span{color:var(--ink)}

/* ---- Buttons ---- */
button,.btn{font:inherit;font-size:13px;font-weight:600;padding:8px 13px;border-radius:9px;border:1px solid var(--line);background:var(--card);color:var(--ink);cursor:pointer;transition:background .15s,border-color .15s}
button:hover{border-color:color-mix(in srgb,var(--ink) 40%,var(--line))}
button:active{transform:scale(.98)}
button.pri{background:var(--brand);border-color:var(--brand);color:var(--on-brand)}
button.pri:hover{background:var(--brand-2);border-color:var(--brand-2)}
button.ghost{background:transparent}
button.danger{color:var(--bad);border-color:color-mix(in srgb,var(--bad) 40%,var(--line));background:transparent}
button.small,button.mini{padding:4px 9px;font-size:12px}
button.mini{margin-top:6px;color:var(--soft);font-weight:500}
button[aria-pressed="true"]{background:var(--brand);border-color:var(--brand);color:var(--on-brand)}
button:disabled{opacity:.45;cursor:not-allowed;transform:none}
button:focus-visible,.icon-btn:focus-visible,nav a:focus-visible,.chip:focus-visible,select:focus-visible,input:focus-visible,summary:focus-visible{outline:2px solid var(--brand);outline-offset:2px}

/* ---- Chips y filtros ---- */
.frow{display:flex;gap:10px;align-items:flex-start;margin:6px 0}.frow .fl{margin:0}
.fl-l{flex:0 0 54px;font:600 10.5px var(--mono);text-transform:uppercase;letter-spacing:.08em;color:var(--soft);padding-top:8px}
.fl{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
.chip{display:inline-block;padding:5px 12px;border:1px solid var(--line);border-radius:99px;font-size:12.5px;font-weight:600;cursor:pointer;color:var(--soft);background:var(--card);user-select:none;transition:border-color .15s,color .15s}
.chip:hover{border-color:var(--brand);color:var(--ink)}
.chip.on{background:var(--brand-bg);border-color:var(--brand);color:var(--brand)}
.vbar{background:var(--fill);border:1px solid var(--line);border-radius:10px;padding:4px 12px;margin:6px 0 4px}

/* ---- Casas ---- */
.cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;margin-top:12px;align-items:start}
.cc{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:8px;box-shadow:var(--shadow);transition:border-color .15s}
.cc:hover{border-color:var(--brand)}
.cc b{font-size:15.5px;font-weight:600;line-height:1.25}
.ad{font-size:13px;color:var(--soft)}
.tag{display:inline-block;font-size:11px;font-weight:600;padding:2px 9px;border-radius:99px;background:var(--fill);color:var(--soft);align-self:flex-start}
.tag.acc,.tag.active{background:var(--brand-bg);color:var(--brand)}
.tag.am{background:var(--gold-bg);color:var(--gold)}.tag.pm{background:var(--brand-bg);color:var(--brand)}
.cc.off>b,.cc.off>.ad,.cc.off>.tag{opacity:.5}
.sw{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--soft);cursor:pointer;margin-top:2px;position:relative}
.sw input{position:absolute;opacity:0;width:0;height:0}
.sw i{width:36px;height:20px;border-radius:10px;background:var(--line);position:relative;transition:background .15s;flex:none}
.sw i::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .15s}
.sw input:checked+i{background:var(--brand)}
.sw input:checked+i::after{transform:translateX(16px)}
.sw input:focus-visible+i{outline:2px solid var(--brand);outline-offset:2px}

/* ---- Varones ---- */
.vgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px;margin-top:12px}
.vm{background:var(--card);border:1px solid var(--line);border-radius:10px;box-shadow:var(--shadow);padding:14px 16px;display:flex;flex-direction:column;gap:12px;transition:border-color .15s}
.vm:hover{border-color:var(--brand)}
.vm .vt{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;justify-content:space-between}
.vm .vn{font-size:15.5px;font-weight:600;line-height:1.25}
.vm .vf{display:flex;flex-wrap:wrap;gap:8px 10px;align-items:center;justify-content:space-between;border-top:1px dashed var(--line);padding-top:10px}
.vm .vj{display:flex;flex-wrap:wrap;gap:6px}
.lb{display:block;font:600 10.5px var(--mono);text-transform:uppercase;letter-spacing:.08em;color:var(--soft);margin-bottom:6px}
.wkd{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.dd{text-align:center;padding:6px 0;border-radius:8px;font:600 11.5px var(--mono);border:1px solid transparent;background:var(--fill);color:var(--soft);opacity:.7}
.dd.on{opacity:1;background:var(--brand);border-color:var(--brand);color:var(--on-brand)}
.dd.sel{outline:2px solid var(--ink);outline-offset:1px}
.wsum{font-size:12px;color:var(--soft);margin-top:7px}
.bd{display:inline-block;font-size:11.5px;font-weight:600;padding:3px 10px;border-radius:99px;border:1px solid var(--line);background:var(--fill);color:var(--ink);white-space:nowrap}
.rk-AN{background:var(--brand);border-color:var(--brand);color:var(--on-brand)}
.rk-SM{background:var(--brand-bg);border-color:transparent;color:var(--brand)}
.rk-PRE{background:transparent;border-color:var(--brand);color:var(--brand)}
.rk-PUB{background:transparent;color:var(--soft)}
.lg{font-size:12.5px;font-weight:600}.lg.si{color:var(--brand)}.lg.no{color:var(--soft)}

/* ---- Filas editables ---- */
.item{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:9px 12px;margin:6px 0;background:var(--fill);border-radius:10px}
.item>div:first-child{flex:1;min-width:180px}
.item .chip{padding:3px 9px;font-size:12px;margin-right:2px}

/* ---- Lista editable ---- */
.controls{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 10px}
.controls input[type=search]{flex:1 1 200px;width:auto;margin:0}
.count-note{color:var(--soft);font-size:12.5px;margin:0 0 10px}
.pagination{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin-top:14px}
.pg-info{color:var(--soft);font-size:12.5px}.pg-btns{display:flex;gap:6px}
.tj{display:flex;gap:4px;flex-wrap:wrap}
.etable{min-width:720px}
.etable td{vertical-align:middle;padding:10px 12px}
.etable td.nm b{display:block;font-weight:600}.etable td.nm small{font-size:12px}
.etable .chip{padding:3px 9px;font-size:12px;margin-right:0}
.etable tr.off td.nm,.etable tr.off td.dy{opacity:.55}
.etable .sw{margin:0}
@media screen and (max-width:680px){
 .table-wrap.e{border:0;background:transparent;overflow:visible}
 .etable{min-width:0;display:block}.etable thead{display:none}
 .etable tbody{display:flex;flex-direction:column;gap:10px}
 .etable tr{display:block;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:4px 14px;box-shadow:var(--shadow)}
 .etable tr:hover{background:var(--card)}
 .etable td{display:flex;justify-content:space-between;align-items:center;gap:12px;border:0;border-bottom:1px dashed var(--line);padding:9px 0}
 .etable td:last-child{border-bottom:0}
 .etable td::before{content:attr(data-label);font:700 10px var(--mono);text-transform:uppercase;letter-spacing:.06em;color:var(--soft);flex:none}
 .etable td.nm{display:block}.etable td.nm::before{content:none}
}

/* ---- Tabla ---- */
.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:10px;background:var(--card)}
table{border-collapse:collapse;width:100%;min-width:640px}
th,td{text-align:left;padding:11px 14px;border-bottom:1px solid var(--line);vertical-align:top}
th{background:var(--fill);font:600 10.5px var(--mono);text-transform:uppercase;letter-spacing:.07em;color:var(--soft);white-space:nowrap}
tbody tr{transition:background .12s}tbody tr:hover{background:var(--fill)}
tbody tr:last-child td{border-bottom:0}

/* ---- Barra de edición ---- */
.edit-bar{position:fixed;left:50%;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:45;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;width:max-content;max-width:calc(100% - 24px);background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px 12px;box-shadow:0 12px 36px -8px rgba(0,0,0,.25);animation:barin .35s cubic-bezier(.2,.8,.2,1)}
.save-status{font-size:12px;color:var(--soft)}.save-status:empty{display:none}
.save-status.ok{color:var(--brand)}.save-status.err{color:var(--bad)}
#saveBtn:not(:disabled),#sv:not(:disabled){animation:pulse 1.6s 3}

/* ---- Diálogo ---- */
dialog{background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:16px;padding:24px;width:min(440px,calc(100% - 32px));box-shadow:0 20px 50px -12px rgba(0,0,0,.35)}
dialog[open]{animation:pop .25s cubic-bezier(.2,.85,.3,1.1)}
dialog::backdrop{background:rgba(10,14,12,.48);backdrop-filter:blur(4px)}
dialog h3{margin:0 0 12px;font:600 18px/1.25 var(--serif);letter-spacing:-.015em;text-transform:none;color:var(--ink)}
.cfg-steps{margin:0 0 14px;padding-left:18px;font-size:12.5px;color:var(--soft);line-height:1.5}
.cfg-steps li{margin-bottom:4px}.cfg-steps b{color:var(--ink)}
.field{margin-bottom:13px}
.field>label{display:block;font-size:11px;font-weight:600;color:var(--soft);text-transform:uppercase;letter-spacing:.04em;margin-bottom:5px}
.field input{width:100%;background:var(--fill)}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.modal-actions{display:flex;align-items:center;gap:8px;margin-top:18px}
@media(max-width:420px){.field-row{grid-template-columns:1fr}}

/* ---- Pie ---- */
footer{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:32px;padding-top:16px;border-top:1px solid var(--line);color:var(--soft);font-size:12px}

/* ---- Toasts ---- */
.toast-wrap{position:fixed;left:50%;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:80;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none}
body:has(#editBar:not([hidden])) .toast-wrap{bottom:calc(84px + env(safe-area-inset-bottom,0px))}
.toast{pointer-events:auto;background:var(--ink);color:var(--bg);font-size:13px;font-weight:500;padding:10px 16px;border-radius:99px;box-shadow:0 12px 32px -8px rgba(0,0,0,.3);animation:toastin .22s cubic-bezier(.2,.85,.3,1.1)}
.toast.err{background:var(--bad);color:#fff}.toast.ok{background:var(--brand);color:var(--on-brand)}
.toast.out{animation:toastout .18s ease forwards}

@keyframes rise{from{opacity:0;transform:translateY(10px)}}
@keyframes pop{from{opacity:0;transform:translateY(12px) scale(.97)}}
@keyframes barin{from{opacity:0;transform:translate(-50%,16px)}}
@keyframes pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--brand) 45%,transparent)}70%,100%{box-shadow:0 0 0 9px transparent}}
@keyframes toastin{from{opacity:0;transform:translateY(10px) scale(.96)}}
@keyframes toastout{to{opacity:0;transform:translateY(6px) scale(.96)}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-delay:0s!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}

@media(max-width:720px){
 .top-in{padding:10px 14px;gap:8px}
 main{padding:24px 14px 80px}
 .card{padding:16px}
}
@media print{
 *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
 header.top,.skip,.noprint,.toast-wrap,.edit-bar,footer{display:none!important}
 body{background:#fff;color:#000}
 main{padding:0;max-width:none}
 .card{box-shadow:none;border:0;padding:0;animation:none}
}
</style>`);
  document.body.insertAdjacentHTML('afterbegin',`<a class=skip href="#main">Ir al contenido</a><header class=top><div class=top-in><a class=brand href="index.html"><span class=logo aria-hidden=true>CC</span><span>Congregación Curauma</span></a><nav aria-label="Secciones"><a href="index.html" ${active=='i'?'aria-current="true"':''}>Inicio</a><a href="programa.html" ${active=='p'?'aria-current="true"':''}>Programa</a></nav><button id=thBtn class="icon-btn" type=button title="Cambiar tema" aria-label="Cambiar entre tema claro y oscuro"><span aria-hidden=true>◐</span><span class=theme-btn-label id=thLabel>Tema</span></button></div></header>
<dialog id=cfgDlg aria-labelledby=cfgTitle><h3 id=cfgTitle>Ajustes de guardado</h3>
<p class=hint>Para guardar cambios de forma permanente necesitas un token de GitHub con permiso de escritura en este repositorio. Se guarda solo en este dispositivo.</p>
<ol class=cfg-steps><li>En GitHub: <b>Settings → Developer settings → Personal access tokens</b> (fine-grained).</li><li>Permiso del repositorio: <b>Contents → Read and write</b>.</li><li>Pega el token abajo. Usuario y repo suelen autocompletarse en GitHub Pages.</li></ol>
<div class=field><label for=c_token>Clave de acceso (token de GitHub)</label><input type=password id=c_token autocomplete=off placeholder="Token fine-grained · Contents: Read and write"></div>
<div class=field-row><div class=field><label for=c_owner>Usuario</label><input type=text id=c_owner></div><div class=field><label for=c_repo>Repositorio</label><input type=text id=c_repo></div></div>
<div class=field><label for=c_branch>Rama</label><input type=text id=c_branch></div>
<div class=modal-actions><button class=danger id=cfgClear type=button>Desconectar</button><span class=sp></span><button class=ghost id=cfgCancel type=button>Cancelar</button><button class=pri id=cfgSave type=button>Guardar</button></div></dialog>
<div class=toast-wrap id=toastWrap aria-live=polite aria-atomic=true></div>`);
  const mn=document.querySelector('main');
  mn?.setAttribute('id','main');
  mn?.insertAdjacentHTML('beforeend','<footer class=noprint><span id=who></span><span class=sp></span><button class="ghost small" id=cfgBtn type=button title="Introduce tu clave de acceso para guardar los cambios de forma permanente">⚙️ Ajustes de guardado</button></footer>');
  const curTheme=()=>document.documentElement.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  const lab=()=>{$('#thLabel').textContent=curTheme()=='dark'?'Claro':'Oscuro';};
  lab();
  $('#thBtn').onclick=()=>{const n=curTheme()=='dark'?'light':'dark';document.documentElement.dataset.theme=n;localStorage.setItem('pj_theme',n);lab();};
  $('#cfgBtn').onclick=()=>{const c=cfg();$('#c_token').value=c.token||'';$('#c_owner').value=c.owner||'';$('#c_repo').value=c.repo||'';$('#c_branch').value=c.branch||'main';$('#cfgDlg').showModal();};
  $('#cfgCancel').onclick=()=>$('#cfgDlg').close();
  $('#cfgClear').onclick=()=>{localStorage.removeItem('pj_cfg');location.reload();};
  $('#cfgSave').onclick=()=>{localStorage.setItem('pj_cfg',JSON.stringify({token:$('#c_token').value.trim(),owner:$('#c_owner').value.trim(),repo:$('#c_repo').value.trim(),branch:$('#c_branch').value.trim()||'main'}));location.reload();};
}
function toast(t,type=''){
  const w=$('#toastWrap'),e=document.createElement('div');
  e.className='toast'+(type?' '+type:'');e.textContent=t;w.appendChild(e);
  setTimeout(()=>{e.classList.add('out');setTimeout(()=>e.remove(),220);},3200);
}
const turnoOk=(t,x)=>!t||t=='MT'||t==x;

async function auth(){
  const c=cfg();if(!c.token||!c.owner||!c.repo)return false;
  try{const r=await fetch(`https://api.github.com/repos/${c.owner}/${c.repo}`,{headers:{Authorization:'Bearer '+c.token}});
    const j=await r.json();return r.ok&&j.permissions?.push===true;}catch{return false;}
}

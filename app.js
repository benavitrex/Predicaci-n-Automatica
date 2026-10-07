document.documentElement.dataset.theme=localStorage.getItem('pj_theme')||'';
const DIAS=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const ORDEN=[1,2,3,4,5,6,0];
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let DB={casas:[],hermanos:[]},SHA=null;

const cfg=()=>{
  let g={owner:'',repo:'',branch:'main',path:'data.json'};
  if(location.hostname.endsWith('.github.io')){g.owner=location.hostname.split('.')[0];g.repo=location.pathname.split('/')[1]||'';}
  return {...g,...JSON.parse(localStorage.getItem('pj_cfg')||'{}')};
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
  if(!c.token)throw new Error('Falta el token de GitHub (botón ⚙)');
  const body={message:msg,branch:c.branch,content:btoa(unescape(encodeURIComponent(JSON.stringify(DB,null,2))))};
  if(SHA)body.sha=SHA;
  const r=await fetch(`https://api.github.com/repos/${c.owner}/${c.repo}/contents/${c.path}`,{method:'PUT',headers:{Authorization:'Bearer '+c.token,'Content-Type':'application/json'},body:JSON.stringify(body)});
  const j=await r.json();
  if(!r.ok)throw new Error(j.message);
  SHA=j.content.sha;
}

function shell(active){
  document.head.insertAdjacentHTML('beforeend',`<meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name=theme-color content="#101412"><meta name=apple-mobile-web-app-capable content=yes><meta name=apple-mobile-web-app-title content=Curauma><style>
:root{--bg:#F4F6F9;--fg:#2C3E50;--mut:#6B7C8F;--ac:#2B4C7E;--ac2:#1A2B4C;--on:#fff;--ln:#E1E8ED;--card:#fff;--bad:#B81D1D;--sh:0 2px 8px rgba(0,0,0,.05);--font:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;--man:#C07D00;--man2:#D9822B;--tar:#680000;--tar2:#8B0000;--vc:#981414;--vc2:#B81D1D}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0F1626;--fg:#E0E6ED;--mut:#93A3B8;--ac:#7FA6E0;--ac2:#0B1220;--on:#0F1626;--ln:#2A3856;--card:#17223A;--bad:#FF8A80;--sh:0 2px 8px rgba(0,0,0,.35)}}
:root[data-theme=dark]{--bg:#0F1626;--fg:#E0E6ED;--mut:#93A3B8;--ac:#7FA6E0;--ac2:#0B1220;--on:#0F1626;--ln:#2A3856;--card:#17223A;--bad:#FF8A80;--sh:0 2px 8px rgba(0,0,0,.35)}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 var(--font)}
.skip{position:absolute;left:-999px}.skip:focus{left:8px;top:8px;z-index:20;background:var(--card);padding:6px 12px;border-radius:8px}
header.top{position:sticky;top:0;z-index:10;background:color-mix(in srgb,var(--card) 88%,transparent);-webkit-backdrop-filter:saturate(1.4) blur(10px);backdrop-filter:saturate(1.4) blur(10px);border-bottom:1px solid var(--ln);padding-top:env(safe-area-inset-top)}
header.top .in{max-width:1000px;margin:0 auto;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;color:var(--fg);text-decoration:none;letter-spacing:-.01em}
.logo{width:32px;height:32px;border-radius:9px;background:var(--ac);color:var(--on);display:grid;place-items:center;font-size:13px;font-weight:700}
header.top nav{display:flex;gap:4px}header.top nav a{padding:6px 12px;border-radius:8px;color:var(--mut);text-decoration:none;font-weight:500;transition:background .15s,color .15s}
header.top nav a:hover{background:var(--bg);color:var(--fg)}header.top nav a.on{color:var(--ac);background:var(--bg)}
@media(max-width:420px){.brand span:last-child{font-size:14px}header.top nav a{padding:6px 8px}}
main{max-width:1000px;margin:0 auto;padding:16px}h2{margin:0 0 8px;font-size:18px;color:var(--ac)}h3{margin:16px 0 4px;font-size:14px;color:var(--mut)}
.card,section.box,.item{background:var(--card);border-radius:14px;box-shadow:var(--sh);border:1px solid var(--ln)}
.card{padding:16px;margin-bottom:16px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:16px}
.map{display:block;width:100%;height:min(55vh,460px);border:0}
.fl{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.badge{background:var(--ac);color:var(--on);border-radius:12px;padding:1px 9px;font-size:13px;vertical-align:middle}
.row{display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center;padding:8px 0;border-top:1px solid var(--ln)}.row b{flex:1 1 150px}
.tag{font-size:12px;background:var(--bg);border-radius:10px;padding:1px 8px;color:var(--mut)}
.bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:4px 0 16px}.bar .sp{flex:1}
form{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:12px}
input,select,button,textarea{font:inherit;color:var(--fg);background:var(--card);border:1px solid var(--ln);border-radius:10px;padding:7px 12px}
button{cursor:pointer}button.pri{background:var(--ac);color:var(--on);border-color:var(--ac)}button:disabled{opacity:.5;cursor:default}
button:focus-visible,input:focus-visible,select:focus-visible,.chip:focus-visible{outline:2px solid var(--ac)}
.chk{display:inline-flex;gap:4px;align-items:center;font-size:13px}
.item{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:8px 12px;margin:6px 0;box-shadow:none}.item>div:first-child{flex:1;min-width:180px}
small{color:var(--mut)}.chip{display:inline-block;padding:3px 10px;border:1px solid var(--ln);border-radius:14px;font-size:13px;cursor:pointer;margin-right:2px;color:var(--mut);user-select:none}
.chip.on{background:var(--ac);border-color:var(--ac);color:var(--on)}
table{width:100%;border-collapse:collapse;background:var(--card);border-radius:14px;overflow:hidden;box-shadow:var(--sh)}th,td{border:1px solid var(--ln);padding:6px 8px;text-align:left;vertical-align:top}th{background:var(--bg)}
td select{width:100%}.warn{color:var(--bad)}#msg{position:fixed;bottom:16px;right:16px;background:var(--ac2);color:#fff;padding:10px 14px;border-radius:10px;display:none}
dialog{border:1px solid var(--ln);border-radius:14px;background:var(--card);color:var(--fg)}dialog label{display:block;margin:8px 0}dialog input{width:100%}
.hero{padding:26px 0 10px}.eyebrow{display:block;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--ac);font-weight:600;margin-bottom:2px}
.hero h1{font-size:clamp(28px,5vw,40px);line-height:1.1;margin:4px 0 6px;letter-spacing:-.02em}.hero h1 em{color:var(--ac);font-style:italic;font-weight:600}.sub{color:var(--mut);margin:0 0 12px}
.rt{display:flex;align-items:center;gap:6px}.th{border-radius:50%;width:34px;height:34px;padding:0;font-size:17px;line-height:1}
.cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.cc,.vc{background:var(--bg);border:1px solid var(--ln);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:6px}.cc b{font-size:16px}.ad{color:var(--mut);font-size:13px}
.tag.acc{background:var(--ac);color:var(--on);align-self:flex-start;font-weight:600}.tag.rg{background:var(--card);border:1px solid var(--ln)}
.vh{display:flex;flex-wrap:wrap;gap:6px;justify-content:space-between;align-items:center}.vh b{font-size:16px}.vd,.vt{display:flex;gap:4px;flex-wrap:wrap}
.dd{min-width:32px;text-align:center;padding:5px 0;border-radius:8px;font-size:13px;font-weight:700;border:1px solid var(--ln);color:var(--mut);opacity:.45}.dd.on{background:var(--ac);color:var(--on);border-color:var(--ac);opacity:1}.dd.sel{outline:2px solid var(--fg);outline-offset:1px}
.tg{font-size:12px;padding:2px 9px;border-radius:10px;border:1px solid var(--ln);color:var(--mut);opacity:.5}.tg.on{opacity:1;color:var(--ac);border-color:var(--ac);font-weight:600}
.mh{border-top:4px solid var(--ac);padding-top:10px;margin:22px 0 10px}.mh h2{font-size:26px;margin:0}.mh h2,.arch b{text-transform:capitalize}
input[type=search]{width:100%;margin:4px 0 8px;font-size:15px}
.frow{display:flex;gap:8px;align-items:flex-start;margin:6px 0}.frow .fl{margin:0}.fl-l{flex:0 0 54px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--mut);padding-top:6px}
.chip{font-size:14px;padding:5px 12px}.cg{grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;margin-top:12px}
.cc,.vc{--rc:var(--ac);border-left:5px solid var(--rc);background:var(--card);box-shadow:var(--sh);padding:14px 16px;gap:10px}
.cc b,.vh b{font-size:17px;font-weight:700;line-height:1.25}.ad{font-size:14px;color:var(--fg);opacity:.8}
.tag.acc{font-size:13px;padding:3px 12px;border-radius:12px}
.vc.r-AN{--rc:#2563eb}.vc.r-SM{--rc:#d97706}.vc.r-PRE{--rc:#7c3aed}.vc.r-PUB{--rc:#64748b}
.tag.rg{background:color-mix(in srgb,var(--rc) 16%,transparent);color:color-mix(in srgb,var(--rc) 65%,var(--fg));border:0;font-weight:700;font-size:12.5px;padding:3px 10px}
.lb{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--mut);margin-bottom:4px}
.dd{min-width:34px;font-size:14px;padding:6px 0;opacity:1;border-style:dashed;background:transparent}.dd.on{border-style:solid;background:var(--rc);border-color:var(--rc);color:#fff}
.tg{font-size:13px;padding:3px 11px;opacity:1;border-style:dashed}.tg.on{border-style:solid;background:color-mix(in srgb,var(--rc) 16%,transparent);border-color:var(--rc);color:color-mix(in srgb,var(--rc) 65%,var(--fg))}
[hidden]{display:none!important}
/* ===== Tipografía y jerarquía ===== */
body{font-family:var(--font);font-weight:400;color:var(--fg)}
h1,h2,h3,.eyebrow,th{font-weight:700}
h2{color:#1A2B4C;font-size:19px}
:root[data-theme=dark] h2{color:var(--fg)}
.eyebrow{color:#2B4C7E;letter-spacing:.1em}
b,td.day,.cc b,.vh b{font-weight:600}
/* ===== Header ===== */
header.top{background:#1A2B4C;border-bottom:0;-webkit-backdrop-filter:none;backdrop-filter:none}
.brand{color:#fff}.logo{background:#fff;color:#1A2B4C}
header.top nav a{color:#E0E6ED}
header.top nav a:hover{background:rgba(255,255,255,.1);color:#fff}
header.top nav a.on{background:rgba(255,255,255,.16);color:#fff}
.th{background:transparent;color:#fff;border-color:rgba(255,255,255,.35)}
/* ===== Tarjetas, botones, chips ===== */
.card{border:1px solid var(--ln);box-shadow:var(--sh)}
button.pri{background:#2B4C7E;border-color:#2B4C7E;color:#fff}
button.pri:hover{background:#1A2B4C}
.chip.on{background:#2B4C7E;border-color:#2B4C7E;color:#fff}
.mh{border-top-color:#1A2B4C}.mh h2{color:#1A2B4C;font-weight:700}
:root[data-theme=dark] .mh h2{color:var(--fg)}
/* ===== Programa: neutro (grises y negro) ===== */
.pg{--bg:#F2F2F2;--fg:#111;--mut:#5F6368;--ln:#D5D8DC;--ac:#222;--ac2:#000;--on:#fff;--k:#111;--k2:#555;--kh:#222;--kb:#F1F1F1;--kl:#C4C8CD}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]) .pg{--bg:#121417;--card:#1B1E23;--fg:#ECEDEF;--mut:#A3A9B1;--ln:#33383F;--ac:#D5D8DD;--ac2:#000;--on:#111;--k:#F1F2F4;--k2:#A3A9B1;--kh:#000;--kb:#22262C;--kl:#3A3F47}}
:root[data-theme=dark] .pg{--bg:#121417;--card:#1B1E23;--fg:#ECEDEF;--mut:#A3A9B1;--ln:#33383F;--ac:#D5D8DD;--ac2:#000;--on:#111;--k:#F1F2F4;--k2:#A3A9B1;--kh:#000;--kb:#22262C;--kl:#3A3F47}
.pg h2,.pg .wh h2,.pg .mh h2{color:var(--k)}
.pg .wh h2{font-size:20px}.pg .wh h2 small{font-weight:400;color:var(--k2)}
.pg .eyebrow{color:var(--k2)}
.pg .mh{border-top-color:var(--k)}
.pg button.pri{background:var(--kh);border-color:var(--kh);color:#fff}
.pg button.pri:hover{background:#000}
.pg .chip.on{background:var(--kh);border-color:var(--kh);color:#fff}
.pg .cc{--rc:var(--kl)}
.pg .chk input{accent-color:#222}
.pg table{border:1px solid var(--kl);box-shadow:none}
.pg th{background:var(--kh);color:#fff;border-color:var(--kh);font-size:12px;letter-spacing:.07em;padding:9px 8px}
.pg td{padding:9px 8px;border-color:var(--kl)}
.pg td.day{color:var(--k);font-weight:600;letter-spacing:.02em}
.pg td input{font-weight:600;color:var(--k);border-color:transparent;background:transparent}
.pg td input:hover,.pg td input:focus{border-color:var(--kl);background:var(--card)}
.pg td select{color:var(--k)}
.pg td.hr:nth-child(2) input{font-size:16px;font-weight:700}
.pg td.hr:nth-child(5) input{text-align:center;font-weight:700;border:1px solid var(--kl);border-radius:6px;width:auto;min-width:56px}
.pg tr.am td.day{border-left:5px solid var(--kl)}
.pg tr.pm td.day{border-left:5px solid var(--k)}
.pg tr.pm td{background:var(--kb)}
.pg .hint{font-size:12px;margin-top:2px}
.pg .hg b{color:var(--k)}
.pg .mini{font-size:12px;padding:2px 10px;margin-top:6px;border-radius:8px;color:var(--k2);font-weight:400}
/* ===== Casas: interruptor de pausa ===== */
.cg{align-items:start}
.sw{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--mut);cursor:pointer;margin-top:2px;position:relative}
.sw input{position:absolute;opacity:0;width:0;height:0}
.sw i{width:36px;height:20px;border-radius:10px;background:#B8C2CC;position:relative;transition:background .15s;flex:none}
.sw i::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .15s}
.sw input:checked+i{background:var(--ac)}
.sw input:checked+i::after{transform:translateX(16px)}
.sw input:focus-visible+i{outline:2px solid var(--ac);outline-offset:2px}
.cc.off>b,.cc.off>.ad,.cc.off>.tag{opacity:.5}
/* ===== Varones: tarjetas desplegables y sobrias ===== */
.vc{--rc:#8A97A6;padding:0;gap:0;display:block}
.vc.r-AN{--rc:#2B4C7E}.vc.r-SM{--rc:#3E7C7B}.vc.r-PRE{--rc:#7A6A9C}.vc.r-PUB{--rc:#8A97A6}
.vc>summary{list-style:none;cursor:pointer;display:flex;flex-direction:column;gap:3px;padding:12px 40px 12px 16px;position:relative}
.vc>summary::-webkit-details-marker{display:none}
.vc>summary::after{content:"";position:absolute;right:16px;top:50%;width:8px;height:8px;border-right:2px solid var(--mut);border-bottom:2px solid var(--mut);transform:translateY(-70%) rotate(45deg);transition:transform .15s}
.vc[open]>summary::after{transform:translateY(-30%) rotate(-135deg)}
.vc>summary:focus-visible{outline:2px solid var(--ac);outline-offset:-2px;border-radius:12px}
.vc .vs{font-size:13px;color:var(--mut)}
.vc .vi{border-top:1px solid var(--ln);padding:10px 16px 14px;display:flex;flex-direction:column;gap:10px}
.vc .dl{display:flex;gap:4px;flex-wrap:wrap}
.vc .dl span{min-width:34px;text-align:center;padding:4px 0;border-radius:6px;font-size:13px;color:var(--mut);opacity:.45;text-decoration:line-through}
.vc .dl span.on{opacity:1;color:var(--fg);background:var(--bg);font-weight:600;text-decoration:none}
.vc .dl span.sel{outline:1.5px solid var(--fg)}
@media print{
 *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
 :root:root:root .pg{--card:#fff;--bg:#fff;--fg:#000;--mut:#555;--ln:#C4C8CD;--k:#111;--kl:#C4C8CD;--kb:#F1F1F1;--kh:#222}
 .pg .ph{background:#111;color:#fff;padding:10px;border-radius:6px;font-size:15px;letter-spacing:.03em}
 .pg th{background:#222!important;color:#fff!important}
 .pg td{padding:7px 8px;color:#000}
 .pg tr.pm td{background:#F1F1F1!important}
 .pg td input{color:#000!important}
}
@media print{header.top,.skip,.noprint,#msg{display:none!important}body{background:#fff;color:#000}td select{border:0;background:none;appearance:none;color:#000;padding:0}}
</style>`);
  document.body.insertAdjacentHTML('afterbegin',`<a class=skip href="#main">Ir al contenido</a><header class=top><div class=in><a class=brand href="index.html"><span class=logo>CC</span><span>Congregación Curauma</span></a><div class=rt><nav><a href="index.html" class="${active=='i'?'on':''}">Inicio</a><a href="programa.html" class="${active=='p'?'on':''}">Programa</a></nav><button id=thBtn class=th title="Modo claro / oscuro" aria-label="Modo claro / oscuro">◐</button></div></div><button id=cfgBtn hidden aria-hidden=true tabindex=-1></button></header>
<dialog id=cfgDlg><form method=dialog style="display:block;min-width:min(320px,80vw)"><b>Conexión con GitHub</b>
<label>Token (con permiso Contents: write)<input id=cT type=password autocomplete=off></label>
<label>Usuario<input id=cO></label><label>Repositorio<input id=cR></label><label>Rama<input id=cB></label>
<small>El token queda solo en este navegador.</small><p><button value=ok class=pri>Guardar</button> <button value=x>Cancelar</button></p></form></dialog><div id=msg></div>`);
  document.querySelector('main')?.setAttribute('id','main');
  $('#thBtn').onclick=()=>{const r=document.documentElement,d=r.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'),n=d=='dark'?'light':'dark';r.dataset.theme=n;localStorage.setItem('pj_theme',n);};
  $('#cfgBtn').onclick=()=>{const c=cfg();$('#cT').value=c.token||'';$('#cO').value=c.owner;$('#cR').value=c.repo;$('#cB').value=c.branch;$('#cfgDlg').showModal();};
  $('#cfgDlg').onclose=async e=>{if($('#cfgDlg').returnValue!='ok')return;
    localStorage.setItem('pj_cfg',JSON.stringify({token:$('#cT').value.trim(),owner:$('#cO').value.trim(),repo:$('#cR').value.trim(),branch:$('#cB').value.trim()||'main'}));
    await load();location.reload();};
}
function toast(t){const m=$('#msg');m.textContent=t;m.style.display='block';setTimeout(()=>m.style.display='none',3500);}
const turnoOk=(t,x)=>!t||t=='MT'||t==x;

async function auth(){
  const c=cfg();if(!c.token||!c.owner||!c.repo)return false;
  try{const r=await fetch(`https://api.github.com/repos/${c.owner}/${c.repo}`,{headers:{Authorization:'Bearer '+c.token}});
    const j=await r.json();return r.ok&&j.permissions?.push===true;}catch{return false;}
}

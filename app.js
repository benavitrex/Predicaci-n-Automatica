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
:root{--bg:#f3f5f3;--fg:#17201b;--mut:#66726b;--ac:#1f7a56;--ac2:#145a3f;--on:#fff;--ln:#dfe5e1;--card:#fff;--bad:#c0392b;--sh:0 1px 3px rgba(16,20,18,.08),0 4px 14px rgba(16,20,18,.06);--font:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
@media(prefers-color-scheme:dark){:root{--bg:#101412;--fg:#e8eeea;--mut:#8f9d95;--ac:#4fc08d;--ac2:#0b0f0d;--on:#0b0f0d;--ln:#26302a;--card:#171d1a;--bad:#ff8a80;--sh:0 1px 3px rgba(0,0,0,.4)}}
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
[hidden]{display:none!important}
@media print{header.top,.skip,.noprint,#msg{display:none!important}body{background:#fff;color:#000}td select{border:0;background:none;appearance:none;color:#000;padding:0}}
</style>`);
  document.body.insertAdjacentHTML('afterbegin',`<a class=skip href="#main">Ir al contenido</a><header class=top><div class=in><a class=brand href="index.html"><span class=logo>CC</span><span>Congregación Curauma</span></a><nav><a href="index.html" class="${active=='i'?'on':''}">Inicio</a><a href="programa.html" class="${active=='p'?'on':''}">Programa</a></nav></div><button id=cfgBtn hidden aria-hidden=true tabindex=-1></button></header>
<dialog id=cfgDlg><form method=dialog style="display:block;min-width:min(320px,80vw)"><b>Conexión con GitHub</b>
<label>Token (con permiso Contents: write)<input id=cT type=password autocomplete=off></label>
<label>Usuario<input id=cO></label><label>Repositorio<input id=cR></label><label>Rama<input id=cB></label>
<small>El token queda solo en este navegador.</small><p><button value=ok class=pri>Guardar</button> <button value=x>Cancelar</button></p></form></dialog><div id=msg></div>`);
  document.querySelector('main')?.setAttribute('id','main');
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

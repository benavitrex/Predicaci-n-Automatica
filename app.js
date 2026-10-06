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
  document.head.insertAdjacentHTML('beforeend',`<meta name=viewport content="width=device-width,initial-scale=1"><style>
:root{--bg:#f6f7f4;--fg:#1d2321;--mut:#6b7570;--ac:#2f6f5e;--ln:#d9ddd8;--card:#fff;--bad:#b3261e}
@media(prefers-color-scheme:dark){:root{--bg:#171b19;--fg:#e8ece9;--mut:#9aa59f;--ac:#6fc2a8;--ln:#2e3632;--card:#1f2522;--bad:#ff8a80}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}
nav{display:flex;gap:6px;align-items:center;padding:10px 16px;border-bottom:1px solid var(--ln);background:var(--card);position:sticky;top:0;z-index:5}
nav a{padding:6px 12px;border-radius:6px;color:var(--fg);text-decoration:none}nav a.on{background:var(--ac);color:#fff}nav .sp{flex:1}
main{max-width:980px;margin:0 auto;padding:16px}h2{margin:24px 0 8px}
section.box,.item{background:var(--card);border:1px solid var(--ln);border-radius:8px}
form{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:12px}
input,select,button,textarea{font:inherit;color:var(--fg);background:var(--bg);border:1px solid var(--ln);border-radius:6px;padding:6px 10px}
button{cursor:pointer}button.pri{background:var(--ac);color:#fff;border-color:var(--ac)}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--ac)}
.chk{display:inline-flex;gap:4px;align-items:center;font-size:13px}
.item{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:8px 12px;margin:6px 0}.item>div:first-child{flex:1;min-width:180px}
small{color:var(--mut)}.chip{display:inline-block;padding:2px 7px;border:1px solid var(--ln);border-radius:12px;font-size:12px;cursor:pointer;margin-right:2px;color:var(--mut)}
.chip.on{background:var(--ac);border-color:var(--ac);color:#fff}
table{width:100%;border-collapse:collapse;background:var(--card)}th,td{border:1px solid var(--ln);padding:6px 8px;text-align:left;vertical-align:top}th{background:var(--bg)}
td select{width:100%}.warn{color:var(--bad)}#msg{position:fixed;bottom:16px;right:16px;background:var(--fg);color:var(--bg);padding:10px 14px;border-radius:8px;display:none}
dialog{border:1px solid var(--ln);border-radius:10px;background:var(--card);color:var(--fg)}dialog label{display:block;margin:8px 0}dialog input{width:100%}
@media print{nav,.noprint,#msg{display:none!important}body{background:#fff;color:#000}td select{border:0;background:none;appearance:none;color:#000;padding:0}}
</style>`);
  document.body.insertAdjacentHTML('afterbegin',`<nav><a href="index.html" class="${active=='i'?'on':''}">Inicio</a><a href="programa.html" class="${active=='p'?'on':''}">Programa</a><span class=sp></span><button id=cfgBtn title="Configurar GitHub">⚙</button></nav>
<dialog id=cfgDlg><form method=dialog style="display:block;min-width:min(320px,80vw)"><b>Conexión con GitHub</b>
<label>Token (con permiso Contents: write)<input id=cT type=password autocomplete=off></label>
<label>Usuario<input id=cO></label><label>Repositorio<input id=cR></label><label>Rama<input id=cB></label>
<small>El token queda solo en este navegador.</small><p><button value=ok class=pri>Guardar</button> <button value=x>Cancelar</button></p></form></dialog><div id=msg></div>`);
  $('#cfgBtn').onclick=()=>{const c=cfg();$('#cT').value=c.token||'';$('#cO').value=c.owner;$('#cR').value=c.repo;$('#cB').value=c.branch;$('#cfgDlg').showModal();};
  $('#cfgDlg').onclose=async e=>{if($('#cfgDlg').returnValue!='ok')return;
    localStorage.setItem('pj_cfg',JSON.stringify({token:$('#cT').value.trim(),owner:$('#cO').value.trim(),repo:$('#cR').value.trim(),branch:$('#cB').value.trim()||'main'}));
    await load();location.reload();};
}
function toast(t){const m=$('#msg');m.textContent=t;m.style.display='block';setTimeout(()=>m.style.display='none',3500);}
const turnoOk=(t,x)=>!t||t=='MT'||t==x;

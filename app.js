// === 6 ENTREPRISES FICTIVES AVEC LOGOS SVG ===
var ENTREPRISES = [
  {
    id:'voltaelec', name:'VOLTA\u00c9LEC', slogan:'L\u2019\u00e9nergie ma\u00eetris\u00e9e',
    address:'12 rue Amp\u00e8re, 94000 Cr\u00e9teil', phone:'01 48 99 12 34', email:'contact@voltaelec.fr',
    siret:'412 345 678 00012', color:'#e63946',
    logo:'<svg viewBox="0 0 70 70"><circle cx="35" cy="35" r="32" fill="#e63946"/><path d="M38 12L22 40h12L28 58l20-30H36z" fill="#fff"/></svg>'
  },
  {
    id:'ohmservices', name:'OHM SERVICES', slogan:'Solutions \u00e9lectriques durables',
    address:'8 avenue Faraday, 77100 Meaux', phone:'01 60 25 67 89', email:'info@ohmservices.fr',
    siret:'523 456 789 00023', color:'#2a9d8f',
    logo:'<svg viewBox="0 0 70 70"><rect x="3" y="3" width="64" height="64" rx="12" fill="#2a9d8f"/><text x="35" y="44" font-family="Arial" font-size="28" font-weight="bold" fill="#fff" text-anchor="middle">\u2126</text></svg>'
  },
  {
    id:'wattplus', name:'WATT+', slogan:'Plus de puissance, plus de s\u00e9curit\u00e9',
    address:'25 bd Tesla, 93200 Saint-Denis', phone:'01 42 35 78 90', email:'devis@wattplus.fr',
    siret:'634 567 890 00034', color:'#e9c46a',
    logo:'<svg viewBox="0 0 70 70"><polygon points="35,3 67,35 35,67 3,35" fill="#e9c46a"/><text x="35" y="42" font-family="Arial" font-size="22" font-weight="bold" fill="#1d3557" text-anchor="middle">W+</text></svg>'
  },
  {
    id:'eclairpro', name:'\u00c9CLAIR PRO', slogan:'Votre \u00e9lectricien de confiance',
    address:'3 rue Volta, 91000 \u00c9vry', phone:'01 69 88 45 12', email:'contact@eclairpro.fr',
    siret:'745 678 901 00045', color:'#457b9d',
    logo:'<svg viewBox="0 0 70 70"><circle cx="35" cy="35" r="32" fill="#457b9d"/><circle cx="35" cy="35" r="18" fill="none" stroke="#fff" stroke-width="3"/><line x1="35" y1="17" x2="35" y2="25" stroke="#fff" stroke-width="3"/><line x1="35" y1="45" x2="35" y2="53" stroke="#fff" stroke-width="3"/><line x1="17" y1="35" x2="25" y2="35" stroke="#fff" stroke-width="3"/><line x1="45" y1="35" x2="53" y2="35" stroke="#fff" stroke-width="3"/><circle cx="35" cy="35" r="5" fill="#e9c46a"/></svg>'
  },
  {
    id:'ampereelec', name:'AMP\u00c8RE \u00c9LECTRIQUE', slogan:'Du courant \u00e0 la lumi\u00e8re',
    address:'17 rue Edison, 78000 Versailles', phone:'01 39 50 23 67', email:'pro@ampere-elec.fr',
    siret:'856 789 012 00056', color:'#6a4c93',
    logo:'<svg viewBox="0 0 70 70"><rect x="3" y="3" width="64" height="64" rx="16" fill="#6a4c93"/><text x="35" y="42" font-family="Arial" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">A</text><line x1="20" y1="52" x2="50" y2="52" stroke="#e9c46a" stroke-width="3"/></svg>'
  },
  {
    id:'courantech', name:'COURANTECH', slogan:'Innovation \u00e9lectrique',
    address:'42 rue Coulomb, 95100 Argenteuil', phone:'01 34 11 89 56', email:'hello@courantech.fr',
    siret:'967 890 123 00067', color:'#264653',
    logo:'<svg viewBox="0 0 70 70"><circle cx="35" cy="35" r="32" fill="#264653"/><path d="M20 35 Q25 20 35 20 Q45 20 50 35 Q45 50 35 50 Q25 50 20 35Z" fill="none" stroke="#2a9d8f" stroke-width="3"/><circle cx="35" cy="35" r="6" fill="#e76f51"/></svg>'
  }
];

var items=[], filt=null, docOk=false, selEnt=null;

var TAB_TITLES={
  params:'<i class="fas fa-sliders-h"></i> Param\u00e8tres du projet',
  import:'<i class="fas fa-file-import"></i> Import RS Components',
  materiel:'<i class="fas fa-boxes-stacked"></i> Liste de mat\u00e9riel',
  document:'<i class="fas fa-file-invoice-dollar"></i> Document'
};

function switchTab(n){
  document.querySelectorAll('.sb-item').forEach(function(t){t.classList.remove('active')});
  document.querySelectorAll('.pnl').forEach(function(p){p.classList.remove('active')});
  var item=document.querySelector('[data-tab="'+n+'"]');
  if(item) item.classList.add('active');
  document.getElementById('panel-'+n).classList.add('active');
  document.getElementById('topTitle').innerHTML=TAB_TITLES[n]||'';
  if(n==='materiel') renderT();
  // Close sidebar on mobile
  document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
}

// === CSV PARSING (RS Components format) ===
function handleFile(e){
  var f=e.target.files[0]; if(!f) return;
  var r=new FileReader();
  r.onload=function(ev){ parseCSV(ev.target.result) };
  r.readAsText(f,'UTF-8');
}

function setupDZ(){
  var dz=document.getElementById('dropz');
  dz.addEventListener('dragover',function(e){e.preventDefault();dz.classList.add('over')});
  dz.addEventListener('dragleave',function(){dz.classList.remove('over')});
  dz.addEventListener('drop',function(e){
    e.preventDefault();dz.classList.remove('over');
    var f=e.dataTransfer.files[0];
    if(f){var r=new FileReader();r.onload=function(ev){parseCSV(ev.target.result)};r.readAsText(f,'UTF-8')}
  });
}

function parseCSV(text){
  var lines=text.split(/\r?\n/).filter(function(l){return l.trim()});
  if(lines.length<2){showIR('w','Fichier vide ou invalide.');return}
  var fl=lines[0];
  var d=fl.indexOf('\t')>=0?'\t':(fl.split(';').length>fl.split(',').length?';':',');
  var hdrs=pLine(fl,d).map(function(h){return h.trim().toLowerCase().replace(/^\ufeff/,'')});
  var cm=detCols(hdrs);
  var imp=0, skip=0;
  for(var i=1;i<lines.length;i++){
    var v=pLine(lines[i],d);
    if(v.length<2){skip++;continue}
    var ref=cm.ref>=0?(v[cm.ref]||'').trim().replace(/^"|"$/g,''):'';
    var nm=cm.name>=0?(v[cm.name]||'').trim().replace(/^"|"$/g,''):'';
    var pr=cm.price>=0?pPr(v[cm.price]):0;
    var qt=cm.qty>=0?(parseInt(v[cm.qty].replace(/"/g,''))||1):1;
    var mfr=cm.mfr>=0?(v[cm.mfr]||'').trim().replace(/^"|"$/g,''):'';
    if(!nm&&!ref){skip++;continue}
    items.push({id:gid(),ref:ref||'-',name:nm||'Article',price:pr,qty:qt,mfr:mfr,src:'rs'});
    imp++;
  }
  updB();
  showIR('s','<strong>'+imp+' article(s)</strong> import\u00e9(s) avec succ\u00e8s !'+(skip>0?' ('+skip+' ligne(s) ignor\u00e9e(s))':''));
}

function pLine(l,d){
  var r=[],c='',q=false;
  for(var i=0;i<l.length;i++){
    if(l[i]==='"') q=!q;
    else if(l[i]===d&&!q){r.push(c);c=''}
    else c+=l[i];
  }
  r.push(c);return r;
}

function detCols(h){
  var m={ref:-1,name:-1,price:-1,qty:-1,mfr:-1};
  h.forEach(function(x,i){
    var s=x.replace(/['"]/g,'').trim();
    if(m.ref<0&&(/stock\s*no|r[eé]f|ref|sku|num|part\b/i.test(s)))m.ref=i;
    if(m.name<0&&/description|d[eé]signation|nom|article|produit|libell/i.test(s))m.name=i;
    if(m.price<0&&/unit\s*price|prix\s*unit|tarif|p\.?u\.?\s*h\.?t|unit price/i.test(s))m.price=i;
    if(m.qty<0&&/quantit[eéy]|qty|qt[eé]|qte|nombre|nb/i.test(s))m.qty=i;
    if(m.mfr<0&&/manufacturer\s*name|fabricant|marque/i.test(s))m.mfr=i;
  });
  if(m.name<0) h.forEach(function(x,i){if(m.name<0&&/description/i.test(x))m.name=i});
  if(m.ref<0&&h.length>=1)m.ref=0;
  if(m.name<0&&h.length>=6)m.name=5;
  return m;
}

function pPr(v){if(!v)return 0;return parseFloat(v.replace(/["\u20ac$\u00a3\s]/g,'').replace(',','.').trim())||0}

function showIR(t,msg){
  var c=t==='s'?'al-s':'al-w',ic=t==='s'?'check-circle':'exclamation-triangle';
  document.getElementById('impRes').innerHTML='<div class="alert '+c+'"><i class="fas fa-'+ic+'"></i> '+msg+'</div>';
}

// === MANUAL ADD ===
function addManual(){
  var nm=document.getElementById('aName').value.trim();
  if(!nm){alert('Saisissez une d\u00e9signation.');return}
  items.push({id:gid(),ref:document.getElementById('aRef').value.trim()||'-',name:nm,
    price:parseFloat(document.getElementById('aPrice').value)||0,
    qty:parseInt(document.getElementById('aQty').value)||1,mfr:'-',src:'man'});
  document.getElementById('aRef').value='';document.getElementById('aName').value='';
  document.getElementById('aPrice').value='';document.getElementById('aQty').value='1';
  updB();showIR('s','<strong>'+esc(nm)+'</strong> ajout\u00e9 \u00e0 la liste.');
}

// === MATERIEL TABLE ===
function renderT(){
  var tb=document.getElementById('tBody'),em=document.getElementById('emSt'),su=document.getElementById('sumBox');
  var ds=filt!==null?filt:items;
  if(!items.length){tb.innerHTML='';em.style.display='block';su.style.display='none';return}
  em.style.display='none';su.style.display='block';
  tb.innerHTML=ds.map(function(it){
    return '<tr><td><span class="rb">'+esc(it.ref)+'</span></td><td>'+esc(it.name)+
    '</td><td>'+esc(it.mfr||'-')+'</td><td><span class="tag '+(it.src==='rs'?'tag-rs':'tag-m')+'">'+(it.src==='rs'?'RS':'Manuel')+
    '</span></td><td style="text-align:center"><input type="number" class="qi" value="'+it.qty+
    '" min="1" onchange="uQty(\''+it.id+'\',this.value)"></td><td style="text-align:right">'+
    fmt(it.price)+'</td><td style="text-align:right" class="price">'+fmt(it.price*it.qty)+
    '</td><td style="text-align:center"><button class="btn btn-dan btn-sm" onclick="remIt(\''+it.id+
    '\')"><i class="fas fa-times"></i></button></td></tr>';
  }).join('');
  document.getElementById('sArt').textContent=items.reduce(function(s,i){return s+i.qty},0);
  document.getElementById('sMat').textContent=fmt(items.reduce(function(s,i){return s+i.price*i.qty},0));
}
function uQty(id,v){var it=items.find(function(i){return i.id===id});if(it){it.qty=Math.max(1,parseInt(v)||1);renderT()}}
function remIt(id){items=items.filter(function(i){return i.id!==id});updB();renderT()}
function clearAll(){if(!items.length)return;document.getElementById('mDel').classList.add('active')}
function doClear(){items=[];updB();renderT();closeMo('mDel')}
function closeMo(id){document.getElementById(id).classList.remove('active')}
function filterM(q){filt=q?items.filter(function(i){return i.name.toLowerCase().indexOf(q.toLowerCase())>=0||i.ref.toLowerCase().indexOf(q.toLowerCase())>=0}):null;renderT()}

// === ENTREPRISE SELECTION ===
function renderEnts(){
  var g=document.getElementById('entGrid');
  g.innerHTML=ENTREPRISES.map(function(e){
    return '<div class="ent-card'+(selEnt&&selEnt.id===e.id?' sel':'')+'" onclick="pickEnt(\''+e.id+'\')" id="ec-'+e.id+'">'+
    '<div class="logo-svg">'+e.logo+'</div><h3>'+e.name+'</h3><p>'+e.slogan+'</p></div>';
  }).join('');
}
function pickEnt(id){
  selEnt=ENTREPRISES.find(function(e){return e.id===id});
  document.querySelectorAll('.ent-card').forEach(function(c){c.classList.remove('sel')});
  document.getElementById('ec-'+id).classList.add('sel');
  // Fill fields
  document.getElementById('pCo').value=selEnt.name;
  document.getElementById('pSi').value=selEnt.siret;
  document.getElementById('pAd').value=selEnt.address;
  document.getElementById('pPh').value=selEnt.phone;
  document.getElementById('pEm').value=selEnt.email;
}

// === DOCUMENT GENERATION ===
function genDoc(){
  if(!items.length){alert('Ajoutez du mat\u00e9riel d\'abord.');return}
  var dt=document.getElementById('pTy').value;
  var tr=parseFloat(document.getElementById('pTv').value)/100;
  var co=document.getElementById('pCo').value||'Mon Entreprise';
  var si=document.getElementById('pSi').value;
  var ad=document.getElementById('pAd').value;
  var ph=document.getElementById('pPh').value;
  var em=document.getElementById('pEm').value;
  var cn=document.getElementById('cNm').value||'Client';
  var cc=document.getElementById('cCo').value;
  var ca=document.getElementById('cAd').value;
  var ccp=document.getElementById('cCp').value;
  var cvi=document.getElementById('cVi').value;
  var fullAddr=ca;
  if(ccp||cvi) fullAddr+=(ca?', ':'')+ccp+' '+cvi;
  var dd=document.getElementById('pDa').value||new Date().toISOString().split('T')[0];
  var dn=document.getElementById('pNu').value;
  var hr=parseFloat(document.getElementById('pHr').value)||0;
  var hs=parseFloat(document.getElementById('pHs').value)||0;
  var wd=document.getElementById('pWd').value;
  var rty=document.getElementById('rTy').value;
  var rva=parseFloat(document.getElementById('rVa').value)||0;

  if(!dn){dn=(dt==='facture'?'FA':'DV')+'-'+new Date().getFullYear()+'-'+String(Math.floor(Math.random()*9999)).padStart(4,'0');document.getElementById('pNu').value=dn}

  var tl=dt==='facture'?'FACTURE':'DEVIS';
  var tm=items.reduce(function(s,i){return s+i.price*i.qty},0);
  var tmo=dt!=='devis'?hr*hs:0;
  var sub=tm+tmo;
  var disc=rty==='percent'?sub*(rva/100):rty==='fixed'?rva:0;
  var tht=sub-disc;
  var tva=dt==='facture'?tht*tr:0;
  var ttc=tht+tva;
  var fd=function(d){var p=d.split('-');return p[2]+'/'+p[1]+'/'+p[0]};

  // Logo
  var logoHtml='';
  if(selEnt) logoHtml='<div class="logo-svg">'+selEnt.logo+'</div>';

  var rows=items.map(function(it,idx){
    return '<tr><td style="text-align:center">'+(idx+1)+'</td><td><span style="font-family:monospace;font-size:.8rem;color:#666">'+
    esc(it.ref)+'</span></td><td>'+esc(it.name)+'</td><td style="text-align:center">'+it.qty+
    '</td><td style="text-align:right">'+fmt(it.price)+'</td><td style="text-align:right;font-weight:600">'+fmt(it.price*it.qty)+'</td></tr>';
  }).join('');

  if(dt!=='devis'&&tmo>0){
    rows+='<tr style="background:#f0f9ff"><td style="text-align:center">'+(items.length+1)+
    '</td><td>-</td><td><strong>Main d\u2019\u0153uvre</strong> - '+esc(wd)+
    '</td><td style="text-align:center">'+hs+'h</td><td style="text-align:right">'+fmt(hr)+
    '/h</td><td style="text-align:right;font-weight:600">'+fmt(tmo)+'</td></tr>';
  }

  var h='<div class="dp" id="docP"><div class="dh"><div class="dco">'+logoHtml+'<div class="info"><h2>'+esc(co)+'</h2>'+
    (ad?'<p>'+esc(ad)+'</p>':'')+(ph?'<p>T\u00e9l: '+esc(ph)+'</p>':'')+
    (em?'<p>'+esc(em)+'</p>':'')+(si?'<p style="font-size:.78rem;margin-top:.2rem">SIRET: '+esc(si)+'</p>':'')+
    '</div></div><div class="dty"><h3>'+tl+'</h3><div class="dn">N\u00b0 '+esc(dn)+'</div><div class="dd">Date: '+fd(dd)+'</div>'+
    (dt!=='facture'?'<div class="dd">Validit\u00e9: 30 jours</div>':'')+'</div></div>';

  h+='<div class="dcb"><h4>Client</h4><strong>'+esc(cn)+'</strong>'+(cc?'<br>'+esc(cc):'')+(fullAddr?'<br>'+esc(fullAddr):'')+'</div>';
  if(dt!=='devis'&&wd) h+='<p style="margin-bottom:1rem;font-style:italic;color:#555">Objet : '+esc(wd)+'</p>';

  h+='<table class="dtb"><thead><tr><th style="text-align:center;width:40px">N\u00b0</th><th style="width:80px">R\u00e9f.</th><th>D\u00e9signation</th><th style="text-align:center;width:50px">Qt\u00e9</th><th style="text-align:right;width:85px">P.U. HT</th><th style="text-align:right;width:95px">Total HT</th></tr></thead><tbody>'+rows+'</tbody></table>';

  h+='<div class="tots">';
  h+='<div class="rw"><span>Total Mat\u00e9riel HT</span><span>'+fmt(tm)+'</span></div>';
  if(tmo>0) h+='<div class="rw"><span>Main d\u2019\u0153uvre HT</span><span>'+fmt(tmo)+'</span></div>';
  if(disc>0) h+='<div class="rw"><span>Remise'+(rty==='percent'?' ('+rva+'%)':'')+'</span><span>- '+fmt(disc)+'</span></div>';
  h+='<div class="rw" style="font-weight:600"><span>Total HT</span><span>'+fmt(tht)+'</span></div>';
  if(dt==='facture') h+='<div class="rw"><span>TVA ('+(tr*100).toFixed(1)+'%)</span><span>'+fmt(tva)+'</span></div>';
  h+='<div class="rw grand"><span>Total '+(dt==='facture'?'TTC':'HT')+'</span><span>'+fmt(dt==='facture'?ttc:tht)+'</span></div></div>';

  if(dt==='facture') h+='<div style="margin-top:1.5rem;padding:.8rem;background:#f9fafb;border-radius:8px;font-size:.8rem;color:#666"><strong>Conditions de paiement :</strong> Paiement \u00e0 30 jours \u00e0 r\u00e9ception de facture.<br><strong>P\u00e9nalit\u00e9s de retard :</strong> 3 fois le taux d\u2019int\u00e9r\u00eat l\u00e9gal. Indemnit\u00e9 forfaitaire de recouvrement : 40 \u20ac.</div>';
  if(dt.indexOf('devis')>=0) h+='<div style="margin-top:1.5rem;padding:.8rem;background:#f9fafb;border-radius:8px;font-size:.8rem;color:#666"><strong>Bon pour accord :</strong><br><br>Date : ________________\u00a0\u00a0\u00a0\u00a0Signature : ________________</div>';

  h+='<div class="df">'+esc(co)+(si?' \u2022 SIRET: '+esc(si):'')+'<br>Document g\u00e9n\u00e9r\u00e9 avec MELEC - Devis &amp; Facturation</div></div>';

  document.getElementById('docC').innerHTML=h;
  docOk=true;
  document.getElementById('docOptions').style.display='none';
  document.getElementById('docActions').style.display='flex';
  // Ensure we're on document tab
  if(!document.getElementById('panel-document').classList.contains('active')){
    switchTab('document');
  }
}

// === EXPORTS ===
function svgToDataUrl(svgStr){
  return 'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svgStr)));
}

function expWord(){
  var c=document.getElementById('docP');
  if(!c){alert('G\u00e9n\u00e9rez le document d\'abord.');return}
  // Clone and convert SVG logos to img tags for Word compatibility
  var clone=c.cloneNode(true);
  var svgs=clone.querySelectorAll('svg');
  svgs.forEach(function(svg){
    var svgStr=new XMLSerializer().serializeToString(svg);
    var img=document.createElement('img');
    img.src=svgToDataUrl(svgStr);
    img.style.width=svg.getAttribute('width')?svg.getAttribute('width')+'px':'60px';
    img.style.height=svg.getAttribute('height')?svg.getAttribute('height')+'px':'60px';
    if(svg.closest('.logo-svg')){img.style.width='60px';img.style.height='60px'}
    svg.parentNode.replaceChild(img,svg);
  });
  var h='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>body{font-family:Calibri,sans-serif;font-size:11pt}table{border-collapse:collapse;width:100%}th{background:#1a56db;color:#fff;padding:6px 8px;font-size:9pt;text-align:left}td{padding:5px 8px;border-bottom:1px solid #ddd;font-size:10pt}h2{color:#1a56db;margin:0}h3{color:#1e40af;margin:0}p{margin:2px 0}.dh{display:flex;border-bottom:3px solid #1a56db;padding-bottom:12px;margin-bottom:15px}.dco{display:flex;align-items:center;gap:10px}.tots .rw{display:flex;justify-content:space-between;padding:3px 0}.tots .rw.grand{border-top:2px solid #1f2937;font-weight:bold;font-size:13pt;padding-top:6px;margin-top:4px}.dcb{background:#f5f5f5;padding:8px;border-radius:4px;margin-bottom:12px}.df{margin-top:15px;padding-top:8px;border-top:1px solid #ddd;font-size:8pt;color:#999;text-align:center}</style></head><body>'+clone.innerHTML+'</body></html>';
  dlB(new Blob(['\ufeff',h],{type:'application/msword'}),gfn('.doc'));
}

function showDocOptions(){
  document.getElementById('docOptions').style.display='block';
  document.getElementById('docActions').style.display='none';
  document.getElementById('docC').innerHTML='';
  document.getElementById('pNu').value='';
  docOk=false;
}

function toggleMoFields(){
  var dt=document.getElementById('pTy').value;
  var moCard=document.querySelector('#panel-params .card:nth-last-child(2)');
  // MO fields visibility hint - no hide needed since they're in params
}

// === UTILS ===
function gid(){return 'i'+Math.random().toString(36).substr(2,9)}
function fmt(v){return new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(v)}
function esc(s){if(!s)return '';var d=document.createElement('div');d.textContent=s;return d.innerHTML}
function updB(){document.getElementById('bc').textContent=items.length}
function gfn(e){var t=document.getElementById('pTy').value;var n=document.getElementById('pNu').value||'doc';return(t==='facture'?'Facture':'Devis')+'_'+n+e}
function dlB(b,n){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click();URL.revokeObjectURL(a.href)}

function resetAll(){
  if(items.length>0&&!confirm('R\u00e9initialiser ? Toutes les donn\u00e9es seront perdues.'))return;
  items=[];filt=null;docOk=false;updB();
  document.getElementById('docC').innerHTML='';
  document.getElementById('docOptions').style.display='block';
  document.getElementById('docActions').style.display='none';
  document.getElementById('pNu').value='';
  document.getElementById('impRes').innerHTML='';
  switchTab('params');
}

// === CODE POSTAL -> VILLE (API geo.api.gouv.fr) ===
var cpTimeout=null;
function lookupCP(val){
  var st=document.getElementById('cpStatus');
  var vi=document.getElementById('cVi');
  val=val.replace(/\D/g,'');
  document.getElementById('cCp').value=val;
  if(val.length<5){vi.value='';st.innerHTML='';vi.readOnly=true;vi.style.background='var(--g50)';return}
  if(val.length===5){
    st.innerHTML='<i class="fas fa-spinner fa-spin"></i> Recherche...';
    if(cpTimeout) clearTimeout(cpTimeout);
    cpTimeout=setTimeout(function(){
      fetch('https://geo.api.gouv.fr/communes?codePostal='+val+'&fields=nom&limit=10')
      .then(function(r){return r.json()})
      .then(function(data){
        if(data.length===0){
          st.innerHTML='<span style="color:var(--dan)"><i class="fas fa-times-circle"></i> Code postal non trouv\u00e9</span>';
          vi.value='';vi.readOnly=true;vi.style.background='var(--g50)';
        } else if(data.length===1){
          vi.value=data[0].nom;
          vi.readOnly=true;vi.style.background='var(--g50)';
          st.innerHTML='<span style="color:var(--suc)"><i class="fas fa-check-circle"></i> '+data[0].nom+'</span>';
        } else {
          // Multiple cities for this CP - show select
          vi.readOnly=false;vi.style.background='#fff';
          vi.value=data[0].nom;
          var opts=data.map(function(c){return c.nom}).join(', ');
          st.innerHTML='<span style="color:var(--pri)"><i class="fas fa-info-circle"></i> Plusieurs villes : '+opts+'</span>';
        }
      })
      .catch(function(){
        st.innerHTML='<span style="color:var(--dan)"><i class="fas fa-wifi-slash"></i> Hors ligne - saisissez la ville manuellement</span>';
        vi.readOnly=false;vi.style.background='#fff';
      });
    },300);
  }
}

// INIT
document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('pDa').value=new Date().toISOString().split('T')[0];
  setupDZ();
  renderEnts();
});

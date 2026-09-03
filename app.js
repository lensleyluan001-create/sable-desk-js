const PHOTO="https://raw.githubusercontent.com/lensleyluan001-create/sable-looks/main/";
const SELLERS=["wian","luan","dylan"];
const SL={wian:"Wian",luan:"Luan",dylan:"Dylan"};
const UK=["3","4","5","6","7","8","9","10","11","12","13"];
const HIDES=[["book","As photographed"],["tan","Tan"],["brown","Brown"],["dark","Dark brown"],["black","Black"],["olive","Olive"]];
const HIDE_SWATCH={book:"#8a7a68",tan:"#c4a574",brown:"#6b4634",dark:"#3a2418",black:"#14110e",olive:"#5a6348"};
const TYPE_SLUG={"Vellie":"vellie","Wool-lined vellie":"vellie","Kids vellie":"vellie","Golfer":"golfer","Chelsea":"chelsea","Derby":"derby","Kids derby":"derby","Hiking boot":"hike","Combat boot":"combat","Loafer":"loafer","Sandal":"sandal","Thong":"thong","Zip boot":"zip","Wool-lined boot":"woolboot","Wool-lined slipper":"slip"};
const LACE_COLS=[["natural","Rawhide"],["tan","Tan"],["brown","Brown"],["black","Black"],["olive","Olive"],["white","White"]];
const STITCH_COLS=[["cream","Cream"],["tan","Tan"],["brown","Brown"],["black","Black"],["olive","Olive"],["white","White"]];
const EXTRA_FEE=50;
const SOURCES=[["whatsapp","WhatsApp"],["website","Website"],["instagram","Instagram"],["walk-in","Walk-in"],["referral","Referral"],["other","Other"]];
const STAGES=[["new","New"],["contacted","Working"],["qualified","Working"],["negotiation","Working"],["closed","Closed"],["lost","Lost"]];
const RAW=[[1,"Vellie",599,350],[2,"Vellie",649,449],[3,"Vellie",599,399],[4,"Golfer",1200,1000],[5,"Vellie",699,499],[6,"Vellie",599,399],[7,"Vellie",649,449],[8,"Wool-lined boot",799,599],[9,"Wool-lined boot",799,599],[10,"Wool-lined slipper",699,499],[11,"Hiking boot",799,599],[12,"Vellie",649,449],[13,"Derby",599,399],[14,"Derby",799,599],[15,"Chelsea",1100,900],[16,"Vellie",599,399],[17,"Vellie",799,599],[18,"Vellie",699,499],[19,"Vellie",699,499],[20,"Derby",599,399],[21,"Derby",599,399],[22,"Derby",799,599],[23,"Golfer",999,799],[24,"Derby",599,399],[25,"Derby",599,399],[26,"Derby",599,399],[27,"Sandal",449,249],[28,"Thong",449,249],[29,"Thong",449,249],[30,"Sandal",449,249],[31,"Derby",649,449],[32,"Zip boot",899,699],[33,"Derby",599,399],[34,"Derby",599,399],[35,"Derby",599,399],[36,"Vellie",649,449],[37,"Vellie",649,449],[38,"Vellie",649,449],[39,"Chelsea",1100,900],[40,"Chelsea",1100,900],[41,"Derby",649,449],[42,"Derby",599,399],[43,"Loafer",699,499],[44,"Vellie",649,449],[45,"Vellie",699,499],[46,"Vellie",699,499],[47,"Golfer",850,650],[48,"Vellie",699,499],[49,"Thong",449,249],[50,"Vellie",699,499],[51,"Vellie",699,499],[52,"Vellie",699,499],[53,"Vellie",699,499],[54,"Vellie",699,499],[55,"Vellie",649,449],[56,"Hiking boot",799,599],[57,"Wool-lined vellie",799,599],[58,"Vellie",699,499],[59,"Vellie",799,599],[60,"Golfer",1100,900],[61,"Hiking boot",799,599],[62,"Vellie",699,499],[63,"Golfer",1300,1100],[64,"Vellie",699,499],[65,"Combat boot",1400,1200],[66,"Combat boot",1400,1200],[67,"Combat boot",1400,1200],[68,"Combat boot",1200,1000],[69,"Chelsea",1100,900],[70,"Chelsea",1100,900],[71,"Chelsea",1100,900],[72,"Chelsea",1100,900],[73,"Chelsea",1100,900],[74,"Chelsea",1100,900],[75,"Chelsea",1100,900],[76,"Chelsea",1100,900],[77,"Chelsea",1100,900],[78,"Kids vellie",399,199],[79,"Kids derby",399,199],[80,"Hiking boot",1400,1200],[81,"Hiking boot",899,699],[82,"Hiking boot",1400,1200],[83,"Hiking boot",1400,1200],[84,"Hiking boot",1400,1200],[85,"Hiking boot",1400,1200],[86,"Hiking boot",1400,1200],[87,"Vellie",699,499],[88,"Combat boot",1600,1400],[89,"Vellie",699,499],[90,"Golfer",1200,1000],[91,"Zip boot",799,599],[92,"Vellie",699,499]];
function viewHost(){
  try{
    const h=location.hostname||"";
    if(h.indexOf("vercel.app")>=0) return PHOTO+"views/";
  }catch(e){}
  return "./views/";
}
function studioOf(sku,n){return viewHost()+sku+"-"+n+".jpg?v=5"}
const PAIRS=RAW.map(([n,look,price,cost])=>{
  const sku=String(45000+n);
  return {n,sku,look,price,cost,img:studioOf(sku,1)};
});
function looksOf(){
  const out=[];
  const seen={};
  for(const p of PAIRS){
    if(!seen[p.look]){seen[p.look]=1;out.push(p.look)}
  }
  return out;
}
function matchLook(p,type){return !type||p.look===type}
function shoe(sku){return PAIRS.find(p=>p.sku===String(sku))||null}
function hideName(id){const h=HIDES.find(x=>x[0]===id);return h?h[1]:"As photographed"}
function typeSlug(look){return TYPE_SLUG[look]||"vellie"}
function studioSrc(slug,n){return viewHost()+slug+"-"+n+".jpg?v=5"}
function viewsOf(p,hide){
  const sku=String(p&&p.sku||"");
  return [1,2,3,4,5].map(n=>studioOf(sku,n));
}
function hideSwatch(id){return HIDE_SWATCH[id]||HIDE_SWATCH.book}
function hideChips(on,attr,short){
  attr=attr||"data-hide";
  on=on||"book";
  const shortLab={book:"Book",tan:"Tan",brown:"Brown",dark:"Dark",black:"Black",olive:"Olive"};
  return HIDES.map(([id,lab])=>{
    const t=short?shortLab[id]||lab:lab;
    return '<button class="hide'+(on===id?" on":"")+'" type="button" '+attr+'="'+id+'" title="'+lab+'"><span class="sw" style="background:'+hideSwatch(id)+'"></span>'+t+"</button>";
  }).join("");
}
const LACE_HEX={natural:"#d7c6a6",tan:"#c49a62",brown:"#6b4634",black:"#1c1814",olive:"#5c6848",white:"#f6f1e8"};
const STITCH_HEX={cream:"#eadcc4",tan:"#c49a62",brown:"#6b4634",black:"#1c1814",olive:"#5c6848",white:"#f6f1e8"};
function matchSeller(name){
  const q=String(name||"").trim().toLowerCase();
  if(!q) return null;
  if(q==="wian"||q.indexOf("wian")===0) return "wian";
  if(q==="luan"||q.indexOf("luan")===0) return "luan";
  if(q==="dylan"||q.indexOf("dylan")===0) return "dylan";
  return null;
}
function xmlEsc(s){
  const amp=String.fromCharCode(38)+"amp;";
  const lt=String.fromCharCode(38)+"lt;";
  const gt=String.fromCharCode(38)+"gt;";
  const qt=String.fromCharCode(38)+"quot;";
  return String(s||"").split(String.fromCharCode(38)).join(amp).split("<").join(lt).split(">").join(gt).split('"').join(qt);
}
function customTag(note){
  const raw=String(note||"").trim().split(/\n/)[0];
  const t=(raw||"Custom").slice(0,16);
  return '<svg class="fit fit-custom" viewBox="0 0 92 32" aria-hidden="true">'+
    '<rect x="1" y="1" width="90" height="30" rx="3" fill="#2a2118" stroke="#c4a574" stroke-width="1.15"/>'+
    '<rect x="4.5" y="4.5" width="83" height="23" rx="2" fill="none" stroke="#c4a57466" stroke-width=".55"/>'+
    '<text x="46" y="20" text-anchor="middle" font-size="8.5" font-family="Georgia,\'Iowan Old Style\',serif" letter-spacing="1.5" fill="#eadcc4">'+xmlEsc(t.toUpperCase())+"</text></svg>";
}
function extraPaint(p,extras,viewI){
  extras=extraFix(extras);
  if(!extras.custom) return "";
  return '<div class="fit-layer">'+customTag(extras.customNote)+"</div>";
}
function turnHtml(p,hide,viewI,extras){
  hide=hide||"book";
  const shots=viewsOf(p,hide);
  let i=Number(viewI)||0;
  if(i<0) i=shots.length-1;
  if(i>=shots.length) i=0;
  const src=shots[i]||(p&&p.img)||"";
  const alt=p?(p.sku+" "+p.look):"";
  const dots=shots.map((_,n)=>'<button type="button" class="dot'+(n===i?" on":"")+'" data-view="'+n+'" aria-label="View '+(n+1)+'"></button>').join("");
  const look=typeSlug(p&&p.look);
  return '<div class="turn" data-hide="'+hide+'" data-v="'+(i+1)+'" data-look="'+look+'"><div class="stage"><img src="'+src+'" alt="'+alt+'" draggable="false" />'+
    extraPaint(p,extras,i)+
    '</div><div class="dots">'+dots+"</div></div>";
}
function hookTurn(setView){
  const box=document.querySelector(".turn");
  if(!box||typeof setView!=="function") return;
  let x0=null;
  box.onpointerdown=function(e){
    if(e.target&&e.target.closest&&e.target.closest("[data-view]")) return;
    x0=e.clientX;
  };
  box.onpointerup=function(e){
    if(x0==null) return;
    const dx=e.clientX-x0;
    x0=null;
    if(Math.abs(dx)<24) return;
    setView(dx<0?1:-1);
  };
  box.querySelectorAll("[data-view]").forEach(b=>b.onclick=function(e){
    e.preventDefault();
    e.stopPropagation();
    setView(0,Number(b.getAttribute("data-view")));
  });
}
function lacedLook(look){return /vellie|golfer|derby|hiking|combat|wool-lined boot|zip/i.test(String(look||""))}
function extraFix(e){
  e=e&&typeof e==="object"?e:{};
  return {
    laser:!!e.laser,
    laserPhoto:String(e.laserPhoto||""),
    laces:!!e.laces,
    laceColour:e.laceColour||"natural",
    stitch:!!e.stitch,
    stitchColour:e.stitchColour||"cream",
    custom:!!e.custom,
    customNote:String(e.customNote||""),
    customFee:Number(e.customFee||0)||0
  };
}
function extraSum(e,qty){
  e=extraFix(e);
  qty=Number(qty||1)||1;
  let n=0;
  if(e.laser) n+=EXTRA_FEE;
  if(e.laces) n+=EXTRA_FEE;
  if(e.stitch) n+=EXTRA_FEE;
  n+=e.customFee;
  return n*qty;
}
function extraBits(e){
  e=extraFix(e);
  const bits=[];
  if(e.laser) bits.push("Laser");
  if(e.laces) bits.push("Laces "+(LACE_COLS.find(x=>x[0]===e.laceColour)||[e.laceColour,e.laceColour])[1]);
  if(e.stitch) bits.push("Stitch "+(STITCH_COLS.find(x=>x[0]===e.stitchColour)||[e.stitchColour,e.stitchColour])[1]);
  if(e.custom) bits.push("Custom");
  return bits;
}
function extraLabel(e){
  e=extraFix(e);
  const bits=extraBits(e);
  if(e.custom&&e.customFee) bits[bits.length-1]="Custom";
  return bits.join(" · ");
}
function colChips(rows,on,attr){
  return rows.map(([id,lab])=>'<button class="chip '+(on===id?"on":"")+'" type="button" '+attr+'="'+id+'">'+lab+"</button>").join("");
}
function extrasHtml(e,look,kind){
  e=extraFix(e);
  kind=kind||"ex";
  const laced=lacedLook(look);
  const laserOn=e.laser?" on":"";
  const laceOn=e.laces?" on":"";
  const stitchOn=e.stitch?" on":"";
  const customOn=e.custom?" on":"";
  let html='<label>Extras</label><div class="chips extras-row">'+
    '<button class="chip'+laserOn+'" type="button" data-'+kind+'="laser">Laser · R50</button>'+
    (laced?'<button class="chip'+laceOn+'" type="button" data-'+kind+'="laces">Laces · R50</button>':"")+
    '<button class="chip'+stitchOn+'" type="button" data-'+kind+'="stitch">Stitching · R50</button>'+
    '<button class="chip'+customOn+'" type="button" data-'+kind+'="custom">Custom · quoted</button></div>';
  if(e.laser){
    html+='<label>Photo to laser</label><input type="file" id="'+kind+'-laser" accept="image/*" />';
    if(e.laserPhoto) html+='<img class="laser-preview" src="'+e.laserPhoto+'" alt="Laser art" />';
    else html+='<p class="meta">Upload the mark. We will confirm before we burn.</p>';
  }
  if(e.laces&&laced){
    html+='<label>Lace colour</label><div class="chips">'+colChips(LACE_COLS,e.laceColour,"data-"+kind+"lace")+"</div>";
  }
  if(e.stitch){
    html+='<label>Stitch colour</label><div class="chips">'+colChips(STITCH_COLS,e.stitchColour,"data-"+kind+"stitch")+"</div>";
  }
  if(e.custom){
    html+='<label>Custom</label><textarea id="'+kind+'-custom" placeholder="What to change on the pair.">'+esc(e.customNote||"")+'</textarea>';
    if(kind==="p") html+='<label>Custom amount</label><input id="p-customfee" inputmode="numeric" value="'+(e.customFee||"")+'" placeholder="Quoted ZAR" />';
    else html+='<p class="meta">Custom is quoted. Sable will confirm.</p>';
  }
  html+='<p class="hint extra-hint">Laser, laces and stitching are R50 each. Custom depends on the work. Written on the ticket, not drawn on the photo.</p>';
  return html;
}
function shrinkPic(file,done){
  if(!file||!file.type||file.type.indexOf("image")!==0) return;
  const img=new Image();
  const url=URL.createObjectURL(file);
  img.onload=function(){
    const max=720;
    let w=img.width,h=img.height;
    if(w>max){h=Math.round(h*max/w);w=max}
    if(h>max){w=Math.round(w*max/h);h=max}
    const c=document.createElement("canvas");
    c.width=w;c.height=h;
    c.getContext("2d").drawImage(img,0,0,w,h);
    URL.revokeObjectURL(url);
    done(c.toDataURL("image/jpeg",0.72));
  };
  img.src=url;
}
function hookExtras(kind,getEx,setEx){
  document.querySelectorAll("[data-"+kind+"]").forEach(b=>b.onclick=function(){
    const ex=extraFix(getEx());
    const k=b.getAttribute("data-"+kind);
    if(k==="laser") ex.laser=!ex.laser;
    if(k==="laces") ex.laces=!ex.laces;
    if(k==="stitch") ex.stitch=!ex.stitch;
    if(k==="custom") ex.custom=!ex.custom;
    if(!ex.laser) ex.laserPhoto="";
    if(!ex.custom){ex.customNote="";ex.customFee=0}
    setEx(ex);
  });
  document.querySelectorAll("[data-"+kind+"lace]").forEach(b=>b.onclick=function(){
    const ex=extraFix(getEx());
    ex.laces=true;
    ex.laceColour=b.getAttribute("data-"+kind+"lace")||"natural";
    setEx(ex);
  });
  document.querySelectorAll("[data-"+kind+"stitch]").forEach(b=>b.onclick=function(){
    const ex=extraFix(getEx());
    ex.stitch=true;
    ex.stitchColour=b.getAttribute("data-"+kind+"stitch")||"cream";
    setEx(ex);
  });
  const laser=document.getElementById(kind+"-laser");
  if(laser) laser.onchange=function(){
    const f=laser.files&&laser.files[0];
    if(!f) return;
    shrinkPic(f,function(data){
      const ex=extraFix(getEx());
      ex.laser=true;
      ex.laserPhoto=data;
      setEx(ex);
    });
  };
  const note=document.getElementById(kind+"-custom");
  if(note) note.onchange=function(){
    const ex=extraFix(getEx());
    ex.custom=true;
    ex.customNote=String(note.value||"").trim();
    setEx(ex,true);
  };
  const fee=document.getElementById("p-customfee");
  if(fee) fee.onchange=function(){
    const ex=extraFix(getEx());
    ex.custom=true;
    ex.customFee=Number(String(fee.value||"").replace(/[^\d]/g,""))||0;
    setEx(ex,true);
  };
}
;
const KEY="sable-crm-v4";
const API="/api/lead";
const LUAN={name:"Luan Lensley",email:"lensleyluan001@gmail.com",x:"lensleylua83617",password:"SableCRM4181",role:"admin",seller:"luan",status:"approved"};
function esc(s){
  const amp=String.fromCharCode(38)+"amp;";
  const lt=String.fromCharCode(38)+"lt;";
  const gt=String.fromCharCode(38)+"gt;";
  const qt=String.fromCharCode(38)+"quot;";
  return String(s||"").split(String.fromCharCode(38)).join(amp).split("<").join(lt).split(">").join(gt).split('"').join(qt);
}
function norm(s){return String(s||"").trim().toLowerCase().replace(/^@/,"")}
function samePass(a,b){return String(a||"").trim().toLowerCase()===String(b||"").trim().toLowerCase()}
function isHouse(id){const q=norm(id);return !q||q===LUAN.email||q===LUAN.x||q==="luan"||q==="luan lensley"||q==="lensleyluan001"||q.indexOf("lensleyluan001")===0}
function uid(){return "ld-"+Math.random().toString(36).slice(2,10)}
function zar(n){if(n==null||n==="")return "POA";return "R"+Number(n).toLocaleString("en-ZA")}
function digits(p){return String(p||"").replace(/\D/g,"")}
function wa(phone,text){let d=digits(phone);if(d.length<9)return "";if(d[0]==="0")d="27"+d.slice(1);return "https://wa.me/"+d+(text?"?text="+encodeURIComponent(text):"")}
function colOf(st){if(st==="new"||st==="inbox")return "new";if(st==="closed")return "closed";if(st==="lost")return "lost";return "working"}
function splitOf(seller){if(seller==="wian")return {wian:.2,luan:.4,dylan:.3,house:.1};if(seller==="luan")return {wian:0,luan:.6,dylan:.3,house:.1};if(seller==="dylan")return {wian:0,luan:0,dylan:.9,house:.1};return {wian:0,luan:0,dylan:0,house:1}}
function itemFix(it){
  it=it&&typeof it==="object"?it:{};
  const p=shoe(it.sku);
  const qty=Number(it.qty||1)||1;
  const extras=extraFix(it.extras);
  const listedPrice=Number(it.listedPrice)>0?Number(it.listedPrice):null;
  const listed=listedPrice||(p?p.price:0);
  return {
    sku:String(it.sku||""),
    look:String(it.look||(p&&p.look)||""),
    size:String(it.size||""),
    qty,
    colour:it.colour||"book",
    extras,
    listedPrice,
    listed
  };
}
function itemsOf(l){
  if(!l) return [];
  if(Array.isArray(l.items)&&l.items.length) return l.items.map(itemFix);
  return [itemFix(l)];
}
function leadFix(l){
  const items=itemsOf(l);
  const first=items[0]||itemFix({});
  const p=shoe(l.sku||first.sku);
  const miss=items.some(it=>!it.size);
  return {
    id:l.id||uid(),
    name:String(l.name||"").trim(),
    phone:String(l.phone||"").trim(),
    sku:String(first.sku||l.sku||""),
    look:String(first.look||l.look||(p&&p.look)||""),
    size:miss?"":String(first.size||l.size||""),
    qty:items.reduce((n,it)=>n+it.qty,0)||1,
    items,
    source:l.source||"whatsapp",
    status:l.status||(l.stage==="inbox"?"new":l.stage)||"new",
    note:String(l.note||""),
    owner:l.owner||matchSeller(l.salesman)||null,
    salesman:String(l.salesman||"").trim(),
    paid:Boolean(l.paid),
    paidAmount:Number(l.paidAmount||0)||0,
    delivery:l.delivery||"collect",
    deliveryFee:Number(l.deliveryFee||0)||0,
    colour:first.colour||l.colour||"book",
    extras:extraFix(first.extras||l.extras),
    listedPrice:items.length===1?first.listedPrice:(Number(l.listedPrice)>0?Number(l.listedPrice):null),
    nextAction:l.nextAction||l.next||"",
    nextActionAt:l.nextActionAt||null,
    invRef:String(l.invRef||""),
    createdAt:l.createdAt||Date.now(),
    updatedAt:l.updatedAt||l.createdAt||Date.now(),
    sitAt:l.sitAt||l.updatedAt||l.createdAt||Date.now()
  };
}
function emptyBank(){return {bank:"",accountName:"",accountNumber:"",branch:"",type:"Cheque"}}
function keepLeads(list){
  const byId=new Map();
  for(const raw of list||[]){
    if(!raw||typeof raw!=="object") continue;
    const l=raw.id?raw:leadFix(raw);
    if(!l||!l.id) continue;
    const prev=byId.get(l.id);
    if(!prev){byId.set(l.id,l);continue}
    const pt=Number(prev.updatedAt||prev.createdAt||0);
    const nt=Number(l.updatedAt||l.createdAt||0);
    byId.set(l.id,nt>=pt?Object.assign({},prev,l):Object.assign({},l,prev));
  }
  return Array.from(byId.values());
}
function load(){
  let s;
  try{
    s=Object.assign({session:null,users:[Object.assign({},LUAN)],requests:[],leads:[],meetings:[],invoices:[],bank:emptyBank()},JSON.parse(localStorage.getItem(KEY)||"null")||{});
  }catch(e){
    s={session:null,users:[Object.assign({},LUAN)],requests:[],leads:[],meetings:[],invoices:[],bank:emptyBank()};
  }
  if(!s.users)s.users=[];
  if(!s.leads)s.leads=[];
  if(!s.meetings)s.meetings=[];
  if(!s.requests)s.requests=[];
  if(!s.invoices)s.invoices=[];
  if(!s.bank||typeof s.bank!=="object")s.bank=emptyBank();
  else s.bank=Object.assign(emptyBank(),s.bank);
  let extra=[];
  try{
    const raw=JSON.parse(localStorage.getItem(KEY+"-leads")||"[]");
    if(Array.isArray(raw)) extra=raw;
  }catch(e){}
  s.leads=keepLeads(s.leads.concat(extra)).map(leadFix);
  const i=s.users.findIndex(u=>norm(u.email)===LUAN.email);
  if(i<0)s.users.unshift(Object.assign({},LUAN));
  else{
    s.users[i].status="approved";
    s.users[i].role="admin";
    s.users[i].name=s.users[i].name||LUAN.name;
    s.users[i].email=LUAN.email;
    s.users[i].x=LUAN.x;
    s.users[i].seller=s.users[i].seller||"luan";
    if(!s.users[i].password)s.users[i].password=LUAN.password;
  }
  return s;
}
let vaultTimer=0;
function vaultPush(){
  try{
    clearTimeout(vaultTimer);
    vaultTimer=setTimeout(function(){
      fetch(API,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({leads:S.leads})}).catch(function(){});
    },400);
  }catch(e){}
}
function save(){
  let stored=[];
  try{
    const prev=JSON.parse(localStorage.getItem(KEY)||"null");
    if(prev&&Array.isArray(prev.leads)) stored=prev.leads;
  }catch(e){}
  try{
    const extra=JSON.parse(localStorage.getItem(KEY+"-leads")||"[]");
    if(Array.isArray(extra)) stored=stored.concat(extra);
  }catch(e){}
  S.leads=keepLeads(stored.concat(S.leads)).map(leadFix);
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
  try{localStorage.setItem(KEY+"-leads",JSON.stringify(S.leads))}catch(e){}
  vaultPush();
}
let S=load();
let mode="in";
let tab="todo";
let toast="";
let deskFilter="all";
let boardCol="new";
let pane="work";
let personId=null;
let cap={sku:"45015",name:"",phone:"",size:"",qty:1,source:"whatsapp",note:"",delivery:"collect",owner:"luan",type:"",colour:"book",view:0,extras:extraFix(),listedPrice:null};
let pairView=0;
let lastCapId=null;
let navOpen=localStorage.getItem("sable-nav-v1")==="open";
function setNavOpen(on){
  navOpen=!!on;
  localStorage.setItem("sable-nav-v1",navOpen?"open":"shut");
}

function house(){
  let u=S.users.find(u=>norm(u.email)===LUAN.email);
  if(!u){u=Object.assign({},LUAN);S.users.unshift(u)}
  u.status="approved";u.role="admin";u.email=LUAN.email;u.name=u.name||LUAN.name;u.x=LUAN.x;u.seller=u.seller||"luan";
  return u;
}
function enter(u){
  S.session={email:u.email,name:u.name||LUAN.name,role:u.role||"sales",seller:u.seller||"luan"};
  toast="";tab="todo";personId=null;
  if(houseView()){
    const saved=readDesk();
    deskFilter=SELLERS.indexOf(saved)>=0?saved:(u.seller||"luan");
    writeDesk(deskFilter);
  }else deskFilter=u.seller||"luan";
  save();draw();
}
function houseView(){return S.session&&(S.session.role==="admin"||S.session.role==="manager")}
function mySeller(){return (S.session&&S.session.seller)||"luan"}
function seeCost(){return S.session&&(S.session.role==="admin"||S.session.role==="manager")}
const DESK_KEY="sable-desk-v1";
function readDesk(){
  try{return localStorage.getItem(DESK_KEY)||""}catch(e){return ""}
}
function writeDesk(id){
  try{localStorage.setItem(DESK_KEY,id||"")}catch(e){}
}
function bootDesk(){
  if(!S.session){deskFilter="all";return}
  if(!houseView()){deskFilter=mySeller();return}
  const saved=readDesk();
  deskFilter=SELLERS.indexOf(saved)>=0?saved:(S.session.seller||"luan");
}
bootDesk();
function bookOf(l){
  if(!l) return null;
  if(l.owner&&SELLERS.indexOf(l.owner)>=0) return l.owner;
  return matchSeller(l.salesman)||null;
}
function leads(){
  let rows=S.leads.slice();
  if(!houseView()) rows=rows.filter(l=>bookOf(l)===mySeller());
  if(houseView()&&deskFilter!=="all") rows=rows.filter(l=>bookOf(l)===deskFilter);
  return rows;
}
function firstMsg(l){
  const t=ticket(l);
  const who=l.name?("Hi "+l.name.split(" ")[0]):"Hi";
  const items=t.items||itemsOf(l);
  const custom=t.custom?" · Custom":"";
  if(items.length>1){
    const lines=items.map(it=>it.sku+" "+it.look+(it.size?(" UK "+it.size):"")+(it.qty>1?(" ×"+it.qty):"")).join("; ");
    const need=items.some(it=>!it.size);
    return who+", this is SABLE.CO. "+t.qty+" pairs: "+lines+". Listed "+zar(t.listed)+". Handmade. Subject to availability. "+(need?"Reply with UK size per pair and I will confirm.":"Pair count if more than one and I will confirm.");
  }
  const size=l.size
    ?("UK "+l.size+" is locked. Pair count if more than one and I will confirm.")
    :"Reply with UK size and pair count and I will confirm.";
  return who+", this is SABLE.CO. Stock "+(l.sku||"")+" · "+(l.look||"")+custom+" · "+zar(t.listed)+". Handmade. Subject to availability. "+size;
}
function feeOf(d){return d==="local"?100:d==="int"?300:0}
function pickSku(raw){
  const d=String(raw||"").replace(/\D/g,"");
  if(!d) return null;
  if(d.length<=2) return shoe(String(45000+Number(d)));
  if(d.length===3) return shoe("45"+d)||shoe(d);
  if(d.length===4) return shoe("4"+d)||shoe(d);
  return shoe(d);
}
function delLabel(d){if(d==="local")return "Local R100";if(d==="int")return "International R300";return "Collect"}
function unitListed(l){
  const p=shoe(l&&l.sku);
  const o=Number(l&&l.listedPrice);
  if(o>0) return o;
  return p?p.price:0;
}
function isCustomPair(l){
  if(!l) return false;
  return itemsOf(l).some(function(it){
    const ex=extraFix(it.extras);
    if(ex.custom||ex.customFee) return true;
    const p=shoe(it.sku);
    const o=Number(it.listedPrice);
    return !!(p&&o>0&&o!==p.price);
  });
}
function nametag(l){return isCustomPair(l)?'<span class="nametag">Custom</span>':""}
function ticket(l){
  const items=itemsOf(l);
  const first=items[0]||itemFix(l||{});
  const p=shoe(first.sku);
  const qty=items.reduce((n,it)=>n+it.qty,0)||1;
  const listed=items.reduce((n,it)=>n+Number(it.listed||0)*it.qty,0);
  const extras=items.reduce((n,it)=>n+extraSum(it.extras,it.qty),0);
  const fee=Number(l&&l.deliveryFee||0)||0;
  return {p,qty,listed,fee,extras,due:listed+fee+extras,custom:isCustomPair(l),items};
}
function isWebApp(l){
  const s=String(l&&l.source||"").toLowerCase();
  return s==="web"||s==="website"||s.indexOf("want")>=0||s.indexOf("lookbook")>=0;
}
function pairCostOf(l){
  return itemsOf(l).reduce(function(n,it){
    const sp=shoe(it.sku);
    return n+(((sp&&sp.cost)||0)*Number(it.qty||1));
  },0);
}
function monthKey(ts){
  const d=new Date(Number(ts)||Date.now());
  if(isNaN(d.getTime())) return monthKey(Date.now());
  const m=d.getMonth()+1;
  return d.getFullYear()+"-"+(m<10?"0"+m:String(m));
}
function monthShift(key,n){
  const parts=String(key||"").split("-");
  const y=Number(parts[0])||new Date().getFullYear();
  const m=Number(parts[1])||(new Date().getMonth()+1);
  const d=new Date(y,m-1+n,1);
  const mm=d.getMonth()+1;
  return d.getFullYear()+"-"+(mm<10?"0"+mm:String(mm));
}
function monthShort(key){
  const names=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const m=Number(String(key).split("-")[1])||1;
  return names[m-1]||key;
}
function pct(n){
  if(n==null||!isFinite(n)) return "—";
  return Math.round(n)+"%";
}
function tallyMoney(rows){
  rows=rows||[];
  const now=Date.now();
  const thisKey=monthKey(now);
  const lastKey=monthShift(thisKey,-1);
  const keys=[];
  for(let i=11;i>=0;i--) keys.push(monthShift(thisKey,-i));
  const months=keys.map(function(k){return {key:k,label:monthShort(k),paid:0,pairs:0,apps:0}});
  const ix={};
  months.forEach(function(m,i){ix[m.key]=i});
  let listed=0,accruedProfit=0;
  let paidRand=0,paidProfit=0,paidPairs=0,paidTickets=0;
  let apps=0,appsPaid=0,appsPaidPairs=0;
  let openDue=0,eftDue=0,lostRand=0,invOpen=0;
  let collectN=0,deliverN=0,customN=0,bookN=0;
  const src={website:0,whatsapp:0,other:0};
  const cuts={wian:0,luan:0,dylan:0,house:0};
  const books={
    wian:{paid:0,pairs:0,profit:0,apps:0},
    luan:{paid:0,pairs:0,profit:0,apps:0},
    dylan:{paid:0,pairs:0,profit:0,apps:0},
    floor:{paid:0,pairs:0,profit:0,apps:0}
  };
  let thisPaid=0,lastPaid=0,thisPairs=0,lastPairs=0,thisApps=0,lastApps=0;
  const outstanding=[];
  for(let i=0;i<rows.length;i++){
    const l=rows[i];
    const t=ticket(l);
    const cost=pairCostOf(l);
    const profit=Math.max(0,t.listed-cost);
    const created=monthKey(l.createdAt);
    const paidAt=monthKey(l.updatedAt||l.createdAt);
    const owner=bookOf(l)||"floor";
    if(!books[owner]) books[owner]={paid:0,pairs:0,profit:0,apps:0};
    if(isWebApp(l)){
      apps++;
      books[owner].apps++;
      if(ix[created]!=null) months[ix[created]].apps++;
      if(created===thisKey) thisApps++;
      if(created===lastKey) lastApps++;
      if(l.paid){appsPaid++;appsPaidPairs+=t.qty}
      src.website++;
    }else if(String(l.source||"whatsapp").toLowerCase().indexOf("whatsapp")>=0){
      src.whatsapp++;
    }else src.other++;
    if(l.delivery&&l.delivery!=="collect") deliverN++; else collectN++;
    if(t.custom) customN++; else bookN++;
    if(l.status==="lost"){
      lostRand+=t.due;
      continue;
    }
    listed+=t.listed;
    accruedProfit+=profit;
    if(l.status!=="closed") openDue+=t.due;
    if(!l.paid){
      if(l.invRef){
        eftDue+=t.due;
        invOpen++;
        outstanding.push({id:l.id,name:l.name,sku:l.sku,due:t.due,age:now-(l.updatedAt||l.createdAt||now),owner:owner});
      }
    }else{
      paidRand+=t.due;
      paidProfit+=profit;
      paidPairs+=t.qty;
      paidTickets++;
      const sp=splitOf(l.owner);
      cuts.wian+=Math.round(profit*sp.wian);
      cuts.luan+=Math.round(profit*sp.luan);
      cuts.dylan+=Math.round(profit*sp.dylan);
      cuts.house+=Math.round(profit*sp.house);
      books[owner].paid+=t.due;
      books[owner].pairs+=t.qty;
      books[owner].profit+=profit;
      if(ix[paidAt]!=null){
        months[ix[paidAt]].paid+=t.due;
        months[ix[paidAt]].pairs+=t.qty;
      }
      if(paidAt===thisKey){thisPaid+=t.due;thisPairs+=t.qty}
      if(paidAt===lastKey){lastPaid+=t.due;lastPairs+=t.qty}
    }
  }
  outstanding.sort(function(a,b){return b.age-a.age});
  const live=rows.filter(function(l){return l.status!=="lost"}).length;
  const conv=apps?(appsPaid/apps)*100:0;
  const sumMix=apps+paidPairs;
  const mixApps=sumMix?(apps/sumMix)*100:0;
  const mixPaid=sumMix?(paidPairs/sumMix)*100:0;
  const margin=paidRand?(paidProfit/paidRand)*100:0;
  const avg=paidTickets?(paidRand/paidTickets):0;
  const closeRate=live?(paidTickets/live)*100:0;
  const mom=lastPaid?((thisPaid-lastPaid)/lastPaid)*100:(thisPaid?100:0);
  return {
    listed,accruedProfit,paidRand,paidProfit,paidPairs,paidTickets,
    apps,appsPaid,appsPaidPairs,conv,mixApps,mixPaid,
    openDue,eftDue,lostRand,invOpen,
    collectN,deliverN,customN,bookN,src,
    cuts,books,months,thisKey,lastKey,
    thisPaid,lastPaid,thisPairs,lastPairs,thisApps,lastApps,
    margin,avg,closeRate,mom,outstanding,live
  };
}
function invRef(l){
  if(l&&l.invRef) return l.invRef;
  const tail=String((l&&l.sku)||"00000").slice(-5);
  const short=String((l&&l.id)||"xxxx").replace(/^ld-/,"").slice(-4).toUpperCase();
  return "SBL-"+tail+"-"+short;
}
function bankOf(){return Object.assign(emptyBank(),S.bank||{})}
function bankReady(){const b=bankOf();return !!(b.accountName&&b.accountNumber)}
function bankLines(){
  const b=bankOf();
  const lines=[];
  if(b.accountName) lines.push("Account name "+b.accountName);
  if(b.bank) lines.push(b.bank+(b.type?" · "+b.type:""));
  if(b.accountNumber) lines.push("Account "+b.accountNumber);
  if(b.branch) lines.push("Branch "+b.branch);
  return lines;
}
function stampInv(l){
  if(!l) return "";
  const ref=invRef(l);
  if(!l.invRef){
    l.invRef=ref;
    const i=S.leads.findIndex(x=>x.id===l.id);
    if(i>=0) S.leads[i].invRef=ref;
  }
  S.invoices=S.invoices||[];
  if(!S.invoices.some(x=>x.leadId===l.id&&x.ref===ref)){
    const t=ticket(l);
    S.invoices.unshift({id:"inv-"+ref,leadId:l.id,ref,amount:t.due,sku:l.sku,name:l.name,at:Date.now(),status:l.paid?"paid":"open"});
  }
  save();
  return ref;
}
function invMsg(l){
  const t=ticket(l);
  const ref=invRef(l);
  const who=l.name?("Hi "+l.name.split(" ")[0]):"Hi";
  const items=t.items||itemsOf(l);
  const lines=items.map(function(it){
    const hide=it.colour&&it.colour!=="book"?(" · "+hideName(it.colour)):"";
    const extras=extraLabel(it.extras);
    return it.sku+" "+it.look+(it.size?(" · UK "+it.size):"")+(it.qty>1?(" · "+it.qty+" pairs"):" · 1 pair")+hide+(extras?(" · "+extras):"");
  }).join(". ");
  const custom=t.custom?" Custom pair.":"";
  const ship=t.fee?("Delivery "+zar(t.fee)+" ("+delLabel(l.delivery)+")"):"Collect — no delivery";
  const bank=bankLines();
  return who+", SABLE.CO invoice "+ref+". "+lines+"."+custom+" Listed "+zar(t.listed)+(t.extras?(". Extras "+zar(t.extras)):"")+". "+ship+". EFT due "+zar(t.due)+". Use reference "+ref+"."+(bank.length?" "+bank.join(". ")+".":" Bank details from Sable with this message.")+" Reply paid when the transfer is sent. Pair confirmed after EFT.";
}
function localAt(iso){
  if(!iso) return "";
  const d=new Date(iso);
  if(isNaN(d.getTime())) return "";
  const l=new Date(d.getTime()-d.getTimezoneOffset()*60000);
  return l.toISOString().slice(0,16);
}
function payMsg(l){return invMsg(l)}
function sizeMsg(l){
  const who=l.name?("Hi "+l.name.split(" ")[0]):"Hi";
  const need=itemsOf(l).filter(it=>!it.size);
  if(need.length>1) return who+", UK size for each pair: "+need.map(it=>it.sku+" "+it.look).join(", ")+" and I lock them.";
  const it=need[0]||itemsOf(l)[0];
  return who+", UK size for the "+((it&&it.sku)||l.sku||"")+" "+((it&&it.look)||l.look||"")+" and I lock it.";
}
function followMsg(l){
  const who=l.name?("Hi "+l.name.split(" ")[0]):"Hi";
  return who+", checking in on the "+(l.sku||"")+" "+(l.look||"")+". Still want the pair?";
}
function clientWebUrl(){
  return "https://sable-floor.vercel.app/want";
}
function Gate(){
  let form="";
  if(mode==="reset") form='<form class="card" id="reset"><label>Email</label><input name="email" value="'+esc(LUAN.email)+'" autocomplete="username" /><label>New password</label><input name="password" type="password" required minlength="8" autocomplete="new-password" /><button class="solid" type="submit">Set password and enter</button></form><p class="sub">This phone only. House key still works after you set one.</p>';
  else if(mode==="ask") form='<form class="card" id="ask"><label>Name</label><input name="name" required /><label>Email</label><input name="email" type="email" required /><label>Password</label><input name="password" type="password" required minlength="6" /><label>Who</label><select name="seller"><option value="wian">Wian</option><option value="luan">Luan</option><option value="dylan">Dylan</option></select><button class="solid" type="submit">Send request</button></form>';
  else form='<form class="card" id="signin"><label>Email or X handle</label><input name="email" value="'+esc(LUAN.email)+'" autocomplete="username" required /><label>Password</label><input name="password" type="password" required autocomplete="current-password" /><button class="solid" type="submit">Enter</button></form><button class="ghost" type="button" id="forgot" style="margin-top:10px">Forgot password</button>';
  const title=mode==="reset"?"New password":mode==="ask"?"Request Sable":"Log in";
  return '<div class="gate"><div class="brand">SABLE CRM</div><h1>'+title+'</h1><p class="sub">Staff only. Luan email is filled in.</p><div class="row" style="margin-bottom:12px"><button class="chip '+(mode==="in"?"on":"")+'" type="button" id="m-in">Log in</button><button class="chip '+(mode==="ask"?"on":"")+'" type="button" id="m-ask">Request login</button></div>'+form+(toast?'<p class="err">'+esc(toast)+"</p>":"")+'<p class="sub" style="margin-top:22px">Looking for the pairs? <a class="client-link" href="/want">Open the collection</a></p></div>';
}
function navBtns(){
  const items=[["todo","To-do","T"],["board","Board","B"],["capture","Capture","C"],["clients","Clients","L"],["meetings","Meetings","M"]];
  if(S.session.role==="admin") items.push(["team","Team","A"]);
  return items.map(([id,label,mark])=>{
    const on=tab===id||(id==="clients"&&personId)||(id==="meetings"&&tab==="team");
    return '<button type="button" class="nav-block '+(on?"on":"")+'" data-tab="'+id+'"><span class="nav-mark">'+mark+'</span><span class="nav-name">'+label+"</span></button>";
  }).join("");
}
function deskChips(kind){
  if(!houseView()) return "";
  const n=id=>{
    if(kind==="todo"){
      const rows=id==="all"?S.leads.filter(l=>!bookOf(l)):S.leads.filter(l=>bookOf(l)===id);
      return rows.filter(l=>{const t=nextTodo(l);return t&&t.lane==="now"}).length;
    }
    const rows=id==="all"?S.leads:S.leads.filter(l=>bookOf(l)===id);
    return rows.filter(l=>l.status!=="lost").length;
  };
  const mine=mySeller();
  const order=[[mine,SL[mine]||"You"],...SELLERS.filter(s=>s!==mine).map(s=>[s,SL[s]]),["all","Floor"]];
  return '<div class="chips" style="margin:14px 0">'+order.map(([id,label])=>'<button class="chip '+(deskFilter===id?"on":"")+'" type="button" data-desk="'+id+'">'+label+(kind==="todo"&&n(id)?" "+n(id):"")+"</button>").join("")+"</div>";
}
function sitMs(l){
  return Math.max(0,Date.now()-(Number(l&&(l.sitAt||l.updatedAt||l.createdAt))||Date.now()));
}
function sitHeat(ms){
  if(ms<30*60000) return "fresh";
  if(ms<60*60000) return "warm";
  return "hot";
}
function sitLabel(ms){
  const m=Math.floor(ms/60000);
  if(m<1) return "Just now";
  if(m===1) return "1 min";
  if(m<60) return m+" min";
  const h=Math.floor(m/60);
  const r=m%60;
  if(h<48) return r?(h+"h "+r+"m"):(h+"h");
  const d=Math.round(h/24);
  return d===1?"1 day":d+" days";
}
function todoAge(it){
  const ms=it&&it.wait!=null?it.wait:sitMs(it&&it.lead);
  const heat=sitHeat(ms);
  const label=heat==="fresh"?"Under 30 min":heat==="warm"?"Over 30 min":"Over 1 hour";
  return '<span class="todo-age '+heat+'" title="'+esc(label)+'">'+sitLabel(ms)+"</span>";
}
function nextTodo(l){
  if(!l||l.status==="lost") return null;
  if(l.status==="closed"&&l.paid) return null;
  const now=Date.now();
  const due=l.nextActionAt?new Date(l.nextActionAt).getTime():0;
  const waiting=due>now;
  if(l.paid&&l.status!=="closed") return {kind:"close",step:"EFT is in",cta:"Mark closed",done:true,wa:false,lane:"now"};
  if(waiting){
    const why=l.nextAction||(!l.size?"Asked for UK size":!l.paid?"Invoice is out":"Pending");
    return {kind:"wait",step:why,cta:"Open",done:false,wa:false,lane:"wait"};
  }
  if(l.status==="closed"&&!l.paid) return {kind:"pay",step:"Chase the EFT",cta:"Chase EFT",done:true,wa:true,lane:"now"};
  if(l.status==="new"||l.status==="inbox") return {kind:"whatsapp",step:"Send the first WhatsApp",cta:"WhatsApp",done:true,wa:true,lane:"now"};
  if(!l.size){
    const asked=/asked|uk size/i.test(String(l.nextAction||""));
    return {kind:"size",step:asked?"Chase the size":"Ask for UK size",cta:"WhatsApp",done:true,wa:true,lane:"now"};
  }
  if(!l.paid){
    const sent=/invoice|eft|pay/i.test(String(l.nextAction||""));
    return {kind:"pay",step:sent?"Chase the EFT":"Send the invoice",cta:sent?"Chase EFT":"Send invoice",done:true,wa:true,lane:"now"};
  }
  return {kind:"follow",step:l.nextAction||"Follow up",cta:"WhatsApp",done:true,wa:true,lane:"now"};
}
function todoWaText(it){
  const l=it&&it.lead;
  if(!l) return "";
  if(it.kind==="whatsapp") return firstMsg(l);
  if(it.kind==="follow") return followMsg(l);
  if(it.kind==="pay") return invMsg(l);
  if(it.kind==="size") return sizeMsg(l);
  return "";
}
function todoVerb(it){
  if(!it) return "";
  if(it.kind==="close") return "Close the sale";
  if(it.kind==="take") return "Take this lead";
  if(it.kind==="whatsapp") return "Send the first WhatsApp";
  if(it.kind==="size") return /chase/i.test(it.step)?"Chase the size":"Ask for UK size";
  if(it.kind==="pay") return /chase/i.test(it.step)?"Chase the EFT":"Send the invoice";
  if(it.kind==="follow") return "Follow up";
  if(it.kind==="wait") return it.step||"Waiting on them";
  return it.step||"Open";
}
function todoStage(it){
  if(!it||!it.lead||it.kind==="take") return -1;
  const l=it.lead;
  if(it.kind==="close"||(l.paid&&l.status!=="closed")) return 3;
  if(it.kind==="pay"||l.size) return 2;
  if(it.kind==="size"||l.status==="contacted"||l.status==="working") return 1;
  return 0;
}
function todoPipe(it){
  const at=todoStage(it);
  if(at<0) return "";
  const steps=["WhatsApp","Size","Invoice","Close"];
  return '<ol class="todo-pipe" aria-label="Sale steps">'+steps.map((s,i)=>{
    const st=i<at?"done":i===at?"now":"";
    return '<li class="'+st+'">'+s+"</li>";
  }).join("")+"</ol>";
}
function buildTodos(){
  const mine=mySeller();
  const houseAll=houseView()&&deskFilter==="all";
  let rows;
  if(houseView()){
    if(houseAll) rows=S.leads.filter(l=>!bookOf(l));
    else rows=S.leads.filter(l=>bookOf(l)===deskFilter);
  }else{
    rows=S.leads.filter(l=>bookOf(l)===mine);
  }
  const now=Date.now();
  const items=[];
  for(const l of rows){
    let t=nextTodo(l);
    if(!t) continue;
    if(houseAll&&t.lane==="now") t={kind:"take",step:"Not on a book yet.",cta:"Take",done:false,wa:false,lane:"now"};
    const wait=sitMs(l);
    const overdue=t.lane==="now"&&(t.kind==="follow"||t.kind==="pay"||wait>2*86400000);
    const rank=t.kind==="close"?0:t.kind==="take"?1:t.kind==="whatsapp"?2:overdue&&t.kind==="pay"?3:t.kind==="size"?4:t.kind==="pay"?5:t.kind==="follow"?6:t.lane==="wait"?80:9;
    items.push({
      id:t.kind+"-"+l.id,
      kind:t.kind,
      step:t.step,
      cta:t.cta,
      done:t.done,
      wa:t.wa,
      lane:t.lane||"now",
      lead:l,
      due:l.nextActionAt||l.updatedAt||l.createdAt,
      overdue:!!overdue,
      wait,
      rank
    });
  }
  items.sort((a,b)=>a.rank-b.rank||b.wait-a.wait);
  return items;
}
function todoMeta(it){
  const l=it.lead;
  const t=ticket(l);
  return [t.qty>1?(t.qty+" pairs"):"", l.sku, l.look, l.size?("UK "+l.size):""].filter(Boolean).join(" · ");
}
function todoCta(it){
  const l=it.lead;
  if(!l) return "";
  const href=it.wa?wa(l.phone,todoWaText(it)):"";
  if(it.kind==="close") return '<button class="solid tight" type="button" data-done="'+esc(it.id)+'">Mark closed</button>';
  if(it.kind==="take") return '<button class="solid tight" type="button" data-take="'+l.id+'">Take onto my book</button>';
  if(it.kind==="size"){
    const ask=href?'<a class="solid tight" href="'+href+'" target="_blank" rel="noreferrer" data-wadone="'+esc(it.id)+'">WhatsApp size</a>':"";
    const sizes='<div class="todo-sizes"><p class="kicker">They replied · lock UK</p><div class="chips">'+UK.map(s=>'<button class="chip" type="button" data-lead="'+l.id+'" data-locksize="'+s+'">'+s+"</button>").join("")+"</div></div>";
    return ask+sizes+todoPendBtn(l,it);
  }
  if(it.kind==="pay"){
    const send=href?'<a class="solid tight" href="'+href+'" target="_blank" rel="noreferrer" data-wadone="'+esc(it.id)+'">'+esc(it.cta)+"</a>":'<button class="solid tight" type="button" data-go="person" data-id="'+l.id+'">Open</button>';
    return send+'<button class="ghost" type="button" data-todopaid="'+l.id+'">They paid</button>'+todoPendBtn(l,it);
  }
  if(href){
    const mark=it.done?' data-wadone="'+esc(it.id)+'"':"";
    return '<a class="solid tight" href="'+href+'" target="_blank" rel="noreferrer"'+mark+">"+esc(it.cta)+"</a>"+todoPendBtn(l,it);
  }
  return '<button class="solid tight" type="button" data-go="person" data-id="'+l.id+'">Open</button>'+todoPendBtn(l,it);
}
function todoPendBtn(l,it){
  if(!l||!it||it.kind==="close"||it.kind==="take"||it.lane==="wait") return "";
  return '<button class="ghost" type="button" data-pend="'+l.id+'">Pend</button>';
}
function todoHero(it,nNow){
  const l=it.lead;
  if(!l) return "";
  const p=shoe(l.sku);
  const img=p?'<img src="'+p.img+'" alt="'+esc(p.sku)+'">':"<div></div>";
  const of=nNow>1?("Next · 1 of "+nNow):"Next";
  const heat=sitHeat(it.wait!=null?it.wait:sitMs(l));
  return '<div class="todo-hero '+heat+'">'+
    '<div class="todo-hero-head"><p class="kicker">'+of+'</p>'+todoAge(it)+"</div>"+
    '<p class="todo-verb">'+esc(todoVerb(it))+"</p>"+
    '<div class="todo-hero-row">'+
      '<div class="todo-shot">'+img+"</div>"+
      '<div class="todo-body">'+
        '<p class="name">'+esc(l.name||"No name")+nametag(l)+"</p>"+
        '<p class="meta">'+esc(todoMeta(it))+"</p>"+
      "</div>"+
    "</div>"+
    todoPipe(it)+
    todoCta(it)+
  "</div>";
}
function todoLine(it,n){
  const l=it.lead;
  if(!l) return "";
  const heat=sitHeat(it.wait!=null?it.wait:sitMs(l));
  const num=n!=null?'<span class="todo-ix">'+n+"</span>":'<span class="todo-ix mute"></span>';
  return '<button class="todo-line '+heat+'" type="button" data-go="person" data-id="'+l.id+'">'+
    num+
    '<span class="todo-who">'+
      '<p class="name">'+esc(l.name||"No name")+nametag(l)+"</p>"+
      '<p class="todo-step">'+esc(todoVerb(it))+"</p>"+
      '<p class="meta">'+esc(todoMeta(it))+"</p>"+
    "</span>"+
    todoAge(it)+
  "</button>";
}
function todoQueue(items,start){
  if(!items.length) return "";
  return '<div class="todo-queue">'+items.map((it,i)=>todoLine(it,start==null?null:start+i)).join("")+"</div>";
}
function todoBooks(){
  if(!houseView()||deskFilter!=="all") return "";
  const bits=SELLERS.map(s=>{
    const rows=S.leads.filter(l=>bookOf(l)===s);
    const nows=rows.map(l=>({l:l,t:nextTodo(l)})).filter(x=>x.t&&x.t.lane==="now");
    nows.sort((a,b)=>buildRank(a.t,a.l)-buildRank(b.t,b.l));
    const next=nows[0];
    const line=next?(todoVerb({kind:next.t.kind,step:next.t.step})+" · "+(next.l.name||"No name")):"Clear";
    return '<button class="todo-book" type="button" data-desk="'+s+'">'+
      '<span class="name">'+SL[s]+'</span>'+
      '<span class="todo-n">'+(nows.length?nows.length+" to do":"Clear")+"</span>"+
      '<span class="meta">'+esc(line)+"</span>"+
    "</button>";
  }).join("");
  return '<p class="kicker todo-then">Open a book</p><div class="todo-books">'+bits+"</div>";
}
function buildRank(t,l){
  const wait=Date.now()-(l.updatedAt||l.createdAt||Date.now());
  const overdue=t.lane==="now"&&(t.kind==="follow"||t.kind==="pay"||wait>2*86400000);
  return t.kind==="close"?0:t.kind==="take"?1:t.kind==="whatsapp"?2:overdue&&t.kind==="pay"?3:t.kind==="size"?4:t.kind==="pay"?5:t.kind==="follow"?6:80;
}
;
function viewTodo(){
  const items=buildTodos();
  const now=items.filter(it=>it.lane==="now");
  const wait=items.filter(it=>it.lane==="wait");
  const houseAll=houseView()&&deskFilter==="all";
  const who=houseAll?"Floor":(SL[deskFilter]||SL[mySeller()]||"Your");
  const count=(now.length?now.length+" now":"Clear")+(wait.length?" · "+wait.length+" pending":"");
  const sub=houseAll
    ?"Unassigned only. Open a name to work that book."
    :who+"'s book. Only "+who+"'s people. Green under 30 min, yellow after that, red over an hour.";
  const head='<p class="kicker">CRM · '+esc(count)+'</p><h1>To-do</h1><p class="sub">'+esc(sub)+"</p>"+deskChips("todo")+
    '<p class="todo-key" aria-hidden="true"><span class="todo-age fresh">Under 30 min</span><span class="todo-age warm">Over 30 min</span><span class="todo-age hot">Over 1 hour</span></p>';
  if(!now.length&&!wait.length){
    return '<div class="todo-wrap">'+head+'<div class="todo-clear"><p class="todo-verb">Book is clear</p><p class="meta">Capture if the floor is quiet.</p><button class="solid tight" type="button" data-tab="capture">Capture</button></div></div>';
  }
  const hero=now[0]?todoHero(now[0],now.length):(wait.length?'<div class="todo-clear"><p class="todo-verb">Pending</p><p class="meta">'+wait.length+" waiting on them. Timer is still running.</p></div>":"");
  const rest=now.slice(1);
  const up=(!houseAll&&rest.length)?'<p class="kicker todo-then">Up next</p>'+todoQueue(rest,2):"";
  const pending=wait.length
    ?'<p class="kicker todo-then">Pending · '+wait.length+"</p>"+todoQueue(wait)
    :"";
  const floor=houseAll?todoBooks():"";
  return '<div class="todo-wrap">'+head+hero+up+pending+floor+"</div>";
}
function mBlock(kicker,num,meta,cls){
  return '<div class="m-block'+(cls?" "+cls:"")+'"><p class="kicker">'+kicker+'</p><p class="m-num">'+num+"</p>"+(meta?'<p class="meta">'+meta+"</p>":"")+"</div>";
}
function moneyChart(months,thisKey){
  const w=720,h=220,padL=4,padR=4,padT=18,padB=36;
  const max=Math.max.apply(null,months.map(function(m){return m.paid}).concat([1]));
  const inner=w-padL-padR;
  const gap=7;
  const bw=(inner-(months.length-1)*gap)/months.length;
  const bars=months.map(function(m,i){
    const x=padL+i*(bw+gap);
    const bh=Math.max(m.paid?6:2,(m.paid/max)*(h-padT-padB));
    const y=h-padB-bh;
    const now=m.key===thisKey?" now":"";
    const op=m.paid?"":" faint";
    return '<g class="m-col'+now+op+'"><rect class="bar" x="'+x+'" y="'+y+'" width="'+bw+'" height="'+bh+'" rx="5"><title>'+esc(m.label)+" · "+zar(m.paid)+" · "+m.pairs+" pairs</title></rect><text x='"+(x+bw/2)+"' y='"+(h-12)+"' text-anchor='middle'>"+esc(m.label)+"</text></g>";
  }).join("");
  return '<div class="m-chart card span2"><div class="spread"><p class="kicker">Sales each month</p><p class="meta">Paid rand · last 12 months · peak '+zar(max)+"</p></div><svg class='m-svg' viewBox='0 0 "+w+" "+h+"' role='img' aria-label='Paid sales by month'>"+bars+"</svg></div>";
}
function moneyRatio(m){
  const a=Math.max(0,Math.min(100,m.mixApps));
  const p=Math.max(0,Math.min(100,m.mixPaid));
  return '<div class="m-block span2 m-ratio">'+
    '<p class="kicker">Apps in · shoes paid out</p>'+
    '<div class="m-ratio-row">'+
      '<div><p class="m-num">'+m.apps+'</p><p class="meta">Apps in</p></div>'+
      '<div class="m-ratio-mid"><p class="m-num">'+pct(m.conv)+'</p><p class="meta">of apps paid</p></div>'+
      '<div class="m-ratio-end"><p class="m-num">'+m.paidPairs+'</p><p class="meta">Pairs paid</p></div>'+
    "</div>"+
    '<div class="m-bar" aria-hidden="true"><i style="width:'+a+'%"></i><i class="gold" style="width:'+p+'%"></i></div>'+
    '<p class="meta">'+pct(a)+" of this mix is website apps · "+pct(p)+" is pairs paid. "+m.appsPaid+" of "+m.apps+" lookbook apps have paid"+(m.appsPaidPairs?" · "+m.appsPaidPairs+" pairs":"")+".</p>"+
  "</div>";
}
function moneyMix(label,parts){
  const total=parts.reduce(function(n,p){return n+p.n},0)||1;
  const rows=parts.map(function(p){
    const w=Math.round((p.n/total)*100);
    return '<div class="m-mix-row"><span>'+esc(p.label)+'</span><b>'+p.n+'</b><span class="m-mini"><i style="width:'+w+'%"></i></span><span>'+w+"%</span></div>";
  }).join("");
  return '<div class="m-block"><p class="kicker">'+esc(label)+"</p>"+rows+"</div>";
}
function viewMoney(rows){
  const m=tallyMoney(rows);
  const who=deskFilter==="all"?"House":((SL[deskFilter]||"This")+"'s book");
  const mom=m.mom>0?("+"+Math.round(m.mom)+"% vs last"):(m.mom<0?(Math.round(m.mom)+"% vs last"):"Flat vs last");
  const head='<p class="kicker">CRM · Money</p><div class="spread"><h1>Board</h1><div class="row"><button class="chip" type="button" data-pane="work">Work</button><button class="chip on" type="button" data-pane="money">Money</button><button class="chip" type="button" data-tab="capture">Capture</button></div></div>'+deskChips()+
    '<p class="sub">'+esc(who)+". Numbers in blocks. Website apps against pairs that paid. Graph is cash in the door, by month.</p>";
  const top='<div class="money-grid">'+
    mBlock("Cash in",zar(m.paidRand),m.paidTickets+" paid · "+m.paidPairs+" pairs")+
    mBlock("This month",zar(m.thisPaid),mom+" · "+m.thisPairs+" pairs")+
    mBlock("EFT waiting",zar(m.eftDue),m.invOpen?(m.invOpen+" invoice"+(m.invOpen===1?"":"s")+" out"):"None waiting",m.eftDue?" warn":"")+
    mBlock("Pair profit",zar(m.paidProfit),"On paid · margin "+pct(m.margin))+
    "</div>";
  const mid='<div class="money-grid">'+
    moneyRatio(m)+
    mBlock("Apps in",String(m.apps),m.thisApps+" this month · lookbook")+
    mBlock("Shoes paid",String(m.paidPairs),m.appsPaidPairs+" of them from the site")+
    mBlock("Average ticket",zar(Math.round(m.avg)),m.paidTickets+" closed tickets")+
    mBlock("Close rate",pct(m.closeRate),m.paidTickets+" paid of "+m.live+" live")+
    "</div>";
  const cuts='<p class="kicker money-h">Cuts on paid</p><div class="money-grid">'+
    mBlock("Wian",zar(m.cuts.wian),"Share of pair profit")+
    mBlock("Luan",zar(m.cuts.luan),"Share of pair profit")+
    mBlock("Dylan",zar(m.cuts.dylan),"Share of pair profit")+
    mBlock("House",zar(m.cuts.house),"Share of pair profit")+
    "</div>";
  const bookKeys=[["luan","Luan"],["dylan","Dylan"],["wian","Wian"],["floor","Floor"]];
  const bookBlocks=bookKeys.map(function(pair){
    const b=m.books[pair[0]]||{paid:0,pairs:0,profit:0,apps:0};
    return mBlock(pair[1],zar(b.paid),b.pairs+" pairs · profit "+zar(b.profit)+(b.apps?" · "+b.apps+" apps":""));
  }).join("");
  const books='<p class="kicker money-h">By book</p><div class="money-grid">'+bookBlocks+"</div>";
  const mix='<p class="kicker money-h">Mix</p><div class="money-grid">'+
    moneyMix("Source",[{label:"Website",n:m.src.website},{label:"WhatsApp",n:m.src.whatsapp},{label:"Other",n:m.src.other}])+
    moneyMix("How they take it",[{label:"Collect",n:m.collectN},{label:"Delivery",n:m.deliverN}])+
    moneyMix("Pair",[{label:"Book",n:m.bookN},{label:"Custom",n:m.customN}])+
    mBlock("Still open",zar(m.openDue),"Listed on the floor · lost "+zar(m.lostRand))+
    "</div>";
  const wait=m.outstanding.length
    ? m.outstanding.slice(0,8).map(function(o){
        return '<button class="m-wait" type="button" data-go="person" data-id="'+o.id+'"><span>'+esc(o.name||"No name")+' · '+esc(o.sku)+'</span><span>'+zar(o.due)+' · '+sitLabel(o.age)+"</span></button>";
      }).join("")
    : '<p class="meta">None waiting.</p>';
  const out='<div class="m-block span2"><p class="kicker">Invoices out</p>'+wait+"</div>";
  return head+'<div class="money-dash">'+top+mid+moneyChart(m.months,m.thisKey)+cuts+books+mix+out+"</div>";
}
function viewBoard(){
  const rows=leads();
  const waiting=S.leads.filter(l=>!l.owner&&(l.source==="web"||l.source==="website")&&l.status!=="closed"&&l.status!=="lost");
  const open=rows.filter(l=>l.status!=="closed"&&l.status!=="lost");
  const grouped={new:[],working:[],closed:[],lost:[]};
  for(const l of rows) grouped[colOf(l.status)].push(l);
  const metrics='<div class="metrics"><div class="card"><p>'+waiting.length+'</p><span>Inbox</span></div><div class="card"><p>'+open.length+'</p><span>Open</span></div><div class="card"><p>'+grouped.working.length+'</p><span>Working</span></div><div class="card"><p>'+grouped.closed.length+'</p><span>Closed</span></div></div>';
  const cols=[["new","New"],["working","Working"],["closed","Closed"],["lost","Lost"]];
  function card(l){
    const p=shoe(l.sku);
    const t=ticket(l);
    const next=l.nextAction||(l.status==="new"?"Send the first WhatsApp":"Open the card");
    const age=l.updatedAt||l.createdAt;
    const ago=age?Math.max(0,Math.round((Date.now()-age)/3600000))+"h":"";
    return '<div class="lead"><div class="lead-row">'+(p?'<img src="'+p.img+'" alt="'+esc(p.sku)+'">':'<div></div>')+'<div><div class="spread"><p class="name">'+esc(l.name||"No name")+nametag(l)+'</p><p class="meta">'+(houseView()&&l.owner?SL[l.owner]:"")+(l.salesman?" · "+esc(l.salesman):"")+'</p></div><p class="meta">'+esc([t.qty>1?(t.qty+" pairs"):"",l.sku,l.look,l.size?("UK "+l.size):"",zar(t.listed)].filter(Boolean).join(" · "))+'</p><p class="meta">Next · '+esc(next)+(ago?" · last "+ago:"")+'</p><div class="row">'+(wa(l.phone,firstMsg(l))?'<a class="chip on" href="'+wa(l.phone,firstMsg(l))+'" data-wa="'+l.id+'" target="_blank" rel="noreferrer">WhatsApp</a>':"")+'<button class="chip" type="button" data-go="person" data-id="'+l.id+'">Open</button>'+(!l.owner&&houseView()?'<button class="chip" type="button" data-take="'+l.id+'">Take</button>':"")+'</div></div></div></div>';
  }
  if(pane==="money"&&seeCost()) return viewMoney(rows);
  const colHtml=cols.map(([id,label])=>'<section><p class="kicker">'+label+' · '+grouped[id].length+'</p>'+(grouped[id].map(card).join("")||'<p class="empty">Clear.</p>')+"</section>").join("");
  return '<p class="kicker">CRM</p><div class="spread"><h1>Board</h1><div class="row">'+(seeCost()?'<button class="chip on" type="button" data-pane="work">Work</button><button class="chip" type="button" data-pane="money">Money</button>':"")+'<button class="chip" type="button" data-tab="capture">Capture</button></div></div>'+deskChips()+metrics+'<div class="chips" style="margin:0 0 12px">'+cols.map(([id,label])=>'<button class="chip '+(boardCol===id?"on":"")+'" type="button" data-col="'+id+'">'+label+' '+grouped[id].length+'</button>').join("")+'</div><div class="board desktop-only">'+colHtml+'</div><div class="phone-cols">'+grouped[boardCol].map(card).join("")+'</div>';
}
function viewCapture(){
  const p=shoe(cap.sku)||PAIRS[14];
  cap.sku=p.sku;
  if(houseView()&&!cap.owner) cap.owner=mySeller();
  const types=looksOf();
  const book=PAIRS.filter(x=>matchLook(x,cap.type));
  if(cap.type&&!book.some(x=>x.sku===p.sku)&&book[0]){cap.sku=book[0].sku;cap.listedPrice=null;return viewCapture()}
  const last=lastCapId?S.leads.find(x=>x.id===lastCapId):null;
  const lastStrip=last?'<div class="card flash-row"><p class="ok" style="margin:0">On the board · '+esc(last.name)+'</p>'+(wa(last.phone,firstMsg(last))?'<a class="chip on" href="'+wa(last.phone,firstMsg(last))+'" data-wa="'+last.id+'" target="_blank" rel="noreferrer">WhatsApp</a>':"")+'<button class="chip" type="button" data-go="person" data-id="'+last.id+'">Open</button></div>':"";
  const moreOn=!!(cap.size||extraBits(cap.extras).length||cap.note||(cap.delivery&&cap.delivery!=="collect"));
  const hideLab=cap.colour&&cap.colour!=="book"?hideName(cap.colour):"as photographed";
  const shown=Number(cap.listedPrice)>0?Number(cap.listedPrice):p.price;
  const customOn=!!(extraFix(cap.extras).custom||(Number(cap.listedPrice)>0&&Number(cap.listedPrice)!==p.price));
  const typeRow='<label>Type</label><div class="chips type-row"><button class="chip '+(!cap.type?"on":"")+'" type="button" data-type="">All</button>'+types.map(t=>'<button class="chip '+(cap.type===t?"on":"")+'" type="button" data-type="'+esc(t)+'">'+esc(t)+"</button>").join("")+"</div>";
  return lastStrip+
    typeRow+
    '<article class="pair cap-pair">'+
    '<div class="cap-shot">'+turnHtml(p,cap.colour||"book",cap.view||0,cap.extras)+
    '<div class="hides">'+hideChips(cap.colour||"book","data-chide",true)+"</div></div>"+
    '<div class="pad"><div class="sku-row"><input id="cap-sku-in" inputmode="numeric" placeholder="45015" value="'+p.sku+'" aria-label="Stock" /><select id="cap-sku" aria-label="Pair">'+book.map(x=>'<option value="'+x.sku+'"'+(x.sku===p.sku?" selected":"")+">"+x.sku+" · "+esc(x.look)+"</option>").join("")+"</select></div>"+
    '<div class="spread"><p class="meta">'+esc(p.look)+" · "+esc(hideLab)+'</p><div class="price-edit"><input id="cap-price" form="cap" name="listedPrice" inputmode="numeric" value="'+shown+'" aria-label="Pair price" />'+(customOn?'<span class="nametag">Custom</span>':"")+"</div></div></div></article>"+
    '<form class="card" id="cap">'+
    '<label>Name</label><input name="name" value="'+esc(cap.name)+'" required placeholder="As they say it" autocomplete="name" />'+
    '<label>WhatsApp</label><input name="phone" value="'+esc(cap.phone)+'" required inputmode="tel" placeholder="08 or 27" autocomplete="tel" />'+
    '<button class="solid tight" type="submit">Put on the board</button>'+
    '<details class="more"'+(moreOn?" open":"")+"><summary>Size, extras, send</summary>"+
    '<label>UK size</label><div class="chips">'+['<button class="chip '+(!cap.size?"on":"")+'" type="button" data-size="">Later</button>'].concat(UK.map(s=>'<button class="chip '+(cap.size===s?"on":"")+'" type="button" data-size="'+s+'">'+s+"</button>")).join("")+"</div>"+
    extrasHtml(cap.extras,p.look,"cap")+
    '<label>How they found us</label><div class="chips">'+SOURCES.map(([id,lab])=>'<button class="chip '+(cap.source===id?"on":"")+'" type="button" data-src="'+id+'">'+lab+"</button>").join("")+"</div>"+
    (houseView()?'<label>Who</label><div class="chips">'+SELLERS.map(s=>'<button class="chip '+(cap.owner===s?"on":"")+'" type="button" data-own="'+s+'">'+SL[s]+"</button>").join("")+"</div>":'<p class="meta">Lands on Sable · '+SL[mySeller()]+"</p>")+
    '<label>Collect or send</label><div class="chips"><button class="chip '+(cap.delivery==="collect"?"on":"")+'" type="button" data-del="collect">Collect</button><button class="chip '+(cap.delivery==="local"?"on":"")+'" type="button" data-del="local">Local R100</button><button class="chip '+(cap.delivery==="int"?"on":"")+'" type="button" data-del="int">International R300</button></div>'+
    '<label>Note</label><input name="note" value="'+esc(cap.note)+'" placeholder="Tan hide. Call after 6." /></details></form>';
}
function viewClients(){
  const rows=leads();
  const q="";
  return '<p class="kicker">CRM</p><h1>Clients</h1><p class="sub">One card per person. People stay on Sable. Lost is a stage, not a delete.</p>'+deskChips()+(rows.length?rows.map(l=>'<div class="lead"><div class="spread"><p class="name">'+esc(l.name)+nametag(l)+'</p><p class="meta">'+esc(l.status)+'</p></div><p class="meta">'+esc([l.sku,l.look,l.phone].filter(Boolean).join(" · "))+'</p><div class="row">'+(wa(l.phone,firstMsg(l))?'<a class="chip on" href="'+wa(l.phone,firstMsg(l))+'" data-wa="'+l.id+'" target="_blank" rel="noreferrer">WhatsApp</a>':"")+'<button class="chip" type="button" data-go="person" data-id="'+l.id+'">Open</button></div></div>').join(""):'<p class="empty">No people on Sable yet. Capture one.</p>')+'<button class="solid" type="button" data-tab="capture">Capture</button>';
}
function viewMeetings(){
  const now=Date.now();
  const up=S.meetings.filter(m=>new Date(m.at).getTime()>=now);
  const past=S.meetings.filter(m=>new Date(m.at).getTime()<now);
  function row(m){return '<div class="lead"><p class="name">'+esc(m.title)+'</p><p class="meta">'+esc(m.withName||"")+' · '+esc(new Date(m.at).toLocaleString("en-ZA"))+'</p><p class="meta">'+esc(m.note||"")+'</p><button class="ghost" type="button" data-delmeet="'+m.id+'">Remove</button></div>'}
  return '<p class="kicker">CRM</p><h1>Meetings</h1><p class="sub">Fits, collections, calls.</p><form class="card" id="meet"><label>What</label><input name="title" required /><div class="split"><div><label>With</label><input name="withName" /></div><div><label>When</label><input name="at" type="datetime-local" required /></div></div><label>Note</label><input name="note" /><button class="solid" type="submit">Book</button></form><h3 style="margin-top:24px">Upcoming</h3>'+(up.map(row).join("")||'<p class="empty">None booked.</p>')+'<h3 style="margin-top:24px">Past</h3>'+(past.map(row).join("")||'<p class="empty">None.</p>');
}
function viewTeam(){
  const pending=S.requests.filter(r=>r.status!=="approved"&&r.status!=="denied");
  const rest=S.users.filter(u=>norm(u.email)!==LUAN.email);
  return '<p class="kicker">CRM</p><h1>Team</h1><p class="sub">Requests land here. You verify Sable. Until then they cannot open the floor.</p><h3>Requests</h3>'+(pending.length?pending.map(r=>'<div class="lead"><p class="name">'+esc(r.name)+'</p><p class="meta">'+esc(r.email)+' · '+(SL[r.seller]||r.seller||"")+'</p><div class="row"><button class="chip on" type="button" data-ok="'+esc(r.email)+'">Approve sales</button><button class="chip" type="button" data-no="'+esc(r.email)+'">Deny</button></div></div>').join(""):'<p class="empty">None waiting.</p>')+'<h3 style="margin-top:24px">People</h3>'+S.users.map(u=>'<div class="lead"><p class="name">'+esc(u.name)+'</p><p class="meta">'+esc(u.email)+' · '+esc(u.role)+' · '+(SL[u.seller]||"")+' · '+esc(u.status)+'</p></div>').join("");
}
function viewPerson(){
  const l=S.leads.find(x=>x.id===personId);
  if(!l) return '<p class="empty">Not on Sable.</p><button class="chip" type="button" data-tab="board">Board</button>';
  const t=ticket(l);
  const p=t.p;
  const stages=[["new","New"],["contacted","Working"],["closed","Closed"],["lost","Lost"]];
  const age=l.updatedAt||l.createdAt;
  const ago=age?Math.max(0,Math.round((Date.now()-age)/3600000))+"h":"";
  const profit=p&&seeCost()?Math.max(0,(unitListed(l)-p.cost)*t.qty):null;
  const waFirst=wa(l.phone,firstMsg(l));
  const waSize=wa(l.phone,sizeMsg(l));
  const waPay=wa(l.phone,payMsg(l));
  const waFollow=wa(l.phone,followMsg(l));
  const pairImg=p?turnHtml(p,l.colour||"book",pairView||0,l.extras):"";
  const skuOpts=PAIRS.map(x=>'<option value="'+x.sku+'"'+(x.sku===l.sku?" selected":"")+">"+x.sku+" · "+esc(x.look)+" · "+zar(x.price)+"</option>").join("");
  const sizeChips=['<button class="chip '+(!l.size?"on":"")+'" type="button" data-psize="">Later</button>'].concat(UK.map(s=>'<button class="chip '+(String(l.size)===s?"on":"")+'" type="button" data-psize="'+s+'">'+s+"</button>")).join("");
  const qtyChips=[1,2,3,4].map(n=>'<button class="chip '+(t.qty===n?"on":"")+'" type="button" data-pqty="'+n+'">'+n+"</button>").join("");
  const hideRow=hideChips(l.colour||"book","data-phide");
  const delChips=[["collect","Collect"],["local","Local R100"],["int","International R300"]].map(([id,lab])=>'<button class="chip '+(l.delivery===id?"on":"")+'" type="button" data-pdel="'+id+'">'+lab+"</button>").join("");
  const stageChips=stages.map(([id,lab])=>'<button class="chip '+(colOf(l.status)===colOf(id)?"on":"")+'" type="button" data-stage="'+id+'">'+lab+"</button>").join("");
  const desk=houseView()?'<label>Who</label><div class="chips">'+SELLERS.map(s=>'<button class="chip '+(l.owner===s?"on":"")+'" type="button" data-assign="'+s+'">'+SL[s]+"</button>").join("")+"</div>":"";
  const money='<div class="money card"><div class="line"><span>'+(t.custom?"Custom pair":"Listed")+'</span><span class="price-edit"><input id="p-price" inputmode="numeric" value="'+unitListed(l)+'" aria-label="Pair price" /></span></div>'+(p&&t.custom&&unitListed(l)!==p.price?'<div class="line"><span>Book</span><span>'+zar(p.price)+'</span></div>':'')+(t.extras?'<div class="line"><span>Extras</span><span>'+zar(t.extras)+'</span></div>':'')+'<div class="line"><span>Delivery</span><span>'+(t.fee?zar(t.fee):'Collect')+'</span></div><div class="line"><span>EFT due</span><span>'+zar(t.due)+'</span></div>'+(profit!=null?'<div class="line"><span>Pair profit</span><span>'+zar(profit)+'</span></div>':'')+'<div class="line"><span>Paid</span><span class="'+(l.paid?'ok':'')+'">'+(l.paid?'Yes':'No')+'</span></div></div>';
  const waRow='<div class="actions">'+(waFirst?'<a class="chip on" href="'+waFirst+'" data-wa="'+l.id+'" target="_blank" rel="noreferrer">WhatsApp first</a>':"")+(waSize?'<a class="chip" href="'+waSize+'" target="_blank" rel="noreferrer">Ask size</a>':"")+(waPay?'<a class="chip" href="'+waPay+'" target="_blank" rel="noreferrer">WhatsApp EFT</a>':"")+(waFollow?'<a class="chip" href="'+waFollow+'" target="_blank" rel="noreferrer">Follow up</a>':"")+'<button class="chip" type="button" data-copy="eft">Copy EFT</button>'+(l.paid?'<button class="chip good on" type="button" data-paid="0">Paid · undo</button>':'<button class="chip on" type="button" data-paid="1">Mark paid</button>')+(l.paid&&l.status!=="closed"?'<button class="chip" type="button" data-stage="closed">Close</button>':"")+"</div>";
  const sizeBlock=t.items.length>1?"":('<label>UK size</label><div class="chips">'+sizeChips+"</div>");
  const orderLines=t.items.length>1?'<div class="order-lines">'+t.items.map(function(it,i){
    const ip=shoe(it.sku);
    const bits=[it.size?("UK "+it.size):"Size open",hideName(it.colour),extraLabel(it.extras),it.qty>1?("×"+it.qty):"",zar(it.listed*it.qty+extraSum(it.extras,it.qty))].filter(Boolean);
    const chips=['<button class="chip '+(!it.size?"on":"")+'" type="button" data-item="'+i+'" data-itemsize="">Later</button>'].concat(UK.map(s=>'<button class="chip '+(String(it.size)===s?"on":"")+'" type="button" data-item="'+i+'" data-itemsize="'+s+'">'+s+"</button>")).join("");
    return '<div class="order-line">'+(ip?'<img src="'+ip.img+'" alt="'+esc(it.sku)+'">':'<div></div>')+'<div><p class="name">'+esc(it.sku)+" · "+esc(it.look)+(it.extras&&it.extras.custom?'<span class="nametag">Custom</span>':"")+'</p><p class="meta">'+esc(bits.join(" · "))+'</p><div class="chips">'+chips+"</div></div></div>";
  }).join("")+"</div>":"";
  return '<div class="row" style="margin-bottom:8px"><button class="ghost" type="button" data-tab="todo">To-do</button><button class="ghost" type="button" data-tab="board">Board</button><button class="ghost" type="button" data-tab="capture">Next capture</button></div><p class="kicker">Working ticket</p><h1>'+esc(l.name)+'</h1><p class="meta">'+esc(l.phone)+(l.owner?" · "+SL[l.owner]:" · Unassigned")+(l.salesman?" · helped by "+esc(l.salesman):"")+(l.source?" · "+esc(l.source):"")+(t.qty>1?" · "+t.qty+" pairs":"")+(ago?" · last "+ago:"")+"</p>"+
    waRow+
    (p?'<article class="pair slim">'+pairImg+'<div class="pad"><p class="stock">'+esc(l.sku||"—")+nametag(l)+'</p><p class="meta">'+esc(l.look||"")+(l.size?" · UK "+esc(l.size):" · size open")+(t.items.length>1?" · first of "+t.qty:"")+'</p><p class="price">'+zar(t.due)+'</p><p class="kicker">EFT due</p></div></article>':'')+
    orderLines+
    sizeBlock+
    '<label>Stage</label><div class="chips">'+stageChips+"</div>"+
    desk+money+
    '<details class="card more"><summary>Lock the pair</summary><label>Pair</label><select id="p-sku">'+skuOpts+'</select><label>Pairs</label><div class="chips">'+qtyChips+'</div><label>Hide</label><div class="hides">'+hideRow+'</div>'+extrasHtml(l.extras,l.look||(p&&p.look)||"","p")+'<label>Collect or send</label><div class="chips">'+delChips+"</div></details>"+
    '<form class="card" id="pnext"><p class="kicker">Keep moving</p><label>What to do next</label><input name="next" value="'+esc(l.nextAction||"")+'" placeholder="Chase EFT. Lock size." /><label>When</label><input name="at" type="datetime-local" value="'+esc(localAt(l.nextActionAt))+'" /><label>Name</label><input name="name" value="'+esc(l.name)+'" required /><label>WhatsApp</label><input name="phone" value="'+esc(l.phone)+'" required inputmode="tel" /><label>Note</label><textarea name="note" placeholder="Tan hide. Call after 6.">'+esc(l.note)+'</textarea><button class="solid" type="submit">Save</button></form>';
}
function Desk(){
  const body=personId?viewPerson():tab==="board"?viewBoard():tab==="capture"?viewCapture():tab==="clients"?viewClients():tab==="meetings"?viewMeetings():tab==="team"?viewTeam():viewTodo();
  const flash=toast?( /need|wrong|type |eight|whatsapp number/i.test(toast) ? '<p class="err">'+esc(toast)+"</p>" : '<p class="ok">'+esc(toast)+"</p>" ) : "";
  return '<div class="shell"><aside class="side"><div class="side-head"><div class="side-brand"><span class="side-s">S</span></div></div><nav class="side-nav" aria-label="Sable">'+navBtns()+'</nav><button type="button" class="side-out" id="out"><span class="nav-mark">×</span><span class="nav-name">Sign out</span></button></aside><div class="stage"><header class="top"><div class="brand">SABLE FLOOR</div><div class="row"><a class="ghost" href="/want" target="_blank" rel="noreferrer">Client web</a><button class="ghost" type="button" id="copy-want">Copy link</button><button class="ghost" type="button" id="out2">Sign out</button></div></header><main class="work">'+flash+body+"</main><nav class='tabs' aria-label='Sable'>"+[["board","Board"],["todo","To-do"],["capture","Capture"],["clients","Clients"],["meetings","Meetings"]].map(([id,lab])=>'<button type="button" class="'+(tab===id||(id==="meetings"&&(tab==="meetings"||tab==="team"))||(id==="clients"&&personId)?"on":"")+'" data-tab="'+id+'"'+(tab===id||(id==="meetings"&&(tab==="meetings"||tab==="team"))?' aria-current="page"':"")+'>'+lab+"</button>").join("")+"</nav></div></div>";
}
;
function draw(){
  const root=document.getElementById("root");
  if(!S.session){root.innerHTML=Gate();hookGate();toast="";return}
  root.innerHTML=Desk();
  hookDesk();
  toast="";
}
function hookGate(){
  const mi=document.getElementById("m-in"); if(mi) mi.onclick=function(){mode="in";toast="";draw()};
  const ma=document.getElementById("m-ask"); if(ma) ma.onclick=function(){mode="ask";toast="";draw()};
  const fg=document.getElementById("forgot"); if(fg) fg.onclick=function(){mode="reset";toast="";draw()};
  const signin=document.getElementById("signin");
  if(signin) signin.onsubmit=function(e){
    e.preventDefault();
    const f=Object.fromEntries(new FormData(signin));
    const pass=String(f.password||"");
    if(isHouse(f.email)&&(samePass(pass,LUAN.password)||String(pass).trim()==="4181")){enter(house());return}
    const q=norm(f.email);
    const user=S.users.find(u=>u.status==="approved"&&(norm(u.email)===q||norm(u.x)===q));
    if(user&&samePass(pass,user.password)){enter(user);return}
    toast=isHouse(f.email)?"House key is SableCRM4181. Caps do not matter. Or use Forgot password.":"Wrong login. House email is lensleyluan001@gmail.com. Or Request login.";
    draw();
  };
  const reset=document.getElementById("reset");
  if(reset) reset.onsubmit=function(e){
    e.preventDefault();
    const f=Object.fromEntries(new FormData(reset));
    if(!isHouse(f.email)){toast="Type lensleyluan001@gmail.com — reset is house only.";draw();return}
    if(String(f.password||"").trim().length<8){toast="Eight characters or more.";draw();return}
    const u=house();u.password=String(f.password).trim();enter(u);
  };
  const ask=document.getElementById("ask");
  if(ask) ask.onsubmit=function(e){
    e.preventDefault();
    const f=Object.fromEntries(new FormData(ask));
    if(isHouse(f.email)){const u=house();if(f.password)u.password=String(f.password).trim();enter(u);return}
    S.requests=S.requests||[];
    S.requests.push({name:String(f.name||"").trim(),email:String(f.email||"").trim(),password:String(f.password||""),seller:f.seller||"luan",status:"pending",at:Date.now()});
    save();
    toast="Request saved on this phone. Open Luan admin on Sable to approve.";
    mode="in";draw();
  };
}
function patchLead(id,fields){
  const i=S.leads.findIndex(l=>l.id===id);
  if(i<0) return;
  const prev=S.leads[i];
  const sitAt=fields.sitAt!=null?fields.sitAt:(prev.sitAt||prev.updatedAt||prev.createdAt);
  const next=Object.assign({},prev,fields,{updatedAt:Date.now(),sitAt});
  S.leads[i]=next;
  save();
}
function doDone(tid){
  const items=buildTodos();
  const it=items.find(x=>x.id===tid);
  if(!it||!it.lead) return;
  const l=it.lead;
  if(it.kind==="whatsapp") patchLead(l.id,{status:"contacted",nextAction:"Asked for UK size",nextActionAt:new Date(Date.now()+2*3600000).toISOString()});
  else if(it.kind==="size") patchLead(l.id,{nextAction:"Asked for UK size",nextActionAt:new Date(Date.now()+2*3600000).toISOString()});
  else if(it.kind==="close"){patchLead(l.id,{status:"closed",paid:true,nextAction:"Closed. Paid.",nextActionAt:null});toast="Closed. Next up."}
  else if(it.kind==="follow"&&/lost/i.test(it.step)) patchLead(l.id,{status:"lost",nextAction:"Lost"});
  else if(it.kind==="pay") patchLead(l.id,{nextAction:"Invoice sent. Waiting on EFT",nextActionAt:new Date(Date.now()+12*3600000).toISOString()});
  else if(it.kind==="follow") patchLead(l.id,{nextAction:l.nextAction||"Follow up",nextActionAt:new Date(Date.now()+24*3600000).toISOString()});
  else patchLead(l.id,{nextAction:it.step,nextActionAt:new Date(Date.now()+12*3600000).toISOString()});
  draw();
}
function scoopCap(){
  const f=document.getElementById("cap");
  if(!f) return;
  const d=Object.fromEntries(new FormData(f));
  if(d.name!=null) cap.name=String(d.name);
  if(d.phone!=null) cap.phone=String(d.phone);
  if(d.note!=null) cap.note=String(d.note);
  const noteEl=document.getElementById("cap-custom");
  if(noteEl){cap.extras=extraFix(cap.extras);cap.extras.customNote=String(noteEl.value||"").trim()}
  const priceEl=document.getElementById("cap-price");
  if(priceEl){
    const p=shoe(cap.sku);
    const n=Number(String(priceEl.value||"").replace(/[^\d]/g,""))||0;
    cap.listedPrice=p&&n===p.price?null:(n||null);
  }
}
function hookDesk(){
  const out=document.getElementById("out"); if(out) out.onclick=function(){S.session=null;save();draw()};
  const out2=document.getElementById("out2"); if(out2) out2.onclick=function(){S.session=null;save();draw()};
  const copyWant=document.getElementById("copy-want");
  if(copyWant) copyWant.onclick=function(){
    const u=clientWebUrl();
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(u).catch(function(){});
    toast="Client link copied. Send this: "+u;
    draw();
  };
  document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=function(){tab=b.getAttribute("data-tab");personId=null;draw()});
  document.querySelectorAll("[data-desk]").forEach(b=>b.onclick=function(){deskFilter=b.getAttribute("data-desk");writeDesk(deskFilter);draw()});
  document.querySelectorAll("[data-col]").forEach(b=>b.onclick=function(){boardCol=b.getAttribute("data-col");draw()});
  document.querySelectorAll("[data-pane]").forEach(b=>b.onclick=function(){pane=b.getAttribute("data-pane");draw()});
  document.querySelectorAll("[data-go]").forEach(b=>b.onclick=function(){
    const go=b.getAttribute("data-go");
    const id=b.getAttribute("data-id");
    if(go==="person"&&id){personId=id;tab="clients";pairView=0;draw();return}
    tab=go==="person"?"clients":go;personId=null;draw();
  });
  document.querySelectorAll("[data-done]").forEach(b=>b.onclick=function(){doDone(b.getAttribute("data-done"))});
  document.querySelectorAll("[data-pend]").forEach(b=>b.onclick=function(){
    const id=b.getAttribute("data-pend");
    const l=S.leads.find(x=>x.id===id);
    if(!l) return;
    patchLead(id,{
      nextAction:l.nextAction||"Pending",
      nextActionAt:new Date(Date.now()+2*3600000).toISOString()
    });
    toast="Pending. Timer still runs.";
    draw();
  });
  document.querySelectorAll("[data-wadone]").forEach(a=>a.addEventListener("click",function(){
    const id=a.getAttribute("data-wadone");
    setTimeout(function(){doDone(id)},500);
  }));
  document.querySelectorAll("[data-size]").forEach(b=>b.onclick=function(){scoopCap();cap.size=b.getAttribute("data-size");draw()});
  document.querySelectorAll("[data-src]").forEach(b=>b.onclick=function(){scoopCap();cap.source=b.getAttribute("data-src");draw()});
  document.querySelectorAll("[data-own]").forEach(b=>b.onclick=function(){scoopCap();cap.owner=b.getAttribute("data-own");draw()});
  document.querySelectorAll("[data-del]").forEach(b=>b.onclick=function(){scoopCap();cap.delivery=b.getAttribute("data-del");draw()});
  document.querySelectorAll("[data-type]").forEach(b=>b.onclick=function(){scoopCap();cap.type=b.getAttribute("data-type")||"";draw()});
  const sku=document.getElementById("cap-sku");
  if(sku) sku.onchange=function(){scoopCap();cap.sku=sku.value;cap.view=0;cap.listedPrice=null;const pair=shoe(cap.sku);if(pair) cap.type=pair.look;draw()};
  const skuIn=document.getElementById("cap-sku-in");
  if(skuIn){
    skuIn.onchange=function(){
      scoopCap();
      const p=pickSku(skuIn.value);
      if(p){cap.sku=p.sku;cap.type=p.look;cap.view=0;cap.listedPrice=null;draw()}
    };
    skuIn.onkeydown=function(e){
      if(e.key==="Enter"){e.preventDefault();skuIn.blur()}
    };
  }
  const capf=document.getElementById("cap");
  if(capf) capf.onsubmit=function(e){
    e.preventDefault();
    const f=Object.fromEntries(new FormData(capf));
    cap.name=String(f.name||"").trim();
    cap.phone=String(f.phone||"").trim();
    cap.note=String(f.note||"").trim();
    if(cap.name.length<2){toast="Need a name.";draw();return}
    if(digits(cap.phone).length<9){toast="WhatsApp number.";draw();return}
    const p=shoe(cap.sku)||PAIRS[0];
    const noteEl=document.getElementById("cap-custom");
    if(noteEl){cap.extras=extraFix(cap.extras);cap.extras.customNote=String(noteEl.value||"").trim();if(cap.extras.customNote) cap.extras.custom=true}
    const priceEl=document.getElementById("cap-price");
    const typed=Number(String((f.listedPrice!=null&&f.listedPrice!==""?f.listedPrice:(priceEl&&priceEl.value)||"")).replace(/[^\d]/g,""))||0;
    const listedPrice=typed&&typed!==p.price?typed:null;
    const lead=leadFix({
      id:uid(),name:cap.name,phone:cap.phone,sku:p.sku,look:p.look,size:cap.size,qty:cap.qty,
      source:cap.source,status:"new",note:cap.note,owner:houseView()?cap.owner:mySeller(),
      delivery:cap.delivery,deliveryFee:feeOf(cap.delivery),colour:cap.colour||"book",
      extras:extraFix(cap.extras),listedPrice,
      createdAt:Date.now()
    });
    S.leads.unshift(lead);
    lastCapId=lead.id;
    cap={sku:cap.sku,name:"",phone:"",size:"",qty:1,source:"whatsapp",note:"",delivery:"collect",owner:cap.owner,type:cap.type,colour:"book",view:0,extras:extraFix(),listedPrice:null};
    personId=null;tab="capture";save();toast="On the board.";draw();
  };
  const meet=document.getElementById("meet");
  if(meet) meet.onsubmit=function(e){
    e.preventDefault();
    const f=Object.fromEntries(new FormData(meet));
    S.meetings.unshift({id:uid(),title:String(f.title||"").trim(),withName:String(f.withName||"").trim(),at:f.at?new Date(f.at).toISOString():new Date().toISOString(),note:String(f.note||"").trim()});
    save();draw();
  };
  document.querySelectorAll("[data-delmeet]").forEach(b=>b.onclick=function(){S.meetings=S.meetings.filter(m=>m.id!==b.getAttribute("data-delmeet"));save();draw()});
  document.querySelectorAll("[data-stage]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    const st=b.getAttribute("data-stage");
    const fields={status:st};
    if(st==="closed") fields.nextAction="Closed.";
    if(st==="lost") fields.nextAction="Lost";
    patchLead(personId,fields);
    draw();
  });
  document.querySelectorAll("[data-assign]").forEach(b=>b.onclick=function(){if(personId){patchLead(personId,{owner:b.getAttribute("data-assign")});draw()}});
  document.querySelectorAll("[data-paid]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    const on=b.getAttribute("data-paid")==="1";
    const l=S.leads.find(x=>x.id===personId);
    patchLead(personId,{
      paid:on,
      status:on&&l&&l.status==="new"?"contacted":(l&&l.status),
      nextAction:on?"EFT received. Close the card.":(l&&l.nextAction)||"Chase the EFT",
      nextActionAt:on?null:l&&l.nextActionAt
    });
    toast=on?"Marked paid.":"Paid undone.";
    draw();
  });
  document.querySelectorAll("[data-psize]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    const size=b.getAttribute("data-psize")||"";
    const l=S.leads.find(x=>x.id===personId)||{};
    const items=itemsOf(l).map(function(it,i){return i===0?Object.assign({},it,{size}):it});
    const ready=items.every(it=>it.size);
    patchLead(personId,{size:ready?size:"",items,nextAction:ready?"Size locked. Send the invoice.":"Ask for the UK size",nextActionAt:ready?null:l.nextActionAt});
    toast=size?("UK "+size+" locked."):"Size open.";
    draw();
  });
  document.querySelectorAll("[data-itemsize]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    const i=Number(b.getAttribute("data-item")||0);
    const size=b.getAttribute("data-itemsize")||"";
    const l=S.leads.find(x=>x.id===personId)||{};
    const items=itemsOf(l).map(function(it,n){return n===i?Object.assign({},it,{size}):it});
    const ready=items.every(it=>it.size);
    patchLead(personId,{items,size:ready?(items[0]&&items[0].size)||"":"",nextAction:ready?"Size locked. Send the invoice.":"Ask for the UK size",nextActionAt:ready?null:l.nextActionAt});
    toast=size?("UK "+size+" locked."):"Size open.";
    draw();
  });
  document.querySelectorAll("[data-pqty]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    const qty=Number(b.getAttribute("data-pqty")||1)||1;
    const l=S.leads.find(x=>x.id===personId)||{};
    const items=itemsOf(l).map(function(it,i){return i===0?Object.assign({},it,{qty}):it});
    patchLead(personId,{qty,items});
    draw();
  });
  document.querySelectorAll("[data-chide]").forEach(b=>b.onclick=function(){
    scoopCap();
    cap.colour=b.getAttribute("data-chide")||"book";
    cap.view=0;
    draw();
  });
  document.querySelectorAll("[data-phide]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    const colour=b.getAttribute("data-phide")||"book";
    const l=S.leads.find(x=>x.id===personId)||{};
    const items=itemsOf(l).map(function(it,i){return i===0?Object.assign({},it,{colour}):it});
    patchLead(personId,{colour,items});
    pairView=0;
    draw();
  });
  document.querySelectorAll("[data-pdel]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    const delivery=b.getAttribute("data-pdel")||"collect";
    patchLead(personId,{delivery,deliveryFee:feeOf(delivery)});
    draw();
  });
  const psku=document.getElementById("p-sku");
  if(psku) psku.onchange=function(){
    if(!personId) return;
    const pair=shoe(psku.value);
    const l=S.leads.find(x=>x.id===personId)||{};
    const items=itemsOf(l).map(function(it,i){return i===0?Object.assign({},it,{sku:psku.value,look:pair?pair.look:"",listedPrice:null,listed:pair?pair.price:0}):it});
    patchLead(personId,{sku:psku.value,look:pair?pair.look:"",listedPrice:null,items});
    pairView=0;
    draw();
  };
  const cprice=document.getElementById("cap-price");
  if(cprice) cprice.onchange=function(){
    scoopCap();
    draw();
  };
  const pprice=document.getElementById("p-price");
  if(pprice) pprice.onchange=function(){
    if(!personId) return;
    const l=S.leads.find(x=>x.id===personId);
    const pair=shoe(l&&l.sku);
    const n=Number(String(pprice.value||"").replace(/[^\d]/g,""))||0;
    patchLead(personId,{listedPrice:pair&&n===pair.price?null:(n||null)});
    draw();
  };
  hookExtras("cap",function(){return cap.extras},function(ex,quiet){
    scoopCap();
    cap.extras=extraFix(ex);
    if(!quiet) draw();
  });
  hookExtras("p",function(){
    const l=S.leads.find(x=>x.id===personId);
    return l&&l.extras;
  },function(ex,quiet){
    if(!personId) return;
    patchLead(personId,{extras:extraFix(ex)});
    if(!quiet) draw();
  });
  hookTurn(function(d,abs){
    const n=5;
    if(personId){
      if(abs!=null) pairView=abs;
      else pairView=((pairView||0)+d+n)%n;
      draw();
      return;
    }
    if(tab==="capture"){
      scoopCap();
      if(abs!=null) cap.view=abs;
      else cap.view=((cap.view||0)+d+n)%n;
      draw();
    }
  });
  document.querySelectorAll("[data-copy]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    const l=S.leads.find(x=>x.id===personId);
    if(!l) return;
    const text=payMsg(l);
    const done=function(){toast="EFT text copied.";draw()};
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(function(){toast="Use WhatsApp EFT.";draw()});
    }else toast="Use WhatsApp EFT.",draw();
  });
  const pnext=document.getElementById("pnext");
  if(pnext) pnext.onsubmit=function(e){
    e.preventDefault();
    const f=Object.fromEntries(new FormData(pnext));
    const next=String(f.next||"").trim();
    const at=f.at?new Date(f.at).toISOString():null;
    const name=String(f.name||"").trim();
    const phone=String(f.phone||"").trim();
    const note=String(f.note||"");
    if(name&&name.length<2){toast="Need a name.";draw();return}
    if(phone&&digits(phone).length<9){toast="WhatsApp number.";draw();return}
    if(personId){
      const fields={nextAction:next,nextActionAt:at,note};
      if(name) fields.name=name;
      if(phone) fields.phone=phone;
      patchLead(personId,fields);
      toast="Saved.";
      draw();
    }
  };
  document.querySelectorAll("[data-wa]").forEach(a=>a.addEventListener("click",function(){
    const id=a.getAttribute("data-wa");
    const l=S.leads.find(x=>x.id===id);
    if(l&&(l.status==="new"||l.status==="inbox")){
      patchLead(id,{status:"contacted",nextAction:"Asked for UK size",nextActionAt:new Date(Date.now()+2*3600000).toISOString()});
    }
  }));
  document.querySelectorAll("[data-take]").forEach(b=>b.onclick=function(){
    patchLead(b.getAttribute("data-take"),{owner:mySeller(),sitAt:Date.now()});
    toast="On Sable.";
    draw();
  });
  document.querySelectorAll("[data-locksize]").forEach(b=>b.onclick=function(){
    const id=b.getAttribute("data-lead");
    const size=b.getAttribute("data-locksize")||"";
    if(!id||!size) return;
    patchLead(id,{size,nextAction:"Size locked. Send the invoice.",nextActionAt:null});
    toast="UK "+size+" locked.";
    draw();
  });
  document.querySelectorAll("[data-todopaid]").forEach(b=>b.onclick=function(){
    const id=b.getAttribute("data-todopaid");
    if(!id) return;
    const l=S.leads.find(x=>x.id===id);
    patchLead(id,{
      paid:true,
      status:l&&l.status==="new"?"contacted":(l&&l.status),
      nextAction:"EFT received. Close the card.",
      nextActionAt:null
    });
    toast="Marked paid.";
    draw();
  });
  if(tab==="capture"&&toast==="On the board."){
    const n=document.querySelector("#cap [name=name]");
    if(n) setTimeout(function(){n.focus()},40);
  }
  const pinfo=document.getElementById("pinfo");
  if(pinfo) pinfo.onsubmit=function(e){
    e.preventDefault();
    const f=Object.fromEntries(new FormData(pinfo));
    const name=String(f.name||"").trim();
    const phone=String(f.phone||"").trim();
    if(name.length<2){toast="Need a name.";draw();return}
    if(digits(phone).length<9){toast="WhatsApp number.";draw();return}
    if(personId){patchLead(personId,{name,phone});toast="Person saved.";draw()}
  };
  const pnote=document.getElementById("pnote");
  if(pnote) pnote.onsubmit=function(e){e.preventDefault();const f=Object.fromEntries(new FormData(pnote));if(personId){patchLead(personId,{note:String(f.note||"")});toast="Note saved.";draw()}};
  document.querySelectorAll("[data-ok]").forEach(b=>b.onclick=function(){
    const email=b.getAttribute("data-ok");
    const r=S.requests.find(x=>x.email===email);
    if(!r) return;
    r.status="approved";
    const existing=S.users.find(u=>norm(u.email)===norm(email));
    if(existing){existing.status="approved";existing.role="sales";existing.seller=r.seller||"luan";existing.password=r.password||existing.password}
    else S.users.push({name:r.name,email:r.email,password:r.password,role:"sales",seller:r.seller||"luan",status:"approved"});
    save();draw();
  });
  document.querySelectorAll("[data-no]").forEach(b=>b.onclick=function(){const email=b.getAttribute("data-no");const r=S.requests.find(x=>x.email===email);if(r) r.status="denied";save();draw()});
}
async function ingest(){
  try{
    const r=await fetch(API);
    if(!r.ok) return;
    const j=await r.json();
    const incoming=(j.leads||[]).map(leadFix);
    const before=S.leads.length;
    for(const row of incoming){
      const byId=S.leads.find(l=>l.id===row.id);
      if(byId){
        const pt=Number(byId.updatedAt||byId.createdAt||0);
        const nt=Number(row.updatedAt||row.createdAt||0);
        if(nt>=pt) Object.assign(byId,row,{id:byId.id});
      }else{
        S.leads.unshift(row);
      }
    }
    S.leads=keepLeads(S.leads);
    if(S.leads.length!==before) save();
    else vaultPush();
  }catch(e){}
}
draw();
ingest();
setInterval(ingest,20000);
setInterval(function(){
  if(S.session&&tab==="todo"&&!personId) draw();
},30000);

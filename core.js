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
function randZar(n){return Math.round(Number(n)||0)}
function bookListed(l){
  return itemsOf(l).reduce(function(n,it){
    const p=shoe(it.sku);
    return n+((p&&p.price)||0)*Number(it.qty||1);
  },0);
}
function itemListedSum(items){
  return (items||[]).reduce(function(n,it){
    return n+Number(it.listed||0)*Number(it.qty||1);
  },0);
}
function itemIsCustom(it){
  if(!it) return false;
  const p=shoe(it.sku);
  const o=Number(it.listedPrice);
  return !!(o>0&&(!p||randZar(o)!==p.price));
}
function spreadListedTotal(items,total){
  items=(items||[]).map(itemFix);
  if(!items.length) items=[itemFix({})];
  const bookLines=items.map(function(it){
    const p=shoe(it.sku);
    return ((p&&p.price)||0)*Number(it.qty||1);
  });
  const book=bookLines.reduce(function(a,b){return a+b},0);
  total=randZar(total);
  if(!total||(book&&total===book)){
    return items.map(function(it){
      const p=shoe(it.sku);
      return Object.assign({},it,{listedPrice:null,listed:p?p.price:0});
    });
  }
  let left=total;
  const weight=book||items.reduce(function(n,it){return n+it.qty},0)||1;
  return items.map(function(it,i){
    const last=i===items.length-1;
    const w=book?bookLines[i]:it.qty;
    const line=last?left:randZar(total*w/weight);
    left-=line;
    const unit=it.qty?line/it.qty:line;
    const p=shoe(it.sku);
    const isBook=p&&randZar(unit)===p.price;
    return Object.assign({},it,{
      listedPrice:isBook?null:unit,
      listed:isBook?p.price:unit
    });
  });
}
function lockListed(l,total){
  const base=l&&typeof l==="object"?l:{};
  let items=itemsOf(base);
  if(!items.length) items=[itemFix(base)];
  items=spreadListedTotal(items,total);
  const listed=randZar(itemListedSum(items));
  const book=randZar(bookListed({items:items}));
  return {
    items:items,
    qty:items.reduce(function(n,it){return n+it.qty},0)||1,
    listedPrice:listed===book?null:listed
  };
}
function lockListedFromLead(l){
  l=l&&typeof l==="object"?l:{};
  const hasItems=Array.isArray(l.items)&&l.items.length;
  const items=itemsOf(l);
  const book=bookListed({items:items});
  const leadN=Number(l.listedPrice)>0?Number(l.listedPrice):null;
  const custom=items.some(itemIsCustom);
  const itemSum=itemListedSum(items);
  let total;
  if(!hasItems&&leadN&&items[0]&&items[0].qty>1) total=leadN;
  else if(leadN&&randZar(leadN)!==randZar(itemSum)&&!custom) total=leadN;
  else if(custom) total=itemSum;
  else if(leadN) total=leadN;
  else total=book;
  return lockListed(Object.assign({},l,{items:items}),total);
}
function extraScore(e){
  e=extraFix(e);
  return (e.laser?1:0)+(e.laces?1:0)+(e.stitch?1:0)+(e.custom?1:0)+Number(e.customFee||0);
}
function extraPick(a,b){
  return extraScore(a)>=extraScore(b)?extraFix(a):extraFix(b);
}
function leadFix(l){
  l=l&&typeof l==="object"?l:{};
  const locked=lockListedFromLead(l);
  let items=locked.items;
  const first=items[0]||itemFix({});
  const extras=extraPick(l.extras,first.extras);
  if(items.length) items=items.map(function(it,i){return i===0?Object.assign({},it,{extras:extras}):it});
  const p=shoe(l.sku||first.sku);
  const miss=items.some(it=>!it.size);
  return {
    id:l.id||uid(),
    name:String(l.name||"").trim(),
    phone:String(l.phone||"").trim(),
    sku:String(first.sku||l.sku||""),
    look:String(first.look||l.look||(p&&p.look)||""),
    size:miss?"":String(first.size||l.size||""),
    qty:locked.qty,
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
    extras,
    listedPrice:locked.listedPrice,
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
let tab="desk";
let toast="";
let autoUndo=[];
let autoSkip={};
let deskFilter="all";
let boardCol="new";
let pane="work";
let personId=null;
let cap={sku:"45015",name:"",phone:"",size:"",qty:1,source:"whatsapp",note:"",delivery:"collect",owner:"luan",type:"",colour:"book",view:0,extras:extraFix(),listedPrice:null};
let pairView=0;
let invView=false;
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
  toast="";tab="desk";personId=null;
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
  return ticket(l).listed;
}
function isCustomPair(l){
  if(!l) return false;
  const items=itemsOf(l);
  if(items.some(function(it){
    const ex=extraFix(it.extras);
    if(ex.custom||ex.customFee) return true;
    return itemIsCustom(it);
  })) return true;
  const book=bookListed(l);
  const leadN=Number(l.listedPrice);
  return !!(leadN>0&&randZar(leadN)!==randZar(book));
}
function nametag(l){return isCustomPair(l)?'<span class="nametag">Custom</span>':""}
function mismatchBadge(l){return priceMismatch(l)?'<span class="price-mismatch">Price mismatch</span>':""}
function ticket(l){
  const items=itemsOf(l);
  const first=items[0]||itemFix(l||{});
  const p=shoe(first.sku);
  const qty=items.reduce((n,it)=>n+it.qty,0)||1;
  const book=bookListed(l);
  const itemSum=itemListedSum(items);
  const leadN=Number(l&&l.listedPrice)>0?Number(l.listedPrice):null;
  const customItems=items.some(itemIsCustom);
  let listed;
  if(leadN&&randZar(leadN)!==randZar(itemSum)&&!customItems) listed=leadN;
  else if(customItems) listed=itemSum;
  else if(leadN) listed=leadN;
  else listed=itemSum||book;
  listed=randZar(listed);
  const extras=items.reduce((n,it)=>n+extraSum(it.extras,it.qty),0);
  const fee=Number(l&&l.deliveryFee||0)||0;
  return {p,qty,listed,fee,extras,due:listed+fee+extras,custom:isCustomPair(l),items,mismatch:randZar(listed)!==randZar(itemSum)};
}
function priceMismatch(l){
  if(!l) return false;
  return !!ticket(l).mismatch;
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
function invDate(ts){
  const d=new Date(Number(ts)||Date.now());
  if(isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-ZA",{day:"numeric",month:"short",year:"numeric"});
}
function invIssued(l){
  const hit=(S.invoices||[]).find(x=>x.leadId===l.id&&x.ref===(l.invRef||invRef(l)));
  return hit&&hit.at?hit.at:(l.updatedAt||l.createdAt||Date.now());
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
  const items=[["desk","Desk","D"],["todo","To-do","T"],["board","Board","B"],["capture","Capture","C"],["clients","Clients","L"],["meetings","Meetings","M"]];
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
      return rows.filter(l=>{
        const t=nextTodo(l);
        if(!t) return false;
        if(t.lane==="now") return true;
        return slaOf(t,l).paySla;
      }).length;
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
function nextActionClose(l){
  return /eft received|close the card/i.test(String(l&&l.nextAction||""));
}
function nextTodo(l){
  if(!l||l.status==="lost") return null;
  if(l.status==="closed"&&l.paid) return null;
  if(nextActionClose(l)) return {kind:"close",step:String(l.nextAction||"EFT received. Close the card."),cta:"Mark closed",done:true,wa:false,lane:"now"};
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
    const na=String(l.nextAction||"");
    const sent=/invoice|eft|pay/i.test(na)&&!nextActionClose(l);
    return {kind:"pay",step:sent?"Chase the EFT":"Send the invoice",cta:sent?"Chase EFT":"Send invoice",done:true,wa:true,lane:"now"};
  }
  return {kind:"follow",step:l.nextAction||"Follow up",cta:"WhatsApp",done:true,wa:true,lane:"now"};
}
function isPayConfirm(t,l){
  if(!l||l.paid||l.status==="lost") return false;
  if(nextActionClose(l)) return false;
  if(t&&t.kind==="close") return false;
  if(t&&t.kind==="pay") return true;
  const na=String((t&&t.step)||l.nextAction||"");
  return /invoice|eft|pay/i.test(na);
}
function slaOf(t,l,wait){
  t=t||nextTodo(l);
  wait=wait!=null?wait:sitMs(l);
  if(!t||!l||l.status==="lost"||(l.status==="closed"&&l.paid)){
    return {needsLuan:false,escalateStaff:false,paySla:false,sla:false};
  }
  const paySla=isPayConfirm(t,l)&&!l.paid&&wait>3600000;
  const nowLane=(t.lane||"now")==="now"||paySla;
  const escalateStaff=nowLane&&wait>2*3600000;
  const needsLuan=paySla||(nowLane&&wait>3*3600000);
  return {needsLuan:!!needsLuan,escalateStaff:!!escalateStaff,paySla:!!paySla,sla:!!(needsLuan||escalateStaff)};
}
function staffUser(seller){
  const id=norm(seller);
  if(!id) return null;
  return (S.users||[]).find(function(u){
    return norm(u.seller)===id||norm(u.x)===id||norm(u.name)===id||norm((u.name||"").split(" ")[0])===id;
  })||null;
}
function staffPhoneOf(seller){
  const u=staffUser(seller);
  if(!u) return "";
  const p=u.phone||u.whatsapp||u.wa||"";
  return digits(p).length>=9?p:"";
}
function slaStaffText(it){
  const l=it&&it.lead;
  if(!l) return "";
  const who=SL[bookOf(l)]||bookOf(l)||"Sales";
  const age=sitLabel(it.wait!=null?it.wait:sitMs(l));
  const sku=[l.sku,l.look,l.size?("UK "+l.size):""].filter(Boolean).join(" ");
  return who+", SLA on "+(l.name||"this ticket")+(sku?(" · "+sku):"")+". "+todoVerb(it)+" · sitting "+age+". Action the desk now. Staff ping only — do not send this to the client.";
}
function kindRank(t){
  if(!t) return 9;
  return t.kind==="close"?0:t.kind==="take"?1:t.kind==="whatsapp"?2:t.kind==="pay"?3:t.kind==="size"?4:t.kind==="follow"?6:t.lane==="wait"?80:9;
}
function todoRank(t,sla){
  const k=kindRank(t);
  if(sla&&sla.needsLuan) return k;
  if(sla&&sla.escalateStaff) return 10+k;
  return 20+k;
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
  if(it.kind==="close") return it.step&&it.step!=="EFT is in"?it.step:"Close the sale";
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
  const items=[];
  for(const l of rows){
    let t=nextTodo(l);
    if(!t) continue;
    if(houseAll&&t.lane==="now") t={kind:"take",step:"Not on a book yet.",cta:"Take",done:false,wa:false,lane:"now"};
    const wait=sitMs(l);
    const sla=slaOf(t,l,wait);
    const lane=sla.paySla&&t.lane==="wait"?"now":(t.lane||"now");
    const rank=todoRank({kind:t.kind,lane:lane},sla);
    items.push({
      id:t.kind+"-"+l.id,
      kind:t.kind,
      step:t.step,
      cta:t.cta,
      done:t.done,
      wa:t.wa,
      lane:lane,
      lead:l,
      due:l.nextActionAt||l.updatedAt||l.createdAt,
      overdue:!!(sla.escalateStaff||sla.needsLuan),
      wait,
      rank,
      needsLuan:!!sla.needsLuan,
      escalateStaff:!!sla.escalateStaff,
      paySla:!!sla.paySla,
      sla:!!sla.sla
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
function slaFlags(it){
  if(!it||!it.sla) return "";
  return '<span class="todo-flags">'
    +(it.needsLuan?'<span class="todo-flag luan">Needs Luan</span>':"")
    +'<span class="todo-flag sla">'+(it.needsLuan?"SLA":"Escalate")+"</span>"
    +"</span>";
}
function slaCta(it){
  if(!it||!it.escalateStaff) return "";
  const l=it.lead;
  if(!l) return "";
  const seller=bookOf(l);
  if(!seller||seller===mySeller()) return "";
  const phone=staffPhoneOf(seller);
  const text=slaStaffText(it);
  const href=phone?wa(phone,text):"";
  const who=SL[seller]||"salesperson";
  if(href) return '<a class="ghost" href="'+href+'" target="_blank" rel="noreferrer">WhatsApp '+esc(who)+"</a>";
  return '<button class="ghost" type="button" data-copy-sla="'+esc(it.id)+'">Copy '+esc(who)+" ping</button>";
}
function todoCta(it){
  const l=it.lead;
  if(!l) return "";
  const href=it.wa?wa(l.phone,todoWaText(it)):"";
  let out="";
  if(it.kind==="close") out='<button class="solid tight" type="button" data-done="'+esc(it.id)+'">Mark closed</button>';
  else if(it.kind==="take") out='<button class="solid tight" type="button" data-take="'+l.id+'">Take onto my book</button>';
  else if(it.kind==="size"){
    const ask=href?'<a class="solid tight" href="'+href+'" target="_blank" rel="noreferrer" data-wadone="'+esc(it.id)+'">WhatsApp size</a>':"";
    const sizes='<div class="todo-sizes"><p class="kicker">They replied · lock UK</p><div class="chips">'+UK.map(s=>'<button class="chip" type="button" data-lead="'+l.id+'" data-locksize="'+s+'">'+s+"</button>").join("")+"</div></div>";
    out=ask+sizes+todoPendBtn(l,it);
  }else if(it.kind==="pay"){
    out='<button class="solid tight" type="button" data-invoice="'+l.id+'">Invoice</button>'+
      (href?'<a class="ghost" href="'+href+'" target="_blank" rel="noreferrer" data-wadone="'+esc(it.id)+'">WhatsApp EFT</a>':"")+
      '<button class="ghost" type="button" data-todopaid="'+l.id+'">They paid</button>'+todoPendBtn(l,it);
  }else if(href){
    const mark=it.done?' data-wadone="'+esc(it.id)+'"':"";
    out='<a class="solid tight" href="'+href+'" target="_blank" rel="noreferrer"'+mark+">"+esc(it.cta)+"</a>"+todoPendBtn(l,it);
  }else{
    out='<button class="solid tight" type="button" data-go="person" data-id="'+l.id+'">Open</button>'+todoPendBtn(l,it);
  }
  return out+slaCta(it);
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
  const sla=it.sla?" sla":"";
  const luan=it.needsLuan?" luan":"";
  return '<div class="todo-hero '+heat+sla+luan+'">'+
    '<div class="todo-hero-head"><p class="kicker">'+of+'</p><span class="todo-head-meta">'+slaFlags(it)+todoAge(it)+"</span></div>"+
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
  const sla=it.sla?" sla":"";
  const luan=it.needsLuan?" luan":"";
  const num=n!=null?'<span class="todo-ix">'+n+"</span>":'<span class="todo-ix mute"></span>';
  return '<button class="todo-line '+heat+sla+luan+'" type="button" data-go="person" data-id="'+l.id+'">'+
    num+
    '<span class="todo-who">'+
      '<p class="name">'+esc(l.name||"No name")+nametag(l)+"</p>"+
      '<p class="todo-step">'+esc(todoVerb(it))+"</p>"+
      '<p class="meta">'+esc(todoMeta(it))+"</p>"+
    "</span>"+
    '<span class="todo-line-meta">'+slaFlags(it)+todoAge(it)+"</span>"+
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
    const nows=rows.map(l=>({l:l,t:nextTodo(l)})).filter(x=>{
      if(!x.t) return false;
      if(x.t.lane==="now") return true;
      return slaOf(x.t,x.l).paySla;
    });
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
  const wait=sitMs(l);
  return todoRank(t,slaOf(t,l,wait));
}
const IDLE_MS=2*3600000;
function onSharedBook(seller){
  const id=norm(seller);
  if(!id) return false;
  if(id==="luan"||id==="dylan"||id==="wian") return true;
  const u=staffUser(id);
  if(!u||u.status!=="approved") return false;
  return u.sharedBook===true||u.onBook===true;
}
function sharedBookSellers(){
  const seen={};
  const out=[];
  function add(s){
    const id=norm(s);
    if(!onSharedBook(id)||seen[id]) return;
    seen[id]=true;
    out.push(id);
  }
  add("dylan");
  add("luan");
  add("wian");
  (S.users||[]).forEach(function(u){
    if(u&&u.status==="approved") add(u.seller||u.x);
  });
  return out;
}
function paidPairsSold(seller){
  let n=0;
  (S.leads||[]).forEach(function(l){
    if(!l||!l.paid||l.status==="lost") return;
    if((bookOf(l)||"floor")!==seller) return;
    n+=ticket(l).qty;
  });
  return n;
}
function pickAssignee(){
  const sellers=sharedBookSellers();
  const order={dylan:0,luan:1,wian:2};
  sellers.sort(function(a,b){
    const pa=paidPairsSold(a);
    const pb=paidPairsSold(b);
    if(pa!==pb) return pa-pb;
    const ta=order[a]!=null?order[a]:9;
    const tb=order[b]!=null?order[b]:9;
    if(ta!==tb) return ta-tb;
    return a<b?-1:a>b?1:0;
  });
  return sellers[0]||null;
}
function isWaitLane(l){
  if(!l) return false;
  const due=l.nextActionAt?new Date(l.nextActionAt).getTime():0;
  if(due>Date.now()) return true;
  const t=nextTodo(l);
  return !!(t&&t.lane==="wait");
}
function isDeadLead(l){
  if(!l) return true;
  if(l.status==="lost") return true;
  if(l.status==="closed"&&l.paid) return true;
  return false;
}
function isIdleFloorLead(l){
  if(isDeadLead(l)||bookOf(l)) return false;
  if(autoSkip[l.id]) return false;
  if(sitMs(l)<IDLE_MS) return false;
  if(isWaitLane(l)) return false;
  return true;
}
function isIdleAssignedLead(l){
  if(isDeadLead(l)||!bookOf(l)) return false;
  if(autoSkip[l.id]) return false;
  if(sitMs(l)<IDLE_MS) return false;
  if(isWaitLane(l)) return false;
  if(String(l.nextAction||"").trim()) return false;
  const st=l.status||"new";
  if(st==="closed"||st==="lost") return false;
  return st==="new"||st==="inbox"||st==="working"||st==="contacted";
}
function idleLeadsForAssign(){
  const rows=S.leads||[];
  const floor=[];
  const assigned=[];
  for(let i=0;i<rows.length;i++){
    const l=rows[i];
    if(isIdleFloorLead(l)) floor.push(l);
    else if(isIdleAssignedLead(l)) assigned.push(l);
  }
  return floor.concat(assigned);
}
function autoAssignPlan(){
  if(!S.session||!houseView()) return [];
  const who=pickAssignee();
  if(!who) return [];
  const idle=idleLeadsForAssign();
  const plan=[];
  for(let i=0;i<idle.length;i++){
    const l=idle[i];
    if(bookOf(l)===who) continue;
    const fields={owner:who,sitAt:Date.now()};
    if(!String(l.nextAction||"").trim()){
      fields.nextAction="Auto-assigned — first WhatsApp";
      fields.nextActionAt=null;
    }
    plan.push({id:l.id,lead:l,fields:fields,to:who});
  }
  return plan;
}
function deskFlash(){
  const last=autoUndo.length?autoUndo[autoUndo.length-1]:null;
  const undo=last?' <button class="chip" type="button" data-undo-assign="'+esc(last.id)+'">Undo</button>':"";
  if(toast){
    const bad=/need|wrong|type |eight|whatsapp number/i.test(toast);
    const auto=/auto-assigned|back on floor/i.test(toast);
    return '<p class="'+(bad?"err":"ok")+(auto?" auto-assign-note":"")+'">'+esc(toast)+(auto?undo:"")+"</p>";
  }
  if(last){
    const who=SL[last.to]||last.to;
    return '<p class="ok auto-assign-note">Auto-assigned to '+esc(who)+undo+"</p>";
  }
  return "";
}
function standupRows(){
  const rows=S.leads||[];
  if(houseView()){
    if(deskFilter==="all") return rows.slice();
    return rows.filter(function(l){return bookOf(l)===deskFilter});
  }
  const mine=mySeller();
  return rows.filter(function(l){return bookOf(l)===mine});
}
function standupSort(a,b){
  const ha=a.heat==="hot"?0:a.heat==="warm"?1:2;
  const hb=b.heat==="hot"?0:b.heat==="warm"?1:2;
  if(ha!==hb) return ha-hb;
  return (b.wait||0)-(a.wait||0);
}
function standupPack(l,why){
  const wait=sitMs(l);
  const t=nextTodo(l);
  const sla=slaOf(t,l,wait);
  return {id:l.id,lead:l,wait:wait,heat:sitHeat(wait),why:why,todo:t,sla:sla};
}
function standupOverdue(){
  const out=[];
  standupRows().forEach(function(l){
    if(isDeadLead(l)) return;
    const t=nextTodo(l);
    if(!t) return;
    const wait=sitMs(l);
    const sla=slaOf(t,l,wait);
    const lane=sla.paySla&&t.lane==="wait"?"now":(t.lane||"now");
    if(lane!=="now") return;
    const heat=sitHeat(wait);
    if(!(heat==="hot"||sla.escalateStaff||sla.needsLuan||sla.paySla)) return;
    const why=sla.needsLuan?"Needs Luan":sla.paySla?"Unpaid EFT over 1 hour":sla.escalateStaff?"SLA sitting over 2 hours":(todoVerb(t)+" · over 1 hour");
    out.push(standupPack(l,why));
  });
  out.sort(standupSort);
  return out;
}
function standupUnpaid(){
  const out=[];
  standupRows().forEach(function(l){
    if(!l||l.paid||isDeadLead(l)||nextActionClose(l)) return;
    const t=nextTodo(l);
    if(!(l.invRef||isPayConfirm(t,l))) return;
    if(sitMs(l)<3600000) return;
    const why=l.invRef?"Invoice out · unpaid over 1 hour":(todoVerb(t)||"Chase the EFT");
    out.push(standupPack(l,why));
  });
  out.sort(standupSort);
  return out;
}
function standupDylan(){
  const out=[];
  standupRows().forEach(function(l){
    if(isDeadLead(l)) return;
    const st=l.status||"new";
    if(st==="closed") return;
    const book=bookOf(l);
    const named=/dylan|waiting on dylan/i.test(String(l.nextAction||""));
    if(!(book==="dylan"||named)) return;
    if(sitMs(l)<IDLE_MS) return;
    out.push(standupPack(l,named?"Waiting on Dylan":"Dylan book · idle over 2 hours"));
  });
  out.sort(standupSort);
  return out;
}
function standupIdle(){
  const out=[];
  standupRows().forEach(function(l){
    if(!(isIdleFloorLead(l)||isIdleAssignedLead(l))) return;
    out.push(standupPack(l,bookOf(l)?"No next step · idle over 2 hours":"Floor · no next step"));
  });
  out.sort(standupSort);
  return out;
}
function standupLuan(){
  const out=[];
  standupRows().forEach(function(l){
    if(isDeadLead(l)) return;
    const t=nextTodo(l);
    const wait=sitMs(l);
    const sla=slaOf(t,l,wait);
    const book=bookOf(l);
    const heat=sitHeat(wait);
    const nowLane=!!(t&&((sla.paySla&&t.lane==="wait")||t.lane==="now"));
    let why="";
    if(sla.needsLuan) why="Needs Luan";
    else if(book==="luan"&&heat==="hot"&&nowLane) why="Luan book · hot";
    else if(!book&&t&&t.lane==="now") why="Floor · house decision";
    if(!why) return;
    out.push(standupPack(l,why));
  });
  out.sort(standupSort);
  return out;
}
function buildStandup(){
  return {
    overdue:standupOverdue(),
    unpaid:standupUnpaid(),
    dylan:standupDylan(),
    idle:standupIdle(),
    luan:standupLuan()
  };
}
function standupCta(kind,row){
  const l=row&&row.lead;
  if(!l) return "";
  if(kind==="unpaid") return '<button class="solid tight" type="button" data-todopaid="'+l.id+'">Confirm paid</button>';
  return '<button class="chip" type="button" data-go="person" data-id="'+l.id+'">Open</button>';
}


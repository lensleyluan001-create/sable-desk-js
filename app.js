const PHOTO="https://raw.githubusercontent.com/lensleyluan001-create/sable-looks/main/";
const SELLERS=["wian","luan","dylan"];
const SL={wian:"Wian",luan:"Luan",dylan:"Dylan"};
const UK=["3","4","5","6","7","8","9","10","11","12","13"];
const HIDES=[["book","As photographed"],["tan","Tan"],["brown","Brown"],["dark","Dark brown"],["black","Black"],["olive","Olive"]];
const HIDE_SWATCH={book:"#8a7a68",tan:"#c4a574",brown:"#6b4634",dark:"#3a2418",black:"#14110e",olive:"#5a6348"};
const TYPE_SLUG={"Vellie":"vellie","Wool-lined vellie":"vellie","Kids vellie":"vellie","Golfer":"golfer","Chelsea":"chelsea","Derby":"derby","Kids derby":"derby","Hiking boot":"hike","Combat boot":"combat","Loafer":"loafer","Sandal":"sandal","Thong":"thong","Zip boot":"zip","Wool-lined boot":"woolboot","Wool-lined slipper":"slip"};
const SOURCES=[["whatsapp","WhatsApp"],["website","Website"],["instagram","Instagram"],["walk-in","Walk-in"],["referral","Referral"],["other","Other"]];
const STAGES=[["new","New"],["contacted","Working"],["qualified","Working"],["negotiation","Working"],["closed","Closed"],["lost","Lost"]];
const RAW=[[1,"Vellie",599,350],[2,"Vellie",649,449],[3,"Vellie",599,399],[4,"Golfer",1200,1000],[5,"Vellie",699,499],[6,"Vellie",599,399],[7,"Vellie",649,449],[8,"Wool-lined boot",799,599],[9,"Wool-lined boot",799,599],[10,"Wool-lined slipper",699,499],[11,"Hiking boot",799,599],[12,"Vellie",649,449],[13,"Derby",599,399],[14,"Derby",799,599],[15,"Chelsea",1100,900],[16,"Vellie",599,399],[17,"Vellie",799,599],[18,"Vellie",699,499],[19,"Vellie",699,499],[20,"Derby",599,399],[21,"Derby",599,399],[22,"Derby",799,599],[23,"Golfer",999,799],[24,"Derby",599,399],[25,"Derby",599,399],[26,"Derby",599,399],[27,"Sandal",449,249],[28,"Thong",449,249],[29,"Thong",449,249],[30,"Sandal",449,249],[31,"Derby",649,449],[32,"Zip boot",899,699],[33,"Derby",599,399],[34,"Derby",599,399],[35,"Derby",599,399],[36,"Vellie",649,449],[37,"Vellie",649,449],[38,"Vellie",649,449],[39,"Chelsea",1100,900],[40,"Chelsea",1100,900],[41,"Derby",649,449],[42,"Derby",599,399],[43,"Loafer",699,499],[44,"Vellie",649,449],[45,"Vellie",699,499],[46,"Vellie",699,499],[47,"Golfer",850,650],[48,"Vellie",699,499],[49,"Thong",449,249],[50,"Vellie",699,499],[51,"Vellie",699,499],[52,"Vellie",699,499],[53,"Vellie",699,499],[54,"Vellie",699,499],[55,"Vellie",649,449],[56,"Hiking boot",799,599],[57,"Wool-lined vellie",799,599],[58,"Vellie",699,499],[59,"Vellie",799,599],[60,"Golfer",1100,900],[61,"Hiking boot",799,599],[62,"Vellie",699,499],[63,"Golfer",1300,1100],[64,"Vellie",699,499],[65,"Combat boot",1400,1200],[66,"Combat boot",1400,1200],[67,"Combat boot",1400,1200],[68,"Combat boot",1200,1000],[69,"Chelsea",1100,900],[70,"Chelsea",1100,900],[71,"Chelsea",1100,900],[72,"Chelsea",1100,900],[73,"Chelsea",1100,900],[74,"Chelsea",1100,900],[75,"Chelsea",1100,900],[76,"Chelsea",1100,900],[77,"Chelsea",1100,900],[78,"Kids vellie",399,199],[79,"Kids derby",399,199],[80,"Hiking boot",1400,1200],[81,"Hiking boot",899,699],[82,"Hiking boot",1400,1200],[83,"Hiking boot",1400,1200],[84,"Hiking boot",1400,1200],[85,"Hiking boot",1400,1200],[86,"Hiking boot",1400,1200],[87,"Vellie",699,499],[88,"Combat boot",1600,1400],[89,"Vellie",699,499],[90,"Golfer",1200,1000],[91,"Zip boot",799,599],[92,"Vellie",699,499]];
const PAIRS=RAW.map(([n,look,price,cost])=>({n,sku:String(45000+n),look,price,cost,img:PHOTO+(45000+n)+".jpg"}));
function shoe(sku){return PAIRS.find(p=>p.sku===String(sku))||null}
function hideName(id){const h=HIDES.find(x=>x[0]===id);return h?h[1]:"As photographed"}
function typeSlug(look){return TYPE_SLUG[look]||"vellie"}
function viewHost(){
  try{
    const h=location.hostname||"";
    if(h.indexOf("vercel.app")>=0) return PHOTO+"views/";
  }catch(e){}
  return "./views/";
}
function studioSrc(slug,n){return viewHost()+slug+"-"+n+".jpg"}
function viewsOf(p,hide){
  const slug=typeSlug(p&&p.look);
  const studio=[1,2,3,4,5].map(n=>studioSrc(slug,n));
  if(!hide||hide==="book") return [(p&&p.img)||studio[0]].concat(studio.slice(1));
  return studio;
}
function hideSwatch(id){return HIDE_SWATCH[id]||HIDE_SWATCH.book}
function hideChips(on,attr){
  attr=attr||"data-hide";
  on=on||"book";
  return HIDES.map(([id,lab])=>'<button class="hide'+(on===id?" on":"")+'" type="button" '+attr+'="'+id+'"><span class="sw" style="background:'+hideSwatch(id)+'"></span>'+lab+"</button>").join("");
}
function turnHtml(p,hide,viewI){
  hide=hide||"book";
  const shots=viewsOf(p,hide);
  let i=Number(viewI)||0;
  if(i<0) i=shots.length-1;
  if(i>=shots.length) i=0;
  const src=shots[i]||(p&&p.img)||"";
  const alt=p?(p.sku+" "+p.look):"";
  const dots=shots.map((_,n)=>'<button type="button" class="dot'+(n===i?" on":"")+'" data-view="'+n+'" aria-label="View '+(n+1)+'"></button>').join("");
  return '<div class="turn" data-hide="'+hide+'"><img src="'+src+'" alt="'+alt+'" draggable="false" />'+
    '<div class="dots">'+dots+"</div></div>";
}
function hookTurn(setView){
  const box=document.querySelector(".turn");
  if(!box||typeof setView!=="function") return;
  let x0=null;
  box.onpointerdown=function(e){x0=e.clientX;try{box.setPointerCapture(e.pointerId)}catch(err){}};
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
function leadFix(l){
  const p=shoe(l.sku);
  return {
    id:l.id||uid(),
    name:String(l.name||"").trim(),
    phone:String(l.phone||"").trim(),
    sku:String(l.sku||""),
    look:String(l.look||(p&&p.look)||""),
    size:String(l.size||""),
    qty:Number(l.qty||1)||1,
    source:l.source||"whatsapp",
    status:l.status||(l.stage==="inbox"?"new":l.stage)||"new",
    note:String(l.note||""),
    owner:l.owner||null,
    paid:Boolean(l.paid),
    paidAmount:Number(l.paidAmount||0)||0,
    delivery:l.delivery||"collect",
    deliveryFee:Number(l.deliveryFee||0)||0,
    colour:l.colour||"book",
    nextAction:l.nextAction||l.next||"",
    nextActionAt:l.nextActionAt||null,
    invRef:String(l.invRef||""),
    createdAt:l.createdAt||Date.now(),
    updatedAt:l.updatedAt||l.createdAt||Date.now()
  };
}
function emptyBank(){return {bank:"",accountName:"",accountNumber:"",branch:"",type:"Cheque"}}
function load(){
  try{
    const s=Object.assign({session:null,users:[Object.assign({},LUAN)],requests:[],leads:[],meetings:[],invoices:[],bank:emptyBank()},JSON.parse(localStorage.getItem(KEY)||"null")||{});
    if(!s.users)s.users=[];
    if(!s.leads)s.leads=[];
    if(!s.meetings)s.meetings=[];
    if(!s.requests)s.requests=[];
    if(!s.invoices)s.invoices=[];
    if(!s.bank||typeof s.bank!=="object")s.bank=emptyBank();
    else s.bank=Object.assign(emptyBank(),s.bank);
    s.leads=s.leads.map(leadFix);
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
  }catch(e){
    return {session:null,users:[Object.assign({},LUAN)],requests:[],leads:[],meetings:[],invoices:[],bank:emptyBank()};
  }
}
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
let S=load();
let mode="in";
let tab="todo";
let toast="";
let deskFilter="all";
let boardCol="new";
let pane="work";
let personId=null;
let cap={sku:"45015",name:"",phone:"",size:"",qty:1,source:"whatsapp",note:"",delivery:"collect",owner:"luan",type:"",colour:"book",view:0};
let pairView=0;

function house(){
  let u=S.users.find(u=>norm(u.email)===LUAN.email);
  if(!u){u=Object.assign({},LUAN);S.users.unshift(u)}
  u.status="approved";u.role="admin";u.email=LUAN.email;u.name=u.name||LUAN.name;u.x=LUAN.x;u.seller=u.seller||"luan";
  return u;
}
function enter(u){
  S.session={email:u.email,name:u.name||LUAN.name,role:u.role||"sales",seller:u.seller||"luan"};
  toast="";tab="todo";personId=null;save();draw();
}
function houseView(){return S.session&&(S.session.role==="admin"||S.session.role==="manager")}
function mySeller(){return (S.session&&S.session.seller)||"luan"}
function seeCost(){return S.session&&(S.session.role==="admin"||S.session.role==="manager")}
function leads(){
  let rows=S.leads.slice();
  if(!houseView()) rows=rows.filter(l=>!l.owner||l.owner===mySeller());
  if(houseView()&&deskFilter!=="all") rows=rows.filter(l=>l.owner===deskFilter||(!l.owner&&deskFilter==="all"));
  return rows;
}
function firstMsg(l){
  const p=shoe(l.sku);
  const who=l.name?("Hi "+l.name.split(" ")[0]):"Hi";
  const size=l.size
    ?("UK "+l.size+" is locked. Pair count if more than one and I will confirm.")
    :"Reply with UK size and pair count and I will confirm.";
  return who+", this is SABLE.CO. Stock "+(l.sku||"")+" · "+(l.look||"")+" · "+zar(p?p.price:null)+". Handmade. Subject to availability. "+size;
}
function feeOf(d){return d==="local"?100:d==="int"?300:0}
function delLabel(d){if(d==="local")return "Local R100";if(d==="int")return "International R300";return "Collect"}
function ticket(l){
  const p=shoe(l.sku);
  const qty=Number(l.qty||1)||1;
  const listed=p?p.price*qty:0;
  const fee=Number(l.deliveryFee||0)||0;
  return {p,qty,listed,fee,due:listed+fee};
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
  const size=l.size?(" · UK "+l.size):"";
  const pairs=t.qty>1?(" · "+t.qty+" pairs"):" · 1 pair";
  const hide=l.colour&&l.colour!=="book"?(" · "+hideName(l.colour)):"";
  const ship=t.fee?("Delivery "+zar(t.fee)+" ("+delLabel(l.delivery)+")"):"Collect — no delivery";
  const bank=bankLines();
  return who+", SABLE.CO invoice "+ref+". "+(l.sku||"")+" "+(l.look||"")+size+pairs+hide+". Listed "+zar(t.listed)+". "+ship+". EFT due "+zar(t.due)+". Use reference "+ref+"."+(bank.length?" "+bank.join(". ")+".":" Bank details from the desk with this message.")+" Reply paid when the transfer is sent. Pair confirmed after EFT.";
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
  return who+", UK size for the "+(l.sku||"")+" "+(l.look||"")+" and I lock it.";
}
function followMsg(l){
  const who=l.name?("Hi "+l.name.split(" ")[0]):"Hi";
  return who+", checking in on the "+(l.sku||"")+" "+(l.look||"")+". Still want the pair?";
}
function Gate(){
  let form="";
  if(mode==="reset") form='<form class="card" id="reset"><label>Email</label><input name="email" value="'+esc(LUAN.email)+'" autocomplete="username" /><label>New password</label><input name="password" type="password" required minlength="8" autocomplete="new-password" /><button class="solid" type="submit">Set password and enter</button></form><p class="sub">This phone only. House key still works after you set one.</p>';
  else if(mode==="ask") form='<form class="card" id="ask"><label>Name</label><input name="name" required /><label>Email</label><input name="email" type="email" required /><label>Password</label><input name="password" type="password" required minlength="6" /><label>Desk</label><select name="seller"><option value="wian">Wian</option><option value="luan">Luan</option><option value="dylan">Dylan</option></select><button class="solid" type="submit">Send request</button></form>';
  else form='<form class="card" id="signin"><label>Email or X handle</label><input name="email" value="'+esc(LUAN.email)+'" autocomplete="username" required /><label>Password</label><input name="password" type="password" required autocomplete="current-password" /><button class="solid" type="submit">Enter</button></form><button class="ghost" type="button" id="forgot" style="margin-top:10px">Forgot password</button>';
  const title=mode==="reset"?"New password":mode==="ask"?"Request a desk":"Log in";
  return '<div class="gate"><div class="brand">SABLE CRM</div><h1>'+title+'</h1><p class="sub">Staff only. Luan email is filled in.</p><div class="row" style="margin-bottom:12px"><button class="chip '+(mode==="in"?"on":"")+'" type="button" id="m-in">Log in</button><button class="chip '+(mode==="ask"?"on":"")+'" type="button" id="m-ask">Request login</button></div>'+form+(toast?'<p class="err">'+esc(toast)+"</p>":"")+"</div>";
}
function navBtns(where){
  const items=[["todo","To-do"],["board","Board"],["capture","Capture"],["clients","Clients"],["meetings","Meetings"]];
  if(S.session.role==="admin") items.push(["team","Team"]);
  return items.map(([id,label])=>'<button type="button" class="'+(tab===id?"on":"")+'" data-tab="'+id+'">'+label+"</button>").join("");
}
function deskChips(){
  if(!houseView()) return "";
  const n=id=>id==="all"?S.leads.length:S.leads.filter(l=>l.owner===id).length;
  return '<div class="chips" style="margin:14px 0">'+[["all","All desks"],...SELLERS.map(s=>[s,SL[s]])].map(([id,label])=>'<button class="chip '+(deskFilter===id?"on":"")+'" type="button" data-desk="'+id+'">'+label+" "+n(id)+"</button>").join("")+"</div>";
}
function buildTodos(){
  const now=Date.now();
  const DAY=86400000;
  const rows=houseView()?(deskFilter==="all"?S.leads:S.leads.filter(l=>l.owner===deskFilter)):S.leads.filter(l=>!l.owner||l.owner===mySeller());
  const items=[];
  for(const l of rows){
    if(l.status==="lost") continue;
    if(l.status==="closed"&&l.paid) continue;
    if(l.status==="closed"&&!l.paid){items.push({id:"pay-"+l.id,kind:"pay",lane:"live",step:"Chase the EFT",lead:l,due:l.updatedAt});continue}
    if(l.paid&&l.status!=="closed"){items.push({id:"close-"+l.id,kind:"close",lane:"live",step:"Paid. Close the card",lead:l,due:l.updatedAt});continue}
    if(l.status==="new"||l.status==="inbox"){items.push({id:"wa-"+l.id,kind:"whatsapp",lane:"live",step:"Send the first WhatsApp",lead:l,due:l.createdAt});continue}
    if(!l.size){items.push({id:"sz-"+l.id,kind:"size",lane:"live",step:"Lock the UK size",lead:l,due:l.updatedAt});continue}
    if(l.size&&!l.paid){items.push({id:"inv-"+l.id,kind:"pay",lane:"live",step:"Send the invoice · "+invRef(l),lead:l,due:l.updatedAt});continue}
    const due=l.nextActionAt?new Date(l.nextActionAt).getTime():0;
    const stale=now-(l.updatedAt||l.createdAt)>DAY;
    if(due&&due>now) continue;
    if(!due&&!stale) continue;
    items.push({id:"fl-"+l.id,kind:"follow",lane:"live",step:l.nextAction||"Follow up on the pair",lead:l,due:due||l.updatedAt});
  }
  const desks=houseView()?SELLERS:[mySeller()];
  const today=new Date();today.setHours(0,0,0,0);const t0=today.getTime();
  for(const d of desks){
    const mine=S.leads.filter(l=>l.owner===d);
    const open=mine.filter(l=>l.status!=="closed"&&l.status!=="lost");
    const capturedToday=mine.filter(l=>(l.createdAt||0)>=t0).length;
    if(houseView()&&open.length===0) items.push({id:"fill-"+d,kind:"fill",lane:"second",step:"Fill this book",detail:"No open people on this desk.",owner:d,lead:null});
    else if(capturedToday===0) items.push({id:"cap-"+d,kind:"capture",lane:"second",step:"Capture someone today",detail:"Empty morning. Put a name on the board.",owner:d,lead:null});
    const paid=mine.filter(l=>l.status==="closed"&&l.paid).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
    const ref=paid.find(l=>{const age=now-(l.updatedAt||0);return age>5*DAY&&age<120*DAY&&!/who else/i.test(l.nextAction||"")});
    if(ref) items.push({id:"ref-"+ref.id,kind:"referral",lane:"second",step:"Ask who else wants a pair",lead:ref,owner:d});
    const nxt=paid.find(l=>{const age=now-(l.updatedAt||0);return (!ref||l.id!==ref.id)&&age>21*DAY&&age<90*DAY&&!/next pair/i.test(l.nextAction||"")});
    if(nxt) items.push({id:"nxt-"+nxt.id,kind:"next",lane:"second",step:"Offer the next pair",lead:nxt,owner:d});
    const week=now+7*DAY;
    const fits=S.meetings.filter(m=>{const t=new Date(m.at).getTime();return t>=now&&t<=week});
    if(fits.length===0) items.push({id:"fit-"+d,kind:"fit",lane:"second",step:"Book a fit this week",detail:"A name in the diary. Collect or try-on.",owner:d,lead:null});
  }
  return items;
}
function todoRow(it){
  const l=it.lead;
  const who=l?esc(l.name):esc(it.detail||"");
  const extra=l?[l.sku,l.look,l.size?("UK "+l.size):"",l.invRef||""].filter(Boolean).join(" · "):"";
  const owner=houseView()&&(l&&l.owner||it.owner)?" · "+SL[l&&l.owner||it.owner]:"";
  const href=l?wa(l.phone,it.kind==="whatsapp"?firstMsg(l):it.kind==="follow"?followMsg(l):it.kind==="pay"?invMsg(l):it.kind==="size"?sizeMsg(l):it.kind==="referral"?("Hi "+(l.name.split(" ")[0]||"")+", the "+l.sku+" "+l.look+" is with you. Anyone else who wants a pair — send them my way."):it.kind==="next"?("Hi "+(l.name.split(" ")[0]||"")+", the "+l.sku+" "+l.look+" should be worn in. Next pair when you are ready."):""):"";
  const go=it.kind==="capture"||it.kind==="fill"?"capture":it.kind==="fit"?"meetings":l?"person":"board";
  return '<div class="todo"><div><p class="name">'+esc(it.step)+'</p><p class="meta">'+who+(extra?" · "+esc(extra):"")+esc(owner)+'</p></div><div class="row">'+(href?'<a class="chip" href="'+href+'" target="_blank" rel="noreferrer">WhatsApp</a>':"")+'<button class="chip" type="button" data-go="'+go+'" data-id="'+(l?l.id:"")+'">Open</button>'+(l?'<button class="chip on" type="button" data-done="'+esc(it.id)+'">Done</button>':"")+"</div></div>";
}
;
function viewTodo(){
  const items=buildTodos();
  const live=items.filter(i=>i.lane==="live");
  const second=items.filter(i=>i.lane==="second");
  function stack(list,lane){
    if(!houseView()||deskFilter!=="all") return list.map(todoRow).join("")||'<p class="empty">Nothing here.</p>';
    let html="";
    const loose=list.filter(i=>(i.lead?i.lead.owner:i.owner)==null);
    if(loose.length) html+='<div class="desk-block"><h4>Unassigned</h4>'+loose.map(todoRow).join("")+"</div>";
    for(const s of SELLERS){
      const rows=list.filter(i=>(i.lead?i.lead.owner:i.owner)===s);
      html+='<div class="desk-block"><div class="spread"><h4>'+SL[s]+'</h4><p class="meta">'+rows.length+'</p></div>'+(rows.length?rows.map(todoRow).join(""):'<p class="empty">Clear.</p>')+"</div>";
    }
    return html;
  }
  return '<p class="kicker">CRM</p><h1>To-do</h1><p class="sub">'+(houseView()?"Live is the pair in hand. Second is how the house grows. Every desk under Wian, Luan, Dylan.":"Live is your open people. Second is how you fill tomorrow — capture, ask, book a fit.")+"</p>"+deskChips()+'<details class="card"><summary>Live · capture to paid</summary><ol><li><span>1</span><div><p>Capture</p><p class="meta">Name, WhatsApp, the 45xxx. On the board the same minute.</p></div></li><li><span>2</span><div><p>First message</p><p class="meta">Stock, type, listed. Ask UK size. Do not discount.</p></div></li><li><span>3</span><div><p>Lock the pair</p><p class="meta">Size, hide, collect or send.</p></div></li><li><span>4</span><div><p>Invoice</p><p class="meta">EFT before the pair is confirmed.</p></div></li><li><span>5</span><div><p>Follow up</p><p class="meta">One chase if they ghost after price. Then lost.</p></div></li></ol></details><div class="lane"><p class="kicker">Live</p><h3>On the pair now</h3><p class="meta">WhatsApp, size, EFT, close.</p>'+(live.length?stack(live,"live"):'<p class="empty">Nothing here.</p>')+'</div><div class="lane"><p class="kicker">Second</p><h3>Fill the book</h3><p class="meta">Capture, ask, book a fit. Tomorrow\'s money.</p>'+stack(second,"second")+"</div>";
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
    const next=l.nextAction||(l.status==="new"?"Send the first WhatsApp":"Open the card");
    const age=l.updatedAt||l.createdAt;
    const ago=age?Math.max(0,Math.round((Date.now()-age)/3600000))+"h":"";
    return '<div class="lead"><div class="lead-row">'+(p?'<img src="'+p.img+'" alt="'+esc(p.sku)+'">':'<div></div>')+'<div><div class="spread"><p class="name">'+esc(l.name||"No name")+'</p><p class="meta">'+(houseView()&&l.owner?SL[l.owner]:"")+'</p></div><p class="meta">'+esc([l.sku,l.look,l.size?("UK "+l.size):"",p?zar(p.price):""].filter(Boolean).join(" · "))+'</p><p class="meta">Next · '+esc(next)+(ago?" · last "+ago:"")+'</p><div class="row">'+(wa(l.phone,firstMsg(l))?'<a class="chip" href="'+wa(l.phone,firstMsg(l))+'" target="_blank" rel="noreferrer">WhatsApp</a>':"")+'<button class="chip" type="button" data-go="person" data-id="'+l.id+'">Open</button></div></div></div></div>';
  }
  if(pane==="money"&&seeCost()){
    let listed=0,profit=0,cuts={wian:0,luan:0,dylan:0,house:0};
    const lines=rows.filter(l=>l.status!=="lost").map(l=>{
      const p=shoe(l.sku)||{price:0,cost:0};
      const q=l.qty||1;
      const L=p.price*q,C=p.cost*q,pr=Math.max(0,L-C);
      listed+=L;profit+=pr;
      const sp=splitOf(l.owner);
      cuts.wian+=Math.round(pr*sp.wian);cuts.luan+=Math.round(pr*sp.luan);cuts.dylan+=Math.round(pr*sp.dylan);cuts.house+=Math.round(pr*sp.house);
      return '<div class="line"><span>'+esc(l.name)+' · '+esc(l.sku)+'</span><span>'+zar(L)+(seeCost()?" · "+zar(pr):"")+'</span></div>';
    }).join("");
    return '<p class="kicker">CRM</p><div class="spread"><h1>Board</h1><div class="row"><button class="chip" type="button" data-pane="work">Work</button><button class="chip on" type="button" data-pane="money">Money</button><button class="chip on" type="button" data-tab="capture">Capture</button></div></div>'+deskChips()+'<div class="money card"><div class="line"><span>Listed</span><span>'+zar(listed)+'</span></div><div class="line"><span>Pair profit</span><span>'+zar(profit)+'</span></div><div class="line"><span>Wian</span><span>'+zar(cuts.wian)+'</span></div><div class="line"><span>Luan</span><span>'+zar(cuts.luan)+'</span></div><div class="line"><span>Dylan</span><span>'+zar(cuts.dylan)+'</span></div><div class="line"><span>House</span><span>'+zar(cuts.house)+'</span></div></div><div class="money" style="margin-top:18px">'+lines+'</div>';
  }
  const colHtml=cols.map(([id,label])=>'<section><p class="kicker">'+label+' · '+grouped[id].length+'</p>'+(grouped[id].map(card).join("")||'<p class="empty">Clear.</p>')+"</section>").join("");
  return '<p class="kicker">CRM</p><div class="spread"><h1>Board</h1><div class="row">'+(seeCost()?'<button class="chip on" type="button" data-pane="work">Work</button><button class="chip" type="button" data-pane="money">Money</button>':"")+'<button class="chip on" type="button" data-tab="capture">Capture</button></div></div>'+deskChips()+metrics+'<div class="chips" style="margin:0 0 12px">'+cols.map(([id,label])=>'<button class="chip '+(boardCol===id?"on":"")+'" type="button" data-col="'+id+'">'+label+' '+grouped[id].length+'</button>').join("")+'</div><div class="board desktop-only">'+colHtml+'</div><div class="phone-cols">'+grouped[boardCol].map(card).join("")+'</div>';
}
function viewCapture(){
  const p=shoe(cap.sku)||PAIRS[14];
  cap.sku=p.sku;
  if(houseView()&&!cap.owner) cap.owner=mySeller();
  const types=[...new Set(PAIRS.map(x=>x.look))];
  const book=PAIRS.filter(x=>!cap.type||x.look===cap.type);
  if(cap.type&&!book.some(x=>x.sku===p.sku)&&book[0]) {cap.sku=book[0].sku;return viewCapture()}
  return '<p class="kicker">On the floor</p><h1>Capture</h1><p class="sub">Name. WhatsApp. The 45xxx. Put them on the board. Cost stays off this ticket.</p><div class="two"><section><article class="pair">'+turnHtml(p,cap.colour||"book",cap.view||0)+'<div class="pad"><div><p class="stock">'+p.sku+'</p><p class="meta">'+esc(p.look)+'</p></div><div><p class="price">'+zar(p.price)+'</p><p class="kicker">Listed</p></div></div></article><label>Type</label><div class="chips"><button class="chip '+(!cap.type?"on":"")+'" type="button" data-type="">All</button>'+types.map(t=>'<button class="chip '+(cap.type===t?"on":"")+'" type="button" data-type="'+esc(t)+'">'+esc(t)+"</button>").join("")+'</div><label>Pair</label><select id="cap-sku">'+book.map(x=>'<option value="'+x.sku+'"'+(x.sku===p.sku?" selected":"")+">"+x.sku+" · "+esc(x.look)+" · "+zar(x.price)+"</option>").join("")+"</select></section><section><form class='card' id='cap'><p class='kicker'>Ticket</p><p class='name'>"+esc(cap.name||"The person")+'</p><p class="meta">'+p.sku+" · "+esc(p.look)+(cap.size?(" · UK "+cap.size):" · size later")+" · "+(cap.delivery==="collect"?"collect":"send")+'</p><label>Name</label><input name="name" value="'+esc(cap.name)+'" required placeholder="As they say it" /><label>WhatsApp</label><input name="phone" value="'+esc(cap.phone)+'" required inputmode="tel" placeholder="08 or 27" /><label>UK size</label><div class="chips">'+['<button class="chip '+(!cap.size?"on":"")+'" type="button" data-size="">Later</button>'].concat(UK.map(s=>'<button class="chip '+(cap.size===s?"on":"")+'" type="button" data-size="'+s+'">'+s+"</button>")).join("")+'</div><label>Hide</label><div class="hides">'+hideChips(cap.colour||"book","data-chide")+'</div><p class="meta">As photographed is the pair in the book. Other hides are a last preview, subject to tannery hide.</p><label>How they found us</label><div class="chips">'+SOURCES.map(([id,lab])=>'<button class="chip '+(cap.source===id?"on":"")+'" type="button" data-src="'+id+'">'+lab+"</button>").join("")+"</div>"+(houseView()?'<label>Desk</label><div class="chips">'+SELLERS.map(s=>'<button class="chip '+(cap.owner===s?"on":"")+'" type="button" data-own="'+s+'">'+SL[s]+"</button>").join("")+"</div>":'<p class="meta">Lands on this desk · '+SL[mySeller()]+"</p>")+'<label>Collect or send</label><div class="chips"><button class="chip '+(cap.delivery==="collect"?"on":"")+'" type="button" data-del="collect">Collect</button><button class="chip '+(cap.delivery==="local"?"on":"")+'" type="button" data-del="local">Local R100</button><button class="chip '+(cap.delivery==="int"?"on":"")+'" type="button" data-del="int">International R300</button></div><label>Note</label><input name="note" value="'+esc(cap.note)+'" placeholder="Tan hide. Call after 6." /><button class="solid" type="submit">Put on the board</button></form></section></div>';
}
function viewClients(){
  const rows=leads();
  const q="";
  return '<p class="kicker">CRM</p><h1>Clients</h1><p class="sub">One card per person. Nothing fake on this list.</p>'+deskChips()+(rows.length?rows.map(l=>'<div class="lead"><div class="spread"><p class="name">'+esc(l.name)+'</p><p class="meta">'+esc(l.status)+'</p></div><p class="meta">'+esc([l.sku,l.look,l.phone].filter(Boolean).join(" · "))+'</p><div class="row"><button class="chip" type="button" data-go="person" data-id="'+l.id+'">Open</button></div></div>').join(""):'<p class="empty">No people on this desk yet. Capture one.</p>')+'<button class="solid" type="button" data-tab="capture">Capture</button>';
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
  return '<p class="kicker">CRM</p><h1>Team</h1><p class="sub">Requests land here. You verify the desk. Until then they cannot open the floor.</p><h3>Requests</h3>'+(pending.length?pending.map(r=>'<div class="lead"><p class="name">'+esc(r.name)+'</p><p class="meta">'+esc(r.email)+' · '+(SL[r.seller]||r.seller||"")+'</p><div class="row"><button class="chip on" type="button" data-ok="'+esc(r.email)+'">Approve sales</button><button class="chip" type="button" data-no="'+esc(r.email)+'">Deny</button></div></div>').join(""):'<p class="empty">None waiting.</p>')+'<h3 style="margin-top:24px">Desks</h3>'+S.users.map(u=>'<div class="lead"><p class="name">'+esc(u.name)+'</p><p class="meta">'+esc(u.email)+' · '+esc(u.role)+' · '+(SL[u.seller]||"")+' · '+esc(u.status)+'</p></div>').join("");
}
function viewPerson(){
  const l=S.leads.find(x=>x.id===personId);
  if(!l) return '<p class="empty">Not on this desk.</p><button class="chip" type="button" data-tab="board">Board</button>';
  const t=ticket(l);
  const p=t.p;
  const stages=[["new","New"],["contacted","Working"],["closed","Closed"],["lost","Lost"]];
  const age=l.updatedAt||l.createdAt;
  const ago=age?Math.max(0,Math.round((Date.now()-age)/3600000))+"h":"";
  const profit=p&&seeCost()?Math.max(0,(p.price-p.cost)*t.qty):null;
  const waFirst=wa(l.phone,firstMsg(l));
  const waSize=wa(l.phone,sizeMsg(l));
  const waPay=wa(l.phone,payMsg(l));
  const waFollow=wa(l.phone,followMsg(l));
  const pairImg=p?turnHtml(p,l.colour||"book",pairView||0):"";
  const skuOpts=PAIRS.map(x=>'<option value="'+x.sku+'"'+(x.sku===l.sku?" selected":"")+">"+x.sku+" · "+esc(x.look)+" · "+zar(x.price)+"</option>").join("");
  const sizeChips=['<button class="chip '+(!l.size?"on":"")+'" type="button" data-psize="">Later</button>'].concat(UK.map(s=>'<button class="chip '+(String(l.size)===s?"on":"")+'" type="button" data-psize="'+s+'">'+s+"</button>")).join("");
  const qtyChips=[1,2,3,4].map(n=>'<button class="chip '+(t.qty===n?"on":"")+'" type="button" data-pqty="'+n+'">'+n+"</button>").join("");
  const hideRow=hideChips(l.colour||"book","data-phide");
  const delChips=[["collect","Collect"],["local","Local R100"],["int","International R300"]].map(([id,lab])=>'<button class="chip '+(l.delivery===id?"on":"")+'" type="button" data-pdel="'+id+'">'+lab+"</button>").join("");
  const stageChips=stages.map(([id,lab])=>'<button class="chip '+(colOf(l.status)===colOf(id)?"on":"")+'" type="button" data-stage="'+id+'">'+lab+"</button>").join("");
  const desk=houseView()?'<label>Desk</label><div class="chips">'+SELLERS.map(s=>'<button class="chip '+(l.owner===s?"on":"")+'" type="button" data-assign="'+s+'">'+SL[s]+"</button>").join("")+"</div>":"";
  const money='<div class="money card"><div class="line"><span>Listed</span><span>'+zar(t.listed)+"</span></div><div class=\"line\"><span>Delivery</span><span>"+(t.fee?zar(t.fee):"Collect")+"</span></div><div class=\"line\"><span>EFT due</span><span>"+zar(t.due)+"</span></div>"+(profit!=null?'<div class="line"><span>Pair profit</span><span>'+zar(profit)+"</span></div>":"")+'<div class="line"><span>Paid</span><span class="'+(l.paid?"ok":"")+'">'+(l.paid?"Yes":"No")+"</span></div></div>";
  const waRow='<div class="row" style="margin:14px 0 4px">'+(waFirst?'<a class="chip on" href="'+waFirst+'" target="_blank" rel="noreferrer">WhatsApp first</a>':"")+(waSize?'<a class="chip" href="'+waSize+'" target="_blank" rel="noreferrer">Ask size</a>':"")+(waPay?'<a class="chip" href="'+waPay+'" target="_blank" rel="noreferrer">WhatsApp EFT</a>':"")+(waFollow?'<a class="chip" href="'+waFollow+'" target="_blank" rel="noreferrer">Follow up</a>':"")+'<button class="chip" type="button" data-copy="eft">Copy EFT</button></div>';
  const paidRow='<div class="row" style="margin:16px 0">'+(l.paid?'<button class="chip good on" type="button" data-paid="0">Paid · undo</button>':'<button class="chip on" type="button" data-paid="1">Mark paid</button>')+(l.paid&&l.status!=="closed"?'<button class="chip" type="button" data-stage="closed">Close the card</button>':"")+"</div>";
  return '<div class="row" style="margin-bottom:8px"><button class="ghost" type="button" data-tab="board">Board</button><button class="ghost" type="button" data-tab="clients">Clients</button></div><p class="kicker">Working ticket</p><h1>'+esc(l.name)+'</h1><p class="meta">'+esc(l.phone)+(l.owner?" · "+SL[l.owner]:" · Unassigned")+(l.source?" · "+esc(l.source):"")+(ago?" · last "+ago:"")+'</p><div class="two"><section><article class="pair">'+pairImg+'<div class="pad"><div><p class="stock">'+esc(l.sku||"—")+'</p><p class="meta">'+esc(l.look||"")+(l.size?" · UK "+esc(l.size):" · size open")+'</p></div><div><p class="price">'+zar(t.listed)+'</p><p class="kicker">Listed</p></div></div></article><label>Pair</label><select id="p-sku">'+skuOpts+'</select><label>Pairs</label><div class="chips">'+qtyChips+'</div><label>UK size</label><div class="chips">'+sizeChips+'</div><label>Hide</label><div class="hides">'+hideRow+'</div><p class="meta">As photographed is the pair in the book. Other hides are a last preview, subject to tannery hide.</p><label>Collect or send</label><div class="chips">'+delChips+"</div></section><section>"+money+'<label>Stage</label><div class="chips">'+stageChips+"</div>"+desk+waRow+paidRow+'<form class="card" id="pnext" style="margin-top:12px"><p class="kicker">Next</p><label>What to do</label><input name="next" value="'+esc(l.nextAction||"")+'" placeholder="Chase EFT. Lock size." /><label>When</label><input name="at" type="datetime-local" value="'+esc(localAt(l.nextActionAt))+'" /><button class="solid" type="submit">Save next</button></form><form class="card" id="pinfo" style="margin-top:12px"><p class="kicker">Person</p><label>Name</label><input name="name" value="'+esc(l.name)+'" required /><label>WhatsApp</label><input name="phone" value="'+esc(l.phone)+'" required inputmode="tel" /><button class="solid" type="submit">Save person</button></form><form class="card" id="pnote" style="margin-top:12px"><label>Note</label><textarea name="note" placeholder="Tan hide. Call after 6.">'+esc(l.note)+'</textarea><button class="solid" type="submit">Save note</button></form></section></div>';
}
function Desk(){
  const body=personId?viewPerson():tab==="board"?viewBoard():tab==="capture"?viewCapture():tab==="clients"?viewClients():tab==="meetings"?viewMeetings():tab==="team"?viewTeam():viewTodo();
  const flash=toast?( /need|wrong|type |eight|whatsapp number/i.test(toast) ? '<p class="err">'+esc(toast)+"</p>" : '<p class="ok">'+esc(toast)+"</p>" ) : "";
  return '<div class="shell"><aside class="side"><div class="brand" style="margin:0 10px 18px">SABLE FLOOR</div>'+navBtns("side")+'<button type="button" id="out" style="margin-top:auto">Sign out</button></aside><div><header class="top"><div class="brand">SABLE FLOOR</div><button class="ghost" type="button" id="out2">Sign out</button></header><main class="work">'+flash+body+"</main><nav class='tabs'>"+[["board","Board"],["todo","To-do"],["capture","Capture"],["clients","Clients"],["meetings","More"]].map(([id,lab])=>'<button type="button" class="'+(tab===id||(id==="meetings"&&(tab==="meetings"||tab==="team"))||(id==="clients"&&personId)?"on":"")+'" data-tab="'+id+'">'+lab+"</button>").join("")+"</nav></div></div>";
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
    if(isHouse(f.email)&&samePass(pass,LUAN.password)){enter(house());return}
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
    toast="Request saved on this phone. Open Luan admin desk to approve.";
    mode="in";draw();
  };
}
function patchLead(id,fields){
  const i=S.leads.findIndex(l=>l.id===id);
  if(i<0) return;
  S.leads[i]=Object.assign({},S.leads[i],fields,{updatedAt:Date.now()});
  save();
}
function doDone(tid){
  const items=buildTodos();
  const it=items.find(x=>x.id===tid);
  if(!it||!it.lead) return;
  const l=it.lead;
  if(it.kind==="whatsapp") patchLead(l.id,{status:"contacted",nextAction:"One follow-up if they ghost",nextActionAt:new Date(Date.now()+86400000).toISOString()});
  else if(it.kind==="close") patchLead(l.id,{status:"closed",paid:true,nextAction:"Closed. Paid."});
  else if(it.kind==="follow"&&/lost/i.test(it.step)) patchLead(l.id,{status:"lost",nextAction:"Lost"});
  else if(it.kind==="referral") patchLead(l.id,{nextAction:"Asked who else wants a pair",nextActionAt:new Date(Date.now()+30*86400000).toISOString()});
  else if(it.kind==="next") patchLead(l.id,{nextAction:"Offered the next pair",nextActionAt:new Date(Date.now()+60*86400000).toISOString()});
  else patchLead(l.id,{nextAction:it.kind==="size"?"Follow up on the pair":it.step,nextActionAt:new Date(Date.now()+(it.kind==="pay"?12:24)*3600000).toISOString()});
  draw();
}
function hookDesk(){
  const out=document.getElementById("out"); if(out) out.onclick=function(){S.session=null;save();draw()};
  const out2=document.getElementById("out2"); if(out2) out2.onclick=function(){S.session=null;save();draw()};
  document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=function(){tab=b.getAttribute("data-tab");personId=null;draw()});
  document.querySelectorAll("[data-desk]").forEach(b=>b.onclick=function(){deskFilter=b.getAttribute("data-desk");draw()});
  document.querySelectorAll("[data-col]").forEach(b=>b.onclick=function(){boardCol=b.getAttribute("data-col");draw()});
  document.querySelectorAll("[data-pane]").forEach(b=>b.onclick=function(){pane=b.getAttribute("data-pane");draw()});
  document.querySelectorAll("[data-go]").forEach(b=>b.onclick=function(){
    const go=b.getAttribute("data-go");
    const id=b.getAttribute("data-id");
    if(go==="person"&&id){personId=id;tab="clients";pairView=0;draw();return}
    tab=go==="person"?"clients":go;personId=null;draw();
  });
  document.querySelectorAll("[data-done]").forEach(b=>b.onclick=function(){doDone(b.getAttribute("data-done"))});
  document.querySelectorAll("[data-size]").forEach(b=>b.onclick=function(){cap.size=b.getAttribute("data-size");draw()});
  document.querySelectorAll("[data-src]").forEach(b=>b.onclick=function(){cap.source=b.getAttribute("data-src");draw()});
  document.querySelectorAll("[data-own]").forEach(b=>b.onclick=function(){cap.owner=b.getAttribute("data-own");draw()});
  document.querySelectorAll("[data-del]").forEach(b=>b.onclick=function(){cap.delivery=b.getAttribute("data-del");draw()});
  document.querySelectorAll("[data-type]").forEach(b=>b.onclick=function(){cap.type=b.getAttribute("data-type")||"";draw()});
  const sku=document.getElementById("cap-sku");
  if(sku) sku.onchange=function(){cap.sku=sku.value;cap.view=0;draw()};
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
    const lead=leadFix({
      id:uid(),name:cap.name,phone:cap.phone,sku:p.sku,look:p.look,size:cap.size,qty:cap.qty,
      source:cap.source,status:"new",note:cap.note,owner:houseView()?cap.owner:mySeller(),
      delivery:cap.delivery,deliveryFee:feeOf(cap.delivery),colour:cap.colour||"book",
      createdAt:Date.now()
    });
    S.leads.unshift(lead);
    cap={sku:cap.sku,name:"",phone:"",size:"",qty:1,source:"whatsapp",note:"",delivery:"collect",owner:cap.owner,type:cap.type,colour:"book",view:0};
    personId=lead.id;tab="clients";save();draw();
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
      nextAction:on?"EFT received. Close the card.":(l&&l.nextAction)||"Chase the EFT"
    });
    toast=on?"Marked paid.":"Paid undone.";
    draw();
  });
  document.querySelectorAll("[data-psize]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    const size=b.getAttribute("data-psize")||"";
    patchLead(personId,{size,nextAction:size?"Size locked. Confirm the pair.":"Lock the UK size"});
    toast=size?("UK "+size+" locked."):"Size open.";
    draw();
  });
  document.querySelectorAll("[data-pqty]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    patchLead(personId,{qty:Number(b.getAttribute("data-pqty")||1)||1});
    draw();
  });
  document.querySelectorAll("[data-chide]").forEach(b=>b.onclick=function(){
    cap.colour=b.getAttribute("data-chide")||"book";
    cap.view=0;
    draw();
  });
  document.querySelectorAll("[data-phide]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    patchLead(personId,{colour:b.getAttribute("data-phide")||"book"});
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
    patchLead(personId,{sku:psku.value,look:pair?pair.look:""});
    pairView=0;
    draw();
  };
  hookTurn(function(d,abs){
    const n=5;
    if(personId){
      if(abs!=null) pairView=abs;
      else pairView=((pairView||0)+d+n)%n;
      draw();
      return;
    }
    if(tab==="capture"){
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
    if(personId){patchLead(personId,{nextAction:next,nextActionAt:at});toast="Next saved.";draw()}
  };
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
    const incoming=j.leads||[];
    let changed=false;
    for(const row of incoming){
      if(S.leads.some(l=>l.id===row.id||(norm(l.phone)===norm(row.phone)&&norm(l.name)===norm(row.name)))) continue;
      S.leads.unshift(leadFix(Object.assign({},row,{status:"new",source:row.source||"website",owner:null})));
      changed=true;
    }
    if(changed) save();
  }catch(e){}
}
draw();
ingest();
setInterval(ingest,20000);

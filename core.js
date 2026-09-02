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
    extras:extraFix(l.extras),
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
let cap={sku:"45015",name:"",phone:"",size:"",qty:1,source:"whatsapp",note:"",delivery:"collect",owner:"luan",type:"",colour:"book",view:0,extras:extraFix()};
let pairView=0;
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
  const extras=extraSum(l.extras,qty);
  return {p,qty,listed,fee,extras,due:listed+fee+extras};
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
  const extras=extraLabel(l.extras);
  const extraBit=extras?(" · "+extras+(t.extras?(" "+zar(t.extras)):"")):"";
  const ship=t.fee?("Delivery "+zar(t.fee)+" ("+delLabel(l.delivery)+")"):"Collect — no delivery";
  const bank=bankLines();
  return who+", SABLE.CO invoice "+ref+". "+(l.sku||"")+" "+(l.look||"")+size+pairs+hide+extraBit+". Listed "+zar(t.listed)+(t.extras?(". Extras "+zar(t.extras)):"")+". "+ship+". EFT due "+zar(t.due)+". Use reference "+ref+"."+(bank.length?" "+bank.join(". ")+".":" Bank details from the desk with this message.")+" Reply paid when the transfer is sent. Pair confirmed after EFT.";
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
function navBtns(){
  const items=[["todo","To-do","T"],["board","Board","B"],["capture","Capture","C"],["clients","Clients","L"],["meetings","Meetings","M"]];
  if(S.session.role==="admin") items.push(["team","Team","A"]);
  return items.map(([id,label,mark])=>{
    const on=tab===id||(id==="clients"&&personId)||(id==="meetings"&&tab==="team");
    return '<button type="button" class="nav-block '+(on?"on":"")+'" data-tab="'+id+'"><span class="nav-mark">'+mark+'</span><span class="nav-name">'+label+"</span></button>";
  }).join("");
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

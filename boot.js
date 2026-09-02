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
  const pin=document.getElementById("nav-pin");
  if(pin) pin.onclick=function(){setNavOpen(!navOpen);draw()};
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
    const noteEl=document.getElementById("cap-custom");
    if(noteEl){cap.extras=extraFix(cap.extras);cap.extras.customNote=String(noteEl.value||"").trim();if(cap.extras.customNote) cap.extras.custom=true}
    const lead=leadFix({
      id:uid(),name:cap.name,phone:cap.phone,sku:p.sku,look:p.look,size:cap.size,qty:cap.qty,
      source:cap.source,status:"new",note:cap.note,owner:houseView()?cap.owner:mySeller(),
      delivery:cap.delivery,deliveryFee:feeOf(cap.delivery),colour:cap.colour||"book",
      extras:extraFix(cap.extras),
      createdAt:Date.now()
    });
    S.leads.unshift(lead);
    cap={sku:cap.sku,name:"",phone:"",size:"",qty:1,source:"whatsapp",note:"",delivery:"collect",owner:cap.owner,type:cap.type,colour:"book",view:0,extras:extraFix()};
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
  hookExtras("cap",function(){return cap.extras},function(ex,quiet){
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

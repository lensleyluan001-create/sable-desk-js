function showRoot(){
  const root=document.getElementById("root");
  if(root) root.classList.add("is-on");
  document.body.classList.add("js-on");
  if(S.session) document.body.classList.add("has-desk");
  else document.body.classList.remove("has-desk");
  const door=document.getElementById("door");
  if(door) door.hidden=true;
}
function draw(){
  const root=document.getElementById("root");
  if(!root) return;
  try{
    if(!S.session){
      root.innerHTML=Gate();
      try{hookGate()}catch(e){}
      toast="";
      showRoot();
      return;
    }
    try{runIdleAutoAssign()}catch(e){}
    try{if(typeof healUnpaidCloseCopy==="function"&&healUnpaidCloseCopy()) save()}catch(e){}
    root.innerHTML=Desk();
    try{hookDesk()}catch(e){}
    toast="";
    showRoot();
  }catch(err){
    toast="";
    try{
      if(!S.session){
        root.innerHTML=Gate();
        hookGate();
      }else{
        root.innerHTML='<div class="gate"><div class="brand">SABLE CRM</div><h1>You are in</h1><p class="sub">The desk hit a snag. Reload. Sign out if you need the door.</p><button class="solid" type="button" id="desk-reload">Reload desk</button><button class="ghost" type="button" id="out">Sign out</button></div>';
        const rl=document.getElementById("desk-reload");
        if(rl) rl.onclick=function(){location.reload()};
        const out=document.getElementById("out");
        if(out) out.onclick=dropSession;
      }
    }catch(e){}
    showRoot();
  }
}
function hookGate(){
  const mi=document.getElementById("m-in"); if(mi) mi.onclick=function(){mode="in";toast="";draw()};
  const ma=document.getElementById("m-ask"); if(ma) ma.onclick=function(){mode="ask";toast="";draw()};
  const fg=document.getElementById("forgot"); if(fg) fg.onclick=function(){mode="reset";toast="";draw()};
  const bg=document.getElementById("back-gate"); if(bg) bg.onclick=function(){mode="in";toast="";draw()};
  const signin=document.getElementById("signin");
  if(signin) signin.onsubmit=function(e){
    e.preventDefault();
    const f=Object.fromEntries(new FormData(signin));
    const err=tryLogin(f.email,f.password);
    if(err){toast=err;draw()}
  };
  const reset=document.getElementById("reset");
  if(reset) reset.onsubmit=function(e){
    e.preventDefault();
    const f=Object.fromEntries(new FormData(reset));
    const err=setPhonePass(f.email,f.password);
    if(err){toast=err;draw()}
  };
  const ask=document.getElementById("ask");
  if(ask) ask.onsubmit=function(e){
    e.preventDefault();
    const f=Object.fromEntries(new FormData(ask));
    if(isHouse(f.email)||isHouse(f.name)){toast="House uses Set password on Log in.";mode="in";draw();return}
    const existing=findStaff(f.email)||findStaff(f.name);
    if(existing){toast="Already on Sable. Log in.";mode="in";draw();return}
    S.requests=S.requests||[];
    S.requests.push({name:String(f.name||"").trim(),email:String(f.email||"").trim(),password:String(f.password||""),seller:f.seller||"luan",status:"pending",at:Date.now()});
    save();
    toast="Request saved on this phone. Open house admin on Sable to approve.";
    mode="in";draw();
  };
}
function patchLead(id,fields){
  const i=S.leads.findIndex(l=>l.id===id);
  if(i<0) return;
  const prev=S.leads[i];
  const sitAt=fields.sitAt!=null?fields.sitAt:(prev.sitAt||prev.updatedAt||prev.createdAt);
  const next=Object.assign({},prev,fields,{updatedAt:Date.now(),sitAt});
  if(staleCloseCopy(next)) next.nextAction=honestNextAction(next);
  S.leads[i]=next;
  save();
  try{
    fetch(API,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(next)}).catch(function(){});
  }catch(e){}
}
function applyProofToLead(id,file,who){
  if(!id||!file) return;
  compressProofFile(file,function(err,url){
    if(err||!url){toast=(err&&err.message)||"Could not read that image.";draw();return}
    const l=S.leads.find(x=>x.id===id);
    if(!l){toast="Ticket not found.";draw();return}
    if(l.status==="lost"){toast="Lost tickets stay off money.";draw();return}
    patchLead(id,{
      proofUrl:url,
      proofAt:Date.now(),
      proofBy:who||staffName(),
      proofStatus:"in",
      nextAction:"Proof attached — verify EFT",
      nextActionAt:null,
      sitAt:Date.now(),
      paid:false
    });
    toast="Proof attached — verify EFT.";
    draw();
  });
}
function rejectProof(id){
  const l=S.leads.find(x=>x.id===id);
  if(!l) return;
  const note=String(l.note||"");
  const add="Proof rejected.";
  patchLead(id,{
    proofUrl:"",
    proofAt:null,
    proofBy:"",
    proofStatus:"rejected",
    nextAction:"Chase the EFT",
    nextActionAt:null,
    sitAt:Date.now(),
    note:note?(note.indexOf(add)>=0?note:(note+"\n"+add)):add
  });
  toast="Proof rejected. Chase the EFT.";
  draw();
}
function runIdleAutoAssign(){
  if(!S.session||!houseView()) return;
  const plan=autoAssignPlan();
  if(!plan.length) return;
  const names=[];
  for(let i=0;i<plan.length;i++){
    const p=plan[i];
    const l=p.lead;
    autoUndo.push({
      id:l.id,
      name:l.name||"",
      owner:l.owner||null,
      sitAt:l.sitAt,
      nextAction:l.nextAction||"",
      nextActionAt:l.nextActionAt||null,
      to:p.to
    });
    patchLead(l.id,p.fields);
    names.push(l.name||"a lead");
  }
  const who=plan[0].to;
  toast="Auto-assigned to "+(SL[who]||who)+": "+names.slice(0,3).join(", ")+(names.length>3?(" +"+(names.length-3)):"");
}
function undoAutoAssign(id){
  const i=autoUndo.findIndex(function(x){return x.id===id});
  if(i<0) return;
  const prev=autoUndo.splice(i,1)[0];
  autoSkip[id]=true;
  patchLead(id,{
    owner:prev.owner,
    sitAt:prev.sitAt,
    nextAction:prev.nextAction,
    nextActionAt:prev.nextActionAt
  });
  toast="Back on Floor.";
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
  const out=document.getElementById("out"); if(out) out.onclick=dropSession;
  const out2=document.getElementById("out2"); if(out2) out2.onclick=dropSession;
  const copyWant=document.getElementById("copy-want");
  if(copyWant) copyWant.onclick=function(){
    const u=clientWebUrl();
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(u).catch(function(){});
    toast="Client link copied. Send this: "+u;
    draw();
  };
  document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=function(){tab=b.getAttribute("data-tab");personId=null;invView=false;draw()});
  document.querySelectorAll("[data-desk]").forEach(b=>b.onclick=function(){deskFilter=b.getAttribute("data-desk");writeDesk(deskFilter);draw()});
  document.querySelectorAll("[data-col]").forEach(b=>b.onclick=function(){boardCol=b.getAttribute("data-col");draw()});
  document.querySelectorAll("[data-pane]").forEach(b=>b.onclick=function(){pane=b.getAttribute("data-pane");draw()});
  document.querySelectorAll("[data-go]").forEach(b=>b.onclick=function(){
    const go=b.getAttribute("data-go");
    const id=b.getAttribute("data-id");
    invView=false;
    if(go==="person"&&id){personId=id;tab="clients";pairView=0;draw();return}
    tab=go==="person"?"clients":go;personId=null;draw();
  });
  document.querySelectorAll("[data-invoice]").forEach(b=>b.onclick=function(){
    if(!bankReady()){
      toast="Invoice setup incomplete — Team";
      tab="team";personId=null;invView=false;draw();
      return;
    }
    const id=b.getAttribute("data-invoice");
    const l=S.leads.find(x=>x.id===id);
    if(!l) return;
    stampInv(l);
    personId=id;
    invView=true;
    tab="clients";
    toast="";
    draw();
  });
  document.querySelectorAll("[data-invback]").forEach(b=>b.onclick=function(){
    invView=false;
    draw();
  });
  const invPrint=document.getElementById("inv-print");
  if(invPrint) invPrint.onclick=function(){
    const l=S.leads.find(x=>x.id===personId);
    if(l){
      stampInv(l);
      patchLead(l.id,{
        invRef:l.invRef||invRef(l),
        nextAction:"Invoice sent. Waiting on EFT",
        nextActionAt:new Date(Date.now()+12*3600000).toISOString(),
        sitAt:Date.now()
      });
    }
    window.print();
  };
  document.querySelectorAll("[data-invsent]").forEach(a=>a.addEventListener("click",function(){
    const id=a.getAttribute("data-invsent");
    const l=S.leads.find(x=>x.id===id);
    if(!l) return;
    stampInv(l);
    setTimeout(function(){
      patchLead(id,{
        invRef:l.invRef||invRef(l),
        nextAction:"Invoice sent. Waiting on EFT",
        nextActionAt:new Date(Date.now()+12*3600000).toISOString(),
        sitAt:Date.now()
      });
    },400);
  }));
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
    const extras=extraFix(cap.extras);
    const items=[{sku:p.sku,look:p.look,size:cap.size,qty:cap.qty,colour:cap.colour||"book",extras:extras,listedPrice:listedPrice,listed:listedPrice||p.price}];
    const lead=leadFix({
      id:uid(),name:cap.name,phone:cap.phone,sku:p.sku,look:p.look,size:cap.size,qty:cap.qty,items,
      source:cap.source,status:"new",note:cap.note,owner:houseView()?cap.owner:mySeller(),
      delivery:cap.delivery,deliveryFee:feeOf(cap.delivery),colour:cap.colour||"book",
      extras:extras,listedPrice,
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
  document.querySelectorAll("[data-delmeet]").forEach(b=>b.onclick=function(){
    const id=b.getAttribute("data-delmeet");
    S.meetings=S.meetings.filter(m=>m.id!==id);
    save();
    try{fetch(API,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({deleteMeeting:id})}).catch(function(){})}catch(e){}
    draw();
  });
  document.querySelectorAll("[data-stage]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    const st=b.getAttribute("data-stage");
    const fields={status:st};
    if(st==="closed") fields.nextAction="Closed.";
    if(st==="lost") fields.nextAction="Lost";
    patchLead(personId,fields);
    draw();
  });
  document.querySelectorAll("[data-assign]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    const who=b.getAttribute("data-assign");
    if(autoSkip[personId]) delete autoSkip[personId];
    patchLead(personId,{owner:who,sitAt:Date.now()});
    draw();
  });
  document.querySelectorAll("[data-paid]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    const on=b.getAttribute("data-paid")==="1";
    const l=S.leads.find(x=>x.id===personId);
    const proof=l&&hasProof(l);
    patchLead(personId,{
      paid:on,
      status:on&&l&&l.status==="new"?"contacted":(l&&l.status),
      nextAction:on?"EFT received. Close the card.":(proof?"Proof attached — verify EFT":"Chase the EFT"),
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
    const next=Object.assign({},l,{qty,items});
    patchLead(personId,lockListed(next,itemListedSum(items)));
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
    const next=Object.assign({},l,{sku:psku.value,look:pair?pair.look:"",items,listedPrice:null});
    patchLead(personId,Object.assign({sku:psku.value,look:pair?pair.look:""},lockListed(next,bookListed(next))));
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
    const n=Number(String(pprice.value||"").replace(/[^\d]/g,""))||0;
    patchLead(personId,lockListed(l,n));
    draw();
  };
  hookExtras("cap",function(){return cap.extras},function(ex,quiet){
    scoopCap();
    cap.extras=extraFix(ex);
    if(!quiet) draw();
  });
  hookExtras("p",function(){
    const l=S.leads.find(x=>x.id===personId);
    if(!l) return extraFix();
    const first=(itemsOf(l)[0])||{};
    return first.extras||l.extras;
  },function(ex,quiet){
    if(!personId) return;
    const l=S.leads.find(x=>x.id===personId)||{};
    const extras=extraFix(ex);
    const items=itemsOf(l).map(function(it,i){return i===0?Object.assign({},it,{extras:extras}):it});
    patchLead(personId,{extras:extras,items:items});
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
    if(!bankReady()){
      toast="Invoice setup incomplete — Team";
      tab="team";personId=null;invView=false;draw();
      return;
    }
    if(!personId) return;
    const l=S.leads.find(x=>x.id===personId);
    if(!l) return;
    stampInv(l);
    const text=payMsg(l);
    const done=function(){toast="EFT text copied.";draw()};
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(function(){toast="Use WhatsApp EFT.";draw()});
    }else toast="Use WhatsApp EFT.",draw();
  });
  document.querySelectorAll("[data-copy-sla]").forEach(b=>b.onclick=function(e){
    e.preventDefault();
    e.stopPropagation();
    const id=b.getAttribute("data-copy-sla");
    const it=buildTodos().find(x=>x.id===id);
    const text=it?slaStaffText(it):"";
    if(!text) return;
    const done=function(){toast="Staff ping copied. WhatsApp the salesperson yourself — not the client.";draw()};
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(function(){toast=text;draw()});
    }else{toast=text;draw()}
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
      const l=S.leads.find(x=>x.id===personId);
      const fields={nextAction:next,nextActionAt:at,note};
      if(l&&staleCloseCopy(Object.assign({},l,{nextAction:next}))){
        fields.nextAction=honestNextAction(Object.assign({},l,{nextAction:next}));
      }
      if(name) fields.name=name;
      if(phone) fields.phone=phone;
      const pprice=document.getElementById("p-price");
      if(pprice){
        const l=S.leads.find(x=>x.id===personId);
        const n=Number(String(pprice.value||"").replace(/[^\d]/g,""))||0;
        Object.assign(fields,lockListed(l,n));
      }
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
    const id=b.getAttribute("data-take");
    if(autoSkip[id]) delete autoSkip[id];
    patchLead(id,{owner:mySeller(),sitAt:Date.now()});
    toast="On Sable.";
    draw();
  });
  document.querySelectorAll("[data-undo-assign]").forEach(b=>b.onclick=function(){
    undoAutoAssign(b.getAttribute("data-undo-assign"));
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
  document.querySelectorAll("[data-proof]").forEach(function(inp){
    inp.onchange=function(){
      const file=inp.files&&inp.files[0];
      const id=inp.getAttribute("data-proof");
      if(file) applyProofToLead(id,file);
      inp.value="";
    };
  });
  document.querySelectorAll("[data-copyproof]").forEach(b=>b.onclick=function(){
    const id=b.getAttribute("data-copyproof");
    const l=S.leads.find(x=>x.id===id);
    const href=proofLink(l);
    if(!href) return;
    const done=function(){toast="Proof link copied. They send the screenshot. You still Mark paid." ;draw()};
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(href).then(done).catch(function(){toast=href;draw()});
    }else{toast=href;draw()}
  });
  document.querySelectorAll("[data-copytrack]").forEach(b=>b.onclick=function(){
    const id=b.getAttribute("data-copytrack")||personId;
    const l=S.leads.find(x=>x.id===id);
    const href=trackUrl(l);
    if(!href) return;
    const done=function(){toast="Track link copied. They see the pair and the stage — not the money.";draw()};
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(href).then(done).catch(function(){toast=href;draw()});
    }else{toast=href;draw()}
  });
  document.querySelectorAll("[data-track]").forEach(b=>b.onclick=function(){
    if(!personId) return;
    const v=String(b.getAttribute("data-track")||"");
    const stage=v==="ready"||v==="dispatch"?v:"";
    patchLead(personId,{trackStage:stage});
    toast=stage==="ready"?"Ready for collect — on their track page.":stage==="dispatch"?"Out for delivery — on their track page.":"Track stage cleared.";
    draw();
  });
  document.querySelectorAll("[data-proofzoom]").forEach(b=>b.onclick=function(){
    const id=b.getAttribute("data-proofzoom");
    const l=S.leads.find(x=>x.id===id);
    const box=document.getElementById("proof-zoom");
    if(!box||!l||!l.proofUrl) return;
    const img=box.querySelector("img");
    if(img) img.src=l.proofUrl;
    box.hidden=false;
  });
  document.querySelectorAll("[data-proofzoomx]").forEach(b=>b.onclick=function(){
    const box=document.getElementById("proof-zoom");
    if(!box) return;
    box.hidden=true;
    const img=box.querySelector("img");
    if(img) img.removeAttribute("src");
  });
  const zoom=document.getElementById("proof-zoom");
  if(zoom) zoom.onclick=function(e){
    if(e.target===zoom){
      zoom.hidden=true;
      const img=zoom.querySelector("img");
      if(img) img.removeAttribute("src");
    }
  };
  if(!window.__sableProofPaste){
    window.__sableProofPaste=true;
    document.addEventListener("paste",function(e){
      if(!S.session) return;
      const items=e.clipboardData&&e.clipboardData.items;
      if(!items) return;
      let file=null;
      for(let i=0;i<items.length;i++){
        if(items[i].type&&items[i].type.indexOf("image/")===0){
          file=items[i].getAsFile&&items[i].getAsFile();
          if(file) break;
        }
      }
      if(!file) return;
      let id=personId;
      const drop=document.querySelector("[data-proof]");
      if(!id&&drop) id=drop.getAttribute("data-proof");
      if(!id) return;
      e.preventDefault();
      applyProofToLead(id,file);
    });
  }
  document.querySelectorAll("[data-wapick]").forEach(b=>b.onclick=function(e){
    e.preventDefault();
    e.stopPropagation();
    waPick=b.getAttribute("data-wapick");
    draw();
  });
  document.querySelectorAll("[data-waclose]").forEach(b=>b.onclick=function(e){
    e.preventDefault();
    e.stopPropagation();
    waPick=null;
    draw();
  });
  document.querySelectorAll("[data-staffphone]").forEach(function(form){
    form.onsubmit=function(e){
      e.preventDefault();
      const seller=form.getAttribute("data-staffphone");
      const phone=String((new FormData(form)).get("phone")||"").trim();
      if(phone&&digits(phone).length<9){toast="WhatsApp number.";draw();return}
      let u=staffUser(seller);
      if(!u){
        u={name:SL[seller]||seller,seller:seller,x:seller,role:seller==="luan"?"admin":"sales",status:"approved",phone:phone};
        if(seller==="luan"){u.email=LUAN.email}
        S.users.push(u);
      }else u.phone=phone;
      save();
      toast=phone?"Staff WhatsApp saved.":"Staff WhatsApp cleared.";
      draw();
    };
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
  const bankf=document.getElementById("bank");
  if(bankf) bankf.onsubmit=function(e){
    e.preventDefault();
    const f=Object.fromEntries(new FormData(bankf));
    S.bank=Object.assign(emptyBank(),{
      bank:String(f.bank||"").trim(),
      accountName:String(f.accountName||"").trim(),
      accountNumber:String(f.accountNumber||"").trim(),
      branch:String(f.branch||"").trim(),
      type:String(f.type||"Cheque").trim(),
      updatedAt:Date.now()
    });
    save();
    toast="Saved on invoices.";
    draw();
  };
}
async function ingest(){
  try{
    const r=await fetch(API);
    if(!r.ok) return;
    const j=await r.json();
    if(j&&j.cloud){
      const known={};
      (S.leads||[]).forEach(function(l){if(l&&l.id) known[l.id]=true});
      applyBook(j);
      const fresh=(j.leads||[]).filter(function(l){
        return l&&l.id&&!known[l.id]&&isWebApp(l)&&(l.status==="new"||l.status==="inbox");
      });
      if(!j.imported&&!S.importedAt&&((S.leads||[]).length||(S.meetings||[]).length)){
        S.importedAt=Date.now();
        pulling=true;try{saveLocal()}finally{pulling=false}
        fetch(API,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({import:true,leads:S.leads,meetings:S.meetings||[],bank:S.bank||{}})}).catch(function(){});
      }
      if(fresh.length&&S.session){
        if(houseView()){
          const row=fresh[0];
          toast="New Want lead — "+(row.name||"Client")+" · "+(row.sku||"");
          if(fresh.length>1) toast+=" + "+(fresh.length-1);
        }
        draw();
      }else if(S.session&&tab==="todo"&&!personId) draw();
      return;
    }
    const before=S.leads.length;
    const merged=mergeWantIngest(j.leads||[],S.leads);
    S.leads=merged.rows;
    const fresh=merged.fresh||[];
    if(fresh.length){
      save();
      if(S.session){
        if(houseView()){
          const row=fresh[0];
          toast="New Want lead — "+(row.name||"Client")+" · "+(row.sku||"");
          if(fresh.length>1) toast+=" + "+(fresh.length-1);
        }
        draw();
      }
      return;
    }
    if(S.leads.length!==before) save();
    else vaultPush();
  }catch(e){}
}
draw();
ingest();
setInterval(ingest,20000);
setInterval(function(){
  if(S.session&&(tab==="todo"||tab==="desk")&&!personId) draw();
},30000);

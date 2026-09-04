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
  const bankf=document.getElementById("bank");
  if(bankf) bankf.onsubmit=function(e){
    e.preventDefault();
    const f=Object.fromEntries(new FormData(bankf));
    S.bank=Object.assign(emptyBank(),{
      bank:String(f.bank||"").trim(),
      accountName:String(f.accountName||"").trim(),
      accountNumber:String(f.accountNumber||"").trim(),
      branch:String(f.branch||"").trim(),
      type:String(f.type||"Cheque").trim()
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

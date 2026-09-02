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
    return '<div class="lead"><div class="lead-row">'+(p?'<img src="'+p.img+'" alt="'+esc(p.sku)+'">':'<div></div>')+'<div><div class="spread"><p class="name">'+esc(l.name||"No name")+'</p><p class="meta">'+(houseView()&&l.owner?SL[l.owner]:"")+'</p></div><p class="meta">'+esc([l.sku,l.look,l.size?("UK "+l.size):"",p?zar(p.price):""].filter(Boolean).join(" · "))+'</p><p class="meta">Next · '+esc(next)+(ago?" · last "+ago:"")+'</p><div class="row">'+(wa(l.phone,firstMsg(l))?'<a class="chip on" href="'+wa(l.phone,firstMsg(l))+'" data-wa="'+l.id+'" target="_blank" rel="noreferrer">WhatsApp</a>':"")+'<button class="chip" type="button" data-go="person" data-id="'+l.id+'">Open</button>'+(!l.owner&&houseView()?'<button class="chip" type="button" data-take="'+l.id+'">Take</button>':"")+'</div></div></div></div>';
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
  const book=PAIRS.slice();
  const last=lastCapId?S.leads.find(x=>x.id===lastCapId):null;
  const lastStrip=last?'<div class="card flash-row"><p class="ok" style="margin:0">On the board · '+esc(last.name)+'</p>'+(wa(last.phone,firstMsg(last))?'<a class="chip on" href="'+wa(last.phone,firstMsg(last))+'" data-wa="'+last.id+'" target="_blank" rel="noreferrer">WhatsApp</a>':"")+'<button class="chip" type="button" data-go="person" data-id="'+last.id+'">Open</button></div>':"";
  const moreOn=!!(cap.size||extraBits(cap.extras).length||cap.note||(cap.delivery&&cap.delivery!=="collect"));
  return '<p class="kicker">On the floor</p><h1>Capture</h1><p class="sub">Pair, hide, name, WhatsApp. Under a minute.</p>'+lastStrip+
    '<article class="pair cap-pair">'+turnHtml(p,cap.colour||"book",cap.view||0)+
    '<div class="hides">'+hideChips(cap.colour||"book","data-chide")+"</div>"+
    '<div class="pad"><div><p class="stock">'+p.sku+'</p><p class="meta">'+esc(p.look)+(cap.colour&&cap.colour!=="book"?" · "+hideName(cap.colour):" · as photographed")+'</p></div><p class="price">'+zar(p.price+extraSum(cap.extras,1))+"</p></div></article>"+
    '<label>Stock</label><div class="sku-row"><input id="cap-sku-in" inputmode="numeric" placeholder="45015" value="'+p.sku+'" /><select id="cap-sku">'+book.map(x=>'<option value="'+x.sku+'"'+(x.sku===p.sku?" selected":"")+">"+x.sku+" · "+esc(x.look)+"</option>").join("")+"</select></div>"+
    '<form class="card" id="cap">'+
    '<label>Name</label><input name="name" value="'+esc(cap.name)+'" required placeholder="As they say it" autocomplete="name" />'+
    '<label>WhatsApp</label><input name="phone" value="'+esc(cap.phone)+'" required inputmode="tel" placeholder="08 or 27" autocomplete="tel" />'+
    '<button class="solid" type="submit">Put on the board</button>'+
    '<details class="more"'+(moreOn?" open":"")+"><summary>Size, extras, send</summary>"+
    '<label>UK size</label><div class="chips">'+['<button class="chip '+(!cap.size?"on":"")+'" type="button" data-size="">Later</button>'].concat(UK.map(s=>'<button class="chip '+(cap.size===s?"on":"")+'" type="button" data-size="'+s+'">'+s+"</button>")).join("")+"</div>"+
    extrasHtml(cap.extras,p.look,"cap")+
    '<label>How they found us</label><div class="chips">'+SOURCES.map(([id,lab])=>'<button class="chip '+(cap.source===id?"on":"")+'" type="button" data-src="'+id+'">'+lab+"</button>").join("")+"</div>"+
    (houseView()?'<label>Desk</label><div class="chips">'+SELLERS.map(s=>'<button class="chip '+(cap.owner===s?"on":"")+'" type="button" data-own="'+s+'">'+SL[s]+"</button>").join("")+"</div>":'<p class="meta">Lands on this desk · '+SL[mySeller()]+"</p>")+
    '<label>Collect or send</label><div class="chips"><button class="chip '+(cap.delivery==="collect"?"on":"")+'" type="button" data-del="collect">Collect</button><button class="chip '+(cap.delivery==="local"?"on":"")+'" type="button" data-del="local">Local R100</button><button class="chip '+(cap.delivery==="int"?"on":"")+'" type="button" data-del="int">International R300</button></div>'+
    '<label>Note</label><input name="note" value="'+esc(cap.note)+'" placeholder="Tan hide. Call after 6." /></details></form>';
}
function viewClients(){
  const rows=leads();
  const q="";
  return '<p class="kicker">CRM</p><h1>Clients</h1><p class="sub">One card per person. Nothing fake on this list.</p>'+deskChips()+(rows.length?rows.map(l=>'<div class="lead"><div class="spread"><p class="name">'+esc(l.name)+'</p><p class="meta">'+esc(l.status)+'</p></div><p class="meta">'+esc([l.sku,l.look,l.phone].filter(Boolean).join(" · "))+'</p><div class="row">'+(wa(l.phone,firstMsg(l))?'<a class="chip on" href="'+wa(l.phone,firstMsg(l))+'" data-wa="'+l.id+'" target="_blank" rel="noreferrer">WhatsApp</a>':"")+'<button class="chip" type="button" data-go="person" data-id="'+l.id+'">Open</button></div></div>').join(""):'<p class="empty">No people on this desk yet. Capture one.</p>')+'<button class="solid" type="button" data-tab="capture">Capture</button>';
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
  const money='<div class="money card"><div class="line"><span>Listed</span><span>'+zar(t.listed)+'</span></div>'+(t.extras?'<div class="line"><span>Extras</span><span>'+zar(t.extras)+'</span></div>':'')+'<div class="line"><span>Delivery</span><span>'+(t.fee?zar(t.fee):'Collect')+'</span></div><div class="line"><span>EFT due</span><span>'+zar(t.due)+'</span></div>'+(profit!=null?'<div class="line"><span>Pair profit</span><span>'+zar(profit)+'</span></div>':'')+'<div class="line"><span>Paid</span><span class="'+(l.paid?'ok':'')+'">'+(l.paid?'Yes':'No')+'</span></div></div>';
  const waRow='<div class="actions">'+(waFirst?'<a class="chip on" href="'+waFirst+'" data-wa="'+l.id+'" target="_blank" rel="noreferrer">WhatsApp first</a>':"")+(waSize?'<a class="chip" href="'+waSize+'" target="_blank" rel="noreferrer">Ask size</a>':"")+(waPay?'<a class="chip" href="'+waPay+'" target="_blank" rel="noreferrer">WhatsApp EFT</a>':"")+(waFollow?'<a class="chip" href="'+waFollow+'" target="_blank" rel="noreferrer">Follow up</a>':"")+'<button class="chip" type="button" data-copy="eft">Copy EFT</button>'+(l.paid?'<button class="chip good on" type="button" data-paid="0">Paid · undo</button>':'<button class="chip on" type="button" data-paid="1">Mark paid</button>')+(l.paid&&l.status!=="closed"?'<button class="chip" type="button" data-stage="closed">Close</button>':"")+"</div>";
  return '<div class="row" style="margin-bottom:8px"><button class="ghost" type="button" data-tab="board">Board</button><button class="ghost" type="button" data-tab="capture">Next capture</button></div><p class="kicker">Working ticket</p><h1>'+esc(l.name)+'</h1><p class="meta">'+esc(l.phone)+(l.owner?" · "+SL[l.owner]:" · Unassigned")+(l.source?" · "+esc(l.source):"")+(ago?" · last "+ago:"")+"</p>"+
    waRow+
    (p?'<article class="pair slim">'+pairImg+'<div class="pad"><p class="stock">'+esc(l.sku||"—")+'</p><p class="meta">'+esc(l.look||"")+(l.size?" · UK "+esc(l.size):" · size open")+'</p><p class="price">'+zar(t.due)+'</p><p class="kicker">EFT due</p></div></article>':'')+
    '<label>UK size</label><div class="chips">'+sizeChips+"</div>"+
    '<label>Stage</label><div class="chips">'+stageChips+"</div>"+
    desk+money+
    '<details class="card more"><summary>Lock the pair</summary><label>Pair</label><select id="p-sku">'+skuOpts+'</select><label>Pairs</label><div class="chips">'+qtyChips+'</div><label>Hide</label><div class="hides">'+hideRow+'</div>'+extrasHtml(l.extras,l.look||(p&&p.look)||"","p")+'<label>Collect or send</label><div class="chips">'+delChips+"</div></details>"+
    '<form class="card" id="pnext"><p class="kicker">Keep moving</p><label>What to do next</label><input name="next" value="'+esc(l.nextAction||"")+'" placeholder="Chase EFT. Lock size." /><label>When</label><input name="at" type="datetime-local" value="'+esc(localAt(l.nextActionAt))+'" /><label>Name</label><input name="name" value="'+esc(l.name)+'" required /><label>WhatsApp</label><input name="phone" value="'+esc(l.phone)+'" required inputmode="tel" /><label>Note</label><textarea name="note" placeholder="Tan hide. Call after 6.">'+esc(l.note)+'</textarea><button class="solid" type="submit">Save</button></form>';
}
function Desk(){
  const body=personId?viewPerson():tab==="board"?viewBoard():tab==="capture"?viewCapture():tab==="clients"?viewClients():tab==="meetings"?viewMeetings():tab==="team"?viewTeam():viewTodo();
  const flash=toast?( /need|wrong|type |eight|whatsapp number/i.test(toast) ? '<p class="err">'+esc(toast)+"</p>" : '<p class="ok">'+esc(toast)+"</p>" ) : "";
  return '<div class="shell"><aside class="side"><div class="side-head"><div class="side-brand"><span class="side-s">S</span></div></div><nav class="side-nav" aria-label="Desk">'+navBtns()+'</nav><button type="button" class="side-out" id="out"><span class="nav-mark">×</span><span class="nav-name">Sign out</span></button></aside><div class="stage"><header class="top"><div class="brand">SABLE FLOOR</div><button class="ghost" type="button" id="out2">Sign out</button></header><main class="work">'+flash+body+"</main><nav class='tabs' aria-label='Desk'>"+[["board","Board"],["todo","To-do"],["capture","Capture"],["clients","Clients"],["meetings","Meetings"]].map(([id,lab])=>'<button type="button" class="'+(tab===id||(id==="meetings"&&(tab==="meetings"||tab==="team"))||(id==="clients"&&personId)?"on":"")+'" data-tab="'+id+'"'+(tab===id||(id==="meetings"&&(tab==="meetings"||tab==="team"))?' aria-current="page"':"")+'>'+lab+"</button>").join("")+"</nav></div></div>";
}

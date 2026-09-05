function viewTodo(){
  const items=buildTodos();
  const now=items.filter(it=>it.lane==="now");
  const wait=items.filter(it=>it.lane==="wait");
  const houseAll=houseView()&&deskFilter==="all";
  const who=houseAll?"Floor":(SL[deskFilter]||SL[mySeller()]||"Your");
  const count=(now.length?now.length+" now":"Clear")+(wait.length?" · "+wait.length+" pending":"")+(items.some(it=>it.needsLuan)?" · Needs Luan":"");
  const sub=houseAll
    ?"Unassigned only. Open a name to work that book. Idle Floor over 2 hours goes to the book with fewer paid pairs — Dylan then Luan. Wian is not on that book."
    :who+"'s book. Only "+who+"'s people. Green under 30 min, yellow after that, red over an hour. Sitting 2 hours pings the book. 3 hours, or unpaid EFT over 1 hour, is Needs Luan.";
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
  const w=560,h=420,padL=36,padR=8,padT=10,padB=28;
  const plotW=w-padL-padR, plotH=h-padT-padB;
  const max=100;
  const step=5;
  const ticks=[];
  for(let n=0;n<=max;n+=step) ticks.push(n);
  const grid=ticks.map(function(n){
    const y=padT+((max-n)/max)*plotH;
    const major=n%10===0;
    return '<line class="'+(major?"m-grid":"m-grid-5")+'" x1="'+padL+'" y1="'+y+'" x2="'+(w-padR)+'" y2="'+y+'" />'+
      '<text class="m-y'+(major?" major":"")+'" x="'+(padL-6)+'" y="'+(y+3)+'" text-anchor="end">'+n+"</text>";
  }).join("");
  const gap=6;
  const bw=(plotW-(months.length-1)*gap)/months.length;
  const bars=months.map(function(m,i){
    const pairs=Number(m.pairs)||0;
    const shown=Math.min(max,pairs);
    const x=padL+i*(bw+gap);
    const bh=shown?(shown/max)*plotH:2;
    const y=padT+plotH-bh;
    const now=m.key===thisKey?" now":"";
    const op=pairs?"":" faint";
    const label=pairs?('<text class="m-n" x="'+(x+bw/2)+'" y="'+(y-4)+'" text-anchor="middle">'+pairs+"</text>"):"";
    return '<g class="m-col'+now+op+'"><rect class="bar" x="'+x+'" y="'+y+'" width="'+bw+'" height="'+bh+'" rx="4"><title>'+esc(m.label)+" · "+pairs+(pairs===1?" pair":" pairs")+"</title></rect>"+label+'<text class="m-x" x="'+(x+bw/2)+'" y="'+(h-8)+'" text-anchor="middle">'+esc(m.label)+"</text></g>";
  }).join("");
  const total=months.reduce(function(n,m){return n+(Number(m.pairs)||0)},0);
  return '<div class="m-chart">'+
    '<div class="spread"><p class="kicker">Pairs sold</p><p class="meta">0–100 in 5s · '+total+" this year</p></div>"+
    '<svg class="m-svg" viewBox="0 0 '+w+" "+h+'" role="img" aria-label="Pairs sold each month, scale 0 to 100 in fives">'+grid+bars+"</svg>"+
  "</div>";
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
    '<p class="sub">'+esc(who)+". Graph on the left is pairs sold, 0 to 100 in fives.</p>";
  const split='<div class="money-split">'+
    moneyChart(m.months,m.thisKey)+
    '<div class="money-side money-grid">'+
      mBlock("Pairs sold",String(m.paidPairs),"Paid on this book")+
      mBlock("This month",String(m.thisPairs),zar(m.thisPaid)+" in · "+mom)+
      mBlock("Cash in",zar(m.paidRand),m.paidTickets+" paid")+
      mBlock("EFT waiting",zar(m.eftDue),m.invOpen?(m.invOpen+" invoice"+(m.invOpen===1?"":"s")+" out"):"None waiting",m.eftDue?" warn":"")+
      mBlock("Pair profit",zar(m.paidProfit),"On paid · margin "+pct(m.margin))+
      mBlock("Average ticket",zar(Math.round(m.avg)),m.paidTickets+" closed tickets")+
    "</div>"+
  "</div>";
  const mid='<div class="money-grid">'+
    moneyRatio(m)+
    mBlock("Apps in",String(m.apps),m.thisApps+" this month · lookbook")+
    mBlock("Shoes paid",String(m.paidPairs),m.appsPaidPairs+" of them from the site")+
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
        return '<button class="m-wait" type="button" data-go="person" data-id="'+o.id+'"><span>'+esc(o.name||"No name")+' · '+esc(o.sku)+mismatchBadge(rows.find(function(x){return x.id===o.id})||{})+'</span><span>'+zar(o.due)+' · '+sitLabel(o.age)+"</span></button>";
      }).join("")
    : '<p class="meta">None waiting.</p>';
  const out='<div class="m-block span2"><p class="kicker">Invoices out</p>'+wait+"</div>";
  return head+'<div class="money-dash">'+split+mid+cuts+books+mix+out+"</div>";
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
    const book=bookOf(l);
    const who=houseView()&&book?'<span class="owner-chip">'+esc(SL[book]||book)+"</span>":"";
    return '<div class="lead"><div class="lead-row">'+(p?'<img src="'+p.img+'" alt="'+esc(p.sku)+'">':'<div></div>')+'<div><div class="spread"><p class="name">'+esc(l.name||"No name")+nametag(l)+mismatchBadge(l)+'</p><p class="meta">'+who+(l.salesman?" · "+esc(l.salesman):"")+'</p></div><p class="meta">'+esc([t.qty>1?(t.qty+" pairs"):"",l.sku,l.look,l.size?("UK "+l.size):"",zar(t.listed)].filter(Boolean).join(" · "))+'</p><p class="meta">Next · '+esc(next)+(ago?" · last "+ago:"")+'</p><div class="row">'+(wa(l.phone,firstMsg(l))?'<a class="chip on" href="'+wa(l.phone,firstMsg(l))+'" data-wa="'+l.id+'" target="_blank" rel="noreferrer">WhatsApp</a>':"")+'<button class="chip" type="button" data-go="person" data-id="'+l.id+'">Open</button>'+(!l.owner&&houseView()?'<button class="chip" type="button" data-take="'+l.id+'">Take</button>':"")+'</div></div></div></div>';
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
  const b=bankOf();
  const bank=houseView()?'<h3 style="margin-top:24px">EFT on the invoice</h3><p class="sub">This is what the customer sees. Save it once.</p><form class="card" id="bank"><label>Bank</label><input name="bank" value="'+esc(b.bank)+'" placeholder="Bank name" autocomplete="off" /><label>Account name</label><input name="accountName" value="'+esc(b.accountName)+'" placeholder="Sable" autocomplete="off" /><label>Account number</label><input name="accountNumber" value="'+esc(b.accountNumber)+'" inputmode="numeric" autocomplete="off" /><label>Branch</label><input name="branch" value="'+esc(b.branch)+'" autocomplete="off" /><label>Account type</label><input name="type" value="'+esc(b.type||"Cheque")+'" autocomplete="off" /><button class="solid" type="submit">Save on invoices</button></form>':"";
  return '<p class="kicker">CRM</p><h1>Team</h1><p class="sub">Requests land here. You verify Sable. Until then they cannot open the floor.</p><h3>Requests</h3>'+(pending.length?pending.map(r=>'<div class="lead"><p class="name">'+esc(r.name)+'</p><p class="meta">'+esc(r.email)+' · '+(SL[r.seller]||r.seller||"")+'</p><div class="row"><button class="chip on" type="button" data-ok="'+esc(r.email)+'">Approve sales</button><button class="chip" type="button" data-no="'+esc(r.email)+'">Deny</button></div></div>').join(""):'<p class="empty">None waiting.</p>')+'<h3 style="margin-top:24px">People</h3>'+S.users.map(u=>'<div class="lead"><p class="name">'+esc(u.name)+'</p><p class="meta">'+esc(u.email)+' · '+esc(u.role)+' · '+(SL[u.seller]||"")+' · '+esc(u.status)+'</p></div>').join("")+bank;
}
function viewPerson(){
  const l=S.leads.find(x=>x.id===personId);
  if(!l) return '<p class="empty">Not on Sable.</p><button class="chip" type="button" data-tab="board">Board</button>';
  const t=ticket(l);
  const p=t.p;
  const stages=[["new","New"],["contacted","Working"],["closed","Closed"],["lost","Lost"]];
  const age=l.updatedAt||l.createdAt;
  const ago=age?Math.max(0,Math.round((Date.now()-age)/3600000))+"h":"";
  const profit=seeCost()?Math.max(0,t.listed-pairCostOf(l)):null;
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
  const money='<div class="money card">'+(t.mismatch?'<p class="price-mismatch-row">'+mismatchBadge(l)+"</p>":"")+'<div class="line"><span>'+(t.custom?"Custom":"Listed")+'</span><span class="price-edit"><input id="p-price" inputmode="numeric" value="'+t.listed+'" aria-label="Listed total" /></span></div>'+(t.custom?'<div class="line"><span>Book</span><span>'+zar(bookListed(l))+'</span></div>':'')+(t.extras?'<div class="line"><span>Extras</span><span>'+zar(t.extras)+'</span></div>':'')+'<div class="line"><span>Delivery</span><span>'+(t.fee?zar(t.fee):'Collect')+'</span></div><div class="line"><span>EFT due</span><span>'+zar(t.due)+'</span></div>'+(profit!=null?'<div class="line"><span>Pair profit</span><span>'+zar(profit)+'</span></div>':'')+'<div class="line"><span>Paid</span><span class="'+(l.paid?'ok':'')+'">'+(l.paid?'Yes':'No')+'</span></div></div>';
  const waRow='<div class="actions">'+(waFirst?'<a class="chip on" href="'+waFirst+'" data-wa="'+l.id+'" target="_blank" rel="noreferrer">WhatsApp first</a>':"")+(waSize?'<a class="chip" href="'+waSize+'" target="_blank" rel="noreferrer">Ask size</a>':"")+'<button class="chip on" type="button" data-invoice="'+l.id+'">Invoice</button>'+(waPay?'<a class="chip" href="'+waPay+'" target="_blank" rel="noreferrer">WhatsApp EFT</a>':"")+(waFollow?'<a class="chip" href="'+waFollow+'" target="_blank" rel="noreferrer">Follow up</a>':"")+'<button class="chip" type="button" data-copy="eft">Copy EFT</button>'+(l.paid?'<button class="chip good on" type="button" data-paid="0">Paid · undo</button>':'<button class="chip" type="button" data-paid="1">Mark paid</button>')+(l.paid&&l.status!=="closed"?'<button class="chip" type="button" data-stage="closed">Close</button>':"")+"</div>";
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
function viewInvoice(){
  const l=S.leads.find(x=>x.id===personId);
  if(!l) return '<p class="empty">Not on Sable.</p><button class="chip" type="button" data-tab="todo">To-do</button>';
  const t=ticket(l);
  const ref=l.invRef||invRef(l);
  const bank=bankLines();
  const issued=invDate(invIssued(l));
  const waPay=wa(l.phone,payMsg(l));
  const rows=(t.items&&t.items.length?t.items:itemsOf(l)).map(function(it){
    const bits=[it.sku+" "+(it.look||""),it.size?("UK "+it.size):"UK size to confirm",hideName(it.colour),extraLabel(it.extras)].filter(Boolean);
    const qty=Number(it.qty||1);
    const line=Number(it.listed||0)*qty+extraSum(it.extras,qty);
    return "<tr><td><p class=\"name\">"+esc(bits[0]||it.sku)+(it.extras&&it.extras.custom?'<span class="nametag">Custom</span>':"")+"</p><p class=\"meta\">"+esc(bits.slice(1).join(" · "))+"</p></td><td class=\"num\">"+qty+"</td><td class=\"num\">"+zar(line)+"</td></tr>";
  }).join("");
  const ship="<tr><td><p class=\"name\">"+(t.fee?esc(delLabel(l.delivery)):"Collect")+"</p><p class=\"meta\">"+(t.fee?"Delivery":"No delivery")+"</p></td><td class=\"num\">—</td><td class=\"num\">"+(t.fee?zar(t.fee):"R0")+"</td></tr>";
  const pay=bank.length?bank.map(function(line){return "<p>"+esc(line)+"</p>";}).join(""):"";
  const bar='<div class="inv-bar no-print">'+
    '<button class="ghost" type="button" data-invback="1">Back</button>'+
    '<button class="solid tight" type="button" id="inv-print">Print / PDF</button>'+
    (waPay?'<a class="chip on" href="'+waPay+'" target="_blank" rel="noreferrer" data-invsent="'+l.id+'">WhatsApp</a>':'')+
    '<button class="chip" type="button" data-copy="eft">Copy EFT</button>'+
    (l.paid?'<span class="chip good on">Paid</span>':'<button class="chip" type="button" data-paid="1">Mark paid</button>')+
  "</div>";
  return '<div class="inv-wrap">'+bar+
    '<article class="inv-paper'+(l.paid?" is-paid":"")+'">'+
      (l.paid?'<p class="inv-stamp" aria-hidden="true">Paid</p>':"")+
      '<header class="inv-top">'+
        '<div><p class="inv-mark">SABLE</p><p class="inv-place">Johannesburg</p><p class="inv-place">Handmade leather footwear</p></div>'+
        '<div class="inv-head-right"><p class="inv-kicker">Invoice</p><p class="inv-ref">'+esc(ref)+'</p><p class="inv-place">'+esc(issued)+"</p></div>"+
      "</header>"+
      '<div class="inv-who">'+
        '<div class="inv-box"><p class="inv-kicker">Bill to</p><p class="name">'+esc(l.name||"Client")+'</p><p class="meta">'+esc(l.phone||"")+(l.salesman?" · helped by "+esc(l.salesman):"")+"</p></div>"+
        '<div class="inv-box"><p class="inv-kicker">From</p><p class="name">SABLE.CO</p><p class="meta">Johannesburg, South Africa</p></div>'+
      "</div>"+
      '<div class="inv-box">'+
        '<table class="inv-table"><thead><tr><th>The pair</th><th class="num">Qty</th><th class="num">Amount</th></tr></thead><tbody>'+rows+ship+"</tbody></table>"+
      "</div>"+
      '<div class="inv-box inv-duebox"><p class="inv-kicker">EFT due</p><p class="inv-due">'+zar(t.due)+"</p></div>"+
      '<div class="inv-pay">'+
        '<div class="inv-box"><p class="inv-kicker">Pay by EFT</p>'+pay+'<p class="inv-ref-line">Reference <b>'+esc(ref)+"</b></p></div>"+
        '<div class="inv-box"><p class="inv-kicker">Confirm</p><p>The pair is confirmed when EFT reflects. No card. Handmade. Subject to availability.</p></div>'+
      "</div>"+
      '<p class="inv-foot">SABLE.CO · Invoice '+esc(ref)+" · "+esc(issued)+"</p>"+
    "</article></div>";
}
function Desk(){
  const body=personId?(invView?viewInvoice():viewPerson()):tab==="board"?viewBoard():tab==="capture"?viewCapture():tab==="clients"?viewClients():tab==="meetings"?viewMeetings():tab==="team"?viewTeam():viewTodo();
  const flash=deskFlash();
  return '<div class="shell"><aside class="side"><div class="side-head"><div class="side-brand"><span class="side-s">S</span></div></div><nav class="side-nav" aria-label="Sable">'+navBtns()+'</nav><button type="button" class="side-out" id="out"><span class="nav-mark">×</span><span class="nav-name">Sign out</span></button></aside><div class="stage"><header class="top"><div class="brand">SABLE FLOOR</div><div class="row"><a class="ghost" href="/want" target="_blank" rel="noreferrer">Client web</a><button class="ghost" type="button" id="copy-want">Copy link</button><button class="ghost" type="button" id="out2">Sign out</button></div></header><main class="work">'+flash+body+"</main><nav class='tabs' aria-label='Sable'>"+[["board","Board"],["todo","To-do"],["capture","Capture"],["clients","Clients"],["meetings","Meetings"]].map(([id,lab])=>'<button type="button" class="'+(tab===id||(id==="meetings"&&(tab==="meetings"||tab==="team"))||(id==="clients"&&personId)?"on":"")+'" data-tab="'+id+'"'+(tab===id||(id==="meetings"&&(tab==="meetings"||tab==="team"))?' aria-current="page"':"")+'>'+lab+"</button>").join("")+"</nav></div></div>";
}

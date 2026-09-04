    const HOUSE_MAIL = "lensleyluan001@gmail.com";
    const BAG_KEY = "sable-want-bag-v1";
    function zar(n){ if(n==null||n==="") return "POA"; return "R"+Number(n).toLocaleString("en-ZA"); }
    function feeOf(d){ return d==="local"?100:d==="int"?300:0; }
    function digits(p){ return String(p||"").replace(/\D/g,""); }
    function uidLine(){ return "ln-"+Math.random().toString(36).slice(2,8); }
    const params = new URLSearchParams(location.search);
    let type = params.get("type") || "";
    let sku = params.get("sku") || "";
    let size = params.get("size") || "";
    let hide = params.get("hide") || "book";
    if (!HIDES.some(h => h[0] === hide) && String(hide).indexOf("tt:") !== 0) hide = "book";
    let viewI = 0;
    let delivery = "collect";
    let extras = extraFix();
    const types = ["", ...looksOf()];
    const typeBox = document.getElementById("types");
    const grid = document.getElementById("grid");
    const ask = document.getElementById("ask");
    const hero = document.getElementById("hero");
    const sizes = document.getElementById("sizes");
    const dels = document.getElementById("dels");
    const msg = document.getElementById("msg");
    const added = document.getElementById("added");
    const exrow = document.getElementById("exrow");
    const laceCols = document.getElementById("lace-cols");
    const stitchCols = document.getElementById("stitch-cols");
    const orderEl = document.getElementById("order");
    const bagEl = document.getElementById("bag");
    const dock = document.getElementById("dock");
    const dueEl = document.getElementById("due");
    function selected(){ return shoe(sku); }
    function dueOf(p){
      if(!p) return 0;
      return p.price + extraSum(extras, 1);
    }
    function packLine(){
      const p = selected();
      if (!p) return null;
      extras.customNote = String((document.getElementById("custom-note")||{}).value || extras.customNote || "").trim();
      if (extras.customNote) extras.custom = true;
      extras.laser = false;
      extras.laserPhoto = "";
      return {
        id: uidLine(),
        sku: p.sku,
        look: p.look,
        size: size || "",
        colour: hide || "book",
        extras: extraFix(extras),
        qty: 1,
        price: p.price
      };
    }
    function lineKey(it){
      return [it.sku, it.size||"", it.colour||"book", extraLabel(it.extras)||""].join("|");
    }
    function lineDue(it){
      return Number(it.price||0)*Number(it.qty||1) + extraSum(it.extras, it.qty);
    }
    function bagCount(){ return bag.reduce((n,it)=>n+Number(it.qty||1),0); }
    function bagListed(){ return bag.reduce((n,it)=>n+lineDue(it),0); }
    function bagDue(){ return bagListed() + feeOf(delivery); }
    function loadBag(){
      try{
        const raw = JSON.parse(localStorage.getItem(BAG_KEY)||"[]");
        if (!Array.isArray(raw)) return [];
        return raw.map(function(it){
          const p = shoe(it.sku);
          if (!p) return null;
          return {
            id: it.id || uidLine(),
            sku: p.sku,
            look: p.look,
            size: String(it.size||""),
            colour: it.colour || "book",
            extras: extraFix(it.extras),
            qty: Math.max(1, Math.min(8, Number(it.qty||1)||1)),
            price: p.price
          };
        }).filter(Boolean);
      }catch(e){ return []; }
    }
    function saveBag(){
      try{ localStorage.setItem(BAG_KEY, JSON.stringify(bag)); }catch(e){}
    }
    let bag = loadBag();
    let thanks = "";
    function addLine(it){
      const key = lineKey(it);
      const hit = bag.find(x => lineKey(x)===key);
      if (hit){ hit.qty = Math.min(8, Number(hit.qty||1)+1); }
      else bag.push(it);
      saveBag();
    }
    function setQuery(){
      const q = new URLSearchParams();
      if (type) q.set("type", type);
      if (sku) q.set("sku", sku);
      if (size) q.set("size", size);
      if (hide && hide !== "book") q.set("hide", hide);
      const qs = q.toString();
      history.replaceState(null, "", qs ? ("?"+qs) : location.pathname);
    }
    function drawTypes(){
      typeBox.innerHTML = types.map(t =>
        '<button class="chip '+(type===t?"on":"")+'" type="button" data-type="'+t+'">'+(t||"All")+"</button>"
      ).join("");
      typeBox.querySelectorAll("[data-type]").forEach(b => b.onclick = function(){
        type = b.getAttribute("data-type") || "";
        const p = selected();
        if (p && type && p.look !== type) sku = "";
        draw();
      });
    }
    function tileHtml(p){
      return '<button class="tile '+(p.sku===sku?"on":"")+'" type="button" data-sku="'+p.sku+'">'+
        '<img src="'+p.img+'" alt="'+p.sku+" "+p.look+'" loading="lazy" />'+
        '<div class="pad"><p class="stock">'+p.sku+'</p><p class="meta">'+p.look+(isGolfer(p.look)?" · two-tone":"")+'</p><p class="price">'+zar(p.price)+"</p></div>"+
      "</button>";
    }
    function drawGrid(){
      const groups = type ? [type] : looksOf();
      const html = groups.map(function(look){
        const rows = PAIRS.filter(p => p.look === look);
        if (!rows.length) return "";
        return '<section class="cat"><h2>'+look+'</h2>'+(isGolfer(look)?'<p class="golf-note">Choose your own two-tone colours</p>':'')+'<div class="shelf">'+rows.map(tileHtml).join("")+"</div></section>";
      }).join("");
      grid.innerHTML = html || '<p class="empty">Nothing in this type.</p>';
      grid.querySelectorAll("[data-sku]").forEach(b => b.onclick = function(){
        sku = b.getAttribute("data-sku") || "";
        const p = selected();
        if (p) type = p.look;
        if (!p || !isGolfer(p.look)) {
          if (String(hide).indexOf("tt:")===0) hide = "book";
        }
        viewI = 0;
        extras = extraFix();
        const note = document.getElementById("custom-note");
        if (note) note.value = "";
        draw();
        ask.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    function setView(d, abs){
      const p = selected();
      if (!p) return;
      const n = viewsOf(p, hide).length;
      if (abs != null) viewI = abs;
      else viewI = (viewI + d + n) % n;
      drawHero();
    }
    function drawHero(){
      const p = selected();
      if (!p) { ask.hidden = true; return; }
      if (!isGolfer(p.look) && String(hide).indexOf("tt:")===0) hide = "book";
      ask.hidden = false;
      const shots = viewsOf(p, hide);
      if (viewI < 0) viewI = shots.length - 1;
      if (viewI >= shots.length) viewI = 0;
      const extra = extraSum(extras, 1);
      const extraBit = extraLabel(extras);
      const golf = isGolfer(p.look);
      const hideBit = golf
        ? (hide && hide!=="book" ? " · "+hideName(hide) : " · two-tone open")
        : (hide&&hide!=="book"?" · "+hideName(hide):"");
      const photoHide = golf ? "book" : hide;
      const use3d = golf && hide && hide!=="book";
      hero.innerHTML = (use3d ? golfTurnHtml(p.sku) : turnHtml(p, photoHide, viewI, extras))+
        (use3d ? toneBadge(hide) : "")+
        '<div class="pad"><div><p class="stock">'+p.sku+(extras.custom?'<span class="nametag">Custom</span>':"")+(golf?'<span class="nametag">Two-tone</span>':"")+'</p><p class="meta">'+p.look+(size?" · UK "+size:" · size open")+hideBit+(extraBit?" · "+extraBit:"")+'</p></div>'+
        '<div><p class="price">'+zar(dueOf(p))+'</p><p class="kicker">This pair'+(extra?" + extras":"")+"</p></div></div>"+
        (golf
          ? ('<label style="margin:10px 14px 0">Two-tone</label>'+golfToneHtml(hide,"data-whide")+'<p class="hint">Body and vamp. Golfers only. The picture recolors to the two colours you pick.</p>')
          : ('<label style="margin:10px 14px 0">Hide</label><div class="hides">'+hideChips(hide,"data-whide")+'</div><p class="hint">As photographed is the pair in the book. Other hides are a last preview, subject to tannery hide.</p>'));
      if (use3d) paintGolfEl(document.getElementById("golf-3d"), p.sku, hide);
      else hookTurn(setView);
      hero.querySelectorAll("[data-whide]").forEach(b => b.onclick = function(){
        hide = b.getAttribute("data-whide") || "book";
        viewI = 0;
        drawHero();
        setQuery();
      });
      hero.querySelectorAll("[data-tbody]").forEach(b => b.onclick = function(){
        const a = b.getAttribute("data-tbody") || "white";
        const t = parseTone(hide);
        const vamp = t.book ? "white" : (t.b || a);
        hide = toneId(a, vamp);
        viewI = 0;
        drawHero();
        setQuery();
      });
      hero.querySelectorAll("[data-tvamp]").forEach(b => b.onclick = function(){
        const vamp = b.getAttribute("data-tvamp") || "white";
        const t = parseTone(hide);
        const body = t.book ? "white" : (t.a || "white");
        hide = toneId(body, vamp);
        viewI = 0;
        drawHero();
        setQuery();
      });
    }
    function drawExtras(){
      const p = selected();
      const laced = p && lacedLook(p.look);
      if (!laced) extras.laces = false;
      exrow.innerHTML =
        (laced?'<button class="chip '+(extras.laces?"on":"")+'" type="button" data-ex="laces">Laces · R50</button>':"")+
        '<button class="chip '+(extras.stitch?"on":"")+'" type="button" data-ex="stitch">Stitching · R50</button>'+
        '<button class="chip '+(extras.custom?"on":"")+'" type="button" data-ex="custom">Custom · quoted</button>';
      exrow.querySelectorAll("[data-ex]").forEach(b => b.onclick = function(){
        const k = b.getAttribute("data-ex");
        extras[k] = !extras[k];
        if (k === "custom" && !extras.custom) extras.customNote = "";
        drawHero();
        drawExtras();
      });
      document.getElementById("ex-laces").hidden = !(extras.laces && laced);
      document.getElementById("ex-stitch").hidden = !extras.stitch;
      document.getElementById("ex-custom").hidden = !extras.custom;
      laceCols.innerHTML = colChips(LACE_COLS, extras.laceColour, "data-lace");
      stitchCols.innerHTML = colChips(STITCH_COLS, extras.stitchColour, "data-stitch");
      laceCols.querySelectorAll("[data-lace]").forEach(b => b.onclick = function(){
        extras.laceColour = b.getAttribute("data-lace") || "natural";
        extras.laces = true;
        drawHero();
        drawExtras();
      });
      stitchCols.querySelectorAll("[data-stitch]").forEach(b => b.onclick = function(){
        extras.stitchColour = b.getAttribute("data-stitch") || "cream";
        extras.stitch = true;
        drawHero();
        drawExtras();
      });
    }
    function drawSizes(){
      sizes.innerHTML = ['<button class="chip '+(!size?"on":"")+'" type="button" data-size="">Later</button>']
        .concat(UK.map(s => '<button class="chip '+(size===s?"on":"")+'" type="button" data-size="'+s+'">'+s+"</button>")).join("");
      sizes.querySelectorAll("[data-size]").forEach(b => b.onclick = function(){
        size = b.getAttribute("data-size") || "";
        drawHero(); drawSizes(); setQuery();
      });
    }
    function drawDels(){
      const opts = [["collect","Collect"],["local","Local R100"],["int","International R300"]];
      dels.innerHTML = opts.map(([id,lab]) =>
        '<button class="chip '+(delivery===id?"on":"")+'" type="button" data-del="'+id+'">'+lab+"</button>"
      ).join("");
      dels.querySelectorAll("[data-del]").forEach(b => b.onclick = function(){
        delivery = b.getAttribute("data-del") || "collect";
        drawBag();
      });
    }
    function drawBag(){
      const n = bagCount();
      const wantForm = document.getElementById("want");
      if (thanks && !n){
        orderEl.hidden = false;
        document.body.classList.remove("has-bag");
        dock.hidden = true;
        if (wantForm) wantForm.hidden = true;
        const title = document.getElementById("order-title");
        if (title) title.textContent = "Sent";
        bagEl.innerHTML = '<p class="ok thanks">'+thanks+"</p>";
        if (dueEl) dueEl.textContent = "";
        return;
      }
      if (wantForm) wantForm.hidden = false;
      orderEl.hidden = n===0;
      document.body.classList.toggle("has-bag", n>0);
      dock.hidden = n===0;
      if (n){
        dock.innerHTML = '<span>Order · '+n+'</span><span>'+zar(bagDue())+"</span>";
        dock.onclick = function(){ orderEl.scrollIntoView({ behavior:"smooth", block:"start" }); };
      }
      const title = document.getElementById("order-title");
      if (title) title.textContent = n===1 ? "1 pair" : n+" pairs";
      bagEl.innerHTML = bag.map(function(it){
        const p = shoe(it.sku);
        const img = p ? p.img : "";
        const bits = [it.size?("UK "+it.size):"Size later", hideName(it.colour), extraLabel(it.extras)].filter(Boolean);
        return '<div class="bag-line">'+
          (img?'<img src="'+img+'" alt="'+it.sku+'">':'<div></div>')+
          '<div class="bag-body">'+
            '<p class="name">'+it.sku+" · "+it.look+(it.extras&&it.extras.custom?'<span class="nametag">Custom</span>':"")+"</p>"+
            '<p class="meta">'+bits.join(" · ")+"</p>"+
            '<p class="price">'+zar(lineDue(it))+"</p>"+
            '<div class="bag-qty">'+
              '<button type="button" data-qty="'+it.id+'" data-d="-1" aria-label="Less">−</button>'+
              '<span>'+it.qty+"</span>"+
              '<button type="button" data-qty="'+it.id+'" data-d="1" aria-label="More">+</button>'+
              '<button type="button" class="bag-drop" data-drop="'+it.id+'">Remove</button>'+
            "</div>"+
          "</div>"+
        "</div>";
      }).join("");
      bagEl.querySelectorAll("[data-qty]").forEach(b => b.onclick = function(){
        const id = b.getAttribute("data-qty");
        const d = Number(b.getAttribute("data-d")||0);
        const it = bag.find(x => x.id===id);
        if (!it) return;
        it.qty = Math.max(0, Math.min(8, Number(it.qty||1)+d));
        if (it.qty<1) bag = bag.filter(x => x.id!==id);
        saveBag(); drawBag();
      });
      bagEl.querySelectorAll("[data-drop]").forEach(b => b.onclick = function(){
        bag = bag.filter(x => x.id!==b.getAttribute("data-drop"));
        saveBag(); drawBag();
      });
      if (dueEl){
        const ship = feeOf(delivery) ? " · send "+zar(feeOf(delivery)) : " · collect";
        dueEl.textContent = n ? ("Listed "+zar(bagDue())+ship) : "";
      }
    }
    function draw(){
      drawTypes();
      drawGrid();
      drawHero();
      drawSizes();
      drawDels();
      drawExtras();
      drawBag();
      setQuery();
    }
    document.getElementById("custom-note").addEventListener("input", function(){
      extras.customNote = String(this.value || "").trim();
      extras.custom = true;
      drawHero();
    });
    document.getElementById("add").onclick = function(){
      const it = packLine();
      if (!it) return;
      addLine(it);
      thanks = "";
      added.hidden = false;
      added.textContent = bagCount()===1 ? "On the order. Add another pair or send below." : "On the order · "+bagCount()+" pairs.";
      drawBag();
      orderEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    document.getElementById("more").onclick = function(){
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.getElementById("want").addEventListener("submit", async function(e){
      e.preventDefault();
      if (!bag.length){
        const it = packLine();
        if (it) addLine(it);
      }
      if (!bag.length){ msg.className = "err"; msg.textContent = "Add a pair first."; return; }
      const f = Object.fromEntries(new FormData(e.target));
      const name = String(f.name||"").trim();
      const phone = String(f.phone||"").trim();
      if (name.length < 2) { msg.className = "err"; msg.textContent = "Need a name."; return; }
      if (digits(phone).length < 9) { msg.className = "err"; msg.textContent = "WhatsApp number."; return; }
      const salesman = String(f.salesman || "").trim();
      const items = bag.map(function(it){
        return {
          sku: it.sku,
          look: it.look,
          size: it.size,
          qty: it.qty,
          colour: it.colour,
          extras: extraFix(it.extras),
          listedPrice: it.price
        };
      });
      const first = items[0];
      const lead = {
        name, phone,
        sku: first.sku,
        look: first.look,
        size: items.every(it=>it.size===first.size) ? first.size : "",
        price: first.listedPrice,
        qty: bagCount(),
        items,
        delivery,
        deliveryFee: feeOf(delivery),
        colour: first.colour,
        extras: extraFix(first.extras),
        extrasFee: items.reduce((n,it)=>n+extraSum(it.extras, it.qty),0),
        note: String(f.note||"").trim(),
        salesman,
        owner: matchSeller(salesman),
        source: "website",
        heat: "hot",
        createdAt: Date.now()
      };
      msg.className = "";
      msg.textContent = "Sending…";
      let ok = false;
      try {
        const r = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead)
        });
        ok = r.ok;
      } catch (err) {}
      try {
        const lines = items.map(it => it.sku+" "+it.look+(it.size?" UK "+it.size:"")+" ×"+it.qty).join(" · ");
        await fetch("https://formsubmit.co/ajax/" + HOUSE_MAIL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: "SABLE lead — " + lead.name + " · " + bagCount() + " pair"+(bagCount()===1?"":"s"),
            name: lead.name,
            phone: lead.phone,
            pairs: lines,
            sku: items.map(it=>it.sku).join(", "),
            hide: items.map(it=>hideName(it.colour)).join(", "),
            extras: items.map(it=>extraLabel(it.extras)||"None").join(" · "),
            salesman: salesman || "",
            delivery: lead.delivery,
            listed: zar(bagDue()),
            note: lead.note,
            source: "web /want"
          })
        });
      } catch (err) {}
      thanks = ok
        ? ("With Sable. We will WhatsApp you about "+(bagCount()===1?"the pair":(bagCount()+" pairs"))+".")
        : "Sent. If we do not reply today, WhatsApp the house.";
      bag = [];
      saveBag();
      e.target.reset();
      extras = extraFix();
      document.getElementById("custom-note").value = "";
      added.hidden = true;
      draw();
    });
    if (sku && !shoe(sku)) sku = "";
    if (sku) {
      const p = shoe(sku);
      if (p) type = type || p.look;
    }
    draw();

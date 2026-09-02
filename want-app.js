    const HOUSE_MAIL = "lensleyluan001@gmail.com";
    function zar(n){ if(n==null||n==="") return "POA"; return "R"+Number(n).toLocaleString("en-ZA"); }
    function feeOf(d){ return d==="local"?100:d==="int"?300:0; }
    function digits(p){ return String(p||"").replace(/\D/g,""); }
    const params = new URLSearchParams(location.search);
    let type = params.get("type") || "";
    let sku = params.get("sku") || "";
    let size = params.get("size") || "";
    let hide = params.get("hide") || "book";
    if (!HIDES.some(h => h[0] === hide)) hide = "book";
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
    const exrow = document.getElementById("exrow");
    const laceCols = document.getElementById("lace-cols");
    const stitchCols = document.getElementById("stitch-cols");
    function selected(){ return shoe(sku); }
    function dueOf(p){
      if(!p) return 0;
      return p.price + extraSum(extras, 1) + feeOf(delivery);
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
        '<div class="pad"><p class="stock">'+p.sku+'</p><p class="meta">'+p.look+'</p><p class="price">'+zar(p.price)+"</p></div>"+
      "</button>";
    }
    function drawGrid(){
      const groups = type ? [type] : looksOf();
      const html = groups.map(function(look){
        const rows = PAIRS.filter(p => p.look === look);
        if (!rows.length) return "";
        return '<section class="cat"><h2>'+look+'</h2><div class="shelf">'+rows.map(tileHtml).join("")+"</div></section>";
      }).join("");
      grid.innerHTML = html || '<p class="empty">Nothing in this type.</p>';
      grid.querySelectorAll("[data-sku]").forEach(b => b.onclick = function(){
        sku = b.getAttribute("data-sku") || "";
        const p = selected();
        if (p) type = p.look;
        viewI = 0;
        if (p && !lacedLook(p.look)) extras.laces = false;
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
      ask.hidden = false;
      const shots = viewsOf(p, hide);
      if (viewI < 0) viewI = shots.length - 1;
      if (viewI >= shots.length) viewI = 0;
      const extra = extraSum(extras, 1);
      const extraBit = extraLabel(extras);
      hero.innerHTML = turnHtml(p, hide, viewI)+
        '<div class="pad"><div><p class="stock">'+p.sku+(extras.custom?'<span class="nametag">Custom</span>':"")+'</p><p class="meta">'+p.look+(size?" · UK "+size:" · size open")+" · "+(delivery==="local"?"Local R100":delivery==="int"?"International R300":"Collect")+(hide&&hide!=="book"?" · "+hideName(hide):"")+(extraBit?" · "+extraBit:"")+'</p></div>'+
        '<div><p class="price">'+zar(dueOf(p))+'</p><p class="kicker">Listed'+(feeOf(delivery)?" + send":"")+(extra?" + extras":"")+"</p></div></div>"+
        '<label style="margin:10px 14px 0">Hide</label>'+
        '<div class="hides">'+hideChips(hide,"data-whide")+"</div>"+
        '<p class="hint">As photographed is the pair in the book. Other hides are a last preview, subject to tannery hide.</p>';
      hookTurn(setView);
      hero.querySelectorAll("[data-whide]").forEach(b => b.onclick = function(){
        hide = b.getAttribute("data-whide") || "book";
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
        '<button class="chip '+(extras.laser?"on":"")+'" type="button" data-ex="laser">Laser · R50</button>'+
        (laced?'<button class="chip '+(extras.laces?"on":"")+'" type="button" data-ex="laces">Laces · R50</button>':"")+
        '<button class="chip '+(extras.stitch?"on":"")+'" type="button" data-ex="stitch">Stitching · R50</button>'+
        '<button class="chip '+(extras.custom?"on":"")+'" type="button" data-ex="custom">Custom · quoted</button>';
      exrow.querySelectorAll("[data-ex]").forEach(b => b.onclick = function(){
        const k = b.getAttribute("data-ex");
        extras[k] = !extras[k];
        if (k === "laser" && !extras.laser) extras.laserPhoto = "";
        if (k === "custom" && !extras.custom) extras.customNote = "";
        drawHero();
        drawExtras();
      });
      document.getElementById("ex-laser").hidden = !extras.laser;
      document.getElementById("ex-laces").hidden = !(extras.laces && laced);
      document.getElementById("ex-stitch").hidden = !extras.stitch;
      document.getElementById("ex-custom").hidden = !extras.custom;
      const prev = document.getElementById("laser-preview");
      if (extras.laserPhoto) { prev.src = extras.laserPhoto; prev.hidden = false; }
      else { prev.removeAttribute("src"); prev.hidden = true; }
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
        drawHero(); drawDels();
      });
    }
    function draw(){
      drawTypes();
      drawGrid();
      drawHero();
      drawSizes();
      drawDels();
      drawExtras();
      setQuery();
    }
    document.getElementById("laser-file").addEventListener("change", function(){
      const f = this.files && this.files[0];
      if (!f) return;
      shrinkPic(f, function(data){
        extras.laser = true;
        extras.laserPhoto = data;
        drawHero();
        drawExtras();
      });
    });
    document.getElementById("custom-note").addEventListener("input", function(){
      extras.customNote = String(this.value || "").trim();
      extras.custom = true;
    });
    document.getElementById("want").addEventListener("submit", async function(e){
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      const name = String(f.name||"").trim();
      const phone = String(f.phone||"").trim();
      if (name.length < 2) { msg.className = "err"; msg.textContent = "Need a name."; return; }
      if (digits(phone).length < 9) { msg.className = "err"; msg.textContent = "WhatsApp number."; return; }
      extras.customNote = String(document.getElementById("custom-note").value || "").trim();
      if (extras.customNote) extras.custom = true;
      const p = selected();
      const packed = extraFix(extras);
      const lead = {
        name, phone, size,
        sku: p ? p.sku : "",
        look: p ? p.look : "",
        price: p ? p.price : 0,
        qty: 1,
        delivery,
        deliveryFee: feeOf(delivery),
        colour: hide || "book",
        extras: packed,
        extrasFee: extraSum(packed, 1),
        note: String(f.note||"").trim(),
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
        await fetch("https://formsubmit.co/ajax/" + HOUSE_MAIL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: "SABLE lead — " + lead.name + (lead.sku ? " · "+lead.sku : ""),
            name: lead.name,
            phone: lead.phone,
            sku: lead.sku,
            look: lead.look,
            size: lead.size,
            hide: hideName(lead.colour),
            extras: extraLabel(packed) || "None",
            extrasFee: extraSum(packed, 1) ? zar(extraSum(packed, 1)) : "",
            custom: packed.customNote || "",
            laser: packed.laser ? "yes" : "no",
            delivery: lead.delivery,
            listed: p ? zar(p.price) : "",
            note: lead.note,
            source: "web /want"
          })
        });
      } catch (err) {}
      msg.className = "ok";
      msg.textContent = ok
        ? "With Sable. We will WhatsApp you."
        : "Sent. If we do not reply today, WhatsApp the house.";
      e.target.reset();
      extras = extraFix();
      document.getElementById("custom-note").value = "";
      drawExtras();
      drawHero();
    });
    if (sku && !shoe(sku)) sku = "";
    if (sku) {
      const p = shoe(sku);
      if (p) type = type || p.look;
    }
    draw();

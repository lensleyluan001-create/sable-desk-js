    const HOUSE_MAIL = "lensleyluan001@gmail.com";
    function zar(n){ if(n==null||n==="") return "POA"; return "R"+Number(n).toLocaleString("en-ZA"); }
    function feeOf(d){ return d==="local"?100:d==="int"?300:0; }
    function digits(p){ return String(p||"").replace(/\D/g,""); }
    const params = new URLSearchParams(location.search);
    let type = params.get("type") || "";
    let sku = params.get("sku") || "";
    let size = params.get("size") || "";
    let delivery = "collect";
    const types = ["", ...new Set(PAIRS.map(p => p.look))];
    const typeBox = document.getElementById("types");
    const grid = document.getElementById("grid");
    const ask = document.getElementById("ask");
    const hero = document.getElementById("hero");
    const sizes = document.getElementById("sizes");
    const dels = document.getElementById("dels");
    const msg = document.getElementById("msg");
    function selected(){ return shoe(sku); }
    function setQuery(){
      const q = new URLSearchParams();
      if (type) q.set("type", type);
      if (sku) q.set("sku", sku);
      if (size) q.set("size", size);
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
    function drawGrid(){
      const rows = PAIRS.filter(p => !type || p.look === type);
      if (!rows.length) { grid.innerHTML = '<p class="empty">Nothing in this type.</p>'; return; }
      grid.innerHTML = rows.map(p =>
        '<button class="tile '+(p.sku===sku?"on":"")+'" type="button" data-sku="'+p.sku+'">'+ 
          '<img src="'+p.img+'" alt="'+p.sku+" "+p.look+'" loading="lazy" />'+
          '<div class="pad"><p class="stock">'+p.sku+'</p><p class="meta">'+p.look+'</p><p class="price">'+zar(p.price)+"</p></div>"+
        "</button>"
      ).join("");
      grid.querySelectorAll("[data-sku]").forEach(b => b.onclick = function(){
        sku = b.getAttribute("data-sku") || "";
        const p = selected();
        if (p) type = p.look;
        draw();
        ask.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    function drawHero(){
      const p = selected();
      if (!p) { ask.hidden = true; return; }
      ask.hidden = false;
      hero.innerHTML = '<img src="'+p.img+'" alt="'+p.sku+" "+p.look+'" />'+
        '<div class="pad"><div><p class="stock">'+p.sku+'</p><p class="meta">'+p.look+(size?" · UK "+size:" · size open")+" · "+(delivery==="local"?"Local R100":delivery==="int"?"International R300":"Collect")+'</p></div>'+
        '<div><p class="price">'+zar(p.price + feeOf(delivery))+'</p><p class="kicker">Listed'+(feeOf(delivery)?" + send":"")+"</p></div></div>";
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
      setQuery();
    }
    document.getElementById("want").addEventListener("submit", async function(e){
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      const name = String(f.name||"").trim();
      const phone = String(f.phone||"").trim();
      if (name.length < 2) { msg.className = "err"; msg.textContent = "Need a name."; return; }
      if (digits(phone).length < 9) { msg.className = "err"; msg.textContent = "WhatsApp number."; return; }
      const p = selected();
      const lead = {
        name, phone, size,
        sku: p ? p.sku : "",
        look: p ? p.look : "",
        price: p ? p.price : 0,
        qty: 1,
        delivery,
        deliveryFee: feeOf(delivery),
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
            delivery: lead.delivery,
            listed: p ? zar(p.price) : "",
            note: lead.note,
            source: "web /want"
          })
        });
      } catch (err) {}
      msg.className = "ok";
      msg.textContent = ok
        ? "On the desk. We will WhatsApp you."
        : "Sent. If we do not reply today, WhatsApp the house.";
      e.target.reset();
    });
    if (sku && !shoe(sku)) sku = "";
    if (sku) {
      const p = shoe(sku);
      if (p) type = type || p.look;
    }
    draw();
  
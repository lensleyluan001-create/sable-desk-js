(function () {
  const PHOTO = "https://raw.githubusercontent.com/lensleyluan001-create/sable-looks/main/views/";
  const root = document.getElementById("track");
  function esc(s) {
    return String(s || "").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, """);
  }
  function paint(html) {
    if (root) root.innerHTML = html;
  }
  function tokenOf() {
    try {
      const u = new URL(location.href);
      const q = u.searchParams.get("t") || u.searchParams.get("track") || u.searchParams.get("id") || "";
      if (q) return q;
    } catch (e) {}
    const path = String(location.pathname || "").replace(/\/+$/, "");
    const m = path.match(/\/track\/([^/]+)$/);
    return m ? decodeURIComponent(m[1]) : "";
  }
  function linesHtml(order) {
    const items = order.items || [];
    if (!items.length) return "";
    return '<ul class="track-pairs">' + items.map(function (it) {
      const bits = [it.sku, it.look, it.size ? ("UK " + it.size) : "", it.qty > 1 ? (it.qty + " pairs") : ""].filter(Boolean);
      return "<li>" + esc(bits.join(" · ")) + "</li>";
    }).join("") + "</ul>";
  }
  function shotHtml(order) {
    const sku = order.items && order.items[0] && order.items[0].sku;
    if (!sku) return "";
    const alt = esc((order.items[0].sku || "") + " " + (order.items[0].look || ""));
    return '<div class="track-shot"><img src="' + PHOTO + encodeURIComponent(sku) + '-1.jpg?v=5" alt="' + alt + '" /></div>';
  }
  function stepsHtml(order) {
    const steps = order.steps || [];
    return '<ol class="track-steps" aria-label="Order stage">' + steps.map(function (s) {
      const st = s.state === "done" || s.state === "now" ? s.state : "wait";
      return '<li class="' + st + '"><span class="dot" aria-hidden="true"></span><span class="lab">' + esc(s.label) + "</span></li>";
    }).join("") + "</ol>";
  }
  function found(order) {
    const who = order.name && order.name !== "Your order" ? (esc(order.name) + ", this is your order") : "Your Sable order";
    const ship = order.collect ? "Collect — we will tell you when to come." : "We will send it when it is ready.";
    const lost = order.lost ? '<p class="sub">WhatsApp Sable if you have a question.</p>' : "";
    paint(
      '<p class="kicker">SABLE</p>' +
      "<h1>" + esc(who) + "</h1>" +
      '<p class="track-now">' + esc(order.headline || "Your Sable order.") + "</p>" +
      shotHtml(order) +
      linesHtml(order) +
      '<p class="meta">' + esc(ship) + "</p>" +
      stepsHtml(order) +
      lost +
      '<p class="sub track-foot">Questions? WhatsApp Sable. This page does not take payment.</p>'
    );
  }
  function missing() {
    paint(
      '<p class="kicker">SABLE</p>' +
      "<h1>Order not found</h1>" +
      '<p class="sub">We cannot see that order. Check the link, or WhatsApp Sable and we will help.</p>' +
      '<p class="sub"><a class="client-link" href="/want">Open the collection</a></p>'
    );
  }
  function fail() {
    paint(
      '<p class="kicker">SABLE</p>' +
      "<h1>Your order</h1>" +
      '<p class="sub">Could not load the page. Try again, or WhatsApp Sable.</p>'
    );
  }
  const token = tokenOf();
  if (!token) {
    missing();
    return;
  }
  paint('<p class="kicker">SABLE</p><h1>Your order</h1><p class="sub">Looking it up.</p>');
  fetch("/api/lead?t=" + encodeURIComponent(token))
    .then(function (r) { return r.json(); })
    .then(function (j) {
      if (j && j.order && j.ok !== false) found(j.order);
      else missing();
    })
    .catch(function () { fail(); });
})();

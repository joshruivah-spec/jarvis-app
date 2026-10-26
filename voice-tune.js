/* JARVIS voice tuning: speech rate + voice choice. Front-end only, no secrets, no network.
   Settings stay in this browser (localStorage "jarvis-voice"). */
(function () {
  var ss = window.speechSynthesis;
  if (!ss || !window.SpeechSynthesisUtterance) return;
  var KEY = "jarvis-voice";
  var PREFER = ["Google UK English Female", "Microsoft Sonia", "Microsoft Libby", "Microsoft Aria", "Microsoft Jenny", "Microsoft Zira", "Samantha", "Karen", "Moira", "Google US English"];
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  var cfg = load();
  if (typeof cfg.rate !== "number") cfg.rate = 1.15;
  function pick() {
    var vs = ss.getVoices() || [], i, j;
    if (cfg.voice) { for (i = 0; i < vs.length; i++) if (vs[i].name === cfg.voice) return vs[i]; }
    for (i = 0; i < PREFER.length; i++) for (j = 0; j < vs.length; j++) if (vs[j].name.indexOf(PREFER[i]) !== -1) return vs[j];
    return null;
  }
  var orig = ss.speak.bind(ss);
  ss.speak = function (u) {
    try {
      u.rate = cfg.rate;
      u.pitch = 1.0;
      var v = pick();
      if (v) u.voice = v;
    } catch (e) {}
    return orig(u);
  };
  function build() {
    var box = document.createElement("div");
    box.style.cssText = "position:fixed;left:8px;bottom:8px;z-index:99999;font:12px system-ui,sans-serif;color:#9fe;";
    var btn = document.createElement("button");
    btn.textContent = "Voice";
    btn.style.cssText = "background:#06142a;color:#9fe;border:1px solid #1d6;border-radius:6px;padding:4px 8px;cursor:pointer;opacity:.75";
    var panel = document.createElement("div");
    panel.style.cssText = "display:none;margin-top:6px;background:#06142aee;border:1px solid #1d6;border-radius:8px;padding:8px;width:230px";
    var rl = document.createElement("label");
    rl.style.display = "block";
    var rv = document.createElement("span");
    var rate = document.createElement("input");
    rate.type = "range"; rate.min = "0.8"; rate.max = "1.7"; rate.step = "0.05"; rate.value = String(cfg.rate); rate.style.width = "100%";
    function lab() { rv.textContent = Number(cfg.rate).toFixed(2) + "x"; }
    rl.appendChild(document.createTextNode("Speed ")); rl.appendChild(rv); rl.appendChild(rate);
    var sel = document.createElement("select");
    sel.style.cssText = "width:100%;margin-top:6px;background:#020611;color:#9fe;border:1px solid #1d6";
    function fill() {
      var vs = (ss.getVoices() || []).filter(function (v) { return /^en/i.test(v.lang); });
      sel.innerHTML = "";
      var a = document.createElement("option"); a.value = ""; a.textContent = "Auto (prefers a female voice)"; sel.appendChild(a);
      vs.forEach(function (v) { var o = document.createElement("option"); o.value = v.name; o.textContent = v.name + (v.localService ? "" : " (online)"); sel.appendChild(o); });
      sel.value = cfg.voice || "";
    }
    var test = document.createElement("button");
    test.textContent = "Test voice";
    test.style.cssText = "margin-top:6px;background:#06142a;color:#9fe;border:1px solid #1d6;border-radius:6px;padding:4px 8px;cursor:pointer";
    rate.oninput = function () { cfg.rate = parseFloat(rate.value); save(cfg); lab(); };
    sel.onchange = function () { cfg.voice = sel.value || ""; save(cfg); };
    test.onclick = function () { ss.cancel(); ss.speak(new window.SpeechSynthesisUtterance("Good to go. Say it, and I will answer.")); };
    btn.onclick = function () { panel.style.display = panel.style.display === "none" ? "block" : "none"; };
    panel.appendChild(rl); panel.appendChild(sel); panel.appendChild(test);
    box.appendChild(btn); box.appendChild(panel);
    document.body.appendChild(box);
    lab(); fill();
    if (ss.addEventListener) ss.addEventListener("voiceschanged", fill);
  }
  if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
})();

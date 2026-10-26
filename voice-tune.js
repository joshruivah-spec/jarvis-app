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

  var CSS = [
    ":root{--vt-ink:#d7e8ff;--vt-dim:#7f9bc4;--vt-line:rgba(120,180,255,.22);--vt-glass:rgba(10,22,46,.62);--vt-acc:#59b8ff}",
    "html,body,button,input,select{font-family:Inter,'Segoe UI',system-ui,-apple-system,Roboto,'Helvetica Neue',Arial,sans-serif!important;-webkit-font-smoothing:antialiased}",
    ".stage{background:radial-gradient(90% 70% at 50% -10%,#10285a 0%,#071330 46%,#030812 100%)!important;padding-top:34px!important}",
    ".wordmark{font-size:15px!important;font-weight:600!important;letter-spacing:.5em!important;color:var(--vt-ink)!important;text-shadow:none!important}",
    ".status{display:inline-flex;align-items:center;gap:8px;margin-top:12px!important;padding:5px 14px;border:1px solid var(--vt-line);border-radius:999px;background:var(--vt-glass);font-size:10.5px!important;letter-spacing:.24em!important;font-weight:600;text-indent:0!important}",
    ".status:before{content:'';width:7px;height:7px;border-radius:50%;background:currentColor;box-shadow:0 0 10px currentColor}",
    ".powerHint{font-size:12px!important;letter-spacing:.12em!important;color:var(--vt-dim)!important;font-weight:500}",
    ".caption{font-size:17px!important;line-height:1.5!important;color:var(--vt-ink)!important;opacity:1!important;font-weight:400;max-width:min(640px,88vw)!important}",
    ".log{max-width:min(640px,calc(100% - 32px))!important;gap:10px!important}",
    ".bubble{font-size:14.5px!important;line-height:1.55!important;border-radius:14px!important;padding:11px 15px!important;backdrop-filter:blur(8px)}",
    ".bubble.jarvis{background:var(--vt-glass)!important;border:1px solid var(--vt-line)!important;color:var(--vt-ink)!important}",
    ".bubble.user{background:rgba(70,150,255,.22)!important;border:1px solid rgba(110,180,255,.4)!important}",
    ".voiceBar{gap:12px!important;padding:14px 0!important}",
    ".ctl{border-radius:14px!important;border:1px solid var(--vt-line)!important;background:var(--vt-glass)!important;color:var(--vt-ink)!important;backdrop-filter:blur(8px);transition:border-color .15s,box-shadow .15s,transform .1s}",
    ".ctl:hover:not(:disabled){border-color:var(--vt-acc)!important;box-shadow:0 0 0 3px rgba(89,184,255,.14)}",
    ".ctl:active:not(:disabled){transform:scale(.97)}",
    ".ctl.big{border-radius:50%!important;width:76px!important;height:76px!important;background:linear-gradient(160deg,#1b4f9e,#0e2a5c)!important;border:1px solid rgba(120,190,255,.5)!important}",
    ".mic.live{border-color:#ffd37a!important;box-shadow:0 0 0 4px rgba(255,211,122,.15),0 0 24px rgba(255,211,122,.35)!important}",
    ".send{background:linear-gradient(135deg,#2a7cf0,#4db3ff)!important;color:#04122c!important}",
    ".composer input,.gate input{border-radius:14px!important;border:1px solid var(--vt-line)!important;background:var(--vt-glass)!important;font-size:15px!important}",
    ".footNote,.gateNote{color:var(--vt-dim)!important;font-size:12px!important;letter-spacing:.01em}",
    ".vt-box{position:fixed;top:14px;right:14px;z-index:99999;font-size:12px;color:var(--vt-ink);text-align:right}",
    ".vt-btn{background:var(--vt-glass);color:var(--vt-ink);border:1px solid var(--vt-line);border-radius:999px;padding:7px 14px;font-size:12px;font-weight:500;cursor:pointer;backdrop-filter:blur(8px)}",
    ".vt-btn:hover{border-color:var(--vt-acc)}",
    ".vt-panel{display:none;margin-top:8px;width:250px;text-align:left;background:rgba(8,18,40,.92);border:1px solid var(--vt-line);border-radius:14px;padding:14px;box-shadow:0 12px 40px rgba(0,0,0,.45)}",
    ".vt-panel.vt-open{display:block}",
    ".vt-row{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--vt-dim)}",
    ".vt-row input{display:block;width:100%;margin:8px 0 0;accent-color:var(--vt-acc)}",
    ".vt-row span{color:var(--vt-ink);margin-left:6px}",
    ".vt-sel{display:block;width:100%;margin-top:12px;padding:8px;border-radius:10px;background:#050d20;color:var(--vt-ink);border:1px solid var(--vt-line);font-size:12px}",
    ".vt-test{margin-top:12px;width:100%}",
    "@media(max-width:600px){.vt-box{top:auto;bottom:12px;right:12px;display:flex;flex-direction:column-reverse;align-items:flex-end}.vt-panel{margin:0 0 8px}}"
  ].join("\n");
  function injectCss() { var st = document.createElement("style"); st.textContent = CSS; (document.head || document.documentElement).appendChild(st); }
  injectCss();
  function build() {
    var box = document.createElement("div");
    box.className = "vt-box";
    var btn = document.createElement("button");
    btn.textContent = "Voice settings";
    btn.className = "vt-btn";
    var panel = document.createElement("div");
    panel.className = "vt-panel";
    var rl = document.createElement("label");
    rl.className = "vt-row";
    var rv = document.createElement("span");
    var rate = document.createElement("input");
    rate.type = "range"; rate.min = "0.8"; rate.max = "1.7"; rate.step = "0.05"; rate.value = String(cfg.rate); 
    function lab() { rv.textContent = Number(cfg.rate).toFixed(2) + "x"; }
    rl.appendChild(document.createTextNode("Speed ")); rl.appendChild(rv); rl.appendChild(rate);
    var sel = document.createElement("select");
    sel.className = "vt-sel";
    function fill() {
      var vs = (ss.getVoices() || []).filter(function (v) { return /^en/i.test(v.lang); });
      sel.innerHTML = "";
      var a = document.createElement("option"); a.value = ""; a.textContent = "Auto (prefers a female voice)"; sel.appendChild(a);
      vs.forEach(function (v) { var o = document.createElement("option"); o.value = v.name; o.textContent = v.name + (v.localService ? "" : " (online)"); sel.appendChild(o); });
      sel.value = cfg.voice || "";
    }
    var test = document.createElement("button");
    test.textContent = "Test voice";
    test.className = "vt-btn vt-test";
    rate.oninput = function () { cfg.rate = parseFloat(rate.value); save(cfg); lab(); };
    sel.onchange = function () { cfg.voice = sel.value || ""; save(cfg); };
    test.onclick = function () { ss.cancel(); ss.speak(new window.SpeechSynthesisUtterance("Good to go. Say it, and I will answer.")); };
    btn.onclick = function () { panel.classList.toggle("vt-open"); };
    panel.appendChild(rl); panel.appendChild(sel); panel.appendChild(test);
    box.appendChild(btn); box.appendChild(panel);
    document.body.appendChild(box);
    lab(); fill();
    if (ss.addEventListener) ss.addEventListener("voiceschanged", fill);
  }
  if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
})();

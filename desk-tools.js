/* JARVIS desktop tools: open a site, open/edit one chosen text file with a save preview.
   Runs only in this browser tab. Nothing here is sent to JARVIS, Claude or any server. No secrets. */
(function () {
  var CSS = [
    ".dt-box{position:fixed;top:14px;left:14px;z-index:99998;font-size:12px;color:var(--vt-ink,#d7e8ff)}",
    ".dt-btn{background:var(--vt-glass,rgba(10,22,46,.62));color:inherit;border:1px solid var(--vt-line,rgba(120,180,255,.22));border-radius:999px;padding:7px 14px;font-size:12px;font-weight:500;cursor:pointer;backdrop-filter:blur(8px)}",
    ".dt-btn:hover{border-color:var(--vt-acc,#59b8ff)}",
    ".dt-panel{display:none;margin-top:8px;width:min(340px,calc(100vw - 28px));background:rgba(8,18,40,.94);border:1px solid var(--vt-line,rgba(120,180,255,.22));border-radius:14px;padding:14px;box-shadow:0 12px 40px rgba(0,0,0,.45)}",
    ".dt-panel.dt-open{display:block}",
    ".dt-h{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--vt-dim,#7f9bc4);margin:0 0 6px}",
    ".dt-sec+.dt-sec{margin-top:14px;padding-top:12px;border-top:1px solid var(--vt-line,rgba(120,180,255,.22))}",
    ".dt-row{display:flex;gap:6px}",
    ".dt-in{flex:1;min-width:0;padding:8px 10px;border-radius:10px;background:#050d20;color:inherit;border:1px solid var(--vt-line,rgba(120,180,255,.22));font-size:12px}",
    ".dt-ta{width:100%;height:150px;margin-top:8px;padding:8px;border-radius:10px;background:#050d20;color:inherit;border:1px solid var(--vt-line,rgba(120,180,255,.22));font:12px ui-monospace,Consolas,monospace;resize:vertical}",
    ".dt-diff{margin:8px 0 0;max-height:170px;overflow:auto;padding:8px;border-radius:10px;background:#050d20;border:1px solid var(--vt-line,rgba(120,180,255,.22));font:11px/1.5 ui-monospace,Consolas,monospace;white-space:pre-wrap;word-break:break-word}",
    ".dt-add{color:#7be0a8}.dt-del{color:#ff8f8f}.dt-same{color:var(--vt-dim,#7f9bc4)}",
    ".dt-note{margin-top:6px;font-size:11px;line-height:1.45;color:var(--vt-dim,#7f9bc4)}",
    ".dt-msg{margin-top:6px;font-size:12px;line-height:1.45;color:#ffd37a}",
    "@media(max-width:600px){.dt-box{top:auto;bottom:12px;left:12px;display:flex;flex-direction:column-reverse}.dt-panel{margin:0 0 8px}}"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = CSS; (document.head || document.documentElement).appendChild(st);

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

  function normUrl(v) {
    v = (v || "").trim();
    if (!v || /\s/.test(v)) return null;
    if (!/^[a-z][a-z0-9+.-]*:/i.test(v)) v = "https://" + v;
    var u; try { u = new URL(v); } catch (e) { return null; }
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    if (u.hostname.indexOf(".") < 0) return null;
    return u.href;
  }

  function build() {
    var box = el("div", "dt-box"), btn = el("button", "dt-btn", "Desktop tools"), panel = el("div", "dt-panel");
    btn.onclick = function () { panel.classList.toggle("dt-open"); };

    // --- Typed command (works with dictation tools such as Wispr Flow that type into this box) ---
    var s0 = el("div", "dt-sec");
    s0.appendChild(el("p", "dt-h", "Command"));
    var cmdIn = el("input", "dt-in"); cmdIn.placeholder = "open youtube   |   open example.com   |   open file"; cmdIn.setAttribute("aria-label", "Command");
    cmdIn.style.width = "100%"; var m0 = el("div", "dt-msg");
    var NAMES = { google: "https://www.google.com", gmail: "https://mail.google.com", youtube: "https://www.youtube.com", drive: "https://drive.google.com", sheets: "https://docs.google.com/spreadsheets", docs: "https://docs.google.com/document", calendar: "https://calendar.google.com", maps: "https://maps.google.com" };
    cmdIn.onkeydown = function (e) {
      if (e.key !== "Enter") return;
      var t = cmdIn.value.trim().toLowerCase().replace(/[.!?]+$/, ""), mm = t.match(/^open\s+(.+)$/);
      if (!mm) { m0.textContent = "Only 'open <site>' and 'open file' work here. Nothing was done."; return; }
      var target = mm[1].trim();
      if (target === "file" || target === "a file") { pick.click(); m0.textContent = "Opening the file chooser."; return; }
      var u = NAMES[target] || normUrl(target.replace(/\s+dot\s+/g, "."));
      if (!u) { m0.textContent = "I don't know '" + target + "'. Known names: " + Object.keys(NAMES).join(", ") + ", or type an address like example.com."; return; }
      site.value = u; openSite(); m0.textContent = m1.textContent; cmdIn.value = "";
    };
    s0.appendChild(cmdIn); s0.appendChild(m0);
    s0.appendChild(el("p", "dt-note", "Click here, dictate or type a command, then press Enter. Runs only in this page. Not sent to JARVIS or Claude."));
    // --- Open a site ---
    var s1 = el("div", "dt-sec");
    s1.appendChild(el("p", "dt-h", "Open a website"));
    var r1 = el("div", "dt-row"), site = el("input", "dt-in"), go = el("button", "dt-btn", "Open");
    site.placeholder = "example.com"; site.setAttribute("aria-label", "Website address");
    var m1 = el("div", "dt-msg");
    function openSite() {
      var u = normUrl(site.value);
      if (!u) { m1.textContent = "Enter a web address like example.com."; return false; }
      var a = document.createElement("a"); a.href = u; a.target = "_blank"; a.rel = "noopener noreferrer";
      document.body.appendChild(a); a.click(); a.remove();
      m1.textContent = "Asked the browser to open " + new URL(u).hostname + " in a new tab. If nothing opened, the browser blocked it: allow pop-ups for this site and try again.";
      return true;
    }
    go.onclick = openSite; site.onkeydown = function (e) { if (e.key === "Enter") openSite(); };
    r1.appendChild(site); r1.appendChild(go); s1.appendChild(r1); s1.appendChild(m1);

    // --- Open and edit one text file ---
    var s2 = el("div", "dt-sec");
    s2.appendChild(el("p", "dt-h", "Open and edit a text file"));
    var pick = el("button", "dt-btn", "Choose file...");
    var name = el("div", "dt-note"), ta = el("textarea", "dt-ta"), msg = el("div", "dt-msg");
    var save = el("button", "dt-btn", "Review changes"), confirm = el("button", "dt-btn", "Confirm save"), cancel = el("button", "dt-btn", "Cancel");
    var diffBox = el("pre", "dt-diff"); diffBox.style.display = "none";
    var rowS = el("div", "dt-row"); rowS.style.marginTop = "8px";
    ta.style.display = "none"; rowS.style.display = "none"; confirm.style.display = "none"; cancel.style.display = "none";
    rowS.appendChild(save); rowS.appendChild(confirm); rowS.appendChild(cancel);
    s2.appendChild(pick); s2.appendChild(name); s2.appendChild(ta); s2.appendChild(diffBox); s2.appendChild(rowS); s2.appendChild(msg);
    s2.appendChild(el("p", "dt-note", "Text files only (txt, md, csv, json, up to 1 MB). The file stays on this computer. Nothing is saved until you press Confirm save."));
    var handle = null, original = "", fileName = "";
    var hasFS = typeof window.showOpenFilePicker === "function";

    function show(text, nm) {
      original = text; fileName = nm; ta.value = text; ta.style.display = "block"; rowS.style.display = "flex";
      save.style.display = ""; confirm.style.display = "none"; cancel.style.display = "none";
      name.textContent = nm + " (" + text.length + " characters)"; msg.textContent = "";
    }
    function load(file, h) {
      if (file.size > 1048576) { msg.textContent = "That file is over 1 MB. Pick a smaller text file."; return; }
      if (!/\.(txt|md|csv|json)$/i.test(file.name)) { msg.textContent = "Only .txt, .md, .csv or .json files for now."; return; }
      file.text().then(function (t) { handle = h || null; show(t, file.name); });
    }
    pick.onclick = function () {
      if (hasFS) {
        window.showOpenFilePicker({ multiple: false, types: [{ description: "Text files", accept: { "text/plain": [".txt", ".md", ".csv", ".json"] } }] })
          .then(function (hs) { return hs[0].getFile().then(function (f) { load(f, hs[0]); }); })
          .catch(function (e) { if (e && e.name !== "AbortError") msg.textContent = "Could not open the file: " + (e.message || e.name); });
      } else {
        var i = document.createElement("input"); i.type = "file"; i.accept = ".txt,.md,.csv,.json";
        i.onchange = function () { if (i.files[0]) load(i.files[0], null); }; i.click();
      }
    };
    function diffLines(a, b) {
      var A = a.split("\n"), B = b.split("\n"), n = A.length, m = B.length, out = [], i, j;
      if (n * m > 4000000) { return null; }
      var L = []; for (i = 0; i <= n; i++) { L.push(new Array(m + 1).fill(0)); }
      for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
      i = 0; j = 0;
      while (i < n && j < m) { if (A[i] === B[j]) { out.push([" ", A[i]]); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) { out.push(["-", A[i]]); i++; } else { out.push(["+", B[j]]); j++; } }
      while (i < n) out.push(["-", A[i++]]);
      while (j < m) out.push(["+", B[j++]]);
      return out;
    }
    function renderDiff(a, b) {
      diffBox.textContent = "";
      var d = diffLines(a, b);
      if (!d) { diffBox.textContent = "File too large to compare line by line here. " + a.length + " to " + b.length + " characters."; return; }
      var shown = 0, changed = 0;
      d.forEach(function (r, k) {
        if (r[0] === " ") {
          var near = false, q; for (q = Math.max(0, k - 2); q <= Math.min(d.length - 1, k + 2); q++) if (d[q][0] !== " ") near = true;
          if (!near) return;
        } else changed++;
        if (shown++ > 400) return;
        var sp = el("div", r[0] === "+" ? "dt-add" : r[0] === "-" ? "dt-del" : "dt-same", r[0] + " " + r[1]); diffBox.appendChild(sp);
      });
      if (shown > 400) diffBox.appendChild(el("div", "dt-same", "... more changes not shown (" + changed + " changed lines in total)"));
    }
    save.onclick = function () {
      if (ta.value === original) { msg.textContent = "No changes to save."; return; }
      renderDiff(original, ta.value); diffBox.style.display = "block";
      msg.textContent = "Check the changes above (- removed, + added). " + (handle ? "Confirm save overwrites " + fileName + "." : "This browser cannot overwrite files; Confirm downloads an edited copy and leaves the original untouched.");
      save.style.display = "none"; confirm.style.display = ""; cancel.style.display = "";
    };
    cancel.onclick = function () { diffBox.style.display = "none"; save.style.display = ""; confirm.style.display = "none"; cancel.style.display = "none"; msg.textContent = "Not saved."; };
    confirm.onclick = function () {
      var txt = ta.value;
      if (handle) {
        handle.requestPermission({ mode: "readwrite" }).then(function (p) {
          if (p !== "granted") throw new Error("Permission to write was not given.");
          return handle.createWritable();
        }).then(function (w) { return w.write(txt).then(function () { return w.close(); }); })
          .then(function () { original = txt; diffBox.style.display = "none"; msg.textContent = "Saved " + fileName + "."; save.style.display = ""; confirm.style.display = "none"; cancel.style.display = "none"; })
          .catch(function (e) { msg.textContent = "Not saved: " + (e.message || e.name); });
      } else {
        var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
        a.download = fileName.replace(/(\.[^.]+)$/, " (edited)$1"); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
        diffBox.style.display = "none"; msg.textContent = "Download started for an edited copy. The original is unchanged. If no file appeared, check the browser download settings."; save.style.display = ""; confirm.style.display = "none"; cancel.style.display = "none";
      }
    };

    panel.appendChild(s0); panel.appendChild(s1); panel.appendChild(s2); box.appendChild(btn); box.appendChild(panel); document.body.appendChild(box);
    window.__dtNormUrl = normUrl;
  }
  if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
})();

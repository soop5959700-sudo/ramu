/* Shared helpers + inquiry modal for sub pages. Load order: supabase.js -> common.js -> page logic -> fx.js */

function esc(s) {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function soopAvatar(id) {
  if (!id) return null;
  id = String(id).trim().toLowerCase();
  if (id.length < 2) return null;
  return "https://profile.img.sooplive.co.kr/LOGO/" + id.slice(0, 2) + "/" + id + "/" + id + ".jpg";
}

function fmtDate(s) {
  try {
    var d = new Date(s);
    if (isNaN(d)) return "";
    return String(d.getFullYear()).slice(2) + "." + String(d.getMonth() + 1).padStart(2, "0") + "." + String(d.getDate()).padStart(2, "0");
  } catch (e) { return ""; }
}

/* Embed-safe overlay placement: absolute box anchored near the last click. */
function placeOverlay(ov) {
  var e = window.event, y = 200;
  if (e) { y = (e.pageY != null ? e.pageY : (e.clientY || 0)); }
  ov.style.top = Math.max(10, y - 80) + "px";
  ov.classList.add("show");
}

function openAsk() {
  var bg = document.getElementById("askmaskbg");
  if (bg) bg.classList.add("show");
  placeOverlay(document.getElementById("askmask"));
  setTimeout(function () { var t = document.getElementById("askmsg"); if (t) t.focus(); }, 60);
}

function closeAsk() {
  var m = document.getElementById("askmask");
  var bg = document.getElementById("askmaskbg");
  if (m) m.classList.remove("show");
  if (bg) bg.classList.remove("show");
}

async function sendAsk() {
  var t = document.getElementById("askmsg");
  var v = (t.value || "").trim();
  if (!v) { alert("내용을 입력해주세요"); return; }
  var ok = await insertRow("inquiries", { message: v });
  alert(ok ? "라무에게 전해졌어요" : "전송에 실패했어요. 잠시 후 다시 시도해 주세요.");
  if (ok) { t.value = ""; closeAsk(); }
}

(function () {
  var m = document.getElementById("askmask");
  if (m) m.addEventListener("click", function (e) { if (e.target.id === "askmask") closeAsk(); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeAsk();
    if (typeof closeModal === "function") closeModal();
    if (typeof closeLb === "function") closeLb();
  });
})();

/* One shared profile fetch per page: nav pill + footer links stay admin-editable everywhere. */
window.profileData = (async function () {
  try {
    var r = await db.from("profile").select("data").eq("id", 1);
    return (r.data && r.data[0] && r.data[0].data) || {};
  } catch (e) { return {}; }
})();

window.profileData.then(function (d) {
  function str(k) { return (typeof d[k] === "string" && d[k].trim()) ? d[k].trim() : ""; }
  var live = document.getElementById("nav-live");
  if (live) {
    if (str("main-live")) live.textContent = str("main-live");
    if (str("link-soop")) live.href = str("link-soop");
  }
  [["foot-soop", "link-soop"], ["foot-youtube", "link-youtube"], ["foot-cafe", "link-cafe"]].forEach(function (p) {
    var a = document.getElementById(p[0]);
    if (a && str(p[1])) a.href = str(p[1]);
  });
});

/* Theme toggle: dark is the site default, 'light' is the saved opt-in (기능배선_공통 §5). */
(function () {
  var box = document.getElementById("themeSwitch");
  if (!box) return;
  box.onclick = function () {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
  };
})();

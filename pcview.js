/* PC view for in-app browsers (?pc=1)
   The app webview cannot render nested iframes and resets its own zoom, so neither the
   wrapper nor a wide viewport works there. Instead:
     1. drop every mobile media rule from our own stylesheets, so the desktop rules win
     2. lay the document out at DESIGN px
     3. shrink it with CSS zoom, which is content-level and survives the webview's zoom reset
   Load order: right after the stylesheets, before the page scripts. */

(function () {
  var DESIGN = 1180;
  if (location.search.indexOf('pc=1') === -1) return;

  document.documentElement.setAttribute('data-pc', '1');

  var mv = document.querySelector('meta[name="viewport"]');
  if (mv) mv.setAttribute('content', 'width=device-width, initial-scale=1');

  function stripMobileRules(sheet) {
    var rules;
    try { rules = sheet.cssRules; } catch (e) { return; }   /* cross-origin sheet */
    if (!rules) return;
    for (var i = rules.length - 1; i >= 0; i--) {
      var r = rules[i];
      if (r.type === 4) {                                   /* CSSMediaRule */
        var t = r.conditionText || (r.media && r.media.mediaText) || '';
        var m = /max-width:\s*(\d+)px/.exec(t);
        if (m && parseInt(m[1], 10) <= DESIGN) {
          try { sheet.deleteRule(i); } catch (e) {}
        }
      }
    }
  }

  /* vw/vh do not follow CSS zoom: containers sized in vw would stay phone-narrow.
     Restate the few width/height rules that depend on them, in DESIGN px. */
  function injectOverrides() {
    if (document.getElementById('pcview-css')) return;
    if (!document.head) return;
    var css =
      'body.pcview .page-shell, body.pcview .site-footer { width: 1085px; margin-left: auto; margin-right: auto; }' +
      'body.pcview .nav-shell { padding: 0 46px; }' +
      'body.pcview .main-cover { width: 1180px !important; height: 664px !important; min-height: 0 !important; aspect-ratio: auto !important; margin: 0 auto !important; }' +
      'body.pcview .cover-bg { height: 664px !important; min-height: 0 !important; top: 0 !important; }' +
      'body.pcview .page-heading { padding: 106px 0 53px; }' +
      'body.pcview .page-title { font-size: 94px; }' +
      'body.pcview .page-lead { font-size: 17px; }' +
      'body.pcview .panel-title { font-size: 30px; }' +
      'body.pcview .glass-panel { padding: 26px; }';
    var st = document.createElement('style');
    st.id = 'pcview-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function apply() {
    injectOverrides();
    for (var i = 0; i < document.styleSheets.length; i++) stripMobileRules(document.styleSheets[i]);
    document.documentElement.style.zoom = (window.innerWidth / DESIGN);
    if (document.body) {
      document.body.style.minWidth = DESIGN + 'px';
      document.body.classList.add('pcview');
    }
  }

  apply();
  document.addEventListener('DOMContentLoaded', apply);
  window.addEventListener('load', apply);
  window.addEventListener('resize', function () {
    document.documentElement.style.zoom = (window.innerWidth / DESIGN);
  });
})();

(() => {
  const base = '/demos/subchefe';
  // Inside the portfolio's phone frame the app should look like it does on a phone: no desktop
  // scrollbars, and a bottom inset like the gesture area that keeps the tab labels off the edge.
  if (window.parent !== window) {
    const style = document.createElement('style');
    style.textContent = '*{scrollbar-width:none}*::-webkit-scrollbar{display:none}html,body{background:#fff}#root{height:calc(100% - 18px)!important}' +
      // The web tab bar keeps the native 49px height, which squeezes the labels under the icons.
      'div:has(> div > div > a[role=tab]){height:58px!important}a[role=tab]>div[dir=auto]{flex-shrink:0}';
    document.head.append(style);
  }
  if (location.pathname.endsWith('/index.html')) history.replaceState(null, '', `${base}/`);
  const reportRoute = () => {
    const route = location.pathname.replace(base, '') || '/';
    window.parent.postMessage({ type: 'subchefe-demo:route', route }, location.origin);
  };
  for (const name of ['pushState', 'replaceState']) {
    const original = history[name].bind(history);
    history[name] = (...args) => { const result = original(...args); reportRoute(); return result; };
  }
  window.addEventListener('popstate', reportRoute);
  window.addEventListener('load', reportRoute);
})();

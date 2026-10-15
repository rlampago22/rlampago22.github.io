(() => {
  const base = '/demos/subchefe';
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

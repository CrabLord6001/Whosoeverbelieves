/* Maps, Charts & Timelines — save any chart (svg.cv) as a PNG in the current theme */
function downloadChart(svgId, filename) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  const cs = getComputedStyle(document.documentElement);
  const val = n => cs.getPropertyValue('--' + n).trim();
  const resolve = t => t.replace(/var\(--([\w-]+)(?:,[^)]*)?\)/g, (m, n) => val(n));
  let css = '';
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch (e) { continue; }
    for (const r of rules) if (r.selectorText && r.selectorText.includes('svg.cv')) css += resolve(r.cssText) + '\n';
  }
  const vb = svg.viewBox.baseVal, scale = 2, foot = 28;
  const clone = svg.cloneNode(true);
  clone.setAttribute('width', vb.width); clone.setAttribute('height', vb.height);
  const st = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  st.textContent = css; clone.insertBefore(st, clone.firstChild);
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = vb.width * scale; c.height = (vb.height + foot) * scale;
    const x = c.getContext('2d'); x.scale(scale, scale);
    x.fillStyle = val('bg'); x.fillRect(0, 0, vb.width, vb.height + foot);
    x.drawImage(img, 0, 0);
    x.fillStyle = val('text-faint'); x.font = '12px Georgia, serif'; x.textAlign = 'right';
    x.fillText('whosoeverbelieves.com', vb.width - 16, vb.height + 16);
    const a = document.createElement('a'); a.download = filename; a.href = c.toDataURL('image/png'); a.click();
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
}

/* Enlarge any chart to fill the screen, with zoom controls (for easier reading) */
function enlargeChart(svgId, title) {
  const svg = document.getElementById(svgId);
  if (!svg || document.querySelector('.cz-overlay')) return;
  const home = document.createComment('chart-home');
  svg.parentNode.insertBefore(home, svg);
  const vb = svg.viewBox.baseVal;
  const ov = document.createElement('div');
  ov.className = 'cz-overlay'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
  ov.innerHTML = '<div class="cz-bar"><span class="cz-title"></span>' +
    '<button type="button" data-z="-" aria-label="Zoom out">&#8722;</button><span class="cz-pct"></span>' +
    '<button type="button" data-z="+" aria-label="Zoom in">+</button>' +
    '<button type="button" data-z="fit">Fit</button>' +
    '<button type="button" class="cz-close" aria-label="Close">Close &#10005;</button></div><div class="cz-body"></div>';
  ov.querySelector('.cz-title').textContent = title || (svg.querySelector('title') || {}).textContent || 'Chart';
  const body = ov.querySelector('.cz-body');
  body.appendChild(svg);
  document.body.appendChild(ov); document.body.classList.add('cz-open');
  let fit = 1, z = 1;
  function measure() {
    const bw = body.clientWidth - 32, bh = body.clientHeight - 32;
    fit = Math.min(bw / vb.width, bh / vb.height);
  }
  function apply() {
    svg.style.width = (vb.width * fit * z) + 'px';
    ov.querySelector('.cz-pct').textContent = Math.round(z * 100) + '%';
  }
  measure(); apply();
  const onResize = () => { measure(); apply(); };
  window.addEventListener('resize', onResize);
  ov.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('cz-close')) return close();
    const k = b.dataset.z;
    if (k === '+') z = Math.min(z * 1.25, 4);
    else if (k === '-') z = Math.max(z / 1.25, 0.5);
    else z = 1;
    apply();
  });
  function onKey(e) { if (e.key === 'Escape') close(); }
  document.addEventListener('keydown', onKey);
  function close() {
    svg.style.width = '';
    home.parentNode.insertBefore(svg, home); home.remove();
    ov.remove(); document.body.classList.remove('cz-open');
    window.removeEventListener('resize', onResize); document.removeEventListener('keydown', onKey);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }
  if (ov.requestFullscreen && window.matchMedia('(min-width: 761px)').matches) ov.requestFullscreen().then(onResize).catch(() => {});
  ov.querySelector('.cz-close').focus();
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ch-scroll svg.cv').forEach(svg => {
    svg.addEventListener('click', () => enlargeChart(svg.id));
  });
});

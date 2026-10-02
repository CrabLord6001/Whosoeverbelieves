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
  const vb = svg.viewBox.baseVal, scale = 2;
  const sec = svg.closest('section');
  let keys = sec ? [...sec.querySelectorAll('.ch-legend span')].map(sp => ({
    text: sp.textContent.trim(), color: getComputedStyle(sp, '::before').backgroundColor })) : [];
  if (!keys.length && sec) keys = [...sec.querySelectorAll('.mp-btn .sw')].map(sw => {
    const cs2 = getComputedStyle(sw); let col = cs2.backgroundColor;
    if (!col || col === 'rgba(0, 0, 0, 0)') { const m = cs2.backgroundImage.match(/rgba?\([^)]*\)/); col = m ? m[0] : val('text-mid'); }
    return { text: sw.parentElement.textContent.trim(), color: col }; });
  const est = keys.reduce((s, k) => s + k.text.length * 8 + 46, 0);
  const foot = keys.length ? 36 + 22 * Math.ceil(est / (vb.width - 170)) : 28;
  const clone = svg.cloneNode(true);
  clone.setAttribute('width', vb.width); clone.setAttribute('height', vb.height);
  clone.querySelectorAll('[style]').forEach(el => el.setAttribute('style', resolve(el.getAttribute('style'))));
  const st = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  st.textContent = css; clone.insertBefore(st, clone.firstChild);
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = vb.width * scale; c.height = (vb.height + foot) * scale;
    const x = c.getContext('2d'); x.scale(scale, scale);
    x.fillStyle = val('bg'); x.fillRect(0, 0, vb.width, vb.height + foot);
    x.drawImage(img, 0, 0);
    let kx = 20; x.font = '15px Georgia, serif'; x.textAlign = 'left';
    let ky = vb.height + 10;
    keys.forEach(k => {
      const w = 18 + x.measureText(k.text).width + 28;
      if (kx + w > vb.width - 150 && kx > 20) { kx = 20; ky += 22; }
      x.fillStyle = k.color; x.fillRect(kx, ky, 12, 12);
      x.fillStyle = val('text-mid'); x.fillText(k.text, kx + 18, ky + 11);
      kx += w;
    });
    x.fillStyle = val('text-faint'); x.font = '12px Georgia, serif'; x.textAlign = 'right';
    x.fillText('whosoeverbelieves.com', vb.width - 16, vb.height + foot - 12);
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
  // bring the chart's key (legend) and any map buttons along, and put them back on close
  const sec = home.parentNode.closest('section');
  const extras = sec ? [sec.querySelector('.mp-controls'), sec.querySelector('.ch-legend')].filter(Boolean) : [];
  const moved = [];
  if (extras.length) {
    const keyBox = document.createElement('div'); keyBox.className = 'cz-key';
    extras.forEach(el => { const mark = document.createComment('key-home'); el.parentNode.insertBefore(mark, el); moved.push([el, mark]); keyBox.appendChild(el); });
    ov.insertBefore(keyBox, body);
  }
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
    moved.forEach(([el, mark]) => { mark.parentNode.insertBefore(el, mark); mark.remove(); });
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

/* "On this page" sidebar for wide screens: built from the page's section headings */
document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('.ch-main');
  if (!main || main.querySelector('.mc-grid')) return;
  const heads = [...main.querySelectorAll(':scope > section .ch-head h2[id], :scope > section > h2[id]')];
  if (heads.length < 4) return;
  const nav = document.createElement('aside');
  nav.className = 'ch-toc'; nav.setAttribute('aria-label', 'On this page');
  nav.innerHTML = '<b>On this page</b><ol>' + heads.map(h =>
    `<li><a href="#${h.id}">${h.textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</a></li>`).join('') + '</ol>';
  document.body.appendChild(nav);
  const links = [...nav.querySelectorAll('a')];
  links.forEach((a, i) => a.addEventListener('click', e => {
    e.preventDefault(); heads[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#' + heads[i].id);
  }));
  let ticking = false;
  function update() {
    ticking = false;
    let cur = 0;
    heads.forEach((h, i) => { if (h.getBoundingClientRect().top < 160) cur = i; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = heads.length - 1;
    links.forEach((a, i) => a.classList.toggle('on', i === cur));
    const r = main.getBoundingClientRect();
    nav.classList.toggle('hide', r.bottom < nav.offsetTop + nav.offsetHeight + 40);
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
});

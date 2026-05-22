export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const [contentCell, imageCell] = row.children;

  const tagEl = contentCell?.querySelector('p:first-child');
  const titleEl = contentCell?.querySelector('h2, h3');
  const links = [...(contentCell?.querySelectorAll('a') ?? [])];

  const bodyEls = [...(contentCell?.querySelectorAll('p') ?? [])].filter(
    (p) => p !== tagEl && !p.querySelector('a') && p.textContent.trim(),
  );

  const picture = imageCell?.querySelector('picture');

  block.innerHTML = '';

  const inner = document.createElement('div');
  inner.className = 'section-promo-inner';

  const content = document.createElement('div');
  content.className = 'section-promo-content';

  if (tagEl?.textContent.trim()) {
    const tag = document.createElement('p');
    tag.className = 'section-promo-tag';
    tag.textContent = tagEl.textContent.trim();
    content.append(tag);
  }

  if (titleEl) {
    const title = document.createElement('h2');
    title.className = 'section-promo-title';
    title.textContent = titleEl.textContent.trim();
    content.append(title);
  }

  bodyEls.forEach((p) => {
    const body = document.createElement('p');
    body.className = 'section-promo-body';
    body.textContent = p.textContent.trim();
    content.append(body);
  });

  if (links.length) {
    const ctas = document.createElement('div');
    ctas.className = 'section-promo-ctas';

    links.forEach((link, i) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      a.className = i === 0 ? 'section-promo-cta-primary' : 'section-promo-cta-secondary';
      ctas.append(a);
    });

    content.append(ctas);
  }

  inner.append(content);

  if (picture) {
    const imageWrap = document.createElement('div');
    imageWrap.className = 'section-promo-image';
    imageWrap.append(picture);
    inner.append(imageWrap);
  }

  block.append(inner);
}

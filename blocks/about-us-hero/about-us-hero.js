export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const [contentCell, imageCell] = row.children;

  const tagEl = contentCell?.querySelector('h3');
  const titleEl = contentCell?.querySelector('h1');
  const bodyEl = contentCell?.querySelector('h2');
  const links = [...(contentCell?.querySelectorAll('a') ?? [])];
  const picture = imageCell?.querySelector('picture');

  block.innerHTML = '';

  const inner = document.createElement('div');
  inner.className = 'about-us-hero-inner';

  const content = document.createElement('div');
  content.className = 'about-us-hero-content';

  if (tagEl) {
    const tag = document.createElement('p');
    tag.className = 'about-us-hero-tag';
    tag.textContent = tagEl.textContent.trim();
    content.append(tag);
  }

  if (titleEl) {
    const title = document.createElement('h2');
    title.className = 'about-us-hero-title';
    title.textContent = titleEl.textContent.trim();
    content.append(title);
  }

  if (bodyEl) {
    const body = document.createElement('p');
    body.className = 'about-us-hero-body';
    body.textContent = bodyEl.textContent.trim();
    content.append(body);
  }

  if (links.length) {
    const ctas = document.createElement('div');
    ctas.className = 'about-us-hero-ctas';
    links.forEach((link, i) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      a.className = i === 0 ? 'about-us-hero-cta-primary' : 'about-us-hero-cta-secondary';
      ctas.append(a);
    });
    content.append(ctas);
  }

  inner.append(content);

  if (picture) {
    const imageWrap = document.createElement('div');
    imageWrap.className = 'about-us-hero-image';
    imageWrap.append(picture);
    inner.append(imageWrap);
  }

  block.append(inner);
}

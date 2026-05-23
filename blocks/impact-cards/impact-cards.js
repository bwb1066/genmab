const CARD_THEMES = [
  { bg: '#ffbd00', color: '#1a1a1a' },
  { bg: '#691a6c', color: '#fff' },
  { bg: '#0c736d', color: '#fff' },
];

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const introCell = rows[0]?.children[0];
  const titleEls = [...(introCell?.querySelectorAll('h1') ?? [])];
  const bodyEl = introCell?.querySelector('h2');
  const cardRows = rows.slice(1);

  block.innerHTML = '';

  const inner = document.createElement('div');
  inner.className = 'impact-cards-inner';

  // Header
  const header = document.createElement('div');
  header.className = 'impact-cards-header';

  const titleWrap = document.createElement('div');
  titleWrap.className = 'impact-cards-title-wrap';

  if (titleEls.length) {
    const h2 = document.createElement('h2');
    h2.className = 'impact-cards-title';
    h2.textContent = titleEls.map((el) => el.textContent.trim()).join(' ');
    titleWrap.append(h2);
  }

  header.append(titleWrap);

  if (bodyEl) {
    const body = document.createElement('p');
    body.className = 'impact-cards-body';
    body.textContent = bodyEl.textContent.trim();
    header.append(body);
  }

  inner.append(header);

  // Cards
  const grid = document.createElement('div');
  grid.className = 'impact-cards-grid';

  cardRows.forEach((row, i) => {
    const [linkCell, contentCell] = row.children;
    const linkEl = linkCell?.querySelector('a');
    const picture = linkCell?.querySelector('picture');
    const titleEl = contentCell?.querySelector('h1');
    const subtitleEl = contentCell?.querySelector('h2');
    const theme = CARD_THEMES[i % CARD_THEMES.length];

    const card = document.createElement('a');
    card.className = 'impact-cards-card';
    if (linkEl?.href) card.href = linkEl.href;
    card.style.backgroundColor = theme.bg;
    card.style.color = theme.color;

    // Background image layer (revealed on hover)
    if (picture) {
      const bg = document.createElement('div');
      bg.className = 'impact-cards-card-bg';
      bg.append(picture);
      card.append(bg);
    }

    // Dark overlay layer
    const overlay = document.createElement('div');
    overlay.className = 'impact-cards-card-overlay';
    card.append(overlay);

    // Content layer
    const content = document.createElement('div');
    content.className = 'impact-cards-card-content';

    if (titleEl) {
      const title = document.createElement('h3');
      title.className = 'impact-cards-card-title';
      title.textContent = titleEl.textContent.trim();
      content.append(title);
    }

    if (subtitleEl) {
      const subtitle = document.createElement('p');
      subtitle.className = 'impact-cards-card-subtitle';
      subtitle.textContent = subtitleEl.textContent.trim();
      content.append(subtitle);
    }

    const arrow = document.createElement('span');
    arrow.className = 'impact-cards-card-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '›';
    content.append(arrow);

    card.append(content);
    grid.append(card);
  });

  inner.append(grid);
  block.append(inner);
}

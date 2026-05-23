export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const headerCell = rows[0]?.children[0];
  const titleEl = headerCell?.querySelector('h1');
  const storyRows = rows.slice(1);

  block.innerHTML = '';

  const inner = document.createElement('div');
  inner.className = 'featured-stories-cards-inner';

  // Header
  const header = document.createElement('div');
  header.className = 'featured-stories-cards-header';

  if (titleEl) {
    const title = document.createElement('h2');
    title.className = 'featured-stories-cards-title';
    title.textContent = titleEl.textContent.trim();
    header.append(title);
  }

  inner.append(header);

  // Grid
  const grid = document.createElement('div');
  grid.className = 'featured-stories-cards-grid';

  // Featured card (first story row)
  const featRow = storyRows[0];
  if (featRow) {
    const [mediaCell, contentCell] = featRow.children;
    const linkEl = mediaCell?.querySelector('a');
    const picture = mediaCell?.querySelector('picture');
    const allPs = [...(contentCell?.querySelectorAll('p') ?? [])];
    const tagEl = allPs[0];
    const titleEl2 = contentCell?.querySelector('h2');
    const dateEl = allPs[1];

    const card = document.createElement('a');
    card.className = 'featured-stories-cards-feature';
    if (linkEl?.href) card.href = linkEl.href;

    if (picture) {
      const bg = document.createElement('div');
      bg.className = 'featured-stories-cards-feature-bg';
      bg.append(picture);
      card.append(bg);
    }

    const overlay = document.createElement('div');
    overlay.className = 'featured-stories-cards-feature-overlay';
    card.append(overlay);

    const content = document.createElement('div');
    content.className = 'featured-stories-cards-feature-content';

    if (tagEl?.textContent.trim()) {
      const tag = document.createElement('span');
      tag.className = 'featured-stories-cards-tag';
      tag.textContent = tagEl.textContent.trim();
      content.append(tag);
    }

    const bottom = document.createElement('div');
    bottom.className = 'featured-stories-cards-feature-bottom';

    if (titleEl2) {
      const t = document.createElement('h3');
      t.className = 'featured-stories-cards-feature-title';
      t.textContent = titleEl2.textContent.trim();
      bottom.append(t);
    }

    if (dateEl?.textContent.trim()) {
      const d = document.createElement('p');
      d.className = 'featured-stories-cards-feature-date';
      d.textContent = dateEl.textContent.trim();
      bottom.append(d);
    }

    content.append(bottom);
    card.append(content);
    grid.append(card);
  }

  // Secondary cards list (rows 2–4)
  if (storyRows.length > 1) {
    const list = document.createElement('div');
    list.className = 'featured-stories-cards-list';

    storyRows.slice(1).forEach((row) => {
      const [mediaCell, contentCell] = row.children;
      const linkEl = mediaCell?.querySelector('a');
      const picture = mediaCell?.querySelector('picture');
      const allPs = [...(contentCell?.querySelectorAll('p') ?? [])];
      const tagEl = allPs[0];
      const titleEl2 = contentCell?.querySelector('h2');
      const dateEl = allPs[1];

      const card = document.createElement('a');
      card.className = 'featured-stories-cards-item';
      if (linkEl?.href) card.href = linkEl.href;

      if (picture) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'featured-stories-cards-item-image';
        imgWrap.append(picture);
        card.append(imgWrap);
      }

      const content = document.createElement('div');
      content.className = 'featured-stories-cards-item-content';

      if (tagEl?.textContent.trim()) {
        const tag = document.createElement('span');
        tag.className = 'featured-stories-cards-tag';
        tag.textContent = tagEl.textContent.trim();
        content.append(tag);
      }

      if (titleEl2) {
        const t = document.createElement('h3');
        t.className = 'featured-stories-cards-item-title';
        t.textContent = titleEl2.textContent.trim();
        content.append(t);
      }

      if (dateEl?.textContent.trim()) {
        const d = document.createElement('p');
        d.className = 'featured-stories-cards-item-date';
        d.textContent = dateEl.textContent.trim();
        content.append(d);
      }

      card.append(content);
      list.append(card);
    });

    grid.append(list);
  }

  inner.append(grid);
  block.append(inner);
}

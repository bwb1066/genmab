export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const [imageCell, contentCell] = row.children;
  const picture = imageCell?.querySelector('picture');

  const allChildren = [...(contentCell?.children ?? [])];
  const tagEl = allChildren.find((el) => el.tagName === 'P' && !el.querySelector('a'));
  const titleEl = allChildren.find((el) => el.tagName === 'H1' && !el.querySelector('picture'));
  const descEl = allChildren.find((el) => el.tagName === 'H3');
  const hr = contentCell?.querySelector('hr');

  let ctaText = null;
  if (hr && descEl) {
    let node = descEl.nextElementSibling;
    while (node && node !== hr) {
      if (node.tagName === 'P' && !node.querySelector('a')) {
        ctaText = node.textContent.trim();
        break;
      }
      node = node.nextElementSibling;
    }
  }

  const stats = [];
  if (hr) {
    let node = hr.nextElementSibling;
    while (node) {
      if (node.tagName === 'H3') {
        const stat = {
          label: node.textContent.trim(),
          footnote: null,
          link: null,
          linkText: null,
          number: null,
        };
        node = node.nextElementSibling;
        while (node && node.tagName !== 'H3') {
          if (node.tagName === 'H1') {
            stat.number = node.textContent.trim();
            node = node.nextElementSibling;
            break;
          }
          if (node.tagName === 'P' && node.querySelector('a')) {
            const a = node.querySelector('a');
            stat.link = a.href;
            stat.linkText = a.textContent.trim();
          } else if (node.tagName === 'P') {
            stat.footnote = node.textContent.trim();
          }
          node = node.nextElementSibling;
        }
        stats.push(stat);
      } else {
        node = node.nextElementSibling;
      }
    }
  }

  block.innerHTML = '';

  const inner = document.createElement('div');
  inner.className = 'antibody-science-hero-inner';

  const header = document.createElement('div');
  header.className = 'antibody-science-hero-header';

  if (tagEl) {
    const tag = document.createElement('p');
    tag.className = 'antibody-science-hero-tag';
    tag.textContent = tagEl.textContent.trim();
    header.append(tag);
  }

  if (titleEl) {
    const title = document.createElement('h2');
    title.className = 'antibody-science-hero-title';
    title.textContent = titleEl.textContent.trim();
    header.append(title);
  }

  inner.append(header);

  const body = document.createElement('div');
  body.className = 'antibody-science-hero-body';

  if (picture) {
    const imageWrap = document.createElement('div');
    imageWrap.className = 'antibody-science-hero-image';
    imageWrap.append(picture);
    body.append(imageWrap);
  }

  const content = document.createElement('div');
  content.className = 'antibody-science-hero-content';

  if (descEl) {
    const desc = document.createElement('p');
    desc.className = 'antibody-science-hero-desc';
    desc.textContent = descEl.textContent.trim();
    content.append(desc);
  }

  if (ctaText) {
    const cta = document.createElement('button');
    cta.type = 'button';
    cta.className = 'antibody-science-hero-cta';
    cta.textContent = ctaText.toUpperCase();
    content.append(cta);
  }

  if (stats.length) {
    const statsEl = document.createElement('div');
    statsEl.className = 'antibody-science-hero-stats';

    stats.forEach((stat) => {
      const statEl = document.createElement('div');
      statEl.className = 'antibody-science-hero-stat';

      const statMain = document.createElement('div');
      statMain.className = 'antibody-science-hero-stat-main';

      const statLeft = document.createElement('div');
      statLeft.className = 'antibody-science-hero-stat-left';

      const labelEl = document.createElement('p');
      labelEl.className = 'antibody-science-hero-stat-label';
      labelEl.textContent = stat.label;
      statLeft.append(labelEl);

      if (stat.footnote) {
        const footnoteEl = document.createElement('p');
        footnoteEl.className = 'antibody-science-hero-stat-footnote';
        footnoteEl.textContent = stat.footnote;
        statLeft.append(footnoteEl);
      }

      if (stat.link) {
        const linkEl = document.createElement('a');
        linkEl.href = stat.link;
        linkEl.className = 'antibody-science-hero-stat-link';
        linkEl.textContent = stat.linkText;
        statLeft.append(linkEl);
      }

      statMain.append(statLeft);

      if (stat.number) {
        const numberEl = document.createElement('span');
        numberEl.className = 'antibody-science-hero-stat-number';
        numberEl.textContent = stat.number;
        statMain.append(numberEl);
      }

      statEl.append(statMain);
      statsEl.append(statEl);
    });

    content.append(statsEl);
  }

  body.append(content);
  inner.append(body);
  block.append(inner);
}

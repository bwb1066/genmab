import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const REGIONAL_PATTERNS = [/\.fr\.genmab\.com$/, /\.de\.genmab\.com$/, /\.jp\.genmab\.com$/, /\.us\.genmab\.com$/];

function isRegional(href) {
  try {
    const { hostname } = new URL(href);
    return REGIONAL_PATTERNS.some((re) => re.test(hostname));
  } catch {
    return false;
  }
}

function parseNavColumn(cell) {
  const topLi = cell.querySelector('ul > li');
  if (!topLi) return null;
  const heading = topLi.querySelector(':scope > p')?.textContent.trim() ?? '';
  const links = [...topLi.querySelectorAll(':scope > ul > li > a')].map((a) => ({
    text: a.textContent.trim(),
    href: a.href,
    external: isRegional(a.href),
  }));
  return { heading, links };
}

function buildNavCol(data) {
  const col = document.createElement('div');
  col.className = 'footer-nav-col';

  const heading = document.createElement('h4');
  heading.className = 'footer-nav-col-heading';
  heading.textContent = data.heading;
  col.append(heading);

  const ul = document.createElement('ul');
  ul.className = 'footer-nav-col-list';

  data.links.forEach(({ text, href, external }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    if (external) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'footer-nav-col-external';
    }
    li.append(a);
    ul.append(li);
  });

  col.append(ul);
  return col;
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';

  const sections = fragment ? [...fragment.children] : [];
  const [columnsSection, taglineSection, legalSection] = sections;

  // Parse columns block cells (7 rows × 1 cell each)
  const columnsBlock = columnsSection?.querySelector('.columns');
  const cells = columnsBlock
    ? [...columnsBlock.children].map((row) => row.firstElementChild)
    : [];

  const [logoCell, ...restCells] = cells;
  const socialCell = restCells.pop();
  const navCells = restCells;

  // ── Main area ──────────────────────────────────────────────────
  const main = document.createElement('div');
  main.className = 'footer-main';

  const inner = document.createElement('div');
  inner.className = 'footer-inner';
  main.append(inner);

  const columns = document.createElement('div');
  columns.className = 'footer-columns';
  inner.append(columns);

  // Logo
  const logoWrap = document.createElement('div');
  logoWrap.className = 'footer-logo';
  const logoPicture = logoCell?.querySelector('picture');
  if (logoPicture) logoWrap.append(logoPicture);
  columns.append(logoWrap);

  // Nav columns
  const navGroup = document.createElement('div');
  navGroup.className = 'footer-nav-group';
  navCells.forEach((cell) => {
    const data = parseNavColumn(cell);
    if (data) navGroup.append(buildNavCol(data));
  });
  columns.append(navGroup);

  // Social column
  if (socialCell) {
    const socialData = parseNavColumn(socialCell);
    const socialCol = document.createElement('div');
    socialCol.className = 'footer-social';

    if (socialData?.heading) {
      const heading = document.createElement('h4');
      heading.className = 'footer-nav-col-heading';
      heading.textContent = socialData.heading;
      socialCol.append(heading);
    }

    // Pair all links with all pictures by index
    const allLinks = [...socialCell.querySelectorAll('a')];
    const allPictures = [...socialCell.querySelectorAll('picture')];

    const iconRow = document.createElement('div');
    iconRow.className = 'footer-social-icons';

    allLinks.forEach((link, i) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.className = 'footer-social-icon';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', link.textContent.trim());
      if (allPictures[i]) a.append(allPictures[i].cloneNode(true));
      iconRow.append(a);
    });

    socialCol.append(iconRow);
    columns.append(socialCol);
  }

  // Tagline
  const taglineH2 = taglineSection?.querySelector('h2');
  if (taglineH2) {
    const tagline = document.createElement('p');
    tagline.className = 'footer-tagline';
    tagline.textContent = taglineH2.textContent.trim();
    inner.append(tagline);
  }

  block.append(main);

  // ── Legal bar ──────────────────────────────────────────────────
  const legal = document.createElement('div');
  legal.className = 'footer-legal';

  const legalInner = document.createElement('div');
  legalInner.className = 'footer-legal-inner';
  legal.append(legalInner);

  const legalUl = legalSection?.querySelector('ul');
  if (legalUl) {
    legalUl.className = 'footer-legal-links';
    legalInner.append(legalUl);
  }

  const copyright = legalSection?.querySelector('p');
  if (copyright) {
    copyright.className = 'footer-copyright';
    legalInner.append(copyright);
  }

  block.append(legal);
}

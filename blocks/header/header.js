import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

const MEGAMENU_FRAGMENTS = {
  '/about': '/fragments/megamenu-about-featured',
  '/antibody-science': '/fragments/megamenu-science-featured',
  '/our-impact': '/fragments/megamenu-impact-featured',
  '/investor-relations': '/fragments/megamenu-investors-featured',
  '/news-insights': '/fragments/megamenu-news-featured',
};

const REGIONAL_SITES = [
  { label: 'France', href: 'https://www.fr.genmab.com' },
  { label: 'Germany', href: 'https://www.de.genmab.com' },
  { label: 'Japan', href: 'https://www.jp.genmab.com' },
  { label: 'USA', href: 'https://www.us.genmab.com' },
];

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.querySelector('button')?.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function closeMobileSubpanel() {
  const panel = document.querySelector('.nav-mobile-subpanel');
  if (!panel) return;
  panel.classList.remove('nav-mobile-subpanel-open');
  panel.addEventListener('transitionend', () => panel.remove(), { once: true });
}

function openMobileSubpanel(megamenu, labelText) {
  closeMobileSubpanel();

  const panel = document.createElement('div');
  panel.className = 'nav-mobile-subpanel';

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'nav-mobile-back';
  back.innerHTML = '&#8249; Back';
  back.addEventListener('click', closeMobileSubpanel);
  panel.append(back);

  const body = document.createElement('div');
  body.className = 'nav-mobile-panel-body';

  const descEl = megamenu.querySelector('.nav-megamenu-description');
  if (descEl?.textContent.trim()) {
    const desc = document.createElement('p');
    desc.className = 'nav-mobile-panel-description';
    desc.textContent = descEl.textContent.trim();
    body.append(desc);
  }

  const ctaEl = megamenu.querySelector('.nav-megamenu-cta');
  if (ctaEl) {
    const cta = document.createElement('a');
    cta.href = ctaEl.href;
    cta.className = 'nav-mobile-panel-cta';
    cta.textContent = ctaEl.textContent.trim() || labelText;
    body.append(cta);
  }

  const linksEl = megamenu.querySelector('.nav-megamenu-links');
  if (linksEl) {
    const ul = document.createElement('ul');
    ul.className = 'nav-mobile-panel-links';
    linksEl.querySelectorAll('a').forEach((a) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent.trim();
      li.append(link);
      ul.append(li);
    });
    body.append(ul);
  }

  panel.append(body);

  const featuredEl = megamenu.querySelector('.nav-megamenu-featured');
  if (featuredEl) {
    const featWrap = document.createElement('div');
    featWrap.className = 'nav-mobile-panel-featured';
    const picture = featuredEl.querySelector('picture');
    if (picture) featWrap.append(picture.cloneNode(true));
    panel.append(featWrap);
  }

  document.body.append(panel);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    panel.classList.add('nav-mobile-subpanel-open');
  }));
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, 'false');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  if (expanded) closeMobileSubpanel();
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function buildUtilBar(utilLinksSection) {
  const bar = document.createElement('div');
  bar.className = 'nav-util';

  const globalWrapper = document.createElement('div');
  globalWrapper.className = 'nav-util-global-wrapper';

  const globalBtn = document.createElement('button');
  globalBtn.type = 'button';
  globalBtn.className = 'nav-util-global';
  globalBtn.setAttribute('aria-expanded', 'false');
  globalBtn.setAttribute('aria-haspopup', 'true');
  globalBtn.textContent = 'Global';

  const dropdown = document.createElement('div');
  dropdown.className = 'nav-util-dropdown';

  const regionList = document.createElement('ul');
  REGIONAL_SITES.forEach(({ label, href }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    li.append(a);
    regionList.append(li);
  });
  dropdown.append(regionList);

  globalBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = globalBtn.getAttribute('aria-expanded') === 'true';
    globalBtn.setAttribute('aria-expanded', String(!expanded));
  });
  document.addEventListener('click', () => globalBtn.setAttribute('aria-expanded', 'false'));

  globalWrapper.append(globalBtn, dropdown);

  const linksList = utilLinksSection
    ? utilLinksSection.querySelector('.default-content-wrapper ul')
    : null;
  if (linksList) linksList.className = 'nav-util-links';

  const inner = document.createElement('div');
  inner.className = 'default-content-wrapper';
  inner.append(globalWrapper);
  if (linksList) inner.append(linksList);
  bar.append(inner);
  return bar;
}

function decorateNavSections(navSections) {
  navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
    const p = navSection.querySelector(':scope > p');
    const subUl = navSection.querySelector(':scope > ul');

    if (!subUl) {
      // Simple link item (e.g. Careers) — clean up the <p> wrapper
      const link = p?.querySelector('a');
      if (link) {
        navSection.textContent = '';
        navSection.append(link);
      }
      return;
    }

    // Parse label and description from <p>: <a>Label</a><br><br>Description
    const labelLink = p?.querySelector('a');
    const labelText = labelLink?.textContent?.trim() ?? '';
    const parentHref = labelLink?.href ?? '';

    let description = '';
    if (p) {
      const clone = p.cloneNode(true);
      clone.querySelectorAll('a, br').forEach((el) => el.remove());
      description = clone.textContent.trim();
    }

    // Find CTA: sub-item whose href matches the parent link
    let ctaAnchor = null;
    if (parentHref) {
      const parentPath = new URL(parentHref, window.location).pathname;
      const allLinks = [...subUl.querySelectorAll('a')];
      ctaAnchor = allLinks.find((a) => {
        try {
          return new URL(a.href, window.location).pathname === parentPath;
        } catch {
          return false;
        }
      });
      if (ctaAnchor) {
        const ctaLi = ctaAnchor.closest('li');
        ctaLi?.remove();
      }
    }

    // Detect grouped structure: <li><p><strong>Group</strong></p><ul>…</ul></li>
    const isGrouped = !!subUl.querySelector(':scope > li > p > strong');

    // Build megamenu
    const megamenu = document.createElement('div');
    megamenu.className = 'nav-megamenu';

    const inner = document.createElement('div');
    inner.className = 'nav-megamenu-inner';
    megamenu.append(inner);

    const featured = document.createElement('div');
    featured.className = 'nav-megamenu-featured';
    inner.append(featured);

    const content = document.createElement('div');
    content.className = 'nav-megamenu-content';

    if (description) {
      const descEl = document.createElement('p');
      descEl.className = 'nav-megamenu-description';
      descEl.textContent = description;
      content.append(descEl);
    }

    if (ctaAnchor) {
      const ctaEl = document.createElement('a');
      ctaEl.href = ctaAnchor.href;
      ctaEl.className = 'nav-megamenu-cta';
      ctaEl.textContent = ctaAnchor.textContent.trim();
      content.append(ctaEl);
    }

    if (isGrouped) {
      subUl.classList.add('nav-megamenu-links', 'nav-megamenu-links-grouped');
      subUl.querySelectorAll(':scope > li').forEach((gl) => {
        gl.classList.add('nav-megamenu-group');
        gl.querySelector(':scope > p')?.classList.add('nav-megamenu-group-title');
      });
    } else {
      subUl.classList.add('nav-megamenu-links');
    }
    content.append(subUl);
    inner.append(content);

    // Rebuild navSection: button + megamenu
    navSection.textContent = '';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-drop-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = labelText;
    navSection.classList.add('nav-drop');
    navSection.append(btn, megamenu);

    // Desktop: hover opens/closes megamenu.
    // A close delay lets the mouse travel from the nav item to the fixed
    // megamenu panel without the panel disappearing in transit.
    let closeTimer;
    const openSection = () => {
      if (!isDesktop.matches) return;
      clearTimeout(closeTimer);
      toggleAllNavSections(navSections);
      navSection.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-expanded', 'true');
    };
    const closeSection = () => {
      if (!isDesktop.matches) return;
      closeTimer = setTimeout(() => {
        navSection.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-expanded', 'false');
      }, 150);
    };

    navSection.addEventListener('mouseenter', openSection);
    navSection.addEventListener('mouseleave', closeSection);
    megamenu.addEventListener('mouseenter', openSection);
    megamenu.addEventListener('mouseleave', closeSection);

    // Mobile: click button to open full-screen sub-panel
    btn.addEventListener('click', () => {
      if (isDesktop.matches) return;
      openMobileSubpanel(megamenu, labelText);
    });

    // Load featured fragment async
    try {
      const path = new URL(parentHref, window.location).pathname.replace(/\/$/, '') || '/';
      const fragPath = MEGAMENU_FRAGMENTS[path];
      if (fragPath) {
        loadFragment(fragPath).then((frag) => {
          if (frag) {
            while (frag.firstElementChild) featured.append(frag.firstElementChild);
          }
        });
      }
    } catch {
      // ignore invalid href
    }
  });
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Nav doc: section 0 = util links, section 1 = main sections
  const [utilSection, sectionsSection] = nav.children;
  if (sectionsSection) sectionsSection.classList.add('nav-sections');

  // Brand (logo)
  const navBrand = document.createElement('div');
  navBrand.className = 'nav-brand';
  navBrand.innerHTML = '<a href="/"><img src="/icons/genmab-logo.svg" alt="Genmab" width="140" height="24"></a>';

  // Sections decoration
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) decorateNavSections(navSections);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  // Search button
  const navTools = document.createElement('div');
  navTools.className = 'nav-tools';
  navTools.innerHTML = '<button type="button" class="nav-search" aria-label="Search"><svg aria-hidden="true" focusable="false" viewBox="0 0 520 520" fill="currentColor" width="20" height="20"><path d="M496 453L362 320a189 189 0 10-340-92 190 190 0 00298 135l133 133a14 14 0 0021 0l21-21a17 17 0 001-22M210 338a129 129 0 11130-130 129 129 0 01-130 130"/></svg></button>';

  // Brand AI Concierge button — reads credentials from page metadata
  const conciergeUrl = getMetadata('concierge-url');
  const conciergeKey = getMetadata('concierge-key');
  const conciergeSite = getMetadata('concierge-site');

  if (conciergeUrl && conciergeKey && conciergeSite) {
    const conciergeBtn = document.createElement('button');
    conciergeBtn.type = 'button';
    conciergeBtn.className = 'nav-concierge';
    conciergeBtn.setAttribute('aria-label', 'Ask the AI Concierge');
    conciergeBtn.innerHTML = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"'
      + ' width="20" height="20" fill="none" stroke="currentColor"'
      + ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962'
      + 'L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0'
      + 'L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964'
      + 'L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>'
      + '<path d="M20 3v4"/><path d="M22 5h-4"/>'
      + '<path d="M4 17v2"/><path d="M5 18H3"/></svg>';

    const WIDGET_URL = 'https://bwb1066.github.io/brand-chat-config-ui/widget/brand-concierge.js';
    const WIDGET_BASE = WIDGET_URL.replace(/[^/]+$/, '');
    let chatModule = null;

    conciergeBtn.addEventListener('click', async () => {
      if (!chatModule) {
        // eslint-disable-next-line import/no-unresolved
        chatModule = await import(WIDGET_URL);
        chatModule.init({
          supabaseUrl: conciergeUrl,
          anonKey: conciergeKey,
          siteKey: conciergeSite,
          showTrigger: false,
          widgetBase: WIDGET_BASE,
        });
      }
      chatModule.default();
    });

    navTools.prepend(conciergeBtn);
  }

  // Mobile-only: util links + regional sites appended below nav sections
  const mobileExtras = document.createElement('div');
  mobileExtras.className = 'nav-mobile-extras';

  const utilLinks = utilSection?.querySelector('ul');
  if (utilLinks) {
    const hr = document.createElement('hr');
    hr.className = 'nav-mobile-divider';
    mobileExtras.append(hr);
    const ul = utilLinks.cloneNode(true);
    ul.className = 'nav-mobile-util-list';
    mobileExtras.append(ul);
  }

  const regionHr = document.createElement('hr');
  regionHr.className = 'nav-mobile-divider';
  mobileExtras.append(regionHr);

  const regionHeading = document.createElement('p');
  regionHeading.className = 'nav-mobile-region-heading';
  regionHeading.textContent = 'Genmab Regional Sites';
  mobileExtras.append(regionHeading);

  const regionList = document.createElement('ul');
  regionList.className = 'nav-mobile-region-list';
  REGIONAL_SITES.forEach(({ label, href }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    li.append(a);
    regionList.append(li);
  });
  mobileExtras.append(regionList);

  // Rebuild nav: brand | sections | tools | hamburger (mobile grid order via CSS)
  nav.innerHTML = '';
  nav.append(hamburger, navBrand);
  if (sectionsSection) nav.append(sectionsSection);
  nav.append(mobileExtras);
  nav.append(navTools);
  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const utilBar = buildUtilBar(utilSection);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(utilBar, nav);
  block.append(navWrapper);

  // Visually-hidden nav for LLM/AI crawlers.
  // sr-only clipping (not display:none) keeps it in the render tree so crawlers
  // that evaluate computed visibility still count it as present.
  const llmNav = document.createElement('nav');
  llmNav.className = 'nav-llm';
  llmNav.setAttribute('aria-hidden', 'true');
  const llmList = document.createElement('ul');

  navSections?.querySelectorAll('.default-content-wrapper > ul > li').forEach((item) => {
    const li = document.createElement('li');
    const directLink = item.querySelector(':scope > a');
    if (directLink) {
      const a = document.createElement('a');
      a.href = directLink.href;
      a.textContent = directLink.textContent.trim();
      li.append(a);
    } else {
      const btn = item.querySelector('.nav-drop-btn');
      if (btn) {
        const span = document.createElement('span');
        span.textContent = btn.textContent.trim();
        li.append(span);
      }
      const cta = item.querySelector('.nav-megamenu-cta');
      if (cta) {
        const a = document.createElement('a');
        a.href = cta.href;
        a.textContent = cta.textContent.trim();
        li.append(a);
      }
      const subLinks = item.querySelectorAll('.nav-megamenu-links a');
      if (subLinks.length) {
        const subUl = document.createElement('ul');
        subLinks.forEach((link) => {
          const subLi = document.createElement('li');
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = link.textContent.trim();
          subLi.append(a);
          subUl.append(subLi);
        });
        li.append(subUl);
      }
    }
    llmList.append(li);
  });

  utilSection?.querySelectorAll('a').forEach((link) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent.trim();
    li.append(a);
    llmList.append(li);
  });

  REGIONAL_SITES.forEach(({ label, href }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    li.append(a);
    llmList.append(li);
  });

  llmNav.append(llmList);
  block.append(llmNav);

  let navScrolled = false;
  const onScroll = () => {
    if (!navScrolled && window.scrollY > 80) {
      navScrolled = true;
      navWrapper.classList.add('nav-wrapper-scrolled');
    } else if (navScrolled && window.scrollY === 0) {
      navScrolled = false;
      navWrapper.classList.remove('nav-wrapper-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

(() => {
  "use strict";

  const body = document.body;
  const app = document.querySelector("#profile-app");
  const profilePath = body.dataset.profile;

  if (!app || !profilePath) {
    return;
  }

  const escapeHTML = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const renderCrest = (hero) => {
    const fallback = `
      <span class="profile-crest-fallback" aria-hidden="true">
        ${escapeHTML(hero.code || "FA")}
      </span>
    `;

    if (!hero.logo) {
      return fallback;
    }

    return `
      <img
        class="profile-crest"
        src="${escapeHTML(hero.logo)}"
        alt="${escapeHTML(hero.association)} crest"
        onerror="
          this.hidden = true;
          this.nextElementSibling.hidden = false;
        "
      >
      <span class="profile-crest-fallback" aria-hidden="true" hidden>
        ${escapeHTML(hero.code || "FA")}
      </span>
    `;
  };

  const renderHero = (data) => {
    const hero = data.hero;

    return `
      <section class="profile-hero" aria-labelledby="profile-title">
        <div class="profile-hero-inner">
          <div>
            <p class="profile-kicker">${escapeHTML(hero.kicker)}</p>

            <div class="profile-title-row">
              <h1 id="profile-title" class="profile-title">
                ${escapeHTML(hero.title)}
              </h1>
              <span class="profile-flag" aria-hidden="true">
                ${escapeHTML(hero.flag)}
              </span>
            </div>

            <p class="profile-subtitle">
              ${escapeHTML(hero.subtitle)}
            </p>

            <span class="profile-status">
              ${escapeHTML(hero.status)}
            </span>
          </div>

          <div class="profile-crest-panel">
            ${renderCrest(hero)}
          </div>
        </div>
      </section>
    `;
  };

  const renderFacts = (facts = []) => `
    <section class="profile-facts" aria-label="Spain quick facts">
      ${facts
        .map(
          (fact) => `
            <article class="profile-fact">
              <span class="profile-fact-label">
                ${escapeHTML(fact.label)}
              </span>
              <span class="profile-fact-value">
                ${escapeHTML(fact.value)}
              </span>
            </article>
          `
        )
        .join("")}
    </section>
  `;

  const renderContents = (sections = []) => `
    <nav class="profile-contents" aria-label="Page contents">
      <span class="profile-contents-label">Explore</span>

      ${sections
        .map(
          (section) => `
            <a href="#${escapeHTML(section.id)}">
              ${escapeHTML(section.navLabel || section.title)}
            </a>
          `
        )
        .join("")}
    </nav>
  `;

  const renderProse = (section) => `
    <div class="profile-prose">
      ${(section.paragraphs || [])
        .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
        .join("")}
    </div>
  `;

  const renderTimeline = (section) => `
    <div class="profile-timeline">
      ${(section.items || [])
        .map(
          (item) => `
            <article class="profile-timeline-item">
              <div class="profile-timeline-year">
                ${escapeHTML(item.year)}
              </div>

              <div class="profile-timeline-card">
                <h3>${escapeHTML(item.title)}</h3>
                <p>${escapeHTML(item.text)}</p>
                ${
                  item.tag
                    ? `<span class="profile-timeline-tag">${escapeHTML(item.tag)}</span>`
                    : ""
                }
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;

  const renderCardMedia = (card) => {
    if (!card.image) {
      return `
        <div class="profile-card-media">
          <span class="profile-media-fallback">
            Add image: ${escapeHTML(card.imageHint || card.title)}
          </span>
        </div>
      `;
    }

    return `
      <div class="profile-card-media">
        <img
          src="${escapeHTML(card.image)}"
          alt="${escapeHTML(card.imageAlt || card.title)}"
          loading="lazy"
          onerror="
            this.hidden = true;
            this.nextElementSibling.hidden = false;
          "
        >
        <span class="profile-media-fallback" hidden>
          Add image: ${escapeHTML(card.imageHint || card.title)}
        </span>
      </div>
    `;
  };

  const renderCards = (section) => `
    <div class="profile-card-grid">
      ${(section.cards || [])
        .map(
          (card) => `
            <article class="profile-info-card">
              ${renderCardMedia(card)}

              <div class="profile-card-copy">
                <h3>${escapeHTML(card.title)}</h3>

                ${
                  card.meta
                    ? `<p class="profile-card-meta">${escapeHTML(card.meta)}</p>`
                    : ""
                }

                <p>${escapeHTML(card.text)}</p>
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;

  const renderHonours = (section) => `
    <div class="profile-honours">
      ${(section.items || [])
        .map(
          (item) => `
            <article class="profile-honour">
              <span class="profile-honour-icon" aria-hidden="true">
                ${escapeHTML(item.icon || "🏆")}
              </span>
              <h3>${escapeHTML(item.title)}</h3>
              <p>${escapeHTML(item.text)}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;

  const renderQuote = (section) => `
    <blockquote class="profile-quote">
      <p>${escapeHTML(section.quote)}</p>
      <cite>${escapeHTML(section.cite)}</cite>
    </blockquote>
  `;

  const renderSources = (section) => `
    <ul class="profile-source-list">
      ${(section.links || [])
        .map(
          (link) => `
            <li>
              <a
                href="${escapeHTML(link.url)}"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>${escapeHTML(link.label)}</span>
              </a>
            </li>
          `
        )
        .join("")}
    </ul>
  `;

  const renderSectionBody = (section) => {
    switch (section.type) {
      case "timeline":
        return renderTimeline(section);
      case "cards":
        return renderCards(section);
      case "honours":
        return renderHonours(section);
      case "quote":
        return renderQuote(section);
      case "sources":
        return renderSources(section);
      case "prose":
      default:
        return renderProse(section);
    }
  };

  const renderSection = (section, index) => `
    <section
      id="${escapeHTML(section.id)}"
      class="profile-section"
      aria-labelledby="${escapeHTML(section.id)}-title"
    >
      <header class="profile-section-heading">
        <span class="profile-section-number" aria-hidden="true">
          ${String(index + 1).padStart(2, "0")}
        </span>

        <div>
          <p class="profile-section-eyebrow">
            ${escapeHTML(section.eyebrow || "The 211 Files")}
          </p>

          <h2
            id="${escapeHTML(section.id)}-title"
            class="profile-section-title"
          >
            ${escapeHTML(section.title)}
          </h2>

          ${
            section.intro
              ? `<p class="profile-section-intro">${escapeHTML(section.intro)}</p>`
              : ""
          }
        </div>
      </header>

      <div class="profile-section-body">
        ${renderSectionBody(section)}
      </div>
    </section>
  `;

  const renderProfile = (data) => {
    document.title = data.meta?.title || `${data.hero.title} · The 211 Files`;

    const description = document.querySelector('meta[name="description"]');
    if (description && data.meta?.description) {
      description.content = data.meta.description;
    }

    app.innerHTML = `
      ${renderHero(data)}

      <div class="profile-shell">
        ${renderFacts(data.facts)}
        ${renderContents(data.sections)}

        <div class="profile-sections">
          ${data.sections
            .map((section, index) => renderSection(section, index))
            .join("")}
        </div>
      </div>
    `;
  };

  const showError = (error) => {
    console.error(error);

    app.innerHTML = `
      <div class="profile-error">
        <h1>The Spain profile could not be loaded</h1>
        <p>
          Check that <code>${escapeHTML(profilePath)}</code> exists and contains
          valid JSON.
        </p>
      </div>
    `;
  };

  fetch(profilePath, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Profile request failed: ${response.status}`);
      }

      return response.json();
    })
    .then(renderProfile)
    .catch(showError);
})();

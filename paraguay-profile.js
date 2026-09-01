(() => {
  "use strict";

  const page = document.body;
  const app = document.querySelector("#profile-app");
  const dataPath = page.dataset.profile;

  if (!app || !dataPath) return;

  const esc = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const renderImage = (image, alt, className = "profile-media-image") => `
    <img
      class="${className}"
      src="${esc(image)}"
      alt="${esc(alt)}"
      loading="lazy"
      onerror="this.closest('figure')?.remove();"
    >
  `;

  const renderGallery = (gallery = [], title = "") => {
    if (!gallery.length) return "";

    return `
      <div class="profile-gallery profile-gallery-${Math.min(gallery.length, 4)}">
        ${gallery.map((image, index) => `
          <figure class="profile-media">
            ${renderImage(image, `${title} — source image ${index + 1}`)}
          </figure>
        `).join("")}
      </div>
    `;
  };

  const renderHeroLogo = (hero) => `
    <img
      src="${esc(hero.logo || hero.fallbackLogo)}"
      alt="${esc(hero.country)} football association logo"
      onerror="${
        hero.fallbackLogo
          ? `this.onerror=null; this.src='${esc(hero.fallbackLogo)}';`
          : "this.remove();"
      }"
    >
  `;

  const renderHero = ({ hero, meta }) => `
    <section class="profile-hero" aria-labelledby="country-title">
      <div class="profile-hero-inner">
        <div class="profile-hero-copy">
          <p class="profile-series">${esc(hero.series)} · ${esc(hero.fileNumber)}</p>

          <div class="profile-country-row">
            <h1 id="country-title">${esc(hero.country)}</h1>
            <span class="profile-country-flag" aria-hidden="true">${esc(hero.flag)}</span>
          </div>

          <p class="profile-association">${esc(hero.association)}</p>

          <div class="profile-hero-badges">
            <span>2030 status: ${esc(hero.status)}</span>
            <span>Confederation: ${esc(hero.confederation)}</span>
            <span>World Cups: ${esc(hero.worldCupAppearances)}</span>
          </div>

          <ul class="profile-best-records">
            ${hero.bestRecords.map((record) => `<li>${esc(record)}</li>`).join("")}
          </ul>

          <p class="profile-hashtag">${esc(hero.hashtag)}</p>
        </div>

        <div class="profile-logo-card">${renderHeroLogo(hero)}</div>
      </div>

      <div class="profile-source-strip">
        <span>${esc(meta.source.label)}</span>
        <span>${esc(meta.source.imageCount)} source images</span>
      </div>
    </section>
  `;

  const renderQuickFacts = (hero) => {
    const facts = [
      ["FA founded", hero.founded],
      ["Joined FIFA", hero.fifa],
      ["Confederation", hero.confederation],
      ["2030 status", hero.status],
      ["World Cup appearances", hero.worldCupAppearances]
    ];

    return `
      <section class="profile-facts" aria-label="Quick facts">
        ${facts.map(([label, value]) => `
          <article>
            <span>${esc(label)}</span>
            <strong>${esc(value)}</strong>
          </article>
        `).join("")}
      </section>
    `;
  };

  const renderNav = (sections) => `
    <nav class="profile-nav" aria-label="Paraguay profile sections">
      ${sections.map((section) => `
        <a href="#${esc(section.id)}">
          <span>${esc(section.number)}</span>
          ${esc(section.title)}
        </a>
      `).join("")}
    </nav>
  `;

  const renderEntry = (entry, sectionTitle) => `
    <article class="profile-story-entry">
      <div class="profile-story-copy">
        ${entry.date ? `<p class="profile-entry-date">${esc(entry.date)}</p>` : ""}
        ${entry.heading ? `<h3>${esc(entry.heading)}</h3>` : ""}
        ${(entry.paragraphs || []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}
      </div>

      ${renderGallery(entry.images || [], entry.heading || sectionTitle)}
    </article>
  `;

  const renderCards = (cards = []) => `
    <div class="profile-card-grid">
      ${cards.map((card) => `
        <article class="profile-card">
          ${renderGallery(card.images || [], card.title)}
          <div class="profile-card-copy">
            ${card.meta ? `<p class="profile-card-meta">${esc(card.meta)}</p>` : ""}
            <h3>${esc(card.title)}</h3>
            <p>${esc(card.text)}</p>
          </div>
        </article>
      `).join("")}
    </div>
  `;

  const renderLineup = (section) => {
    const lineup = section.lineup;

    return `
      <div class="profile-lineup-layout">
        <div>
          ${lineup.image ? `
            <figure class="profile-lineup-image profile-media">
              ${renderImage(lineup.image, "Paraguay historical line-up graphic")}
            </figure>
          ` : ""}

          <div class="profile-player-grid">
            ${lineup.players.map((player) => `
              <article class="profile-player-card">
                ${player.image ? `
                  <figure class="profile-player-photo">
                    ${renderImage(
                      player.image,
                      `${player.name} — Paraguay historical line-up`,
                      "profile-player-image"
                    )}
                  </figure>
                ` : ""}

                <div class="profile-player-copy">
                  <p class="profile-player-position">
                    ${esc(player.position)}${player.years ? ` · ${esc(player.years)}` : ""}
                  </p>
                  <h3>${esc(player.name)}</h3>
                  <p>${esc(player.description)}</p>
                </div>
              </article>
            `).join("")}
          </div>
        </div>

        <aside class="profile-lineup-aside">
          <p class="profile-formation">${esc(lineup.formation)}</p>
          <p>${esc(section.closing)}</p>
        </aside>
      </div>
    `;
  };

  const renderRecords = (section) => `
    <div class="profile-record-grid">
      ${section.recordGroups.map((group) => `
        <article class="profile-record-group">
          <h3>${esc(group.title)}</h3>
          <ul>${group.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
        </article>
      `).join("")}
    </div>

    ${renderGallery(section.images || [], section.title)}
  `;

  const renderHost = (section) => `
    <div class="profile-host-card">
      <div>
        <p class="profile-host-kicker">${esc(section.host.kicker || "Qualified host")}</p>
        <h3>${esc(section.host.headline)}</h3>
        <p>${esc(section.host.text)}</p>
      </div>
      ${section.host.image ? `
        <figure class="profile-host-image profile-media">
          ${renderImage(section.host.image, "Paraguay 2030 host graphic")}
        </figure>
      ` : ""}
    </div>
  `;

  const renderSectionContent = (section) => {
    if (section.lineup) return renderLineup(section);
    if (section.recordGroups) return renderRecords(section);
    if (section.host) return renderHost(section);
    if (section.cards) return renderCards(section.cards);

    return `
      <div class="profile-story-list">
        ${(section.entries || []).map((entry) => renderEntry(entry, section.title)).join("")}
      </div>
    `;
  };

  const renderSection = (section) => `
    <section
      id="${esc(section.id)}"
      class="profile-section"
      aria-labelledby="${esc(section.id)}-title"
    >
      <header class="profile-section-header">
        <span class="profile-section-number">${esc(section.number)}</span>

        <div>
          <p class="profile-section-kicker">The 211 Files · Paraguay</p>
          <h2 id="${esc(section.id)}-title">${esc(section.title)}</h2>
          ${section.subtitle ? `<p class="profile-section-subtitle">${esc(section.subtitle)}</p>` : ""}
          ${section.intro ? `<p class="profile-section-intro">${esc(section.intro)}</p>` : ""}
        </div>
      </header>

      <div class="profile-section-body">
        ${renderSectionContent(section)}
      </div>
    </section>
  `;

  const renderPage = (data) => {
    document.title = data.meta.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = data.meta.description;

    app.innerHTML = `
      ${renderHero(data)}

      <div class="profile-shell">
        ${renderQuickFacts(data.hero)}
        ${renderNav(data.sections)}

        <div class="profile-section-list">
          ${data.sections.map(renderSection).join("")}
        </div>

        <footer class="profile-footer">
          <p>
            Content structured from the supplied Paraguay thread export.
            Project-specific 2025–26 and 2030 claims are preserved as source material.
          </p>
        </footer>
      </div>
    `;
  };

  fetch(dataPath, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not load ${dataPath}: ${response.status}`);
      }
      return response.json();
    })
    .then(renderPage)
    .catch((error) => {
      console.error(error);

      app.innerHTML = `
        <div class="profile-error">
          <h1>The Paraguay page could not be loaded</h1>
          <p>
            Check that <code>${esc(dataPath)}</code> exists and contains valid JSON.
          </p>
        </div>
      `;
    });
})();

(() => {
  "use strict";

  const app = document.querySelector("#profile-app");
  const dataPath = document.body.dataset.profile;
  if (!app || !dataPath) return;

  const esc = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const image = (src, alt, className = "profile-media-image") => `
    <img class="${className}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy"
      onerror="this.closest('figure')?.remove();">
  `;

  const gallery = (images = [], title = "") => {
    if (!images.length) return "";
    return `
      <div class="profile-gallery profile-gallery-${Math.min(images.length, 4)}">
        ${images.map((src, i) => `
          <figure class="profile-media">
            ${image(src, `${title} — source image ${i + 1}`)}
          </figure>
        `).join("")}
      </div>
    `;
  };

  const renderHero = (data) => `
    <section class="profile-hero">
      <div class="profile-hero-inner">
        <div class="profile-hero-copy">
          <p class="profile-series">${esc(data.hero.series)} · ${esc(data.hero.fileNumber)}</p>
          <div class="profile-country-row">
            <h1>${esc(data.hero.country)}</h1>
            <span class="profile-country-flag">${esc(data.hero.flag)}</span>
          </div>
          <p class="profile-association">${esc(data.hero.association)}</p>

          <div class="profile-hero-badges">
            <span>2030 status: ${esc(data.hero.status)}</span>
            <span>${esc(data.hero.confederation)}</span>
            <span>World Cups: ${esc(data.hero.worldCupAppearances)}</span>
          </div>

          <ul class="profile-best-records">
            ${data.hero.bestRecords.map(item => `<li>${esc(item)}</li>`).join("")}
          </ul>
          <p class="profile-hashtag">${esc(data.hero.hashtag)}</p>
        </div>

        <div class="profile-logo-card">
          <img src="${esc(data.hero.logo)}"
               alt="${esc(data.hero.country)} football association logo"
               onerror="this.onerror=null;this.src='${esc(data.hero.fallbackLogo)}';">
        </div>
      </div>

      <div class="profile-source-strip">
        <span>${esc(data.meta.source.label)}</span>
        <span>${esc(data.meta.source.imageCount)} original source images</span>
      </div>
    </section>
  `;

  const renderFacts = (h) => {
    const facts = [
      ["FA founded", h.founded],
      ["Joined FIFA", h.fifa],
      ["Confederation", h.confederation],
      ["2030 status", h.status],
      ["World Cup appearances", h.worldCupAppearances]
    ];
    return `
      <section class="profile-facts">
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
    <nav class="profile-nav" aria-label="Profile sections">
      ${sections.map(section => `
        <a href="#${esc(section.id)}">
          <span>${esc(section.number)}</span>${esc(section.title)}
        </a>
      `).join("")}
    </nav>
  `;

  const renderEntry = (entry, sectionTitle) => `
    <article class="profile-story-entry">
      <div class="profile-story-copy">
        ${entry.date ? `<p class="profile-entry-date">${esc(entry.date)}</p>` : ""}
        ${entry.heading ? `<h3>${esc(entry.heading)}</h3>` : ""}
        ${(entry.paragraphs || []).map(p => `<p>${esc(p)}</p>`).join("")}
      </div>
      ${gallery(entry.images || [], entry.heading || sectionTitle)}
    </article>
  `;

  const renderCards = (cards = []) => `
    <div class="profile-card-grid">
      ${cards.map(card => `
        <article class="profile-card">
          ${gallery(card.images || [], card.title)}
          <div class="profile-card-copy">
            ${card.meta ? `<p class="profile-card-meta">${esc(card.meta)}</p>` : ""}
            <h3>${esc(card.title)}</h3>
            <p>${esc(card.text)}</p>
          </div>
        </article>
      `).join("")}
    </div>
  `;

  const renderLineup = (section) => `
    <div class="profile-lineup-layout">
      <div>
        <figure class="profile-lineup-image profile-media">
          ${image(section.lineup.image, "Saint Vincent and the Grenadines historical line-up graphic")}
        </figure>

        <div class="profile-player-grid">
          ${section.lineup.players.map(player => `
            <article class="profile-player-card">
              <figure class="profile-player-photo">
                ${image(
                  player.image,
                  `${player.name} — Saint Vincent and the Grenadines historical line-up`,
                  "profile-player-image"
                )}
              </figure>
              <div class="profile-player-copy">
                <p class="profile-player-position">${esc(player.position)} · ${esc(player.years)}</p>
                <h3>${esc(player.name)}</h3>
                <p>${esc(player.description)}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </div>

      <aside class="profile-lineup-aside">
        <p class="profile-formation">${esc(section.lineup.formation)}</p>
        <p>${esc(section.closing)}</p>
      </aside>
    </div>
  `;

  const renderRecords = (section) => `
    <div class="profile-record-grid">
      ${section.recordGroups.map(group => `
        <article class="profile-record-group">
          <h3>${esc(group.title)}</h3>
          <ul>${group.items.map(item => `<li>${esc(item)}</li>`).join("")}</ul>
        </article>
      `).join("")}
    </div>
    ${gallery(section.images || [], section.title)}
  `;

  const renderBody = (section) => {
    if (section.lineup) return renderLineup(section);
    if (section.recordGroups) return renderRecords(section);
    if (section.cards) return renderCards(section.cards);
    return `
      <div class="profile-story-list">
        ${(section.entries || []).map(entry => renderEntry(entry, section.title)).join("")}
      </div>
    `;
  };

  const renderSection = (section) => `
    <section id="${esc(section.id)}" class="profile-section">
      <header class="profile-section-header">
        <span class="profile-section-number">${esc(section.number)}</span>
        <div>
          <p class="profile-section-kicker">The 211 Files · SVG</p>
          <h2>${esc(section.title)}</h2>
          ${section.subtitle ? `<p class="profile-section-subtitle">${esc(section.subtitle)}</p>` : ""}
          ${section.intro ? `<p class="profile-section-intro">${esc(section.intro)}</p>` : ""}
        </div>
      </header>
      <div class="profile-section-body">${renderBody(section)}</div>
    </section>
  `;

  fetch(dataPath, { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error(`Could not load ${dataPath}: ${response.status}`);
      return response.json();
    })
    .then(data => {
      document.title = data.meta.title;
      const description = document.querySelector('meta[name="description"]');
      if (description) description.content = data.meta.description;

      app.innerHTML = `
        ${renderHero(data)}
        <div class="profile-shell">
          ${renderFacts(data.hero)}
          ${renderNav(data.sections)}
          <div class="profile-section-list">
            ${data.sections.map(renderSection).join("")}
          </div>
          <footer class="profile-footer">
            <p>Content structured from the supplied Saint Vincent and the Grenadines thread export. Project-specific 2026–30 claims are preserved as source material.</p>
          </footer>
        </div>
      `;
    })
    .catch(error => {
      console.error(error);
      app.innerHTML = `
        <div class="profile-error">
          <h1>The Saint Vincent and the Grenadines page could not be loaded</h1>
          <p>Check that <code>${esc(dataPath)}</code> exists and contains valid JSON.</p>
        </div>
      `;
    });
})();

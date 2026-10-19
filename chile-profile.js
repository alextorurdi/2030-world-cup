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

  const img = (src, alt, className = "profile-media-image") => `
    <img class="${className}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy"
      onerror="this.closest('figure')?.remove();">
  `;

  const gallery = (images = [], title = "") => {
    if (!images.length) return "";
    return `
      <div class="profile-gallery profile-gallery-${Math.min(images.length, 4)}">
        ${images.map((src, i) => `
          <figure class="profile-media">
            ${img(src, `${title} — source image ${i + 1}`)}
          </figure>
        `).join("")}
      </div>
    `;
  };

  const hero = (data) => `
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
            ${data.hero.bestRecords.map(r => `<li>${esc(r)}</li>`).join("")}
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

  const facts = (h) => {
    const rows = [
      ["FA founded", h.founded],
      ["Joined FIFA", h.fifa],
      ["Confederation", h.confederation],
      ["2030 status", h.status],
      ["World Cup appearances", h.worldCupAppearances]
    ];
    return `
      <section class="profile-facts" aria-label="Chile quick facts">
        ${rows.map(([label, value]) => `
          <article>
            <span>${esc(label)}</span>
            <strong>${esc(value)}</strong>
          </article>
        `).join("")}
      </section>
    `;
  };

  const nav = (sections) => `
    <nav class="profile-nav" aria-label="Chile profile sections">
      ${sections.map(s => `
        <a href="#${esc(s.id)}"><span>${esc(s.number)}</span>${esc(s.title)}</a>
      `).join("")}
    </nav>
  `;

  const entry = (e, sectionTitle) => `
    <article class="profile-story-entry">
      <div class="profile-story-copy">
        ${e.date ? `<p class="profile-entry-date">${esc(e.date)}</p>` : ""}
        ${e.heading ? `<h3>${esc(e.heading)}</h3>` : ""}
        ${(e.paragraphs || []).map(p => `<p>${esc(p)}</p>`).join("")}
      </div>
      ${gallery(e.images || [], e.heading || sectionTitle)}
    </article>
  `;

  const cards = (items = []) => `
    <div class="profile-card-grid">
      ${items.map(card => `
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

  const lineup = (section) => `
    <div class="profile-lineup-layout">
      <div>
        <figure class="profile-lineup-image profile-media">
          ${img(section.lineup.image, "Chile historical line-up graphic")}
        </figure>

        <div class="profile-player-grid">
          ${section.lineup.players.map(player => `
            <article class="profile-player-card">
              <figure class="profile-player-photo">
                ${img(
                  player.image,
                  `${player.name} — Chile historical line-up`,
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

  const records = (section) => `
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

  const sectionBody = (section) => {
    if (section.lineup) return lineup(section);
    if (section.recordGroups) return records(section);
    if (section.cards) return cards(section.cards);
    return `
      <div class="profile-story-list">
        ${(section.entries || []).map(e => entry(e, section.title)).join("")}
      </div>
    `;
  };

  const section = (s) => `
    <section id="${esc(s.id)}" class="profile-section">
      <header class="profile-section-header">
        <span class="profile-section-number">${esc(s.number)}</span>
        <div>
          <p class="profile-section-kicker">The 211 Files · Chile</p>
          <h2>${esc(s.title)}</h2>
          ${s.subtitle ? `<p class="profile-section-subtitle">${esc(s.subtitle)}</p>` : ""}
          ${s.intro ? `<p class="profile-section-intro">${esc(s.intro)}</p>` : ""}
        </div>
      </header>
      <div class="profile-section-body">${sectionBody(s)}</div>
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
        ${hero(data)}
        <div class="profile-shell">
          ${facts(data.hero)}
          ${nav(data.sections)}
          <div class="profile-section-list">
            ${data.sections.map(section).join("")}
          </div>
          <footer class="profile-footer">
            <p>Content structured from the supplied Chile thread export. Project-specific 2026–30 claims are preserved as source material.</p>
          </footer>
        </div>
      `;
    })
    .catch(error => {
      console.error(error);
      app.innerHTML = `
        <div class="profile-error">
          <h1>The Chile page could not be loaded</h1>
          <p>Check that <code>${esc(dataPath)}</code> exists and contains valid JSON.</p>
        </div>
      `;
    });
})();

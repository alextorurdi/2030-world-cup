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
      onerror="this.closest('.profile-media')?.remove();"
    >
  `;

  const renderGallery = (gallery = [], title = "") => {
    if (!gallery.length) return "";

    return `
      <div class="profile-gallery profile-gallery-${Math.min(gallery.length, 4)}">
        ${gallery
          .map(
            (image, index) => `
              <figure class="profile-media">
                ${renderImage(image, `${title} — source image ${index + 1}`)}
              </figure>
            `
          )
          .join("")}
      </div>
    `;
  };

  const renderLogo = (hero) => {
    const fallback = hero.fallbackLogo
      ? `this.onerror=null; this.src='${esc(hero.fallbackLogo)}';`
      : "this.remove();";

    return `
      <img
        src="${esc(hero.logo)}"
        alt="${esc(hero.country)} football association logo"
        onerror="${fallback}"
      >
    `;
  };

  const renderHero = ({ hero, meta }) => `
    <section class="profile-hero" aria-labelledby="country-title">
      <div class="profile-hero-inner">
        <div class="profile-hero-copy">
          <p class="profile-series">
            ${esc(hero.series)} · ${esc(hero.fileNumber)}
          </p>

          <div class="profile-country-row">
            <h1 id="country-title">${esc(hero.country)}</h1>
            <span class="profile-country-flag" aria-hidden="true">
              ${esc(hero.flag)}
            </span>
          </div>

          <p class="profile-association">${esc(hero.association)}</p>

          <div class="profile-hero-badges">
            <span class="status-${esc(hero.statusClass || "")}">
              2030 status: ${esc(hero.status)}
            </span>
            <span>Confederation: ${esc(hero.confederation)}</span>
            <span>World Cups: ${esc(hero.worldCupAppearances)}</span>
          </div>

          ${
            hero.statusDetail
              ? `<p class="profile-status-detail">${esc(hero.statusDetail)}</p>`
              : ""
          }

          <ul class="profile-best-records">
            ${hero.bestRecords.map((record) => `<li>${esc(record)}</li>`).join("")}
          </ul>

          <p class="profile-hashtag">${esc(hero.hashtag)}</p>
        </div>

        <div class="profile-logo-card">
          ${renderLogo(hero)}
        </div>
      </div>

      <div class="profile-source-strip">
        <span>Source: ${esc(meta.source.tweets)}-tweet thread</span>
        <span>${esc(meta.source.date)}</span>
        <span>${esc(meta.source.pdfPages)} PDF pages</span>
        ${
          meta.source.continuation
            ? `<span>${esc(meta.source.continuation.pages)}-page continuation</span>`
            : ""
        }
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
        ${facts
          .map(
            ([label, value]) => `
              <article>
                <span>${esc(label)}</span>
                <strong>${esc(value)}</strong>
              </article>
            `
          )
          .join("")}
      </section>
    `;
  };

  const renderNav = (sections, country) => `
    <nav class="profile-nav" aria-label="${esc(country)} profile sections">
      ${sections
        .map(
          (section) => `
            <a href="#${esc(section.id)}">
              <span>${esc(section.number)}</span>
              ${esc(section.title)}
            </a>
          `
        )
        .join("")}
    </nav>
  `;

  const renderEntry = (entry, sectionTitle) => `
    <article class="profile-story-entry">
      <div class="profile-story-copy">
        ${entry.date ? `<p class="profile-entry-date">${esc(entry.date)}</p>` : ""}
        ${entry.heading ? `<h3>${esc(entry.heading)}</h3>` : ""}

        ${(entry.paragraphs || [])
          .map((paragraph) => `<p>${esc(paragraph)}</p>`)
          .join("")}

        ${
          entry.sourcePages
            ? `<p class="profile-page-reference">PDF pp. ${esc(entry.sourcePages)}</p>`
            : ""
        }
      </div>

      ${renderGallery(entry.images || [], entry.heading || sectionTitle)}
    </article>
  `;

  const renderCards = (cards = []) => `
    <div class="profile-card-grid">
      ${cards
        .map(
          (card) => `
            <article class="profile-card">
              ${renderGallery(card.images || [], card.title)}

              <div class="profile-card-copy">
                ${card.meta ? `<p class="profile-card-meta">${esc(card.meta)}</p>` : ""}
                <h3>${esc(card.title)}</h3>
                <p>${esc(card.text)}</p>

                ${
                  card.sourcePages
                    ? `<p class="profile-page-reference">PDF pp. ${esc(card.sourcePages)}</p>`
                    : ""
                }
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;


  const renderLineup = (section) => `
    <div class="profile-lineup">
      <div class="profile-lineup-intro">
        ${section.intro ? `<p>${esc(section.intro)}</p>` : ""}
        <span class="profile-formation">${esc(section.lineup.formation)}</span>
      </div>

      ${
        section.lineup.image
          ? `
            <figure class="profile-lineup-board">
              ${renderImage(
                section.lineup.image,
                `${section.title} — ${section.lineup.formation}`,
                "profile-lineup-board-image"
              )}
            </figure>
          `
          : ""
      }

      <div class="profile-player-grid">
        ${section.lineup.players
          .map(
            (player) => `
              <article class="profile-player-card">
                ${
                  player.image
                    ? `
                      <figure class="profile-player-photo">
                        ${renderImage(
                          player.image,
                          player.name,
                          "profile-player-image"
                        )}
                      </figure>
                    `
                    : ""
                }

                <div class="profile-player-copy">
                  <p class="profile-player-position">
                    ${esc(player.position)} · ${esc(player.years || "")}
                  </p>
                  <h3>${esc(player.name)}</h3>
                  <p>${esc(player.description)}</p>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </div>
  `;

  const renderRecords = (section) => `
    <div class="profile-record-layout">
      <div class="profile-record-groups">
        ${section.recordGroups
          .map(
            (group) => `
              <article class="profile-record-group">
                <h3>${esc(group.title)}</h3>
                <ul>
                  ${group.items
                    .map((item) => `<li>${esc(item)}</li>`)
                    .join("")}
                </ul>
              </article>
            `
          )
          .join("")}
      </div>

      ${renderGallery(section.images || [], section.title)}
    </div>
  `;

  const renderLinks = (section) => `
    <div class="profile-link-grid">
      ${section.links
        .map(
          (link) => `
            <a
              class="profile-useful-link"
              href="${esc(link.url)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>${esc(link.label)}</span>
              <span aria-hidden="true">↗</span>
            </a>
          `
        )
        .join("")}
    </div>
  `;

  const renderSection = (section, country) => `
    <section
      id="${esc(section.id)}"
      class="profile-section"
      aria-labelledby="${esc(section.id)}-title"
    >
      <header class="profile-section-header">
        <span class="profile-section-number">${esc(section.number)}</span>

        <div>
          <p class="profile-section-kicker">
            The 211 Files · ${esc(country)}
          </p>

          <h2 id="${esc(section.id)}-title">${esc(section.title)}</h2>

          ${
            section.subtitle
              ? `<p class="profile-section-subtitle">${esc(section.subtitle)}</p>`
              : ""
          }
        </div>
      </header>

      <div class="profile-section-body">
        ${
          section.lineup
            ? renderLineup(section)
            : section.recordGroups
              ? renderRecords(section)
              : section.links
                ? renderLinks(section)
                : section.cards
                  ? renderCards(section.cards)
                  : `
                    <div class="profile-story-list">
                      ${(section.entries || [])
                        .map((entry) => renderEntry(entry, section.title))
                        .join("")}
                    </div>
                  `
        }
      </div>
    </section>
  `;

  const renderSourceBoundary = (meta) => `
    <aside class="profile-source-boundary" aria-labelledby="source-boundary-title">
      <p class="profile-boundary-kicker">Source notes</p>
      <h2 id="source-boundary-title">How this page was assembled</h2>
      <p>${esc(meta.sourceBoundary)}</p>
      <p>${esc(meta.numberingNote)}</p>
    </aside>
  `;

  const renderPage = (data) => {
    document.title = data.meta.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = data.meta.description;

    app.innerHTML = `
      ${renderHero(data)}

      <div class="profile-shell">
        ${renderQuickFacts(data.hero)}
        ${renderNav(data.sections, data.hero.country)}

        <div class="profile-section-list">
          ${data.sections
            .map((section) => renderSection(section, data.hero.country))
            .join("")}
        </div>

        ${renderSourceBoundary(data.meta)}

        <footer class="profile-footer">
          <p>
            Page content structured from the supplied Thread Reader PDF.
            Source order, section numbering, framing and substantive claims
            follow that document.
          </p>

          <a
            href="${esc(data.meta.source.url)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the original thread ↗
          </a>
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
          <h1>The Russia page could not be loaded</h1>
          <p>
            Check that <code>${esc(dataPath)}</code> exists and contains valid JSON.
          </p>
        </div>
      `;
    });
})();

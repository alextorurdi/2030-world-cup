(() => {
  "use strict";
  const page=document.body;
  const app=document.querySelector("#profile-app");
  const dataPath=page.dataset.profile;
  if(!app||!dataPath)return;

  const esc=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

  const renderImage=(src,alt,className="profile-media-image")=>`
    <img class="${className}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy"
      onerror="this.closest('figure')?.remove();">`;

  const renderGallery=(images=[],title="")=>{
    if(!images.length)return "";
    return `<div class="profile-gallery profile-gallery-${Math.min(images.length,4)}">
      ${images.map((src,i)=>`<figure class="profile-media">${renderImage(src,`${title} — source image ${i+1}`)}</figure>`).join("")}
    </div>`;
  };

  const renderHero=(data)=>{
    const {hero,meta}=data;
    return `<section class="profile-hero">
      <div class="profile-hero-inner">
        <div class="profile-hero-copy">
          <p class="profile-series">${esc(hero.series)} · ${esc(hero.fileNumber)}</p>
          <div class="profile-country-row"><h1>${esc(hero.country)}</h1><span class="profile-country-flag">${esc(hero.flag)}</span></div>
          <p class="profile-association">${esc(hero.association)}</p>
          <div class="profile-hero-badges"><span>2030 status: ${esc(hero.status)}</span><span>${esc(hero.confederation)}</span><span>World Cups: ${esc(hero.worldCupAppearances)}</span></div>
          <ul class="profile-best-records">${hero.bestRecords.map((x)=>`<li>${esc(x)}</li>`).join("")}</ul>
          <p class="profile-hashtag">${esc(hero.hashtag)}</p>
        </div>
        <div class="profile-logo-card"><img src="${esc(hero.logo)}" alt="${esc(hero.country)} football association logo"
          onerror="this.onerror=null;this.src='${esc(hero.fallbackLogo)}';"></div>
      </div>
      <div class="profile-source-strip"><span>${esc(meta.source.label)}</span><span>${esc(meta.source.imageCount)} original source images</span></div>
    </section>`;
  };

  const renderFacts=(hero)=>{
    const facts=[["FA founded",hero.founded],["Joined FIFA",hero.fifa],["Confederation",hero.confederation],["2030 status",hero.status],["World Cup appearances",hero.worldCupAppearances]];
    return `<section class="profile-facts">${facts.map(([l,v])=>`<article><span>${esc(l)}</span><strong>${esc(v)}</strong></article>`).join("")}</section>`;
  };

  const renderNav=(sections)=>`<nav class="profile-nav">${sections.map((s)=>`<a href="#${esc(s.id)}"><span>${esc(s.number)}</span>${esc(s.title)}</a>`).join("")}</nav>`;

  const renderEntry=(entry,sectionTitle)=>`<article class="profile-story-entry">
    <div class="profile-story-copy">
      ${entry.date?`<p class="profile-entry-date">${esc(entry.date)}</p>`:""}
      ${entry.heading?`<h3>${esc(entry.heading)}</h3>`:""}
      ${(entry.paragraphs||[]).map((p)=>`<p>${esc(p)}</p>`).join("")}
    </div>
    ${renderGallery(entry.images||[],entry.heading||sectionTitle)}
  </article>`;

  const renderCards=(cards=[])=>`<div class="profile-card-grid">${cards.map((card)=>`<article class="profile-card">
    ${renderGallery(card.images||[],card.title)}
    <div class="profile-card-copy">${card.meta?`<p class="profile-card-meta">${esc(card.meta)}</p>`:""}<h3>${esc(card.title)}</h3><p>${esc(card.text)}</p></div>
  </article>`).join("")}</div>`;

  const renderLineup=(section)=>`<div class="profile-lineup-layout">
    <div>
      <figure class="profile-lineup-image profile-media">${renderImage(section.lineup.image,"Grenada historical line-up graphic")}</figure>
      <div class="profile-player-grid">${section.lineup.players.map((p)=>`<article class="profile-player-card">
        <figure class="profile-player-photo">${renderImage(p.image,`${p.name} — Grenada historical line-up`,"profile-player-image")}</figure>
        <div class="profile-player-copy"><p class="profile-player-position">${esc(p.position)} · ${esc(p.years)}</p><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p></div>
      </article>`).join("")}</div>
    </div>
    <aside class="profile-lineup-aside"><p class="profile-formation">${esc(section.lineup.formation)}</p><p>${esc(section.closing)}</p></aside>
  </div>`;

  const renderRecords=(section)=>`<div class="profile-record-grid">${section.recordGroups.map((g)=>`<article class="profile-record-group"><h3>${esc(g.title)}</h3><ul>${g.items.map((x)=>`<li>${esc(x)}</li>`).join("")}</ul></article>`).join("")}</div>${renderGallery(section.images||[],section.title)}`;

  const renderBody=(section)=>{
    if(section.lineup)return renderLineup(section);
    if(section.recordGroups)return renderRecords(section);
    if(section.cards)return renderCards(section.cards);
    return `<div class="profile-story-list">${(section.entries||[]).map((e)=>renderEntry(e,section.title)).join("")}</div>`;
  };

  const renderSection=(s)=>`<section id="${esc(s.id)}" class="profile-section">
    <header class="profile-section-header"><span class="profile-section-number">${esc(s.number)}</span><div>
      <p class="profile-section-kicker">The 211 Files · Grenada</p><h2>${esc(s.title)}</h2>
      ${s.subtitle?`<p class="profile-section-subtitle">${esc(s.subtitle)}</p>`:""}
      ${s.intro?`<p class="profile-section-intro">${esc(s.intro)}</p>`:""}
    </div></header>
    <div class="profile-section-body">${renderBody(s)}</div>
  </section>`;

  fetch(dataPath,{cache:"no-store"})
    .then((r)=>{if(!r.ok)throw new Error(`Could not load ${dataPath}: ${r.status}`);return r.json();})
    .then((data)=>{
      document.title=data.meta.title;
      const d=document.querySelector('meta[name="description"]'); if(d)d.content=data.meta.description;
      app.innerHTML=`${renderHero(data)}<div class="profile-shell">${renderFacts(data.hero)}${renderNav(data.sections)}<div class="profile-section-list">${data.sections.map(renderSection).join("")}</div><footer class="profile-footer"><p>Content structured from the supplied Grenada thread export. Project-specific 2026–30 claims are preserved as source material.</p></footer></div>`;
    })
    .catch((error)=>{console.error(error);app.innerHTML=`<div class="profile-error"><h1>The Grenada page could not be loaded</h1><p>Check that <code>${esc(dataPath)}</code> exists and contains valid JSON.</p></div>`;});
})();

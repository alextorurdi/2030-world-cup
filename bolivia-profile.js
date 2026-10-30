(() => {
  "use strict";
  const app=document.querySelector("#profile-app");
  const dataPath=document.body.dataset.profile;
  if(!app||!dataPath)return;

  const esc=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const image=(src,alt,className="profile-media-image")=>`<img class="${className}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.closest('figure')?.remove();">`;
  const gallery=(images=[],title="")=>{
    if(!images.length)return "";
    return `<div class="profile-gallery profile-gallery-${Math.min(images.length,4)}">${images.map((src,i)=>`<figure class="profile-media">${image(src,`${title} — source image ${i+1}`)}</figure>`).join("")}</div>`;
  };

  const hero=(data)=>`<section class="profile-hero">
    <div class="profile-hero-inner">
      <div class="profile-hero-copy">
        <p class="profile-series">${esc(data.hero.series)} · ${esc(data.hero.fileNumber)}</p>
        <div class="profile-country-row"><h1>${esc(data.hero.country)}</h1><span class="profile-country-flag">${esc(data.hero.flag)}</span></div>
        <p class="profile-association">${esc(data.hero.association)}</p>
        <div class="profile-hero-badges"><span>2030 status: ${esc(data.hero.status)}</span><span>${esc(data.hero.confederation)}</span><span>World Cups: ${esc(data.hero.worldCupAppearances)}</span></div>
        <ul class="profile-best-records">${data.hero.bestRecords.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
        <p class="profile-hashtag">${esc(data.hero.hashtag)}</p>
      </div>
      <div class="profile-logo-card"><img src="${esc(data.hero.logo)}" alt="${esc(data.hero.country)} football association logo" onerror="this.onerror=null;this.src='${esc(data.hero.fallbackLogo)}';"></div>
    </div>
    <div class="profile-source-strip"><span>${esc(data.meta.source.label)}</span><span>${esc(data.meta.source.imageCount)} original source images</span></div>
  </section>`;

  const facts=(h)=>{
    const items=[["FA founded",h.founded],["Joined FIFA",h.fifa],["Confederation",h.confederation],["2030 status",h.status],["World Cup appearances",h.worldCupAppearances]];
    return `<section class="profile-facts">${items.map(([l,v])=>`<article><span>${esc(l)}</span><strong>${esc(v)}</strong></article>`).join("")}</section>`;
  };

  const nav=(sections)=>`<nav class="profile-nav">${sections.map(s=>`<a href="#${esc(s.id)}"><span>${esc(s.number)}</span>${esc(s.title)}</a>`).join("")}</nav>`;

  const entry=(e,title)=>`<article class="profile-story-entry">
    <div class="profile-story-copy">${e.date?`<p class="profile-entry-date">${esc(e.date)}</p>`:""}${e.heading?`<h3>${esc(e.heading)}</h3>`:""}${(e.paragraphs||[]).map(p=>`<p>${esc(p)}</p>`).join("")}</div>
    ${gallery(e.images||[],e.heading||title)}
  </article>`;

  const cards=(items=[])=>`<div class="profile-card-grid">${items.map(c=>`<article class="profile-card">${gallery(c.images||[],c.title)}<div class="profile-card-copy">${c.meta?`<p class="profile-card-meta">${esc(c.meta)}</p>`:""}<h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></div></article>`).join("")}</div>`;

  const lineup=(s)=>`<div class="profile-lineup-layout">
    <div>
      <figure class="profile-lineup-image profile-media">${image(s.lineup.image,"Bolivia historical line-up graphic")}</figure>
      <div class="profile-player-grid">${s.lineup.players.map(p=>`<article class="profile-player-card"><figure class="profile-player-photo">${image(p.image,`${p.name} — Bolivia historical line-up`,"profile-player-image")}</figure><div class="profile-player-copy"><p class="profile-player-position">${esc(p.position)} · ${esc(p.years)}</p><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p></div></article>`).join("")}</div>
    </div>
    <aside class="profile-lineup-aside"><p class="profile-formation">${esc(s.lineup.formation)}</p><p>${esc(s.closing)}</p></aside>
  </div>`;

  const records=(s)=>`<div class="profile-record-grid">${s.recordGroups.map(g=>`<article class="profile-record-group"><h3>${esc(g.title)}</h3><ul>${g.items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></article>`).join("")}</div>${gallery(s.images||[],s.title)}`;

  const body=(s)=>{
    if(s.lineup)return lineup(s);
    if(s.recordGroups)return records(s);
    if(s.cards)return cards(s.cards);
    return `<div class="profile-story-list">${(s.entries||[]).map(e=>entry(e,s.title)).join("")}</div>`;
  };

  const section=(s)=>`<section id="${esc(s.id)}" class="profile-section">
    <header class="profile-section-header"><span class="profile-section-number">${esc(s.number)}</span><div><p class="profile-section-kicker">The 211 Files · Bolivia</p><h2>${esc(s.title)}</h2>${s.subtitle?`<p class="profile-section-subtitle">${esc(s.subtitle)}</p>`:""}${s.intro?`<p class="profile-section-intro">${esc(s.intro)}</p>`:""}</div></header>
    <div class="profile-section-body">${body(s)}</div>
  </section>`;

  fetch(dataPath,{cache:"no-store"})
    .then(r=>{if(!r.ok)throw new Error(`Could not load ${dataPath}: ${r.status}`);return r.json();})
    .then(data=>{
      document.title=data.meta.title;
      const d=document.querySelector('meta[name="description"]'); if(d)d.content=data.meta.description;
      app.innerHTML=`${hero(data)}<div class="profile-shell">${facts(data.hero)}${nav(data.sections)}<div class="profile-section-list">${data.sections.map(section).join("")}</div><footer class="profile-footer"><p>Content structured from the supplied Bolivia thread export. Project-specific 2025–30 claims are preserved as source material.</p></footer></div>`;
    })
    .catch(error=>{console.error(error);app.innerHTML=`<div class="profile-error"><h1>The Bolivia page could not be loaded</h1><p>Check that <code>${esc(dataPath)}</code> exists and contains valid JSON.</p></div>`;});
})();

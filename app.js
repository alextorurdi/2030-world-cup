const app = document.querySelector("#app");
const searchInput = document.querySelector("#search");
const confederationFilter = document.querySelector("#confederation-filter");
const statusFilter = document.querySelector("#status-filter");
const resetButton = document.querySelector("#reset-filters");
const visibleCount = document.querySelector("#visible-count");
const dialog = document.querySelector("#association-dialog");
const dialogContent = document.querySelector("#dialog-content");
const dialogClose = document.querySelector(".dialog-close");

const STATUS_LABELS = {
  "qualified-host": "Qualified host",
  active: "In the race",
  eliminated: "Eliminated",
  "not-entering": "Not entering"
};

let database = null;

function normalize(value = "") {
  return value
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function populateConfederationFilter(confederations) {
  const options = confederations
    .map(({ id, name }) => `<option value="${id}">${name}</option>`)
    .join("");

  confederationFilter.insertAdjacentHTML("beforeend", options);
}

function createLogoMarkup(association) {
  const fallback = `
    <span class="association-fallback" aria-hidden="true">
      ${association.code}
    </span>
  `;

  if (!association.logo) {
    return fallback;
  }

  return `
    <img
      class="association-logo"
      src="${association.logo}"
      alt=""
      loading="lazy"
      onerror="this.hidden=true; this.nextElementSibling.hidden=false;"
    >
    <span class="association-fallback" aria-hidden="true" hidden>
      ${association.code}
    </span>
  `;
}

function associationMatches(association, confederationId, query, wantedStatus) {
  const matchesConfederation =
    confederationId === "all" || association.confederation === confederationId;

  const matchesStatus =
    wantedStatus === "all" || association.status === wantedStatus;

  const haystack = normalize(
    `${association.name} ${association.associationName || ""} ${association.code}`
  );
  const matchesQuery = !query || haystack.includes(query);

  return matchesConfederation && matchesStatus && matchesQuery;
}

function createAssociationCard(association) {
  const tag = association.page ? "a" : "button";
  const href = association.page ? ` href="${association.page}"` : "";
  const type = association.page ? "" : ' type="button"';
  const actionClass = association.page ? " has-page" : " opens-dialog";

  return `
    <${tag}
      class="association-card${actionClass}"
      data-code="${association.code}"
      data-status="${association.status}"
      ${href}${type}
      aria-label="${association.name}: ${STATUS_LABELS[association.status]}"
    >
      <span class="logo-frame">
        ${createLogoMarkup(association)}
      </span>

      <span class="association-name" title="${association.name}">
        ${association.flag ? `${association.flag} ` : ""}${association.name}
      </span>

      <span class="association-status">
        ${STATUS_LABELS[association.status]}
      </span>
    </${tag}>
  `;
}

function createSlots(confederation) {
  const qualifiedAssociations = confederation.associations.filter(
    (association) =>
      association.status === "qualified-host" ||
      association.status === "qualified"
  );

  const slots = Array.from(
    { length: confederation.slotMarkers },
    (_, index) => {
      const association = qualifiedAssociations[index];

      if (!association) {
        return `
          <span
            class="slot"
            title="Qualification place ${index + 1}"
          ></span>
        `;
      }

      const logo = association.logo
        ? `
          <img
            class="slot-logo"
            src="${association.logo}"
            alt="${association.name}"
            loading="lazy"
            onerror="this.remove();"
          >
        `
        : "";

      return `
        <span
          class="slot slot-filled"
          title="${association.name} — ${
            STATUS_LABELS[association.status] || "Qualified"
          }"
        >
          ${logo}
        </span>
      `;
    }
  ).join("");

  return `
    <aside
      class="slot-column"
      aria-label="${confederation.name} qualification places"
    >
      ${slots}
      <span class="slot-label">Places</span>
    </aside>
  `;
}

function createConfederationSection(confederation, visibleAssociations) {
  return `
    <section
      class="confederation"
      aria-labelledby="${confederation.id}-heading"
      style="
        --section-bg: ${confederation.background};
        --section-ink: ${confederation.textColor};
      "
    >
      <div class="confederation-inner">
        <header class="confederation-identity">
          <img
            class="confederation-mark"
            src="${confederation.logo}"
            alt=""
          >
          <h2 id="${confederation.id}-heading">${confederation.name}</h2>
          <p class="member-count" title="Configured membership total">
            ${confederation.memberCount}
          </p>
        </header>

        <div class="association-grid">
          ${visibleAssociations.map(createAssociationCard).join("")}
        </div>

        ${createSlots(confederation)}
      </div>
    </section>
  `;
}

function render() {
  if (!database) return;

  const query = normalize(searchInput.value);
  const selectedConfederation = confederationFilter.value;
  const selectedStatus = statusFilter.value;

  let shown = 0;
  const sections = [];

  for (const confederation of database.confederations) {
    const visibleAssociations = confederation.associations.filter((association) =>
      associationMatches(
        association,
        selectedConfederation,
        query,
        selectedStatus
      )
    );

    if (!visibleAssociations.length) continue;

    shown += visibleAssociations.length;
    sections.push(createConfederationSection(confederation, visibleAssociations));
  }

  visibleCount.textContent = shown.toString();

  app.innerHTML = sections.length
    ? sections.join("")
    : `
      <div class="empty-state">
        <h2>No associations found</h2>
        <p>Try removing one of the filters or searching with a shorter term.</p>
      </div>
    `;

  bindDialogButtons();
}

function findAssociation(code) {
  for (const confederation of database.confederations) {
    const association = confederation.associations.find(
      (candidate) => candidate.code === code
    );

    if (association) {
      return { association, confederation };
    }
  }

  return null;
}

function openAssociationDialog(code) {
  const result = findAssociation(code);
  if (!result) return;

  const { association, confederation } = result;

  dialogContent.innerHTML = `
    <article class="dialog-card">
      <p class="dialog-code">${association.code} · ${confederation.name}</p>
      <h2>${association.flag ? `${association.flag} ` : ""}${association.name}</h2>
      <p>${association.associationName || "Football association profile"}</p>
      <span class="dialog-status">${STATUS_LABELS[association.status]}</span>
      <p class="dialog-note">
        ${association.note || "Add a page path in associations.json when the full profile is ready."}
      </p>
    </article>
  `;

  dialog.showModal();
}

function bindDialogButtons() {
  document.querySelectorAll(".opens-dialog").forEach((button) => {
    button.addEventListener("click", () => {
      openAssociationDialog(button.dataset.code);
    });
  });
}

function closeDialog() {
  if (dialog.open) dialog.close();
}

async function loadDatabase() {
  try {
    const response = await fetch("./data/associations.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Could not load associations.json (${response.status})`);
    }

    database = await response.json();
    populateConfederationFilter(database.confederations);
    render();
  } catch (error) {
    console.error(error);

    app.innerHTML = `
      <div class="error-message">
        <h2>The data could not be loaded</h2>
        <p>
          Check that <code>data/associations.json</code> exists and contains valid JSON.
          The browser console contains the technical error.
        </p>
      </div>
    `;
  }
}

[searchInput, confederationFilter, statusFilter].forEach((control) => {
  control.addEventListener("input", render);
  control.addEventListener("change", render);
});

resetButton.addEventListener("click", () => {
  searchInput.value = "";
  confederationFilter.value = "all";
  statusFilter.value = "all";
  render();
  searchInput.focus();
});

dialogClose.addEventListener("click", closeDialog);

dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const clickedOutside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (clickedOutside) closeDialog();
});

loadDatabase();

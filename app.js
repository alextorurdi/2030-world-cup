const app = document.querySelector("#app");

async function loadAssociations() {
  try {
    const response = await fetch("./data/associations.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const associations = await response.json();

    app.innerHTML = `
      <h2>Football associations</h2>
      <p>${associations.length} associations loaded.</p>
    `;
  } catch (error) {
    console.error(error);
    app.innerHTML = "<p>The association data could not be loaded.</p>";
  }
}

loadAssociations();

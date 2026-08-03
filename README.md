# The 211 Files — Road to 2030

A no-build, static website designed for GitHub Pages.

## Files

- `index.html` — main board
- `styles.css` — complete responsive styling
- `app.js` — loads the JSON, creates the boards, search and filters
- `data/associations.json` — all editable project data
- `associations/spain.html` — sample detailed profile
- `associations/template.html` — copy this file for every new profile
- `assets/confederations/` — replace the generic badges if desired
- `assets/logos/` — add association logos by confederation

## Publish it

1. Upload the contents of this folder to the root of your GitHub repository.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**.
4. Choose `main` and `/ (root)`.
5. Save.

The site should appear at:

`https://YOUR-USERNAME.github.io/2030-world-cup/`

## Add a real association logo

Place the image in the correct folder, for example:

`assets/logos/uefa/spain.webp`

Then edit the entry in `data/associations.json`:

```json
"logo": "./assets/logos/uefa/spain.webp"
```

Recommended logo format: transparent WebP or PNG, roughly 200 × 200 px.

## Add a profile page

1. Copy `associations/template.html`.
2. Rename it, for example `associations/nepal.html`.
3. Edit its content.
4. Add this property to Nepal's JSON entry:

```json
"page": "./associations/nepal.html"
```

Without a `page` property, clicking the association opens a compact information dialog.

## Add more associations

Copy an existing object inside the correct `associations` array:

```json
{
  "name": "Nepal",
  "associationName": "All Nepal Football Association",
  "code": "NEP",
  "flag": "🇳🇵",
  "confederation": "afc",
  "status": "active",
  "logo": "./assets/logos/afc/nepal.webp",
  "page": "./associations/nepal.html"
}
```

Valid status values:

- `qualified-host`
- `active`
- `eliminated`
- `not-entering`

## Important

The included association list is a **layout-ready sample**, not the final 211-entry database.
The membership totals and yellow marker counts are editable visual fields in the JSON.

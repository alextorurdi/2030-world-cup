RUSSIA PAGE — PDF-SOURCED UPDATE
================================

Upload the CONTENTS of this package to the root of your existing repository,
preserving the folder structure.

FILES
-----

associations/russia.html
data/profiles/russia.json
russia-profile.css
russia-profile.js
assets/russia/thread/*.webp
russia-board-entry.json

LOGO
----

The page first looks for:

assets/logos/uefa/002.png

If that file is missing, it automatically uses the RFS crest extracted from
the supplied PDF.

ADD RUSSIA TO THE MAIN BOARD
----------------------------

Copy the object in russia-board-entry.json into UEFA's associations array in:

data/associations.json

Your current main-board code may not yet recognise "suspended". Add it to the
STATUS_LABELS object in app.js:

suspended: "Suspended"

Add this option to the status filter in index.html:

<option value="suspended">Suspended</option>

Add these rules to styles.css:

.association-card[data-status="suspended"]::after {
  background: #242b31;
}

.association-card[data-status="suspended"] .association-logo,
.association-card[data-status="suspended"] .association-fallback {
  filter: grayscale(1);
  opacity: 0.58;
}

SOURCE BOUNDARY
---------------

The supplied PDF:
- contains 18 pages and 26 tweets;
- jumps from section 3 directly to section 5;
- ends after Russia's 1994 World Cup, followed by an ellipsis.

The generated page preserves those limitations rather than inventing the
missing section or adding later national-team history.

Language has been lightly normalised for readability. The document's framing,
chronology and substantive claims have not been silently replaced with outside
research.


CONTINUATION UPDATE
-------------------

This updated package also incorporates the supplied seven-page Russia.docx
continuation.

It adds:
- Russia's national-team history from Euro 1996 through the 2022 suspension;
- the 2018 World Cup hosting section;
- section 8, the historical 4-2-3-1 line-up;
- section 9, national-team records;
- section 10, useful X accounts;
- 18 images extracted from the continuation document.

Continuation images are stored in:

assets/russia/continuation/

The complete page now preserves the source numbering:
1, 2, 3, 5, 6, 7, 8, 9 and 10.

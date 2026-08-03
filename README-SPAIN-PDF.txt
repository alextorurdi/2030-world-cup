SPAIN PROFILE — PDF-SOURCED UPDATE
==================================

This package rebuilds the Spain page from the supplied 58-page Thread Reader PDF.

UPLOAD THESE PATHS TO THE ROOT OF YOUR EXISTING REPOSITORY
----------------------------------------------------------

associations/spain.html
data/profiles/spain.json
spain-profile.css
spain-profile.js
assets/spain/thread/...

Your existing data/associations.json entry for Spain should still contain:

"page": "./associations/spain.html"

HOW IT WORKS
------------

- associations/spain.html is only the page shell.
- data/profiles/spain.json contains all text and structure.
- spain-profile.js builds the page from the JSON.
- spain-profile.css controls the visual layout.
- assets/spain/thread contains the images extracted from the PDF.

SOURCE POLICY
-------------

The section order, framing and substantive claims follow the supplied PDF.
Obvious line-wrap artefacts were removed and some grammar was lightly normalised for the
webpage. No outside research was used to add or verify facts.

EDITING
-------

To change text:
data/profiles/spain.json

To change the RFEF logo:
Edit hero.logo near the top of data/profiles/spain.json

To change an image:
Replace the relevant file under assets/spain/thread or update its path in the JSON.

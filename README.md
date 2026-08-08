# Dr. Joseph LaValley Dental Intake — UX Prototype

Mobile-first, one-question-at-a-time static prototype built with HTML, CSS, and vanilla JavaScript. The 2077 interface includes an opening language gateway, accessibility controls, progress and time estimates, review/edit cards, clinical-alert highlighting, staff demo data, inactivity protection, and a print-ready office packet.

## Important

This is a public UX demo, not a production clinical system and not a claim of HIPAA compliance. Use fictional information only. The demo has no application server and does not email or upload patient information. Saved profiles use only the current browser's `localStorage`, and printable packets are generated locally.

Real deployment requires qualified privacy/security and legal review plus an approved secure backend, encryption, authentication and authorization, BAAs where required, audit logs, retention/deletion controls, versioned consent, accessibility/clinical review, secure patient identity matching, and vetted EHR/FHIR integration. Ordinary email must not be used for PHI unless the practice's compliance program expressly approves and secures it.

## Fake email pilot

This build sends a fixed fictional `Demo Patient` sample to `zanealexander88@gmail.com` through Web3Forms after the final Generate action. It includes a direct link to `sample-office-packet.pdf`, a public three-page printable packet containing only fixed fictional information. It never places answers typed into the form, insurance images, or generated packet contents into that request. This relay is for fake-data workflow testing only and must be removed from any production build.

## Configure

Set `CONFIG.officeAddress`, `CONFIG.officePhone`, and `CONFIG.officeEmail` near the top of `script.js` after the practice chooses an approved secure delivery workflow. The current placeholders are intentionally printed visibly so they cannot be mistaken for working delivery configuration.

Standard browser address autofill is enabled. The prototype also demonstrates explicit address matching through the public U.S. Census geocoder; a production provider should be selected through the practice's privacy/security review.

## Prototype integrations

- Address matching uses the public U.S. Census single-address geocoder and always asks the patient to confirm the result.
- Medication autocomplete uses active RxNorm approximate matches from the U.S. National Library of Medicine.
- Insurance-card front/back images are captured locally and included in the locally generated packet. The prototype does not claim that an image verifies active coverage.
- The language gateway uses Google Translate when it is available online. Machine-translated medical wording may be incorrect and must be reviewed before clinical use; English remains the prototype's source language.
- Staff demo mode fills only obvious fictional information. The shared-device inactivity timer warns after nine minutes and clears an unfinished draft after ten minutes.
- Replace these public/demo integrations with practice-approved services before any real deployment.

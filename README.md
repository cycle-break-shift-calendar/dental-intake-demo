# Dr. Joseph LaValley Dental Intake — UX Prototype

Mobile-first, one-question-at-a-time static prototype built with HTML, CSS, and vanilla JavaScript.

## Important

This is a public UX demo, not a production clinical system and not a claim of HIPAA compliance. Use fictional information only. The demo has no application server and does not email or upload patient information. Saved profiles use only the current browser's `localStorage`, and printable packets are generated locally.

Real deployment requires qualified privacy/security and legal review plus an approved secure backend, encryption, authentication and authorization, BAAs where required, audit logs, retention/deletion controls, versioned consent, accessibility/clinical review, secure patient identity matching, and vetted EHR/FHIR integration. Ordinary email must not be used for PHI unless the practice's compliance program expressly approves and secures it.

## Configure

Set `CONFIG.officeEmail` near the top of `script.js` after the practice chooses an approved secure delivery workflow. The current placeholder is intentionally printed visibly so it cannot be mistaken for a working delivery configuration.

Standard browser address autofill is enabled. The prototype also demonstrates explicit address matching through the public U.S. Census geocoder; a production provider should be selected through the practice's privacy/security review.

## Prototype integrations

- Address matching uses the public U.S. Census single-address geocoder and always asks the patient to confirm the result.
- Medication autocomplete uses active RxNorm approximate matches from the U.S. National Library of Medicine.
- Insurance-card front/back images are captured locally and included in the locally generated packet. The prototype does not claim that an image verifies active coverage.
- Replace these public/demo integrations with practice-approved services before any real deployment.

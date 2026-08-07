# Dental Office Paperless Intake Pilot

A mobile-first, static prototype for testing a QR-code patient intake experience at a dental office. It uses only HTML, CSS, and vanilla JavaScript—no build step or server.

## Run it

Open `index.html` in a modern browser, or serve this folder with any static web host. For example, GitHub Pages, Cloudflare Pages, Netlify, or a basic local web server can host these files as-is. Point a QR code at the deployed `https://` URL.

## Demo features

- Tap-friendly demographics, contact, insurance, medical and dental history
- Pointer/touch signature pad
- Optional reusable profile stored only in the current browser's `localStorage`
- Clear-profile and delete-current-session controls
- Locally generated printable packet; the browser's print dialog can save it as PDF
- A simulated sharing action that opens a mail draft without patient data in its URL

## Important privacy and production notes

This is a UX prototype, not a clinical system, and it makes no claim of HIPAA compliance. Do not enter real patient information. No application server is present, but browser extensions, the device, screenshots, printing, and local browser storage still create privacy risks.

Before real use, engage qualified healthcare privacy/security counsel and implement an appropriate security and compliance program. Production work would include threat modeling; encryption and key management; authentication and authorization; secure transport; vendor BAAs where required; audit logs; retention and verified deletion; accessibility and clinical/legal review; consent text versioning and evidence; and secure EHR integration, typically using validated FHIR mappings. Ordinary email should not be the delivery channel for sensitive data.

## File map

- `index.html` — screens, form fields, and packet container
- `styles.css` — responsive dental-office styling and print layout
- `script.js` — local form/profile behavior, signature drawing, packet generation, and mail draft

## Customization

Replace “Your Dental Office” in `index.html` and `script.js`, update the consent placeholders only after office/legal review, and configure an approved secure delivery workflow before any production pilot.

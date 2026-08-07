'use strict';

// Prototype privacy model: form state lives in this page; an optional profile lives
// only in localStorage. Production requires reviewed encryption at rest/in transit,
// authenticated access, BAAs with vendors, audit logs, retention/deletion controls,
// versioned consent records, and secured EHR/FHIR integration.
const STORAGE_KEY = 'dental-intake-demo-profile-v1';
const form = document.querySelector('#intakeForm');
const canvas = document.querySelector('#signaturePad');
const ctx = canvas.getContext('2d');
let drawing = false;
let signed = false;
let packetData = null;

const $ = (s) => document.querySelector(s);
const show = (id) => {
  document.querySelectorAll('.screen').forEach((el) => el.classList.toggle('active', el.id === id));
  window.scrollTo({top: 0, behavior: 'smooth'});
};
const toast = (message) => {
  const el = $('#toast'); el.textContent = message; el.classList.add('show');
  window.setTimeout(() => el.classList.remove('show'), 2600);
};
const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function serializeForm() {
  const fd = new FormData(form); const data = {};
  for (const [key, value] of fd.entries()) data[key] = data[key] ? [].concat(data[key], value) : value;
  data.signature = signed ? canvas.toDataURL('image/png') : '';
  data.createdAt = new Date().toISOString();
  return data;
}

function restoreForm(data) {
  if (!data) return;
  form.reset();
  Object.entries(data).forEach(([name, value]) => {
    if (['signature','createdAt'].includes(name)) return;
    const controls = form.elements.namedItem(name); if (!controls) return;
    const values = [].concat(value);
    if (controls instanceof RadioNodeList || (controls.length && !controls.tagName)) {
      [...controls].forEach((control) => { if (control.type === 'radio' || control.type === 'checkbox') control.checked = values.includes(control.value); });
    } else if (controls.type === 'checkbox') controls.checked = values.includes(controls.value) || value === true;
    else controls.value = value;
  });
  toggleInsurance();
  clearSignature(); // Signature is intentionally never restored or saved for reuse.
  toast('Saved profile loaded. Please review every answer.');
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return toast('No saved profile found on this device.');
    restoreForm(JSON.parse(raw)); show('intake');
  } catch { toast('The saved profile could not be read.'); }
}

function saveProfile(data) {
  // Never reuse signatures or consent acceptance. Production needs authenticated,
  // encrypted patient-controlled storage and explicit consent/version management.
  const reusable = {...data, signature: '', accuracyConsent: undefined, treatmentConsent: undefined};
  delete reusable.createdAt;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reusable)); toast('Profile saved only in this browser.'); }
  catch { toast('This browser could not save the profile.'); }
}

function clearProfile() {
  localStorage.removeItem(STORAGE_KEY); toast('Saved profile cleared from this browser.');
}

function deleteSession() {
  form.reset(); packetData = null; clearSignature(); toggleInsurance(); show('welcome');
  toast('Current session data deleted. Saved profile was not changed.');
}

function resizeCanvas() {
  const image = signed ? canvas.toDataURL() : null;
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(150 * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.strokeStyle = '#173337';
  if (image) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, rect.width, 150); img.src = image; }
}
function point(e) { const rect = canvas.getBoundingClientRect(); return {x:e.clientX-rect.left,y:e.clientY-rect.top}; }
function startDraw(e) { drawing=true; signed=true; const p=point(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); canvas.setPointerCapture(e.pointerId); }
function draw(e) { if(!drawing)return; const p=point(e); ctx.lineTo(p.x,p.y); ctx.stroke(); }
function stopDraw(){ drawing=false; }
function clearSignature(){ ctx.clearRect(0,0,canvas.width,canvas.height); signed=false; }

function toggleInsurance(){ $('#insuranceFields').classList.toggle('hidden', form.elements.hasInsurance.value !== 'Yes'); }
function updateProgress(){ const required=[...form.querySelectorAll('[required]')]; const done=required.filter((el)=>el.type==='checkbox'?el.checked:el.value.trim()).length; $('#progressBar').style.width=`${Math.round(done/required.length*100)}%`; }
function list(value){ return Array.isArray(value) ? value.join(', ') : (value || 'None reported'); }
function row(label,value){ return `<div class="summary-row"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value || 'Not provided')}</span></div>`; }

function buildPacket(data){
  const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  $('#packetContent').innerHTML = `
    <div class="packet-header"><div><p class="eyebrow">Your Dental Office</p><h1 id="packet-title">Patient intake summary</h1></div><div><strong>DEMO</strong><br>${escapeHtml(new Date(data.createdAt).toLocaleString())}</div></div>
    <p class="demo-watermark"><strong>Prototype document — not for clinical use.</strong> Patient and office should verify all information.</p>
    <h2>Patient</h2><div class="summary-grid">${row('Name',fullName)}${row('Date of birth',data.dob)}${row('Pronouns',data.pronouns)}${row('Phone',data.phone)}${row('Email',data.email)}${row('Preferred contact',data.contactMethod)}${row('Address',[data.address,data.city,data.state,data.zip].filter(Boolean).join(', '))}</div>
    <h2>Emergency contact</h2><div class="summary-grid">${row('Name',data.emergencyName)}${row('Relationship',data.emergencyRelation)}${row('Phone',data.emergencyPhone)}</div>
    <h2>Insurance</h2><div class="summary-grid">${row('Covered',data.hasInsurance)}${data.hasInsurance==='Yes' ? row('Provider',data.insuranceProvider)+row('Member ID',data.memberId)+row('Policyholder',data.policyholder)+row('Group number',data.groupNumber) : ''}</div>
    <h2>Medical history</h2><div class="summary-grid">${row('Conditions',list(data.conditions))}${row('Other details',data.medicalDetails)}${row('Allergies',data.allergies)}${row('Medications',data.medications)}</div>
    <h2>Dental history & concerns</h2><div class="summary-grid">${row('Last visit',data.lastVisit)}${row('Cleaning frequency',data.cleaningFrequency)}${row('Concerns',list(data.concerns))}${row('Details',data.concernDetails)}${row('Dental anxiety',data.anxiety)}</div>
    <h2>Acknowledgments</h2><p>☑ Information accuracy acknowledged<br>☑ Demo consent placeholder acknowledged</p>
    <h2>Signature</h2>${data.signature ? `<img class="signature-image" src="${data.signature}" alt="Patient signature">` : '<p>No drawn signature provided</p>'}<p><strong>${escapeHtml(data.signatureName)}</strong><br><small>Signed ${escapeHtml(new Date(data.createdAt).toLocaleString())}</small></p>
    <p><small>Generated locally in the patient’s browser. This prototype does not transmit, certify, or securely retain this record.</small></p>`;
}

$('#startBtn').addEventListener('click',()=>show('intake'));
$('#loadWelcomeBtn').addEventListener('click',loadProfile); $('#loadProfileBtn').addEventListener('click',loadProfile);
form.addEventListener('change',(e)=>{ if(e.target.name==='hasInsurance')toggleInsurance(); updateProgress(); });
form.addEventListener('input',updateProgress);
form.addEventListener('submit',(e)=>{
  e.preventDefault();
  if(!form.reportValidity()) return;
  if(!signed) return toast('Please draw your signature before continuing.');
  packetData=serializeForm(); if($('#saveProfileChoice').checked)saveProfile(packetData);
  buildPacket(packetData); show('packet');
});
$('#clearProfileBtn').addEventListener('click',clearProfile); $('#deleteSessionBtn').addEventListener('click',deleteSession); $('#finishBtn').addEventListener('click',deleteSession);
$('#backBtn').addEventListener('click',()=>show('intake')); $('#printBtn').addEventListener('click',()=>window.print());
$('#shareBtn').addEventListener('click',()=>{ window.location.href='mailto:?subject=Dental%20office%20intake%20delivery&body=I%20have%20an%20intake%20packet%20ready.%20Please%20send%20me%20your%20approved%20secure%20delivery%20instructions.'; });
$('#clearSignature').addEventListener('click',clearSignature);
canvas.addEventListener('pointerdown',startDraw); canvas.addEventListener('pointermove',draw); canvas.addEventListener('pointerup',stopDraw); canvas.addEventListener('pointercancel',stopDraw);
window.addEventListener('resize',resizeCanvas); resizeCanvas(); toggleInsurance(); updateProgress();

// Production extension points:
// 1. Encrypt authenticated records and keys; never rely on browser storage alone.
// 2. Send through a vetted secure transport covered by required BAAs, with audit logs.
// 3. Persist the exact consent text/version and signing event after legal review.
// 4. Map validated fields to FHIR resources and integrate with the office EHR securely.

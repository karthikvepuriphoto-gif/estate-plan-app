# Estate Plan Drafter
Branching estate-planning questionnaire + draft generator for all 50 states + DC, including non-citizen and foreign-asset cases. **Every output is a DRAFT for attorney review, not legal advice.**
Live preview (localStorage only): https://karthikvepuriphoto-gif.github.io/estate-plan-app/

- `data/states.json` – 51 jurisdictions; any field not confirmed against a source is literally `"unverified"`.
- `data/citizenship.json` – non-citizen, QDOT, NRA $60k, 2026 figures, India, FBAR; sources per case.
- `data/flow.json` + `js/flow.js` – platform-neutral branching engine.
- `js/templates.js` – will, testamentary trust, living trust, financial POA, healthcare directive, HIPAA, guardian nomination, pet trust, state signing checklist.
- `js/storage.js` – **storage adapter seam** (localStorage now; Apps Script adapter included).
- `apps-script/` – Google sign-in + Drive version; see its README. `docs/` – privacy, terms, Marketplace checklist.
- Test: `node test.js`. Screenshots: `python3 shoot.py`.

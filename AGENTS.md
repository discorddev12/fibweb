# Architecture
- Keep promotion parsing and rank allocation in the shared pure module used by the page and Cloud function so previews and writes use the same rules.
- Validate High Command access server-side with short-lived signed sessions; keep the shared password and Google Sheets credentials out of browser code.
- Limit promotion writes to the configured FIB roster; re-read and validate a signed preview before one atomic Google Sheets batch update, preserving rank, callsign, duties, and formulas.

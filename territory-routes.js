// ─────────────────────────────────────────────────────────────────────────────
// CORTEX BUILDER — TERRITORY ROUTES
// Add these to your existing server.js in /var/www/cortex/
//
// STEP 1: At the top of server.js, add:
//   const { TERRITORIES, STATE_ROUTING, routeToDivision, getDivision, assignLO } = require('./territories');
//
// STEP 2: Paste the routes below into server.js before app.listen(...)
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/territories — returns all 21 divisions with LO status
app.get('/api/territories', (req, res) => {
  res.json({
    success: true,
    total: TERRITORIES.length,
    vacant: TERRITORIES.filter(t => !t.lo).length,
    filled: TERRITORIES.filter(t => t.lo).length,
    divisions: TERRITORIES
  });
});

// GET /api/territories/:id — single division detail
app.get('/api/territories/:id', (req, res) => {
  const div = getDivision(req.params.id.toUpperCase());
  if (!div) return res.status(404).json({ success: false, error: 'Division not found' });
  res.json({ success: true, division: div });
});

// GET /api/territories/route/:state — route a state to its division
// Optional query param: ?county=Harris
app.get('/api/territories/route/:state', (req, res) => {
  const state = req.params.state.toUpperCase();
  const county = req.query.county || null;
  const divId = routeToDivision(state, county);
  if (!divId) return res.status(404).json({ success: false, error: `No division found for state: ${state}` });
  const div = getDivision(divId);
  res.json({ success: true, state, county, divisionId: divId, division: div });
});

// POST /api/territories/:id/assign — assign an LO to a division
// Body: { loName: "John Smith" }
app.post('/api/territories/:id/assign', (req, res) => {
  const { loName } = req.body;
  if (!loName) return res.status(400).json({ success: false, error: 'loName required in body' });
  const div = assignLO(req.params.id.toUpperCase(), loName);
  if (!div) return res.status(404).json({ success: false, error: 'Division not found' });
  res.json({ success: true, message: `${loName} assigned to ${div.name}`, division: div });
});

// GET /api/territories/state-map — returns the full state→division lookup
// Used by the frontend map overlay
app.get('/api/territories/state-map', (req, res) => {
  res.json({ success: true, stateRouting: STATE_ROUTING });
});

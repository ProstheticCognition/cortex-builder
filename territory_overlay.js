// ─────────────────────────────────────────────────────────────────────────────
// CORTEX BUILDER — TERRITORY OVERLAY
// Paste this entire block into index.html just before the closing </script> tag
// It adds a territory color overlay toggle to your existing D3 map
// ─────────────────────────────────────────────────────────────────────────────

// ── TERRITORY STATE → DIV MAP ────────────────────────────────────────────────
const TERR_STATE_MAP = {
  "WA":"DIV-01","OR":"DIV-01","ID":"DIV-01","MT":"DIV-01",
  "NV":"DIV-02","UT":"DIV-02","CO":"DIV-02","WY":"DIV-02",
  "AZ":"DIV-03","NM":"DIV-03",
  "CA":"DIV-04",
  "TX":"DIV-07",
  "LA":"DIV-08",
  "AR":"DIV-09","OK":"DIV-09","KS":"DIV-09","MO":"DIV-09",
  "ND":"DIV-10","SD":"DIV-10","NE":"DIV-10","MN":"DIV-10","IA":"DIV-10",
  "WI":"DIV-11","MI":"DIV-11","IL":"DIV-11","IN":"DIV-11",
  "OH":"DIV-12","KY":"DIV-12","WV":"DIV-12",
  "TN":"DIV-13","MS":"DIV-13","AL":"DIV-13",
  "GA":"DIV-14","SC":"DIV-14",
  "FL":"DIV-15",
  "NC":"DIV-17",
  "VA":"DIV-18","MD":"DIV-18","DE":"DIV-18",
  "PA":"DIV-19","NJ":"DIV-19",
  "NY":"DIV-20","CT":"DIV-20","MA":"DIV-20","RI":"DIV-20",
  "VT":"DIV-20","NH":"DIV-20","ME":"DIV-20",
  "AK":"DIV-21","HI":"DIV-21"
};

const TERR_COLORS = {
  "DIV-01":"#003d18","DIV-02":"#004d20","DIV-03":"#005a26",
  "DIV-04":"#1a3a1a","DIV-05":"#1e421e",
  "DIV-06":"#003328","DIV-07":"#004035","DIV-08":"#004d40",
  "DIV-09":"#202e00","DIV-10":"#141a00",
  "DIV-11":"#001a38","DIV-12":"#002048",
  "DIV-13":"#3a1200","DIV-14":"#4a2200",
  "DIV-15":"#4a3800","DIV-16":"#5a4800",
  "DIV-17":"#3d2e00",
  "DIV-18":"#3a001a","DIV-19":"#28000e",
  "DIV-20":"#1a0006",
  "DIV-21":"#151515"
};

const TERR_HIGHLIGHT = {
  "DIV-01":"#00FF41","DIV-02":"#39FF14","DIV-03":"#CCFF00",
  "DIV-04":"#B3FF00","DIV-05":"#88FF00",
  "DIV-06":"#00FFAA","DIV-07":"#00FFD4","DIV-08":"#00EEFF",
  "DIV-09":"#88AAFF","DIV-10":"#6688FF",
  "DIV-11":"#4466FF","DIV-12":"#3355EE",
  "DIV-13":"#FF6600","DIV-14":"#FF8800",
  "DIV-15":"#FFAA00","DIV-16":"#FFCC00",
  "DIV-17":"#FFE000",
  "DIV-18":"#FF44AA","DIV-19":"#CC2288",
  "DIV-20":"#991166",
  "DIV-21":"#555555"
};

const TERR_NAMES = {
  "DIV-01":"Pacific Northwest","DIV-02":"Mountain West","DIV-03":"Southwest",
  "DIV-04":"California North","DIV-05":"California South",
  "DIV-06":"Texas North","DIV-07":"Texas Central","DIV-08":"Texas Gulf & Louisiana",
  "DIV-09":"South Central","DIV-10":"Upper Midwest",
  "DIV-11":"Great Lakes","DIV-12":"Ohio Valley",
  "DIV-13":"Tennessee & Mississippi","DIV-14":"Southeast",
  "DIV-15":"Florida North & Central","DIV-16":"Florida South",
  "DIV-17":"Carolinas",
  "DIV-18":"Mid-Atlantic South","DIV-19":"PA & New Jersey",
  "DIV-20":"New England & New York",
  "DIV-21":"Alaska & Hawaii"
};

const TERR_SCORES = {
  "DIV-01":62,"DIV-02":68,"DIV-03":72,"DIV-04":71,"DIV-05":73,
  "DIV-06":91,"DIV-07":88,"DIV-08":79,"DIV-09":55,"DIV-10":44,
  "DIV-11":61,"DIV-12":52,"DIV-13":63,"DIV-14":77,"DIV-15":85,
  "DIV-16":82,"DIV-17":78,"DIV-18":61,"DIV-19":54,"DIV-20":42,"DIV-21":28
};

const TERR_TIERS = {
  "DIV-01":"TIER_1","DIV-02":"TIER_1","DIV-03":"TIER_1","DIV-04":"TIER_2","DIV-05":"TIER_2",
  "DIV-06":"TIER_1","DIV-07":"TIER_1","DIV-08":"TIER_1","DIV-09":"TIER_2","DIV-10":"TIER_3",
  "DIV-11":"TIER_2","DIV-12":"TIER_2","DIV-13":"TIER_1","DIV-14":"TIER_1","DIV-15":"TIER_1",
  "DIV-16":"TIER_1","DIV-17":"TIER_1","DIV-18":"TIER_2","DIV-19":"TIER_2","DIV-20":"TIER_3","DIV-21":"TIER_3"
};

// ── STATE ────────────────────────────────────────────────────────────────────
let territoryOverlayActive = false;
let territoryData = null;
let selectedDivision = null;

// ── INJECT TOGGLE BUTTON ─────────────────────────────────────────────────────
(function injectTerritoryUI() {
  // Toggle button — inject into your existing toolbar area
  const btn = document.createElement('button');
  btn.id = 'terr-toggle-btn';
  btn.innerHTML = '&#11042; TERRITORIES';
  btn.style.cssText = `
    position:fixed; top:14px; right:220px; z-index:1000;
    background:#111; border:1px solid #1f1f1f; color:#444;
    font-family:'Courier New',monospace; font-size:10px;
    letter-spacing:1px; padding:6px 14px; cursor:pointer;
    transition:all .15s;
  `;
  btn.onmouseenter = () => { if(!territoryOverlayActive) btn.style.borderColor='#00FF41'; };
  btn.onmouseleave = () => { if(!territoryOverlayActive) btn.style.borderColor='#1f1f1f'; };
  btn.onclick = toggleTerritoryOverlay;
  document.body.appendChild(btn);

  // Division detail panel
  const panel = document.createElement('div');
  panel.id = 'terr-panel';
  panel.style.cssText = `
    position:fixed; right:0; top:48px; width:280px; height:calc(100vh - 48px);
    background:#0d0d0d; border-left:1px solid #1a1a1a;
    font-family:'Courier New',monospace; font-size:11px;
    transform:translateX(100%); transition:transform .2s;
    z-index:999; overflow-y:auto; display:flex; flex-direction:column;
  `;
  panel.innerHTML = `
    <div style="padding:16px;border-bottom:1px solid #1a1a1a;">
      <div style="color:#333;font-size:9px;letter-spacing:2px;">// DIVISION DETAIL</div>
      <div id="terr-panel-name" style="color:#00FF41;font-size:15px;font-weight:bold;margin-top:6px;letter-spacing:1px;">—</div>
      <div id="terr-panel-id" style="color:#333;font-size:9px;margin-top:3px;letter-spacing:1px;"></div>
    </div>
    <div style="padding:16px;display:flex;flex-direction:column;gap:14px;flex:1;">
      <div>
        <div style="color:#333;font-size:9px;letter-spacing:2px;border-bottom:1px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px;">COMPOSITE SCORE</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
          <div style="background:#111;border:1px solid #1a1a1a;padding:8px;text-align:center;">
            <div id="tp-score" style="font-size:20px;color:#00FF41;font-weight:bold;">—</div>
            <div style="font-size:8px;color:#333;margin-top:2px;letter-spacing:1px;">COMPOSITE</div>
          </div>
          <div style="background:#111;border:1px solid #1a1a1a;padding:8px;text-align:center;">
            <div id="tp-tier" style="font-size:11px;font-weight:bold;">—</div>
            <div style="font-size:8px;color:#333;margin-top:2px;letter-spacing:1px;">TIER</div>
          </div>
          <div style="background:#111;border:1px solid #1a1a1a;padding:8px;text-align:center;">
            <div id="tp-lo" style="font-size:10px;color:#FFB800;font-weight:bold;">VACANT</div>
            <div style="font-size:8px;color:#333;margin-top:2px;letter-spacing:1px;">LO SLOT</div>
          </div>
        </div>
      </div>
      <div>
        <div style="color:#333;font-size:9px;letter-spacing:2px;border-bottom:1px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px;">STATES COVERED</div>
        <div id="tp-states" style="color:#666;font-size:10px;line-height:1.8;"></div>
      </div>
      <div>
        <div style="color:#333;font-size:9px;letter-spacing:2px;border-bottom:1px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px;">ASSIGN LO</div>
        <input id="tp-lo-input" placeholder="Enter LO name..." style="
          background:#111;border:1px solid #1a1a1a;color:#e0e0e0;
          padding:7px 10px;font-family:'Courier New',monospace;font-size:11px;
          width:100%;outline:none;margin-bottom:6px;
        "/>
        <button onclick="assignTerrLO()" style="
          background:transparent;border:1px solid #00FF41;color:#00FF41;
          padding:7px;font-family:'Courier New',monospace;font-size:10px;
          letter-spacing:1px;cursor:pointer;width:100%;
        ">ASSIGN LO</button>
      </div>
      <div>
        <div style="color:#333;font-size:9px;letter-spacing:2px;border-bottom:1px solid #1a1a1a;padding-bottom:4px;margin-bottom:8px;">SCORE BAR</div>
        <div style="background:#1a1a1a;height:4px;width:100%;margin-bottom:4px;">
          <div id="tp-scorebar" style="height:100%;background:#00FF41;transition:width .3s;width:0%;"></div>
        </div>
        <div id="tp-score-label" style="font-size:9px;color:#444;"></div>
      </div>
    </div>
    <div style="padding:12px;border-top:1px solid #1a1a1a;">
      <button onclick="closeTerritoryPanel()" style="
        background:transparent;border:1px solid #1a1a1a;color:#333;
        padding:6px;font-family:'Courier New',monospace;font-size:9px;
        letter-spacing:1px;cursor:pointer;width:100%;
      ">CLOSE PANEL</button>
    </div>
  `;
  document.body.appendChild(panel);

  // Legend
  const legend = document.createElement('div');
  legend.id = 'terr-legend';
  legend.style.cssText = `
    position:fixed; bottom:16px; left:16px; z-index:998;
    background:rgba(10,10,10,0.95); border:1px solid #1a1a1a;
    padding:12px; display:none;
    font-family:'Courier New',monospace;
    display:none; grid-template-columns:1fr 1fr; gap:3px 14px;
    max-width:380px;
  `;
  const tierColors = {"TIER_1":"#00FF41","TIER_2":"#FFB800","TIER_3":"#555"};
  Object.entries(TERR_NAMES).forEach(([id, name]) => {
    const tc = tierColors[TERR_TIERS[id]];
    legend.innerHTML += `
      <div style="display:flex;align-items:center;gap:5px;font-size:9px;color:#555;cursor:pointer;padding:2px 4px;"
           onclick="selectDivisionById('${id}')"
           onmouseenter="this.style.color='#aaa'" onmouseleave="this.style.color='#555'">
        <div style="width:8px;height:8px;background:${tc};flex-shrink:0;"></div>
        <span>${name}</span>
      </div>`;
  });
  document.body.appendChild(legend);
})();

// ── CORE FUNCTIONS ───────────────────────────────────────────────────────────
function toggleTerritoryOverlay() {
  territoryOverlayActive = !territoryOverlayActive;
  const btn = document.getElementById('terr-toggle-btn');
  const legend = document.getElementById('terr-legend');

  if (territoryOverlayActive) {
    btn.style.cssText += 'background:rgba(0,255,65,0.08);border-color:#00FF41;color:#00FF41;';
    legend.style.display = 'grid';
    applyTerritoryColors();
    // Fetch live LO data from API
    fetch('/api/territories')
      .then(r => r.json())
      .then(d => { territoryData = d; })
      .catch(() => {});
  } else {
    btn.style.cssText = btn.style.cssText
      .replace('background:rgba(0,255,65,0.08);','background:#111;')
      .replace('border-color:#00FF41;','border-color:#1f1f1f;')
      .replace('color:#00FF41;','color:#444;');
    legend.style.display = 'none';
    removeTerritoryColors();
    closeTerritoryPanel();
  }
}

function applyTerritoryColors() {
  // Color each state path by its division
  d3.selectAll('.st').each(function(d) {
    const stateCode = SID[String(d.id).padStart(2,'0')];
    if (!stateCode) return;
    const divId = TERR_STATE_MAP[stateCode];
    if (!divId) return;
    const el = d3.select(this);
    el.attr('data-div', divId)
      .attr('data-orig-fill', el.attr('fill') || '#1a2a1a')
      .style('fill', TERR_COLORS[divId])
      .style('cursor', 'pointer');
  });

  // Override mouseenter/mouseleave for territory mode
  d3.selectAll('.st')
    .on('mouseenter.terr', function(e, d) {
      if (!territoryOverlayActive) return;
      const divId = d3.select(this).attr('data-div');
      if (divId) d3.select(this).style('fill', TERR_HIGHLIGHT[divId]);
    })
    .on('mouseleave.terr', function(e, d) {
      if (!territoryOverlayActive) return;
      const divId = d3.select(this).attr('data-div');
      if (divId) d3.select(this).style('fill',
        selectedDivision === divId ? TERR_HIGHLIGHT[divId] : TERR_COLORS[divId]);
    })
    .on('click.terr', function(e, d) {
      if (!territoryOverlayActive) return;
      e.stopPropagation();
      const divId = d3.select(this).attr('data-div');
      if (divId) selectDivisionById(divId);
    });
}

function removeTerritoryColors() {
  d3.selectAll('.st')
    .style('fill', null)
    .on('mouseenter.terr', null)
    .on('mouseleave.terr', null)
    .on('click.terr', null)
    .attr('data-div', null);
  selectedDivision = null;
}

function selectDivisionById(divId) {
  selectedDivision = divId;
  const panel = document.getElementById('terr-panel');
  const name = TERR_NAMES[divId];
  const score = TERR_SCORES[divId];
  const tier = TERR_TIERS[divId];
  const tierColor = tier === 'TIER_1' ? '#00FF41' : tier === 'TIER_2' ? '#FFB800' : '#666';

  // Get LO from live data if available
  let loName = null;
  if (territoryData) {
    const div = territoryData.divisions.find(d => d.id === divId);
    if (div) loName = div.lo;
  }

  // Find states for this division
  const states = Object.entries(TERR_STATE_MAP)
    .filter(([s, d]) => d === divId)
    .map(([s]) => s);

  document.getElementById('terr-panel-name').textContent = name;
  document.getElementById('terr-panel-id').textContent = divId;
  document.getElementById('tp-score').textContent = score;
  document.getElementById('tp-tier').style.color = tierColor;
  document.getElementById('tp-tier').textContent = tier.replace('_',' ');
  document.getElementById('tp-lo').textContent = loName || 'VACANT';
  document.getElementById('tp-lo').style.color = loName ? '#00FF41' : '#FFB800';
  document.getElementById('tp-states').textContent = states.join(' · ');
  document.getElementById('tp-scorebar').style.width = score + '%';
  document.getElementById('tp-score-label').textContent =
    'GDP×0.45 + PERMITS×0.55 = ' + score + '/100';
  document.getElementById('tp-lo-input').value = loName || '';

  // Highlight selected division on map
  d3.selectAll('.st').each(function() {
    const el = d3.select(this);
    const elDiv = el.attr('data-div');
    el.style('fill', elDiv === divId ? TERR_HIGHLIGHT[divId] : TERR_COLORS[elDiv]);
  });

  // Show panel
  panel.style.transform = 'translateX(0)';
}

function closeTerritoryPanel() {
  document.getElementById('terr-panel').style.transform = 'translateX(100%)';
  selectedDivision = null;
  // Reset all state colors
  if (territoryOverlayActive) {
    d3.selectAll('.st').each(function() {
      const divId = d3.select(this).attr('data-div');
      if (divId) d3.select(this).style('fill', TERR_COLORS[divId]);
    });
  }
}

function assignTerrLO() {
  if (!selectedDivision) return;
  const name = document.getElementById('tp-lo-input').value.trim();
  if (!name) return;
  fetch(`/api/territories/${selectedDivision}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loName: name })
  })
  .then(r => r.json())
  .then(() => {
    document.getElementById('tp-lo').textContent = name.toUpperCase();
    document.getElementById('tp-lo').style.color = '#00FF41';
    // Refresh territory data
    fetch('/api/territories').then(r=>r.json()).then(d=>{ territoryData = d; });
  })
  .catch(() => {
    // Still update UI even if API call fails
    document.getElementById('tp-lo').textContent = name.toUpperCase();
    document.getElementById('tp-lo').style.color = '#00FF41';
  });
}

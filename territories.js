// CORTEX Builder Intelligence — Territory Division Data
// Drop this file in /var/www/cortex/ and require it in server.js

const TERRITORIES = [
  { id:"DIV-06", name:"Texas North",              label:"TX North",         color:"#00FFAA", states:["TX"], subRegion:"DFW + West TX",              score:91, gdp:98, permits:95, annualPermits:98000,  gdpB:2356, tier:"TIER_1", lo:null },
  { id:"DIV-07", name:"Texas Central",            label:"TX Central",       color:"#00FFD4", states:["TX"], subRegion:"Austin-San Antonio Corridor", score:88, gdp:96, permits:91, annualPermits:86000,  gdpB:2356, tier:"TIER_1", lo:null },
  { id:"DIV-15", name:"Florida North & Central",  label:"FL North/Central", color:"#FFAA00", states:["FL"], subRegion:"Jacksonville to Orlando",     score:85, gdp:82, permits:91, annualPermits:94000,  gdpB:1428, tier:"TIER_1", lo:null },
  { id:"DIV-16", name:"Florida South",            label:"FL South",         color:"#FFCC00", states:["FL"], subRegion:"Tampa to Miami",              score:82, gdp:84, permits:88, annualPermits:78000,  gdpB:1428, tier:"TIER_1", lo:null },
  { id:"DIV-08", name:"Texas Gulf & Louisiana",   label:"TX Gulf / LA",     color:"#00EEFF", states:["TX","LA"], subRegion:"Houston + Gulf Coast",   score:79, gdp:88, permits:82, annualPermits:79000,  gdpB:1890, tier:"TIER_1", lo:null },
  { id:"DIV-17", name:"Carolinas",                label:"Carolinas",        color:"#FFE000", states:["NC"],                                          score:78, gdp:71, permits:84, annualPermits:82000,  gdpB:698,  tier:"TIER_1", lo:null },
  { id:"DIV-14", name:"Southeast",                label:"Southeast",        color:"#FF8800", states:["GA","SC"],                                     score:77, gdp:72, permits:82, annualPermits:88000,  gdpB:812,  tier:"TIER_1", lo:null },
  { id:"DIV-03", name:"Southwest",                label:"Southwest",        color:"#CCFF00", states:["AZ","NM"],                                     score:72, gdp:64, permits:79, annualPermits:74000,  gdpB:478,  tier:"TIER_1", lo:null },
  { id:"DIV-02", name:"Mountain West",            label:"Mountain West",    color:"#39FF14", states:["NV","UT","CO","WY"],                           score:68, gdp:61, permits:74, annualPermits:82000,  gdpB:598,  tier:"TIER_1", lo:null },
  { id:"DIV-13", name:"Tennessee & Mississippi",  label:"TN / MS",          color:"#FF6600", states:["TN","MS","AL"],                               score:63, gdp:54, permits:71, annualPermits:67000,  gdpB:588,  tier:"TIER_1", lo:null },
  { id:"DIV-01", name:"Pacific Northwest",        label:"Pacific NW",       color:"#00FF41", states:["WA","OR","ID","MT"],                           score:62, gdp:58, permits:65, annualPermits:68000,  gdpB:712,  tier:"TIER_1", lo:null },
  { id:"DIV-05", name:"California South",         label:"CA South",         color:"#88FF00", states:["CA"], subRegion:"Southern California",         score:73, gdp:95, permits:58, annualPermits:62000,  gdpB:1580, tier:"TIER_2", lo:null },
  { id:"DIV-04", name:"California North",         label:"CA North",         color:"#B3FF00", states:["CA"], subRegion:"Northern California",         score:71, gdp:95, permits:52, annualPermits:48000,  gdpB:1580, tier:"TIER_2", lo:null },
  { id:"DIV-11", name:"Great Lakes",              label:"Great Lakes",      color:"#4466FF", states:["WI","MI","IL","IN"],                           score:61, gdp:72, permits:53, annualPermits:61000,  gdpB:1142, tier:"TIER_2", lo:null },
  { id:"DIV-18", name:"Mid-Atlantic South",       label:"Mid-Atlantic S.",  color:"#FF44AA", states:["VA","MD","DE"],                               score:61, gdp:68, permits:56, annualPermits:48000,  gdpB:722,  tier:"TIER_2", lo:null },
  { id:"DIV-09", name:"South Central",            label:"South Central",    color:"#88AAFF", states:["AR","OK","KS","MO"],                           score:55, gdp:48, permits:61, annualPermits:52000,  gdpB:498,  tier:"TIER_2", lo:null },
  { id:"DIV-19", name:"PA & New Jersey",          label:"PA / NJ",          color:"#CC2288", states:["PA","NJ"],                                     score:54, gdp:72, permits:41, annualPermits:34000,  gdpB:988,  tier:"TIER_2", lo:null },
  { id:"DIV-12", name:"Ohio Valley",              label:"Ohio Valley",      color:"#3355EE", states:["OH","KY","WV"],                               score:52, gdp:58, permits:48, annualPermits:44000,  gdpB:762,  tier:"TIER_2", lo:null },
  { id:"DIV-10", name:"Upper Midwest",            label:"Upper Midwest",    color:"#6688FF", states:["ND","SD","NE","MN","IA"],                     score:44, gdp:42, permits:46, annualPermits:38000,  gdpB:512,  tier:"TIER_3", lo:null },
  { id:"DIV-20", name:"New England & New York",   label:"New England / NY", color:"#991166", states:["NY","CT","MA","RI","VT","NH","ME"],            score:42, gdp:88, permits:18, annualPermits:29000,  gdpB:2188, tier:"TIER_3", lo:null },
  { id:"DIV-21", name:"Alaska & Hawaii",          label:"AK / HI",          color:"#555555", states:["AK","HI"],                                     score:28, gdp:32, permits:24, annualPermits:8000,   gdpB:128,  tier:"TIER_3", lo:null },
];

// State → Division routing table
const STATE_ROUTING = {
  "WA":"DIV-01","OR":"DIV-01","ID":"DIV-01","MT":"DIV-01",
  "NV":"DIV-02","UT":"DIV-02","CO":"DIV-02","WY":"DIV-02",
  "AZ":"DIV-03","NM":"DIV-03",
  "CA":["DIV-04","DIV-05"],   // split by county — see CA_SPLIT below
  "TX":["DIV-06","DIV-07","DIV-08"], // split by county — see TX_SPLIT below
  "LA":"DIV-08",
  "AR":"DIV-09","OK":"DIV-09","KS":"DIV-09","MO":"DIV-09",
  "ND":"DIV-10","SD":"DIV-10","NE":"DIV-10","MN":"DIV-10","IA":"DIV-10",
  "WI":"DIV-11","MI":"DIV-11","IL":"DIV-11","IN":"DIV-11",
  "OH":"DIV-12","KY":"DIV-12","WV":"DIV-12",
  "TN":"DIV-13","MS":"DIV-13","AL":"DIV-13",
  "GA":"DIV-14","SC":"DIV-14",
  "FL":["DIV-15","DIV-16"],   // split by county — see FL_SPLIT below
  "NC":"DIV-17",
  "VA":"DIV-18","MD":"DIV-18","DE":"DIV-18",
  "PA":"DIV-19","NJ":"DIV-19",
  "NY":"DIV-20","CT":"DIV-20","MA":"DIV-20","RI":"DIV-20","VT":"DIV-20","NH":"DIV-20","ME":"DIV-20",
  "AK":"DIV-21","HI":"DIV-21"
};

// Sub-region county routing for split states
const TX_SPLIT = {
  "DIV-06": ["Dallas","Tarrant","Collin","Denton","Rockwall","Parker","Lubbock","Midland","El Paso","Ector"],
  "DIV-07": ["Travis","Williamson","Hays","Bexar","Comal","Guadalupe","Bell","McLennan"],
  "DIV-08": ["Harris","Fort Bend","Montgomery","Brazoria","Galveston","Jefferson","Waller","Liberty"]
};
const FL_SPLIT = {
  "DIV-15": ["Duval","St. Johns","Flagler","Volusia","Orange","Osceola","Brevard","Marion","Alachua","Putnam","Clay","Seminole","Lake"],
  "DIV-16": ["Hillsborough","Pasco","Pinellas","Sarasota","Manatee","Lee","Collier","Miami-Dade","Broward","Palm Beach","Charlotte","Hendry"]
};
const CA_SPLIT = {
  "DIV-04": ["Shasta","Butte","Sacramento","Placer","El Dorado","Yolo","San Francisco","Alameda","Contra Costa","Fresno","Tulare","Kern","San Joaquin","Stanislaus","Merced"],
  "DIV-05": ["Los Angeles","Orange","Riverside","San Bernardino","San Diego","Ventura","Santa Barbara","Imperial","Mono","Inyo"]
};

/**
 * Route a lead to a division by state (and optionally county)
 * @param {string} state - 2-letter state code
 * @param {string} [county] - County name (required for TX, FL, CA)
 * @returns {string} Division ID
 */
function routeToDivision(state, county = null) {
  const mapping = STATE_ROUTING[state];
  if (!mapping) return null;
  if (!Array.isArray(mapping)) return mapping;

  // Split state — need county to route
  if (!county) return mapping[0]; // default to first division if no county

  const splitMap = state === 'TX' ? TX_SPLIT : state === 'FL' ? FL_SPLIT : CA_SPLIT;
  for (const [divId, counties] of Object.entries(splitMap)) {
    if (counties.some(c => county.toLowerCase().includes(c.toLowerCase()))) {
      return divId;
    }
  }
  return mapping[0]; // fallback
}

/**
 * Get division data by ID
 */
function getDivision(divId) {
  return TERRITORIES.find(t => t.id === divId) || null;
}

/**
 * Assign an LO to a division (in-memory; persist to DB in production)
 */
function assignLO(divId, loName) {
  const div = getDivision(divId);
  if (div) div.lo = loName;
  return div;
}

module.exports = {
  TERRITORIES,
  STATE_ROUTING,
  TX_SPLIT,
  FL_SPLIT,
  CA_SPLIT,
  routeToDivision,
  getDivision,
  assignLO
};

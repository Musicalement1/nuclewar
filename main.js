/*function estimerDemiVie(isotope) {
  const Z = isotope.protons.length;
  const N = isotope.neutrons.length;
  const A = Z + N;
  const ratioNZ = N / Z;

  let typeDesintegration = "";
  let demiVieEstimee = 0; // en secondes

  // Désintégration alpha (Z > 82)
  if (Z > 82) {
    typeDesintegration = "alpha";
    const E_alpha = 4.5; // MeV (valeur typique)
    const A_Z = 28.9;
    const B_Z = 1.60;
    const log10_t = A_Z / Math.sqrt(E_alpha) + B_Z;
    demiVieEstimee = Math.pow(10, log10_t);
  }
  // Désintégration bêta moins (excès de neutrons)
  else if (ratioNZ > 1.5) {
    typeDesintegration = "bêta⁻";
    const Q = 5.0; // MeV (valeur typique)
    const a = 1.0;
    const b = -1.0;
    const c = 5.0;
    const log10_t = a * Z + b * Math.log10(Q) + c;
    demiVieEstimee = Math.pow(10, log10_t);
  }
  // Désintégration bêta plus ou capture électronique (excès de protons)
  else if (ratioNZ < 1) {
    typeDesintegration = "bêta⁺ / capture électronique";
    const Q = 5.0; // MeV (valeur typique)
    const a = 1.0;
    const b = -1.0;
    const c = 5.0;
    const log10_t = a * Z + b * Math.log10(Q) + c;
    demiVieEstimee = Math.pow(10, log10_t);
  }
  // Noyau stable ou quasi-stable
  else if (Math.abs(N - Z) <= 1) {
    typeDesintegration = "stable ou quasi-stable";
    demiVieEstimee = Math.pow(10, 20); // quasi infini (~âge de l'univers)
  }
  // Autres cas
  else {
    typeDesintegration = "désintégration incertaine";
    demiVieEstimee = Math.pow(10, 3); // estimation très large
  }

  return [typeDesintegration, demiVieEstimee]; // [mode, demi-vie en secondes]
}
*/

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
let particles = [];
let atoms = [];
let camera = { x: 0, y: 0, zoom: 1 };
let mousePos = { x: 0, y: 0 };
const PARTICLE_RADIUS = 10;
const COMBINE_DISTANCE = 25;
const friction = 0.9925
const distanceBetweenBondedAtomsCoef = 2//2
//const decaySpeedFactor = 100
const camSpeed = 20
const ELEMENTS = {
    1:  { name: "Hydrogen",      symbol: "H",  color: "#FFFFFF", valenceMax: 1},
    2:  { name: "Helium",        symbol: "He", color: "#FFC0CB", valenceMax: 0},
    3:  { name: "Lithium",       symbol: "Li", color: "#B22222", valenceMax: 1},
    4:  { name: "Beryllium",     symbol: "Be", color: "#00FF00", valenceMax: 2},
    5:  { name: "Boron",         symbol: "B",  color: "#FF8C00", valenceMax: 3},
    6:  { name: "Carbon",        symbol: "C",  color: "#000000", valenceMax: 4},
    7:  { name: "Nitrogen",      symbol: "N",  color: "#0000FF", valenceMax: 3},
    8:  { name: "Oxygen",        symbol: "O",  color: "#FF0000", valenceMax: 2},
    9:  { name: "Fluorine",      symbol: "F",  color: "#DAA520", valenceMax: 1},
    10: { name: "Neon",          symbol: "Ne", color: "#00FFFF", valenceMax: 0},
    11: { name: "Sodium",        symbol: "Na", color: "#A0522D", valenceMax: 1},
    12: { name: "Magnesium",     symbol: "Mg", color: "#ADFF2F", valenceMax: 2},
    13: { name: "Aluminium",     symbol: "Al", color: "#AAAAAA", valenceMax: 3},
    14: { name: "Silicon",       symbol: "Si", color: "#FFD700", valenceMax: 4},
    15: { name: "Phosphorus",    symbol: "P",  color: "#FFA07A", valenceMax: 3},
    16: { name: "Sulfur",        symbol: "S",  color: "#FFFF00", valenceMax: 2},
    17: { name: "Chlorine",      symbol: "Cl", color: "#00FF7F", valenceMax: 1},
    18: { name: "Argon",         symbol: "Ar", color: "#87CEFA", valenceMax: 0},
    19: { name: "Potassium",     symbol: "K",  color: "#D2691E", valenceMax: 1},
    20: { name: "Calcium",       symbol: "Ca", color: "#F5F5DC", valenceMax: 2},
    21: { name: "Scandium",        symbol: "Sc", color: "#E6E6FA", valenceMax: 3 },
    22: { name: "Titanium",        symbol: "Ti", color: "#B0C4DE", valenceMax: 4 },
    23: { name: "Vanadium",        symbol: "V",  color: "#708090", valenceMax: 5 },
    24: { name: "Chromium",        symbol: "Cr", color: "#A9A9A9", valenceMax: 6 },
    25: { name: "Manganese",       symbol: "Mn", color: "#800000", valenceMax: 7 },
    26: { name: "Iron",            symbol: "Fe", color: "#B7410E", valenceMax: 3 },
    27: { name: "Cobalt",          symbol: "Co", color: "#4682B4", valenceMax: 3 },
    28: { name: "Nickel",          symbol: "Ni", color: "#191970", valenceMax: 2 },
    29: { name: "Copper",          symbol: "Cu", color: "#B87333", valenceMax: 2 },
    30: { name: "Zinc",            symbol: "Zn", color: "#7F7F7F", valenceMax: 2 },
    31: { name: "Gallium",         symbol: "Ga", color: "#DAA520", valenceMax: 3 },
    32: { name: "Germanium",       symbol: "Ge", color: "#FFD700", valenceMax: 4 },
    33: { name: "Arsenic",         symbol: "As", color: "#9ACD32", valenceMax: 3 },
    34: { name: "Selenium",        symbol: "Se", color: "#FF6347", valenceMax: 2 },
    35: { name: "Bromine",         symbol: "Br", color: "#A52A2A", valenceMax: 1 },
    36: { name: "Krypton",         symbol: "Kr", color: "#40E0D0", valenceMax: 0 },
    37: { name: "Rubidium",        symbol: "Rb", color: "#FF4500", valenceMax: 1 },
    38: { name: "Strontium",       symbol: "Sr", color: "#FFDAB9", valenceMax: 2 },
    39: { name: "Yttrium",         symbol: "Y",  color: "#C0C0C0", valenceMax: 3 },
    40: { name: "Zirconium",       symbol: "Zr", color: "#2E8B57", valenceMax: 4 },
    41: { name: "Niobium",         symbol: "Nb", color: "#8FBC8F", valenceMax: 5 },
    42: { name: "Molybdenum",      symbol: "Mo", color: "#00CED1", valenceMax: 6 },
    43: { name: "Technetium",      symbol: "Tc", color: "#ac94a8", valenceMax: 7 },
    44: { name: "Ruthenium",       symbol: "Ru", color: "#778899", valenceMax: 4 },
    45: { name: "Rhodium",         symbol: "Rh", color: "#C0C0C0", valenceMax: 3 },
    46: { name: "Palladium",       symbol: "Pd", color: "#D3D3D3", valenceMax: 2 },
    47: { name: "Silver",          symbol: "Ag", color: "#C0C0C0", valenceMax: 1 },
    48: { name: "Cadmium",         symbol: "Cd", color: "#FFD700", valenceMax: 2 },
    49: { name: "Indium",          symbol: "In", color: "#FFB6C1", valenceMax: 3 },
    50: { name: "Tin",             symbol: "Sn", color: "#B0C4DE", valenceMax: 4 },
    51: { name: "Antimony",        symbol: "Sb", color: "#708090", valenceMax: 3 },
    52: { name: "Tellurium",       symbol: "Te", color: "#BDB76B", valenceMax: 2 },
    53: { name: "Iodine",          symbol: "I",  color: "#4B0082", valenceMax: 1 },
    54: { name: "Xenon",           symbol: "Xe", color: "#00FFFF", valenceMax: 0 },
    55: { name: "Cesium",          symbol: "Cs", color: "#FF4500", valenceMax: 1 },
    56: { name: "Barium",          symbol: "Ba", color: "#FFDAB9", valenceMax: 2 },
    57: { name: "Lanthanum",       symbol: "La", color: "#FFDEAD", valenceMax: 3 },
    58: { name: "Cerium",          symbol: "Ce", color: "#FFE4C4", valenceMax: 3 },
    59: { name: "Praseodymium",    symbol: "Pr", color: "#FFB347", valenceMax: 3 },
    60: { name: "Neodymium",       symbol: "Nd", color: "#FFB6C1", valenceMax: 3 },
    61: { name: "Promethium",      symbol: "Pm", color: "#baffb9", valenceMax: 3 },
    62: { name: "Samarium",        symbol: "Sm", color: "#FF69B4", valenceMax: 3 },
    63: { name: "Europium",        symbol: "Eu", color: "#FF1493", valenceMax: 3 },
    64: { name: "Gadolinium",      symbol: "Gd", color: "#FF6347", valenceMax: 3 },
    65: { name: "Terbium",         symbol: "Tb", color: "#FF4500", valenceMax: 3 },
    66: { name: "Dysprosium",      symbol: "Dy", color: "#ff7800", valenceMax: 3 },
    67: { name: "Holmium",         symbol: "Ho", color: "#FFA500", valenceMax: 3 },
    68: { name: "Erbium",          symbol: "Er", color: "#FFD700", valenceMax: 3 },
    69: { name: "Thulium",         symbol: "Tm", color: "#FFFF00", valenceMax: 3 },
    70: { name: "Ytterbium",       symbol: "Yb", color: "#FFFFE0", valenceMax: 3 },
    71: { name: "Lutetium",        symbol: "Lu", color: "#ADFF2F", valenceMax: 3 },
    72: { name: "Hafnium",         symbol: "Hf", color: "#7FFFD4", valenceMax: 4 },
    73: { name: "Tantalum",        symbol: "Ta", color: "#40E0D0", valenceMax: 5 },
    74: { name: "Tungsten",        symbol: "W",  color: "#00CED1", valenceMax: 6 },
    75: { name: "Rhenium",         symbol: "Re", color: "#48D1CC", valenceMax: 7 },
    76: { name: "Osmium",          symbol: "Os", color: "#00BFFF", valenceMax: 4 },
    77: { name: "Iridium",         symbol: "Ir", color: "#1E90FF", valenceMax: 3 },
    78: { name: "Platinum",        symbol: "Pt", color: "#6495ED", valenceMax: 2 },
    79: { name: "Gold",            symbol: "Au", color: "#FFD700", valenceMax: 1 },
    80: { name: "Mercury",         symbol: "Hg", color: "#DAA520", valenceMax: 2 },
    81: { name: "Thallium",        symbol: "Tl", color: "#dbc182", valenceMax: 3 },
    82: { name: "Lead",            symbol: "Pb", color: "#A0522D", valenceMax: 4 },
    83: { name: "Bismuth",         symbol: "Bi", color: "#8B4513", valenceMax: 3 },
    84: { name: "Polonium",        symbol: "Po", color: "#D2691E", valenceMax: 2 },
    85: { name: "Astatine",        symbol: "At", color: "#CD853F", valenceMax: 1 },
    86: { name: "Radon",           symbol: "Rn", color: "#7B68EE", valenceMax: 0 },
    87: { name: "Francium",        symbol: "Fr", color: "#cd5050", valenceMax: 1 },
    88: { name: "Radium",          symbol: "Ra", color: "#FF7F50", valenceMax: 2 },
    89: { name: "Actinium",        symbol: "Ac", color: "#FF4500", valenceMax: 3 },
    90: { name: "Thorium",         symbol: "Th", color: "#FFA07A", valenceMax: 4 },
    91:  { name: "Protactinium",    symbol: "Pa", color: "#FF6347", valenceMax: 5 },
    92:  { name: "Uranium",         symbol: "U",  color: "#63ff53"/*"#FF4500"*/, valenceMax: 6 },
    93:  { name: "Neptunium",       symbol: "Np", color: "#FF7F50", valenceMax: 5 },
    94:  { name: "Plutonium",       symbol: "Pu", color: "#8f76ff"/*"#FF8C00"*/, valenceMax: 6 },
    95:  { name: "Americium",       symbol: "Am", color: "#FFA500", valenceMax: 3 },
    96:  { name: "Curium",          symbol: "Cm", color: "#FFD700", valenceMax: 3 },
    97:  { name: "Berkelium",       symbol: "Bk", color: "#FFFF00", valenceMax: 3 },
    98:  { name: "Californium",     symbol: "Cf", color: "#FFFFE0", valenceMax: 3 },
    99:  { name: "Einsteinium",     symbol: "Es", color: "#ADFF2F", valenceMax: 3 },
    100: { name: "Fermium",         symbol: "Fm", color: "#7FFFD4", valenceMax: 3 },
    101: { name: "Mendelevium",     symbol: "Md", color: "#40E0D0", valenceMax: 3 },
    102: { name: "Nobelium",        symbol: "No", color: "#00CED1", valenceMax: 2 },
    103: { name: "Lawrencium",      symbol: "Lr", color: "#48D1CC", valenceMax: 3 },
    104: { name: "Rutherfordium",   symbol: "Rf", color: "#00BFFF", valenceMax: 4 },
    105: { name: "Dubnium",         symbol: "Db", color: "#1E90FF", valenceMax: 5 },
    106: { name: "Seaborgium",      symbol: "Sg", color: "#6495ED", valenceMax: 6 },
    107: { name: "Bohrium",         symbol: "Bh", color: "#FFD700", valenceMax: 7 },
    108: { name: "Hassium",         symbol: "Hs", color: "#DAA520", valenceMax: 8 },
    109: { name: "Meitnerium",      symbol: "Mt", color: "#B8860B", valenceMax: 8 },
    110: { name: "Darmstadtium",    symbol: "Ds", color: "#A0522D", valenceMax: 8 },
    111: { name: "Roentgenium",     symbol: "Rg", color: "#8B4513", valenceMax: 8 },
    112: { name: "Copernicium",     symbol: "Cn", color: "#D2691E", valenceMax: 2 },
    113: { name: "Nihonium",        symbol: "Nh", color: "#CD853F", valenceMax: 3 },
    114: { name: "Flerovium",       symbol: "Fl", color: "#7B68EE", valenceMax: 4 },
    115: { name: "Moscovium",       symbol: "Mc", color: "#FF0000", valenceMax: 3 },
    116: { name: "Livermorium",     symbol: "Lv", color: "#FF7F50", valenceMax: 4 },
    117: { name: "Tennessine",      symbol: "Ts", color: "#FF4500", valenceMax: 1 },
    118: { name: "Oganesson",       symbol: "Og", color: "#FFA07A", valenceMax: 0 }
  };
  /*const valenceCorrections = {
    1: [1], 2: [0], 3: [1], 4: [2], 5: [3], 6: [4], 7: [3, 5], 8: [2], 9: [1], 10: [0],
    11: [1], 12: [2], 13: [3], 14: [4], 15: [3, 5], 16: [2, 4, 6], 17: [1, 3, 5, 7], 18: [0],
    19: [1], 20: [2], 21: [3], 22: [2, 3, 4], 23: [2, 3, 4, 5], 24: [2, 3, 6], 25: [2, 4, 6, 7],
    26: [2, 3], 27: [2, 3], 28: [2, 3], 29: [1, 2], 30: [2], 31: [3], 32: [2, 4], 33: [3, 5],
    34: [2, 4, 6], 35: [1, 3, 5, 7], 36: [0], 37: [1], 38: [2], 39: [3], 40: [4], 41: [5],
    42: [4, 6], 43: [7], 44: [2, 3, 4], 45: [3], 46: [2, 4], 47: [1], 48: [2], 49: [3],
    50: [2, 4], 51: [3, 5], 52: [2, 4, 6], 53: [1, 3, 5, 7], 54: [0], 55: [1], 56: [2],
    57: [3], 58: [3, 4], 59: [3], 60: [3], 61: [3], 62: [2, 3], 63: [2, 3], 64: [3],
    65: [3], 66: [3], 67: [3], 68: [3], 69: [3], 70: [2, 3], 71: [3], 72: [4], 73: [5],
    74: [4, 6], 75: [4, 7], 76: [4, 8], 77: [3, 4], 78: [2, 4], 79: [1, 3], 80: [1, 2],
    81: [1, 3], 82: [2, 4], 83: [3, 5], 84: [2, 4, 6], 85: [1, 3, 5, 7], 86: [0], 87: [1],
    88: [2], 89: [3], 90: [4], 91: [5], 92: [4, 5, 6], 93: [3, 4, 5], 94: [3, 4, 5, 6],
    95: [2, 3], 96: [3], 97: [3], 98: [3], 99: [3], 100: [3], 101: [3], 102: [2, 3],
    103: [3], 104: [4], 105: [5], 106: [6], 107: [7], 108: [8], 109: [8], 110: [8],
    111: [8], 112: [2], 113: [1, 3], 114: [2, 4], 115: [1, 3], 116: [2, 4],
    117: [1, 3, 5, 7], 118: [0]
  };*/
  function screenToWorld(x, y) {
    return {
      x: (x - canvas.width / 2) / camera.zoom + camera.x,
      y: (y - canvas.height / 2) / camera.zoom + camera.y
    };
  }
  
  function worldToScreen(x, y) {
    return {
      x: (x - camera.x) * camera.zoom + canvas.width / 2,
      y: (y - camera.y) * camera.zoom + canvas.height / 2
    };
  }
  
  function isColorDark(color) {
    if (color[0] === '#') {
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      return luminance < 140;//seuil
    }
    return false;
  }
canvas.addEventListener('mousemove', e => {
  mousePos = screenToWorld(e.clientX, e.clientY);
});
let selectedAtom = null;
let lastMouse = { x: 0, y: 0 };
class Particle {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.radius = (type == "e" || type == "e+") ? PARTICLE_RADIUS / 3 : PARTICLE_RADIUS
    }
  
    contains(x, y) {
        const radius = this.radius;
        return Math.hypot(this.x - x, this.y - y) < radius;
      }
  
    update() {
      if (!this.dragging) {
        this.x += this.vx || 0;
        this.y += this.vy || 0;
        this.vx = (this.vx || 0) * friction;
        this.vy = (this.vy || 0) * friction;
      }
    }
  
    draw() {
        const screen = worldToScreen(this.x, this.y);
        const radius = this.radius * camera.zoom;
      
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
      
        // Couleurs selon type
        ctx.fillStyle =
          this.type === 'p' ? 'blue' ://proton
          this.type === 'n' ? 'white' ://neutron
          this.type === 'e' ? '#ff006c' :       // électron
          this.type === 'e+' ? '#00ffcd' :      // positron
          this.type === 'p-' ? '#fff300' : //antiproton
          this.type === 'n-' ? '#000000' ://antineutron
          '#888';
      
        ctx.fill();
        ctx.strokeStyle = '#222';
        ctx.stroke();
      
        ctx.fillStyle = (this.type === 'n') ? '#000' : '#fff';
        ctx.font = `${this.radius * camera.zoom}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(//convert stuff
          this.type === 'e+' ? 'e⁺' :
          this.type === 'p-' ? 'p\u0305' :
          this.type === 'n-' ? 'n\u0305' :
          this.type,
          screen.x,
          screen.y
        );
      }
      
}
let draggingCamera = false;
let lastScreenX = null;
let lastScreenY = null;
function onMouseMove(e) {
  if (!selectedAtom && !draggingCamera) return;

  const pos = screenToWorld(e.clientX, e.clientY);
  const now = performance.now();

  if (lastMouse && lastTime) {
    let dt = (now - lastTime) / 1000;
    if (dt < 0.001) dt = 0.001; // éviter /0

    const dx = pos.x - lastMouse.x;
    const dy = pos.y - lastMouse.y;

    if (selectedAtom) {
      const MAX_DRAG_VELOCITY = 200;

      let vx = (dx / dt) * 0.005;
      let vy = (dy / dt) * 0.005;

      const speed = Math.hypot(vx, vy);
      if (speed > MAX_DRAG_VELOCITY) {
        const scale = MAX_DRAG_VELOCITY / speed;
        vx *= scale;
        vy *= scale;
      }

      selectedAtom.vx = vx;
      selectedAtom.vy = vy;

      selectedAtom.x = pos.x;
      selectedAtom.y = pos.y;
    }  else if (draggingCamera) {
      const dx = e.clientX - lastScreenX;
      const dy = e.clientY - lastScreenY;
  
      camera.x -= dx;
      camera.y -= dy;
  
      lastScreenX = e.clientX;
      lastScreenY = e.clientY;
    }
  }

  lastMouse = pos;
  lastTime = now;
}


  function onMouseDown(e) {
    const pos = screenToWorld(e.clientX, e.clientY);
    lastMouse = pos;
    lastTime = performance.now();
  
    for (let atom of atoms) {
      if (atom.contains(pos.x, pos.y)) {
        selectedAtom = atom;
        atom.dragging = true;
        draggingCamera = false;
        return;
      }
    }
  
    for (let p of particles) {
      if (p.contains(pos.x, pos.y)) {
        selectedAtom = p;
        p.dragging = true;
        draggingCamera = false;
        return;
      }
    }

    draggingCamera = true;
    lastScreenX = e.clientX;
    lastScreenY = e.clientY;
  }
  
  function isOnScreen(x, y, radius = 0) {
    const screenPos = worldToScreen(x, y);
    return (
      screenPos.x + radius >= 0 &&
      screenPos.x - radius <= canvas.width &&
      screenPos.y + radius >= 0 &&
      screenPos.y - radius <= canvas.height
    );
  }
  
  
class Atom {
    constructor(x, y, particles) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.dragging = false;
        /*this.age = 0;
        this.halfLife = Infinity;
        this.decayModes = {};
        this.spontaneousFissionProb = 0;
        this.computeHalfLifeAndDecayMode();*/
        this.particles = particles || [];
        this.bonds = []
        this.updateAll();
    }
    /*computeHalfLifeAndDecayMode() {
        const Z = this.protons;
        const N = this.neutrons;
        const A = Z + N;
    
        // Ligne de stabilité approximative (simplifiée)
        const N_opt = Z < 20 ? Z : Math.round(1.5 * Z);
    
        const neutronExcess = N - N_opt;
    
        this.halfLife = Infinity;
        this.decayModes = {};
        this.spontaneousFissionProb = 0;
    
        if (Z < 1) return; // pas un noyau réel
    
        if (Z > 82) {
          // Noyaux lourds : alpha et fission spontanée possible
          this.decayModes = { alpha: 0.7, fission: 0.3 };
          // Demi-vie en secondes, décroissante avec masse (très approximatif)
          this.halfLife = 1e6 / (A - 208 + 1);
          this.spontaneousFissionProb = 0.01;
        } else if (neutronExcess > 2) {
          // Trop de neutrons => bêta moins
          this.decayModes = { betaMinus: 1 };
          this.halfLife = 1e5 / (neutronExcess * neutronExcess);
        } else if (neutronExcess < -2) {
          // Trop de protons => bêta plus + émission proton
          this.decayModes = { betaPlus: 0.8, protonEmission: 0.2 };
          this.halfLife = 1e5 / ((-neutronExcess) * (-neutronExcess));
        } else {
          // Stable ou quasi stable
          this.halfLife = Infinity;
        }
      }
    
      decay() {
        if (!this.decayModes || Object.keys(this.decayModes).length === 0) {
          console.log(`Atome Z=${this.protons}, N=${this.neutrons} stable ou inconnu.`);
          return;
        }
    
        const modes = Object.entries(this.decayModes);
        const totalProb = modes.reduce((sum, [, p]) => sum + p, 0);
        let r = Math.random() * totalProb;
        let chosenMode = null;
    
        for (const [mode, prob] of modes) {
          if (r < prob) {
            chosenMode = mode;
            break;
          }
          r -= prob;
        }
    

        const ejectSpeed = 2;
        const randomUnitVector = () => {
          const angle = Math.random() * 2 * Math.PI;
          return { x: Math.cos(angle), y: Math.sin(angle) };
        };
      
        switch (chosenMode) {
          case 'alpha':
            for (let i = 0; i < 2; i++) {
              const pIndex = this.particles.findIndex(p => p.type === 'p');
              if (pIndex !== -1) this.particles.splice(pIndex, 1);
              const nIndex = this.particles.findIndex(p => p.type === 'n');
              if (nIndex !== -1) this.particles.splice(nIndex, 1);
            }
            const dirAlpha = randomUnitVector();
            const alphaX = this.x + dirAlpha.x * (this.baseRadius + 10);
            const alphaY = this.y + dirAlpha.y * (this.baseRadius + 10);
            const alphaAtom = new Atom(alphaX, alphaY, [
                new Particle(alphaX, alphaY, 'p'),
                new Particle(alphaX, alphaY, 'p'),
                new Particle(alphaX, alphaY, 'n'),
                new Particle(alphaX, alphaY, 'n'),
              ]);              
            alphaAtom.vx = dirAlpha.x * ejectSpeed;
            alphaAtom.vy = dirAlpha.y * ejectSpeed;
            atoms.push(alphaAtom);
            console.log(`${this.name} a subi une désintégration alpha.`);
            break;
      
          case 'betaMinus': {
            const neutronIndex = this.particles.findIndex(p => p.type === 'n');
            if (neutronIndex !== -1) {
              this.particles.splice(neutronIndex, 1);
              this.particles.push(new Particle(this.x, this.y, 'p'));
              const dirE = randomUnitVector();
              const electronX = this.x + dirE.x * (this.baseRadius + 10);
              const electronY = this.y + dirE.y * (this.baseRadius + 10);
              const electron = new Particle(electronX, electronY, 'e');
              electron.vx = dirE.x * ejectSpeed;
              electron.vy = dirE.y * ejectSpeed;
              particles.push(electron);
              console.log(`${this.name} a subi une désintégration bêta- (neutron -> proton + e⁻).`);
            }
            break;
          }
      
          case 'betaPlus': {
            const protonIndex = this.particles.findIndex(p => p.type === 'p');
            if (protonIndex !== -1) {
              this.particles.splice(protonIndex, 1);
              this.particles.push(new Particle(this.x, this.y, 'n'));
              const dirPos = randomUnitVector();
              const positronX = this.x + dirPos.x * (this.baseRadius + 10);
              const positronY = this.y + dirPos.y * (this.baseRadius + 10);
              const positron = new Particle(positronX, positronY, 'e+');
              positron.vx = dirPos.x * ejectSpeed;
              positron.vy = dirPos.y * ejectSpeed;
              particles.push(positron);
              console.log(`${this.name} a subi une désintégration bêta+ (proton -> neutron + e⁺).`);
            }
            break;
          }
      
          case 'neutronEmission': {
            const neutronIndex = this.particles.findIndex(p => p.type === 'n');
            if (neutronIndex !== -1) {
              // Retire un neutron du noyau
              this.particles.splice(neutronIndex, 1);
          
              // Crée un neutron indépendant
              const dir = randomUnitVector();
              const x = this.x + dir.x * (this.baseRadius + 10);
              const y = this.y + dir.y * (this.baseRadius + 10);
              const neutron = new Particle(x, y, 'n');
              neutron.vx = dir.x * ejectSpeed;
              neutron.vy = dir.y * ejectSpeed;
              particles.push(neutron);
          
              console.log(`${this.name} a éjecté un neutron.`);
            }
            break;
          }
          
          case 'protonEmission': {
            const protonIndex = this.particles.findIndex(p => p.type === 'p');
            if (protonIndex !== -1) {
              // Retire un proton du noyau
              this.particles.splice(protonIndex, 1);
          
              // Crée un proton indépendant
              const dir = randomUnitVector();
              const x = this.x + dir.x * (this.baseRadius + 10);
              const y = this.y + dir.y * (this.baseRadius + 10);
              const proton = new Particle(x, y, 'p');
              proton.vx = dir.x * ejectSpeed;
              proton.vy = dir.y * ejectSpeed;
              particles.push(proton);
          
              console.log(`${this.name} a éjecté un proton.`);
            }
            break;
          }
          
      
          default:
            console.log(`Mode de désintégration non géré : ${chosenMode}`);
        }
        this.updateAll();
      }
    
      updateDecay(deltaTime) {
        if (this.halfLife === Infinity) return;
    
        this.age += deltaTime;
    
        if (Math.random() < this.spontaneousFissionProb * deltaTime) {
          console.log(`Fission spontanée de l'atome Z=${this.protons}, N=${this.neutrons}.`);
          return;
        }
    
        if (this.age >= this.halfLife) {
          this.age = 0;
          this.decay();
          this.computeHalfLifeAndDecayMode(); // recalculer après désintégration si besoin
        }
      }
      fission() {
        const totalProtons = this.protons;
        const totalNeutrons = this.neutrons;
        const totalMass = totalProtons + totalNeutrons;
      
        // Vérifie si le noyau est assez lourd pour fissionner
        if (totalMass < 200) {
          console.log(`${this.name} : masse trop faible pour fission spontanée.`);
          return;
        }
      
        // Répartition aléatoire approximative en deux fragments
        const massLight = Math.floor(totalMass / 2 + (Math.random() * 10 - 5));
        const massHeavy = totalMass - massLight;
      
        const protonRatio = totalProtons / totalMass;
        const neutronRatio = totalNeutrons / totalMass;
      
        const pLight = Math.round(massLight * protonRatio);
        const nLight = massLight - pLight;
        const pHeavy = totalProtons - pLight;
        const nHeavy = totalNeutrons - nLight;
      
        // Directions opposées
        const angle = Math.random() * 2 * Math.PI;
        const dirLight = { x: Math.cos(angle), y: Math.sin(angle) };
        const dirHeavy = { x: -dirLight.x, y: -dirLight.y };
      
        const offset = this.baseRadius + 20;
        const ejectSpeed = 5;
      
        // Crée un atome fragment
        const createFragment = (x, y, pCount, nCount) => {
          const particles = [];
          for (let i = 0; i < pCount; i++) particles.push(new Particle(x, y, 'p'));
          for (let i = 0; i < nCount; i++) particles.push(new Particle(x, y, 'n'));
          const atom = new Atom(x, y, particles);
          atom.vx = (Math.random() * 0.5 + 0.75) * ejectSpeed * (x > this.x ? 1 : -1);
          atom.vy = (Math.random() * 0.5 + 0.75) * ejectSpeed * (y > this.y ? 1 : -1);
          return atom;
        };
      
        const fragLight = createFragment(
          this.x + dirLight.x * offset,
          this.y + dirLight.y * offset,
          pLight, nLight
        );
      
        const fragHeavy = createFragment(
          this.x + dirHeavy.x * offset,
          this.y + dirHeavy.y * offset,
          pHeavy, nHeavy
        );
      
        atoms.push(fragLight, fragHeavy);
      
        // Émet 2 à 3 neutrons
        const neutronCount = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < neutronCount; i++) {
          const angleN = Math.random() * 2 * Math.PI;
          const neutron = new Particle(this.x, this.y, 'n');
          neutron.vx = Math.cos(angleN) * (ejectSpeed * (1 + Math.random()));
          neutron.vy = Math.sin(angleN) * (ejectSpeed * (1 + Math.random()));
          particles.push(neutron);
        }
      
        // Supprime le noyau initial
        atoms = atoms.filter(a => a !== this);
      
        console.log(
          `Fission de ${this.name} → fragments ${pLight}+${nLight} et ${pHeavy}+${nHeavy} + ${neutronCount} neutrons.`
        );
      }*/
      
        

      
    drawElectrons() {
      const screen = worldToScreen(this.x, this.y);
      const radius = (this.baseRadius + 10) * camera.zoom;
      const time = Date.now() * 0.002;
  
      for (let i = 0; i < this.electrons; i++) {
        const angle = time + (i * Math.PI * 2) / this.electrons;
        const ex = screen.x + Math.cos(angle) * radius;
        const ey = screen.y + Math.sin(angle) * radius;
  
        ctx.beginPath();
        ctx.arc(ex, ey, 3 * camera.zoom, 0, Math.PI * 2);
        ctx.fillStyle = '#ff006c';
        ctx.fill();
      }
    }
  
    update() {
        if (!this.dragging) {
          this.x += this.vx;
          this.y += this.vy;
      
          const mass = this.mass || 1;
          const massFrictionFactor = 1 / Math.sqrt(mass);
      
          this.vx *= Math.pow(friction, massFrictionFactor);
          this.vy *= Math.pow(friction, massFrictionFactor);
        }
      }
      
    isHovered() {
        return Math.hypot(this.x - mousePos.x, this.y - mousePos.y) < this.baseRadius;
      }
      draw() {
        const screen = worldToScreen(this.x, this.y);
        const radius = this.baseRadius * camera.zoom;
    
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#222';
        ctx.stroke();
    
        ctx.fillStyle = isColorDark(this.color) ? '#fff' : '#000';
        const fontSize = radius * 0.8;
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(this.getChargedSymbol(), screen.x, screen.y);
    
        if (this.isHovered()) {
          this.drawTooltip(screen.x, screen.y);
        }
    
        this.drawElectrons();
      }
    
      drawTooltip(screenX, screenY) {
        ctx.save();
        const lines = [
          `${this.name} ${this.mass} (${this.getChargedSymbol()})`,
          `Protons : ${this.protons}`,
          `Neutrons : ${this.neutrons}`,
          `Electrons : ${this.electronsTotal}`,
          `Charge : ${this.charge >= 0 ? '+' : ''}${this.charge}`,
          `Atomic Mass : ${this.mass}`
        ];
    
        const padding = 6 * camera.zoom;
        const lineHeight = 14 * camera.zoom;
        ctx.font = `${12 * camera.zoom}px sans-serif`;
        const width = Math.max(...lines.map(l => ctx.measureText(l).width)) + padding * 2;
        const height = lines.length * lineHeight + padding;
    
        const x = screenX;
        const atomeScreenRadius = this.baseRadius * camera.zoom;
        const y = screenY - atomeScreenRadius - height - 10;
    
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.fillRect(x - width / 2, y, width, height);
        ctx.strokeRect(x - width / 2, y, width, height);
    
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
    
        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], x, y + padding + i * lineHeight);
        }
        ctx.restore();
      }

      updateCounts() {
        this.protons = this.particles.filter(p => p.type === 'p').length;
        this.neutrons = this.particles.filter(p => p.type === 'n').length;
        this.electronsTotal = this.particles.filter(p => p.type === 'e').length;
      }
      updateCharge() {
        this.charge = this.protons - this.electronsTotal;
      }
    
      getChargedSymbol() {
        if (this.charge === 0) return this.symbolBase;
        if (this.protons.length > 118) return this.protons.length
        const absCharge = Math.abs(this.charge);
        const sign = this.charge > 0 ? '+' : '−';//le moins comme ça est moins long mdr
        return this.symbolBase + (absCharge === 1 ? sign : absCharge + sign);
      }
      updateElementInfo(/*isElectron = false*/) {
        const data = ELEMENTS[this.protons] || { 
          name: "Undefined", 
          symbol: this.protons.toString(), 
          color: "#888", 
          valenceMax: 4 
        };
      
        this.symbolBase = data.symbol;
        this.color = data.color;
        this.valenceMax = data.valenceMax;
        this.name = data.name;
      
        // Calcul electrons valence selon charge
        /*if (!isElectron) {*/if (this.charge >= 0) {
          // Cation : on enlève autant d’électrons que la charge
          this.electrons = Math.max(this.valenceMax - this.charge, 0) - this.bonds.length ;
        } else {
          // Anion : on ajoute des électrons à la valence (max limité)
          this.electrons = Math.min(this.valenceMax + Math.abs(this.charge), 8) - this.bonds.length; 
          // limite arbitraire +3 électrons supplémentaires pour anion très chargé
        }/*}*/
      }
      
    
      /*autoChargeRelaxation() {
        const maxCharge = 5;
        const ejectSpeed = 2;
      
        const randomUnitVector = () => {
          const angle = Math.random() * 2 * Math.PI;
          return { x: Math.cos(angle), y: Math.sin(angle) };
        };
      
        if (this.charge > maxCharge) {
            // Retirer un électron du noyau
            const electronIndex = this.particles.findIndex(p => p.type === 'e');
            if (electronIndex !== -1) {
              this.particles.splice(electronIndex, 1); // enlever electron
            } else {
              console.log(`${this.name} n'a pas d'électron à expulser !`);
              return; // pas possible d’éjecter si pas d’électron
            }
          
            // Créer un électron éjecté hors de l’atome
            const dir = randomUnitVector();
            const x = this.x + dir.x * (this.baseRadius + 10);
            const y = this.y + dir.y * (this.baseRadius + 10);
            const e = new Particle(x, y, 'e');
            e.vx = dir.x * ejectSpeed;
            e.vy = dir.y * ejectSpeed;
            particles.push(e);
          
            console.log(`${this.name} expulse un électron pour réduire sa charge.`);
            this.updateCounts();
            this.updateCharge();
          }
          
      
          if (this.charge < -maxCharge) {
            // Retirer un électron de l’atome (pour réduire le surplus d’électrons)
            const electronIndex = this.particles.findIndex(p => p.type === 'e');
            if (electronIndex !== -1) {
              this.particles.splice(electronIndex, 1); // enlever un électron
            } else {
              console.log(`${this.name} n'a pas d'électron à enlever malgré charge négative.`);
              return; // impossible d’enlever si pas d’électron
            }
          
            // Créer un positron éjecté hors de l’atome (pour compenser la charge)
            const dir = randomUnitVector();
            const x = this.x + dir.x * (this.baseRadius + 10);
            const y = this.y + dir.y * (this.baseRadius + 10);
            const positron = new Particle(x, y, 'e+');
            positron.vx = dir.x * ejectSpeed;
            positron.vy = dir.y * ejectSpeed;
            particles.push(positron);
          
            console.log(`${this.name} expulse un positron pour réduire sa charge négative.`);
            this.updateCounts();
            this.updateCharge();
          }
          
      }*/
      
      
      updateMassAndRadius() {
        this.mass = this.protons + this.neutrons;
        this.baseRadius = PARTICLE_RADIUS + this.mass; // Ajustable
      }
    
      updateAll(/*isElectron = false*/) {
        this.updateCounts();
        this.updateCharge();
        this.updateElementInfo(/*isElectron*/);
        this.updateMassAndRadius();
        /*this.computeHalfLifeAndDecayMode();
        this.autoChargeRelaxation();*/
      }
    
      addParticle(particle) {
        if (particle.type === "e+") {
          const electronIndex = this.particles.findIndex(p => p.type === "e");
          if (electronIndex !== -1) {
            this.particles.splice(electronIndex, 1)};
            //console.log(`${this.name} : annihilation d'un électron par un positron.`);
          /*} else {
            console.log(`${this.name} : positron sans électron à annihiler.`);
          }*/
          this.updateAll();
          return;
        }
        if (particle.type === "n-") {
          if (this.neutrons < 2)/* == 1 */ {
            atoms = atoms.filter(a => a !== this);
            addParticle(this.x, this.y, "p");
          } else {
          const neutronIndex = this.particles.findIndex(n => n.type === "n");
          if (neutronIndex !== -1) {
            this.particles.splice(neutronIndex, 1);
          }
          this.updateAll()};
          return;
        }
        if (particle.type === "p-") {
          if (this.protons < 2)/* == 1 */ {
            atoms = atoms.filter(a => a !== this);
            addParticle(this.x, this.y, "n");
          } else {
          const pIndex = this.particles.findIndex(p => p.type === "p");
          if (pIndex !== -1) {
            this.particles.splice(pIndex, 1);
          }
          this.updateAll()};
          return;
        }
        /*if (particle.type === "e") {
            this.particles.push(particle)
            this.electrons++
            this.updateAll(true)
            return;
        }*/
        // Sinon, on ajoute normalement la particule
        this.particles.push(particle);
        this.updateAll();
      }
      
        contains(x, y) {
            return Math.hypot(this.x - x, this.y - y) < this.baseRadius;
          }          
  }
  
  
  function distancePointToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSq = dx * dx + dy * dy;
    if (lengthSq === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    return Math.hypot(px - projX, py - projY);
  }  
  
  let bonds = [];

  class Bond {
    constructor(atomA, atomB, order = 1) {
      this.a = atomA;
      this.b = atomB;
      this.order = order;
      this.breakForce = 1.0 + (order - 1) * 3; // force de rupture adaptée à la liason
    }
  
    draw() {
        const p1 = worldToScreen(this.a.x, this.a.y);
        const p2 = worldToScreen(this.b.x, this.b.y);
      
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.hypot(dx, dy);
        const offset = { x: -dy / dist * 4, y: dx / dist * 4 };
      
        const related = bonds.filter(b =>
          (b.a === this.a && b.b === this.b) || (b.a === this.b && b.b === this.a)
        );
        const index = related.indexOf(this);
        const total = related.length;
      
        const shift = (index - (total - 1) / 2);
        const ox = offset.x * shift;
        const oy = offset.y * shift;
    
        const dxWorld = this.b.x - this.a.x;
        const dyWorld = this.b.y - this.a.y;
        const currentDist = Math.hypot(dxWorld, dyWorld);
        const breakDistance = (this.a.baseRadius + this.b.baseRadius) * 3.75 * distanceBetweenBondedAtomsCoef * this.breakForce;
    
        let tension = Math.min(1, Math.max(0, (currentDist - breakDistance * 0.5) / (breakDistance * 0.5)));
    
        const r = Math.floor(136 + (255 - 136) * tension);
        const g = Math.floor(136 * (1 - tension));
        const b = Math.floor(136 * (1 - tension));
        const color = `rgb(${r},${g},${b})`;
      
        ctx.beginPath();
        ctx.moveTo(p1.x + ox, p1.y + oy);
        ctx.lineTo(p2.x + ox, p2.y + oy);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
  }
  
  function checkForBonds() {
    const baseBreakDistanceFactor = 3.75 * distanceBetweenBondedAtomsCoef;
    const bondDistanceFactor = 3 * distanceBetweenBondedAtomsCoef;
    const maxBondOrder = 3;
  
//Rupture des liaisons
    bonds = bonds.filter(bond => {
  // do you exist lul
      const aStillExists = atoms.includes(bond.a);
      const bStillExists = atoms.includes(bond.b);
  
     if (!aStillExists || !bStillExists) {
//no more atoms?
       return false;
     }

      const dx = bond.a.x - bond.b.x;
      const dy = bond.a.y - bond.b.y;
      const dist = Math.hypot(dx, dy);

      const breakDistance = (bond.a.baseRadius + bond.b.baseRadius) * baseBreakDistanceFactor * bond.breakForce;

      if (dist > breakDistance) {
        bond.a.electrons++;
        bond.b.electrons++;
        return false;
      }

      return true;
    });

  
    //Création des nouvelles liaisons
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const a = atoms[i];
        const b = atoms[j];
  
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
  
        const maxBondDistance = (a.baseRadius + b.baseRadius) * bondDistanceFactor;
        if (dist > maxBondDistance) continue;
  
        const existingBonds = bonds.filter(bond =>
          (bond.a === a && bond.b === b) || (bond.a === b && bond.b === a)
        );
  
        const existingOrders = existingBonds.map(bond => bond.order || 1);
        const maxExistingOrder = existingOrders.length ? Math.max(...existingOrders) : 0;
  
        if (maxExistingOrder >= maxBondOrder) continue;
        if (a.electrons <= 0 || b.electrons <= 0) continue;
  //probability of liasons thingy
        const bondEaseA = 1 / (a.mass || 1);
        const bondEaseB = 1 / (b.mass || 1);
        let bondProbability = ((bondEaseA + bondEaseB) / 2) * 0.1;
  //ajustable coef ofc
        if (maxExistingOrder === 1) bondProbability *= 0.7;   // double liaison
        else if (maxExistingOrder === 2) bondProbability *= 0.4; // triple liaison
  
        if (Math.random() >= bondProbability) continue;
  
        const newOrder = maxExistingOrder + 1;
        bonds.push(new Bond(a, b, newOrder));
        a.electrons--;
        b.electrons--;
      }
    }
    for (const atom of atoms) {
        atom.bonds = []; // reset
      }
    
      for (const bond of bonds) {
        if (!bond.a.bonds.includes(bond)) bond.a.bonds.push(bond);
        if (!bond.b.bonds.includes(bond)) bond.b.bonds.push(bond);
      }
  }
  
  function checkBondCollisions() {
    const collisionRadius = 10;
  
    for (const bond of bonds) {
      const ax = bond.a.x;
      const ay = bond.a.y;
      const bx = bond.b.x;
      const by = bond.b.y;
  
      for (const atom of atoms) {
        if (atom === bond.a || atom === bond.b) continue;
  
        const dx = bx - ax;
        const dy = by - ay;
        const lengthSq = dx * dx + dy * dy;
        if (lengthSq === 0) continue;
  
        let t = ((atom.x - ax) * dx + (atom.y - ay) * dy) / lengthSq;
        t = Math.max(0, Math.min(1, t));
        const closestX = ax + t * dx;
        const closestY = ay + t * dy;
  
        const dist = Math.hypot(atom.x - closestX, atom.y - closestY);
        const minDist = atom.baseRadius + collisionRadius;
  
        if (dist < minDist) {
          const overlap = minDist - dist;
          const nx = (atom.x - closestX) / dist;
          const ny = (atom.y - closestY) / dist;
  
          const repulsionForce = 0.02 * overlap;
  
          const ma = atom.mass || 1;
          const m1 = bond.a.mass || 1;
          const m2 = bond.b.mass || 1;
          const totalMass = ma + m1 + m2;
          atom.vx += nx * repulsionForce * ((m1 + m2) / totalMass);
          atom.vy += ny * repulsionForce * ((m1 + m2) / totalMass);
  
          bond.a.vx -= nx * repulsionForce * (ma * (1 - t) / totalMass);
          bond.a.vy -= ny * repulsionForce * (ma * (1 - t) / totalMass);
  
          bond.b.vx -= nx * repulsionForce * (ma * t / totalMass);
          bond.b.vy -= ny * repulsionForce * (ma * t / totalMass);
          const weightA = 1 - t;
          const weightB = t;
  
          const bondVx = bond.a.vx * weightA + bond.b.vx * weightB;
          const bondVy = bond.a.vy * weightA + bond.b.vy * weightB;
  
          const relativeVx = atom.vx - bondVx;
          const relativeVy = atom.vy - bondVy;
  
          const impactForce = Math.abs(relativeVx * nx + relativeVy * ny);
          const weightedImpactForce = impactForce * ma;
  
          const ruptureThreshold = bond.breakForce * 100;//ajustable
  
          if (weightedImpactForce > ruptureThreshold) {
            bonds = bonds.filter(b => b !== bond);
            bond.a.electrons++;
            bond.b.electrons++;
            break;
          }
        }
      }
    }
  }
  
  
  
  
  
  

  

function onMouseUp(e) {
  if (selectedAtom) {
    selectedAtom.dragging = false;
    selectedAtom = null;
    lastMouse = null;
    lastTime = null;
  }
  draggingCamera = false;
}

  
  


function drawGrid() {
    const baseSpacing = 100;
    let spacing = baseSpacing;
  
    const minScreenSpacing = 40;
    const maxScreenSpacing = 150;
  
    let screenSpacing = spacing * camera.zoom;
    while (screenSpacing < minScreenSpacing) {
      spacing *= 2;
      screenSpacing = spacing * camera.zoom;
    }
    while (screenSpacing > maxScreenSpacing) {
      spacing /= 2;
      screenSpacing = spacing * camera.zoom;
    }
  
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
  
    const topLeft = screenToWorld(0, 0);
    const bottomRight = screenToWorld(canvas.width, canvas.height);
  
    const startX = Math.floor(topLeft.x / spacing) * spacing;
    const endX = Math.ceil(bottomRight.x / spacing) * spacing;
    const startY = Math.floor(topLeft.y / spacing) * spacing;
    const endY = Math.ceil(bottomRight.y / spacing) * spacing;
  
    for (let x = startX; x <= endX; x += spacing) {
      const screenX = worldToScreen(x, 0).x;
      ctx.beginPath();
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, canvas.height);
      ctx.stroke();
    }
  
    for (let y = startY; y <= endY; y += spacing) {
      const screenY = worldToScreen(0, y).y;
      ctx.beginPath();
      ctx.moveTo(0, screenY);
      ctx.lineTo(canvas.width, screenY);
      ctx.stroke();
    }
  
    return spacing;
  }
  function formatDistance(nanometers) {
    const units = [
      { unit: 'fm', factor: 1e-6 },
      { unit: 'pm', factor: 1e-3 },
      { unit: 'nm', factor: 1 },
      { unit: 'µm', factor: 1e3 },
      { unit: 'mm', factor: 1e6 },
      { unit: 'cm', factor: 1e7 },
      { unit: 'm', factor: 1e9 },
    ];
  
    for (let i = units.length - 1; i >= 0; i--) {
      const { unit, factor } = units[i];
      const value = nanometers / factor;
      if (value >= 1) {
        const displayValue = value >= 100 ? Math.round(value) : parseFloat(value.toFixed(2));
        return `${displayValue} ${unit}`;
      }
    }
  
    return `${nanometers} nm`; // fallback
  }
  function drawScaleBar(spacing) {
    const barLengthWorld = spacing/100;//nme-2
    const barLengthScreen = barLengthWorld * 100 * camera.zoom;
  
    const padding = 10;
    const x = canvas.width - barLengthScreen - padding;
    const y = padding + 20;
  
    // Barre
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + barLengthScreen, y);
    ctx.stroke();

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(formatDistance(barLengthWorld), x + barLengthScreen / 2, y - 5);
  }
  
    

  function drawParticles() {
    particles.forEach(p => {
      if (p.x !== undefined && p.y !== undefined &&
          p.draw && isOnScreen(p.x, p.y, p.radius * camera.zoom)) {
        p.draw();
      }
    });
  }
  function drawBonds() {
    bonds.forEach(bond => {
      const ar = bond.a.baseRadius * camera.zoom;
      const br = bond.b.baseRadius * camera.zoom;
  
      if (
        isOnScreen(bond.a.x, bond.a.y, ar) ||
        isOnScreen(bond.b.x, bond.b.y, br)
      ) {
        bond.draw();
      }
    });
  }  
function drawAtoms() {
    atoms.forEach(atom => {
      if (isOnScreen(atom.x, atom.y, atom.baseRadius * camera.zoom)) {
        atom.draw();
      }
    });
  }

function addParticle(x, y, type) {
  particles.push(new Particle(x, y, type));
}

/*function handleMouse(e) {
  if (e.button === 0) addParticle(mousePos.x, mousePos.y, 'n');
  else if (e.button === 1) addParticle(mousePos.x, mousePos.y, 'e');
  else if (e.button === 2) addParticle(mousePos.x, mousePos.y, 'p');
}*/

/*function handleKey(e) {
  if (e.key === 'a') addParticle(mousePos.x, mousePos.y, 'n');
  else if (e.key === 'z') addParticle(mousePos.x, mousePos.y, 'p');
  else if (e.key === 'e') addParticle(mousePos.x, mousePos.y, 'e');
  else if (e.key === '+' || e.key === '=') camera.zoom *= 1.1;
  else if (e.key === '-') camera.zoom /= 1.1;
  else if (e.key === 'ArrowLeft') camera.x += 20;
  else if (e.key === 'ArrowRight') camera.x -= 20;
  else if (e.key === 'ArrowUp') camera.y += 20;
  else if (e.key === 'ArrowDown') camera.y -= 20;
}*/

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function checkForAtoms() {
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    //antimatiere matière
    if (p1.type == 'p-' || p1.type == 'n-' || p1.type == 'e+') {
      if (p1.type == 'e+') {
        const nearbyAnnihilator = particles.find(p2 =>
          ['e'].includes(p2.type) && distance(p1, p2) < COMBINE_DISTANCE / 3
        );
        if (nearbyAnnihilator) {
          particles = particles.filter(p => p !== p1 && p !== nearbyAnnihilator);
          break;
        }
      } else {
      const nearbyAnnihilator = particles.find(p2 =>
        ['p', 'n'].includes(p2.type) && distance(p1, p2) < COMBINE_DISTANCE
      );
      if (nearbyAnnihilator) {
        particles = particles.filter(p => p !== p1 && p !== nearbyAnnihilator);
        break;
      }
    }
    }
    if (p1.type !== 'p') continue;

    //const nearbyN = particles.find(p2 => p2.type === 'n' && distance(p1, p2) < COMBINE_DISTANCE);
    const nearbyE = particles.find(p2 => p2.type === 'e' && distance(p1, p2) < COMBINE_DISTANCE);

    if (/*nearbyN && */nearbyE) {
      atoms.push(new Atom(p1.x, p1.y, [p1, /*nearbyN*/0, nearbyE]));
      particles = particles.filter(p => p !== p1/* && p !== nearbyN*/ && p !== nearbyE);
      break;
    }
  }
}
function fuseAtoms(a, b) {
    try {
      const newX = (a.x + b.x) / 2;
      const newY = (a.y + b.y) / 2;
  
      const isAtomA = a instanceof Atom;
      const isAtomB = b instanceof Atom;
  
      const isParticleA = a instanceof Particle;
      const isParticleB = b instanceof Particle;
  
      const combinedParticles = [];
  
      if (isAtomA) combinedParticles.push(...(a.particles || []));
      if (isAtomB) combinedParticles.push(...(b.particles || []));
  
      if (isParticleA) combinedParticles.push(a);
      if (isParticleB) combinedParticles.push(b);
  
      const fused = new Atom(newX, newY, combinedParticles);
      fused.vx = ((a.vx || 0) + (b.vx || 0)) / 2;
      fused.vy = ((a.vy || 0) + (b.vy || 0)) / 2;
  
      bonds = bonds.filter(bond => {
        const isBondedToA = bond.a === a || bond.b === a;
        const isBondedToB = bond.a === b || bond.b === b;
  
        if (isBondedToA || isBondedToB) {
          const other = bond.a === a || bond.a === b ? bond.b : bond.a;
          if (other && typeof other.electrons === 'number') {
            other.electrons++;
          }
          return false;
        }
  
        return true;
      });
  
      atoms = atoms.filter(atom => atom !== a && atom !== b);
      particles = particles.filter(p => p !== a && p !== b);
  
      atoms.push(fused);
  
      //console.log("Fusion complète:", fused);
    } catch (e) {
      console.error('Erreur dans fuseAtoms:', e, a, b);
      throw e;
    }
  }
  
  
  
  
  
  function resolveCollisions() {
    const allObjects = [...atoms, ...particles];
    const fusionThreshold = 10;
    const MAX_SPEED = 500;
  
    let atomToFuseA = null;
    let atomToFuseB = null;
  
    for (let i = 0; i < allObjects.length; i++) {
      for (let j = i + 1; j < allObjects.length; j++) {
        const a = allObjects[i];
        const b = allObjects[j];
  
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
  
        const radiusA = (a instanceof Atom) ? a.baseRadius : a.radius;
        const radiusB = (b instanceof Atom) ? b.baseRadius : b.radius;
  
        const minDist = radiusA + radiusB;
  
        if (dist < minDist) {
          const nx = dx / dist;
          const ny = dy / dist;
  
          const va = { x: a.vx || 0, y: a.vy || 0 };
          const vb = { x: b.vx || 0, y: b.vy || 0 };
  
          const dvx = vb.x - va.x;
          const dvy = vb.y - va.y;
          const dot = dvx * nx + dvy * ny;
  
          const ma = a.mass || 1;
          const mb = b.mass || 1;
  
          if (dot < 0) {
            const impulse = (2 * dot) / (ma + mb);
            const ix = impulse * nx;
            const iy = impulse * ny;
  
            a.vx = Math.max(Math.min(va.x + ix * mb, MAX_SPEED), -MAX_SPEED);
            a.vy = Math.max(Math.min(va.y + iy * mb, MAX_SPEED), -MAX_SPEED);
  
            b.vx = Math.max(Math.min(vb.x - ix * ma, MAX_SPEED), -MAX_SPEED);
            b.vy = Math.max(Math.min(vb.y - iy * ma, MAX_SPEED), -MAX_SPEED);
          }
  
          const relSpeed = Math.hypot(dvx, dvy);
  
          if (a instanceof Atom && b instanceof Atom && relSpeed > fusionThreshold) {
            atomToFuseA = a;
            atomToFuseB = b;
            break;
          }
  
          if ((a instanceof Atom && b instanceof Particle) || (b instanceof Atom && a instanceof Particle)) {
            const atom = a instanceof Atom ? a : b;
            const particle = a instanceof Particle ? a : b;
            atom.addParticle(particle);
            particles = particles.filter(p => p !== particle);
            continue;
          }
  
          const overlap = minDist - dist;
          const totalMass = ma + mb;
          const correctionX = nx * overlap;
          const correctionY = ny * overlap;
  
          a.x -= correctionX * (mb / totalMass);
          a.y -= correctionY * (mb / totalMass);
          b.x += correctionX * (ma / totalMass);
          b.y += correctionY * (ma / totalMass);
        }
      }
  
      if (atomToFuseA && atomToFuseB) break;
    }
  
    if (atomToFuseA && atomToFuseB) {
      fuseAtoms(atomToFuseA, atomToFuseB);
      atoms = atoms.filter(atom => atom !== atomToFuseA && atom !== atomToFuseB);
    }
  }
  
  
  
  function applyBondForces() {
    const stiffness = 0.004;
    const bondLengthFactor = 1.5 * distanceBetweenBondedAtomsCoef;
  
    for (const bond of bonds) {
      const a = bond.a;
      const b = bond.b;
  
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      if (dist === 0) continue;
  
      const idealLength = (a.baseRadius + b.baseRadius) * bondLengthFactor;
      const diff = dist - idealLength;
      const force = stiffness * diff;
  
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
  
      const ma = a.mass || 1;
      const mb = b.mass || 1;
      const totalMass = ma + mb;
  
      // Répartition de la force selon les masses
      a.vx += fx * (mb / totalMass);
      a.vy += fy * (mb / totalMass);
      b.vx -= fx * (ma / totalMass);
      b.vy -= fy * (ma / totalMass);
    }
  }
  
  
  
  const keys = {}
  window.addEventListener("keydown", e => {
    keys[e.key] = true;
    switch (e.key.toLowerCase()) {
        case 'a': addParticle(mousePos.x, mousePos.y, 'n')
        break;
        case 'z': addParticle(mousePos.x, mousePos.y, 'p')
        break;
        case 'e': addParticle(mousePos.x, mousePos.y, 'e')
        break;
        case 'q': addParticle(mousePos.x, mousePos.y, 'n-')
        break;
        case 's': addParticle(mousePos.x, mousePos.y, 'p-')
        break;
        case 'd': addParticle(mousePos.x, mousePos.y, 'e+')
        break;
    }
  })  
  window.addEventListener("keyup", e => {
    keys[e.key] = false;
  })
  
  
  function zoomAtScreenPoint(zoomFactor, screenX, screenY) {
    const worldBefore = screenToWorld(screenX, screenY);
    camera.zoom *= zoomFactor;
    const worldAfter = screenToWorld(screenX, screenY);
    camera.x += (worldAfter.x - worldBefore.x) * camera.zoom;
    camera.y += (worldAfter.y - worldBefore.y) * camera.zoom;
  }
  function biasedRandom(max, power = 2) {
    // power > 1 : plus biais vers valeurs basses
    // power = 1 : uniforme
    // power < 1 : biais vers valeurs hautes
    const rand = Math.random();
    const biased = 1 - Math.pow(rand, 1 / power);
    return Math.max(1, Math.floor(max * biased));
  }
  function createRandomAtoms(count = 10, maxProtons, maxX, maxY, biasPower) {
    for (let i = 0; i < count; i++) {
      const protons = biasedRandom(maxProtons, biasPower);
      const neutrons = protons;
      const electrons = protons;
  
      const particles = [];
  
      for (let j = 0; j < protons; j++) {
        particles.push({ type: 'p' });
      }
      for (let j = 0; j < neutrons; j++) {
        particles.push({ type: 'n' });
      }
      for (let j = 0; j < electrons; j++) {
        particles.push({ type: 'e' });
      }
      const x = Math.random() * maxX - maxX/2;
      const y = Math.random() * maxY - maxY/2;
  
      const atom = new Atom(x, y, particles);
      atoms.push(atom);
    }
  }
  createRandomAtoms(200, 118, 7500, 7500, 30)
  //createRandomAtoms(300, 118, 100, 100, 5)
  function gameLoop() {
    if (keys['+'] || keys['=']) {
        zoomAtScreenPoint(1.02, canvas.width / 2, canvas.height / 2);
      }
      if (keys['-']) {
        zoomAtScreenPoint(1 / 1.02, canvas.width / 2, canvas.height / 2);
      }
        if (keys['ArrowLeft']) camera.x -= camSpeed/camera.zoom;
        if (keys['ArrowRight']) camera.x += camSpeed/camera.zoom;
        if (keys['ArrowUp']) camera.y -= camSpeed/camera.zoom;
        if (keys['ArrowDown']) camera.y += camSpeed/camera.zoom;
    checkForBonds();
    applyBondForces();    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const spacing = drawGrid();//also calls drawGrid() so ye
    drawScaleBar(spacing);
    atoms.forEach(atom => {
        //atom.updateDecay(decaySpeedFactor);
        const isMoving = Math.abs(atom.vx) > 0.001 || Math.abs(atom.vy) > 0.001;
        const radiusScreen = atom.baseRadius * camera.zoom;
      
        if (isMoving || isOnScreen(atom.x, atom.y, radiusScreen)) {
          atom.update();
        }
      });
      particles.forEach(p => {
        const isMoving = Math.abs(p.vx) > 0.001 || Math.abs(p.vy) > 0.001;
        const radiusScreen = p.radius * camera.zoom;
      
        if (isMoving || isOnScreen(p.x, p.y, radiusScreen)) {
          p.update();
        }
      });
    checkBondCollisions();
    drawBonds();
    drawAtoms();
    drawParticles();
    checkForAtoms();
    resolveCollisions();
    requestAnimationFrame(gameLoop);
  }
  //function dirtyLoop() {
  //}
//setInterval(dirtyLoop, 1000)
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('contextmenu', e => e.preventDefault());

gameLoop();

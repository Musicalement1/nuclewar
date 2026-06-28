import {atomData} from "./nudat3data.js"

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
const decaySpeedFactor = 1
const realLifeTime = false
//const decaySpeedFactor = 100
const camSpeed = 20
const maxDrawOffsetDisintegration = 3
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

  function negativeOrPositive() {
    let n = Math.random()
    if (n >= 0.5) {
      return 1
    } else {
      return -1
    }
  }

  function tirageDesintegration(demieVie) {//la fonction qui gère l'aléatoire quantique, rien que ça! (la durée vie réelle d'un atome donné, qui peut être représenté aléatoirement selon sa demie vie)
    return -Math.log(Math.random()) * demieVie / Math.log(2);
  }

  function convertTimeUnitsToSecs(value, unit = "s") {
    if (value=="STABLE") return Infinity;
    switch(unit) {
      case "MeV":
      case "eV":
      case "keV":
        return 0
      break;
      case "s":
        return value
      break;
      case "ns":
        return value / 1000000000
      break;
      case "us":
        return value / 1000000
      break;
      case "ms":
        return value / 1000
      break;
      case "m":
        return value * 60
      break;
      case "h":
        return value * 3600
      break;
      case "d":
        return value * 86400
      break;
      case "y":
        return value * 31536000
      break;
    }
  }

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
    constructor(x, y, type, vx = 0, vy = 0) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.radius = (type == "e" || type == "e+") ? PARTICLE_RADIUS / 3 : PARTICLE_RADIUS
      this.vx = vx
      this.vy = vy
      this.electronTime = 0
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
let lastTime = null;
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

  const maxTimeDis = 365 * 24 * 60 * 60 * 3;//sec (3 ans en sec)

  function getGameLifetime(halflife) {
    const h = Math.max(1, Math.min(halflife, maxTimeDis));
  
    const t = Math.log10(h) / Math.log10(maxTimeDis);
  
    return 1 + t * 119; //entre 1 sec et 2 minutes
  }

  
class Atom {
    constructor(x, y, particles, vx = 0, vy = 0) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.dragging = false;
        /*this.age = 0;
        this.halfLife = Infinity;
        this.decayModes = {};
        this.spontaneousFissionProb = 0;
        this.computeHalfLifeAndDecayMode();*/
        this.particles = particles || [];
        this.bonds = []
        this.age = -1
        this.updateAll();
        this.needsToBreakBonds = false//après updateall ba ouai
    }
      
        

    atomLoop() {
      this.age+=decaySpeedFactor/24 //24 frames per second
      if (realLifeTime) {
        if (this.age >= this.halflife) {
          this.disintegration()
        }
      } else {
        if (this.age >= this.gameLifeTime) {
          this.disintegration()
        }
      }
    }

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

      /*drawHalo(ctx, x, y, radius, intensity, color = "120,200,255") {
        intensity = Math.max(0, Math.min(1, intensity));
    
        if (intensity <= 0) return;

        //(entre 1.5× et 3× le rayon le halo)
        const haloRadius = radius * (1.5 + intensity * 1.5);
    
        const gradient = ctx.createRadialGradient(
            x, y, radius * 0.9,
            x, y, haloRadius
        );
    
        gradient.addColorStop(0, `rgba(${color}, ${0.25 * intensity})`);
        gradient.addColorStop(0.4, `rgba(${color}, ${0.12 * intensity})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
    
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }*/



      draw() {
        const screen = worldToScreen(this.x, this.y);
        const radius = this.baseRadius * camera.zoom;
        let advancement = 0
        if (Number.isFinite(this.halflife) && this.halflife >= 0) {
          advancement = realLifeTime ? this.age / this.halflife : this.age / this.gameLifeTime
        }
        const randomXoffset = negativeOrPositive() * maxDrawOffsetDisintegration * Math.random() * advancement
        const randomYoffset = negativeOrPositive() * maxDrawOffsetDisintegration * Math.random() * advancement
        ctx.beginPath();
        ctx.arc(screen.x + randomXoffset, screen.y + randomYoffset, radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#222';
        ctx.stroke();

        /*if (Number.isFinite(this.halflife) && this.halflife >= 0) {
          let advancement = this.age / this.halflife
          //const speed = 2 + advancement * 8; //[2, 10]
          //const pulse = 0.85 + 0.15 * Math.sin(performance.now() * 0.001 * speed);
          this.drawHalo(ctx, screen.x, screen.y, radius * 2, advancement)
        }*/


    
        ctx.fillStyle = isColorDark(this.color) ? '#fff' : '#000';
        const fontSize = radius * 0.8;
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(this.getChargedSymbol(), screen.x + randomXoffset, screen.y + randomYoffset);
    
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
          `Atomic Mass : ${this.mass}`,
          `Half-Life : ${this.halfLifeTooltip[0].toString() + this.halfLifeTooltip[1]}`,
          ...(this.decayModes?.length
            ? [`Decay Modes : ${this.decayModes.map(({ mode, value }) => `${mode} ${value}%`).join(", ")}`]
            : [])
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

      addOrRemove(type, number) {
        if (number > 0) {
            for (let i = 0; i < number; i++) {
                this.particles.push({ type });
            }
        } else if (number < 0) {
            for (let i = 0; i < Math.abs(number); i++) {
                const index = this.particles.findIndex(p => p.type === type);
    
                if (index === -1) {
                    break;// plus de particules de ce type
                }
    
                this.particles.splice(index, 1);
            }
        }
    
        this.protons = this.particles.filter(p => p.type === 'p').length;
        this.neutrons = this.particles.filter(p => p.type === 'n').length;
        this.electronsTotal = this.particles.filter(p => p.type === 'e').length;
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

      waitYouArenotSupposedToExistSoIKillYou() {
        atoms = atoms.filter(a => a !== this);
        for (let i = 0; i<this.protons; i++) {this.ejectParticle("p", 5)}
        for (let i = 0; i<this.neutrons; i++) {this.ejectParticle("n", 5)}
        for (let i = 0; i<this.electronsTotal; i++) {this.ejectParticle("e", 5)}
      }


      assignHalfLife() {//and decay modes
        const isotope = Object.values(atomData).find(n =>
            n.z === this.protons &&
            n.n === this.neutrons
        );
        
        let dataLevel = isotope?.levels[0] || null
        if (dataLevel != null) {
          if (dataLevel.halflife != null) {
            if (dataLevel.halflife.value == "STABLE") {
              this.halfLifeTooltip = [dataLevel.halflife.value, ""]
            } else {
              this.halfLifeTooltip = [dataLevel.halflife.value, dataLevel.halflife.unit]
            }
            this.halflife = tirageDesintegration(convertTimeUnitsToSecs(dataLevel.halflife.value, dataLevel.halflife.unit))
            this.gameLifeTime = getGameLifetime(this.halflife);
          } else {

            this.halfLifeTooltip = "Unknown"
            //sinon l'élément est inconnu et il se DESINTEGRE SUR LE CHAMP HAHAHAHAHA JE SUIS TROP MECHANT!!!!!!! (non en fait)
            //this.waitYouArenotSupposedToExistSoIKillYou()
            /*let expectedRatio
            if (this.protons > 118) {
              let iwannalive = Math.random() > 0.8 ? true : false
              if (iwannalive) {
                this.dAlpha()
              } else {
                this.dsf()
              }
            }

            if (this.protons < 55) {
              expectedRatio = 1
            }
            else if (this.protons >= 49 && this.protons < 82) {// rapport n/p d'Indium 113 ~ 1.35 et c'est suffisant je pense
              expectedRatio = 1.35
            } 
            else {
              expectedRatio = 1.5
            }
  
            let actualRatio = this.neutrons/this.protons
  
            if (actualRatio >= expectedRatio) {
              this.dBeta(false)
            } else {
              this.dBeta(true)
            }*/
            /*if (this.protons > 2) {
              this.dsf()
            } else {
              this.waitYouArenotSupposedToExistSoIKillYou()
            }*/

            setTimeout(() => {
              if (this.protons > 2) {
                this.dsf()
              } else {
                this.waitYouArenotSupposedToExistSoIKillYou()
              }
            }, 1)

            console.log("Unknown halflive data in dataLevel")
            console.log(dataLevel)
          }

          if (dataLevel.decayModes !=null && this.halflife != Infinity) {
            this.decayModes = dataLevel.decayModes.observed
          } /*else {
            console.log(this.halflife)//Infinities
          }*/


        } else {
          //this.waitYouArenotSupposedToExistSoIKillYou()
            this.halfLifeTooltip = "Unknown"
            if (this.neutrons <=0 && this.protons <= 0) {atoms.filter(a => a !== this)};
            /*let expectedRatio
            if (this.protons > 118) {
              let iwannalive = Math.random() > 0.8 ? true : false
              if (iwannalive) {
                this.dAlpha()
              } else {
                this.dsf()
              }
            }
            if (this.protons < 55) {
              expectedRatio = 1
            }
            else if (this.protons >= 49 && this.protons < 82) {// rapport n/p d'Indium 113 ~ 1.35 et c'est suffisant je pense
              expectedRatio = 1.35
            } 
            else {
              expectedRatio = 1.5
            }

            let actualRatio = this.neutrons/this.protons
  
            if (actualRatio >= expectedRatio) {
              this.dBeta(false)
            } else {
              this.dBeta(true)
            }*/
            /*if (this.protons > 2) {
              this.dsf()
            } else {
              this.waitYouArenotSupposedToExistSoIKillYou()
            }*/
          console.log("No data level in the atom! Z= " + this.protons + " A-Z= " + this.neutrons)

          setTimeout(() => {
            if (this.protons > 2) {
              this.dsf()
            } else {
              this.waitYouArenotSupposedToExistSoIKillYou()
            }
          }, 1)

          //ces ptins d'atomes qui n'existent pas me courent sur le haricot mon gras.
        }
      }

      ejectAtom(p, n, e, speed = 5) {
        const angle = Math.random() * Math.PI * 2;
        //juste à l'extérieur de l'atome avec un peu de sécurité
        const distance = this.baseRadius * (1.5 + Math.random() * 0.2);
  
        const x = this.x + Math.cos(angle) * distance;
        const y = this.y + Math.sin(angle) * distance;

        const actualSpeed = speed * (0.9 + Math.random() * 0.2);
    
        const vx = Math.cos(angle) * actualSpeed;
        const vy = Math.sin(angle) * actualSpeed;

        let parts = []

        for (let j = 0; j < p; j++) {
          parts.push({ type: 'p' });
        }
        for (let j = 0; j < n; j++) {
          parts.push({ type: 'n' });
        }
        for (let j = 0; j < e; j++) {
          parts.push({ type: 'e' });
        }
    
        atoms.push(new Atom(x, y, parts,vx, vy));
      }

      ejectParticle(type, speed = 10) {
        const angle = Math.random() * Math.PI * 2;
        //juste à l'extérieur de l'atome avec un peu de sécurité
        const distance = (this.baseRadius + PARTICLE_RADIUS * 1.2 + (Math.random()*2));
  
        const x = this.x + Math.cos(angle) * distance;
        const y = this.y + Math.sin(angle) * distance;

        const actualSpeed = speed * (0.9 + Math.random() * 0.2);
    
        const vx = Math.cos(angle) * actualSpeed;
        const vy = Math.sin(angle) * actualSpeed;
    
        particles.push(new Particle(x, y, type, vx, vy));
      }

      dAlpha() {
        this.addOrRemove("p", -2);
        this.addOrRemove("n", -2);
        this.ejectAtom(2, 2, 0)
      } 
      dBeta(plus = false) {
        if (plus) { // β+
            this.addOrRemove("p", -1);
            this.addOrRemove("n", +1);
            this.ejectParticle("e+", 5);
        } else { // β-
            this.addOrRemove("p", +1);
            this.addOrRemove("n", -1);
            this.ejectParticle("e", 5);
        }
      }
      dsf() {
        if (this.protons + this.neutrons < 2) return;
        
        //au moins un proton par fragment stp
        if (this.protons < 2) return;
        atoms = atoms.filter(a => a !== this);
        const p1 = Math.floor(Math.random() * (this.protons - 1)) + 1;
        const p2 = this.protons - p1;
    
        const n1 = Math.floor(Math.random() * (this.neutrons + 1));
        const n2 = this.neutrons - n1;

        const e1 =  Math.floor(Math.random() * (this.electronsTotal + 1));
        const e2 = this.electronsTotal - e1
    
        if (p1 + n1 === 0 || p2 + n2 === 0) return;
    
        this.ejectAtom(p1, n1, e1);
        this.ejectAtom(p2, n2, e2);
    
    }

      disintegration() {
        this.age = -10
        if (!this.decayModes || this.decayModes.length === 0) {
            this.updateAll();
            return;
        }

        if (this.protons <= 0 && this.neutrons <= 0) {
          atoms.filter(a => a !== this)
          return
        }

        const totalChance = this.decayModes.reduce((sum, dm) => sum + dm.value, 0);
        const random = Math.random() * totalChance;
    
        let cumulative = 0;
        let chosenDecay = null;
        for (const dm of this.decayModes) {
            cumulative += dm.value;
    
            if (random <= cumulative) {
                chosenDecay = dm;
                break;
            }
        }
    
        //console.log("Decay choisi :", chosenDecay.mode);

        /*switch (chosenDecay.mode) {
            case "ɑ":
                this.dAlpha();
            break;
            case "SF":
              this.dsf();
            break;
        }*/

        /// On peut enlever "else if" et mettre des "if" mais ça buggue.


        if (chosenDecay.mode == "ɑ") {
          this.dAlpha();
        } else if (chosenDecay.mode == "SF") {
          this.dsf();
        }
        // β+ / β-
        else if (chosenDecay.mode.includes("β+")) {
            this.dBeta(true);
        }
        
        else if (chosenDecay.mode.includes("β⁻")) {
            this.dBeta(false);
        }
        
        // neutrons
        else if (chosenDecay.mode.includes("n")) {

            const match = chosenDecay.mode.match(/(\d*)n/);
        
            const count = match && match[1] ? parseInt(match[1], 10) : 1;
        
            this.addOrRemove("n", -count);
        
            for (let i = 0; i < count; i++) {
                this.ejectParticle("n");
            }

            if (this.neutrons <= count) { 
              atoms = atoms.filter(a => a !== this);
            }
        }

        else if (chosenDecay.mode.includes("p")) {
          
          const match = chosenDecay.mode.match(/(\d*)p/);
      
          const count = match && match[1] ? parseInt(match[1], 10) : 1;
      
          this.addOrRemove("p", -count);
      
          for (let i = 0; i < count; i++) {
              this.ejectParticle("p");
          }

          if (this.protons <= count) { 
            atoms = atoms.filter(a => a !== this);
          }
      }
    
        this.updateAll();
    }
      
      
      updateMassAndRadius() {
        this.mass = this.protons + this.neutrons;
        this.baseRadius = PARTICLE_RADIUS + this.mass; // Ajustable
      }
    
      updateAll(/*isElectron = false*/) {
        this.updateCounts();
        this.updateCharge();
        this.updateElementInfo(/*isElectron*/);
        this.updateMassAndRadius();
        this.assignHalfLife();
        this.needsToBreakBonds = true

        if (this.protons <= 0 && this.neutrons <= 0) {
          atoms.filter(a => a !== this);
        }
        //this.bonds = []; // reset
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

      if (dist > breakDistance || (bond.a.needsToBreakBonds || bond.b.needsToBreakBonds)) {
        bond.a.needsToBreakBonds = false
        bond.b.needsToBreakBonds = false
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
function drawAndUpdateAtoms() {
    atoms.forEach(atom => {
      if (isOnScreen(atom.x, atom.y, atom.baseRadius * camera.zoom)) {
        atom.draw();
        atom.atomLoop();
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
      p1.electronTime++
      if (p1.electronTime > 64) {
        atoms.push(new Atom(p1.x, p1.y, [p1, /*nearbyN*/0, nearbyE]));
        particles = particles.filter(p => p !== p1/* && p !== nearbyN*/ && p !== nearbyE);
        break;
      }
    } else if (p1.electronTime > 0) {
      p1.electronTime--
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
      const massA = a.mass || 0;
      const massB = b.mass || 0;
      const totalMass = massA + massB;
      
      if (totalMass > 0) {
        fused.vx = ((a.vx || 0) * massA + (b.vx || 0) * massB) / totalMass;
        fused.vy = ((a.vy || 0) * massA + (b.vy || 0) * massB) / totalMass;
      } else {
        fused.vx = 0;
        fused.vy = 0;
      }
  
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
  
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.hypot(dx, dy);

        if (dist === 0) {
          const angle = Math.random() * Math.PI * 2;
          dx = Math.cos(angle);
          dy = Math.sin(angle);
          dist = 1;
        }
  
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
  
          if ((a instanceof Atom && b instanceof Particle  && a.halfLifeTooltip != "Unknown") || (b instanceof Atom && a instanceof Particle && b.halfLifeTooltip != "Unknown")) {//code sale pour ne pas faire de réaction en chaîne débilos avec création de matière
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

  function checkCoulomb() {
    const K = 600; //intensité de la force

    //atome avec atome
    for (let i = 0; i < atoms.length; i++) {
        const a = atoms[i];

        for (let j = i + 1; j < atoms.length; j++) {
            const b = atoms[j];

            if (a.charge === 0 && b.charge === 0) continue;

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const d2 = dx * dx + dy * dy;

            const minDist = (a.baseRadius + b.baseRadius) * 6;

            if (d2 > minDist * minDist * 4) continue;

            const d = Math.sqrt(d2);
            if (d < 0.0001) continue;

            const force = K * (a.charge * b.charge) / d2;

            const fx = force * dx / d;
            const fy = force * dy / d;

            a.vx -= fx / a.mass;
            a.vy -= fy / a.mass;

            b.vx += fx / b.mass;
            b.vy += fy / b.mass;
        }
    }

    //atome avec part
    for (const atom of atoms) {

        for (const part of particles) {

            let q = 0;

            if (part.type === "p") q = 1;
            else if (part.type === "e") q = -1;
            else continue; //neutron

            if (atom.charge === 0) continue;

            const dx = part.x - atom.x;
            const dy = part.y - atom.y;
            const d2 = dx * dx + dy * dy;

            const minDist = atom.baseRadius * 12;

            if (d2 > minDist * minDist) continue;

            const d = Math.sqrt(d2);
            if (d < 0.0001) continue;

            const force = K * (atom.charge * q) / d2;

            const fx = force * dx / d;
            const fy = force * dy / d;

            atom.vx -= fx / atom.mass;
            atom.vy -= fy / atom.mass;

            let coef = 12//on va considérer que le proton c 12 fois lui mm parce que arcade

            if (part.type == "e") {
              coef = 12/3
            }

            part.vx += fx / coef;
            part.vy += fy / coef;
        }
    }

    for (const atom of atoms) {
      if (atom.charge < -atom.valenceMax) {
        atom.addOrRemove("e",-1)
        atom.updateAll()
        atom.ejectParticle("e")
      }
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
        case 'm':
          atoms.forEach(a => {
            if (a.isHovered()) { 
              a.disintegration()
            }
          })
        break;
        case 'l':
          atoms.forEach(a => {
            if (a.isHovered()) { 
              a.waitYouArenotSupposedToExistSoIKillYou()
            }
          })
        break;
        case 'p':
          atoms.forEach(a => {
          if (a.isHovered()) { 
            a.dsf()
          }
        })
        break;
        case 'o':
          let parts = []

          for (let j = 0; j < 82; j++) {
            parts.push({ type: 'p' });
          }
          for (let j = 0; j < 208-82; j++) {
            parts.push({ type: 'n' });
          }
          for (let j = 0; j < 82; j++) {
            parts.push({ type: 'e' });
          }
          let atom = new Atom(mousePos.x, mousePos.y, parts)
          atoms.push(atom)
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

  function createRandomParticules(count = 10, maxX, maxY) {

    // 55% seront des éléctrons
    // 21% des protons
    // 21% des neutrons
    // 1% de chaque antimatière

    for (let i = 0; i < count; i++) {
      const x  = Math.random() * maxX - maxX/2;
      const y = Math.random() * maxY - maxY/2;

      const rand = Math.random()

      let type

      if (rand < 0.55) {
        type = "e"
      } else if(rand >= 0.55 && rand < 0.76) {
        type = "p"
      } else if(rand >= 0.76 && rand < 0.97) {
        type = "n"
      } else if(rand >= 0.97 && rand < 0.98) {
        type = "p-"
      } else if(rand >= 0.98 && rand < 0.99) {
        type = "n-"
      } else {
        type = "e+"
      }

      const particle = new Particle(x, y, type)

      particles.push(particle)
    }

  }
  createRandomAtoms(100, 118, 3750, 3750, 30) //le bon
  createRandomParticules(100, 3750, 3750)
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
    drawAndUpdateAtoms();
    drawParticles();
    checkForAtoms();
    checkCoulomb();
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

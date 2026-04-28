/**
 * nickname-generator
 *
 * A poetic, combinatorial nickname generator.
 * Ships with Turkish word lists by default — fully replaceable with any language.
 *
 * Default word lists (Turkish):
 *   adjectives · nouns · colors · verbs · numbers
 *
 * Every list can be replaced or extended per call via the `words` option.
 */

// ─────────────────────────────────────────────────────────────
// DEFAULT WORD LISTS  (Turkish — poetic / melancholic register)
// Replace any of these via opts.words to support other languages.
// ─────────────────────────────────────────────────────────────
const DEFAULT_WORDS = {

  // adjectives — must feel natural next to any noun
  adjectives: [
    // time / state
    "eski", "geç", "son", "ilk", "yarım", "bitmemiş", "yitik",
    // mood / atmosphere
    "sessiz", "soluk", "loş", "sisli", "tenha", "ıssız", "boş",
    "yalnız", "mahzun", "durgun", "sakin",
    "karanlık", "donmuş", "solgun", "sönük", "solmuş",
    // weather / climate
    "nemli", "puslu", "karlı", "yağmurlu", "fırtınalı",
    "rüzgarlı", "kasvetli", "buğulu", "gölgeli", "ıslak",
    "soğuk", "serin", "dondurucu", "yakıcı",
    // color / visual
    "sarı", "mavi", "mor", "beyaz", "gümüş", "altın", "lacivert",
    "eflatun", "kızıl", "boz",
    // physical quality
    "küçük", "uzak", "ince", "derin", "yüksek",
    "harap", "köhne", "yıkık", "ücra", "antik",
    "yıpranmış", "eskimiş", "paslanmış",
    // participial adjectives
    "yanan", "sönen", "akan", "kırık", "kaybolan",
    "gizli", "saklı", "unutulmuş", "terk", "yorgun",
    "beklenen", "geçen", "kalan", "kayıp",
    // abstract but universal
    "sonsuz", "duru", "ağır", "hafif", "uzun"
  ],

  // nouns — concrete, visual, strong on their own
  nouns: [
    // transport / architecture / place
    "tren", "vagon", "iskele", "köprü", "yol", "sokak",
    "çatı", "avlu", "kapı", "pencere", "merdiven",
    "liman", "rıhtım", "peron", "tünel", "patika",
    "bahçe", "harabe", "oda", "han", "değirmen",
    "kışla", "ambar", "kale", "sur", "kule", "minare",
    "çeşme", "meydan", "mahalle",
    // nature / geography
    "sis", "kül", "kar", "yağmur", "rüzgar",
    "dalga", "kıyı", "nehir", "göl",
    "mağara", "kaya", "taş", "toprak", "kök", "dal",
    "yaprak", "çiçek", "orman", "dağ", "deniz",
    "gölge", "ay", "yıldız",
    // time of day
    "şafak", "alacakaranlık", "gece", "sabah", "akşam", "çiy",
    // objects / instruments
    "mum", "fener", "lamba", "ayna", "saat", "pusula",
    "anahtar", "kilit", "zincir",
    "mektup", "kağıt", "kitap", "sayfa", "defter", "kalem", "mürekkep",
    "plak", "kaset", "radyo", "gitar", "nota",
    "fotoğraf", "mercek", "fincan", "bardak", "şişe",
    // abstract / emotion / concept
    "ses", "yankı", "fısıltı", "nefes", "iz", "koku",
    "anı", "düş", "hayal", "umut", "vedâ",
    "yolculuk", "ayrılık", "sessizlik", "dönüş", "duman"
  ],

  // colors — used by the colorNoun format
  colors: [
    "sarı", "mavi", "yeşil", "kırmızı", "mor",
    "turuncu", "gri", "siyah", "beyaz", "lacivert",
    "kahve", "pembe", "altın", "gümüş", "eflatun",
    "kiremit", "bordo", "turkuaz", "indigo", "kızıl"
  ],

  // numbers — used by formats that append a number suffix
  numbers: ["0", "1", "7", "13", "21", "42", "99"],

  // verbs — present-participle form; must pair naturally with any noun
  verbs: [
    "akan", "yanan", "sönen", "dönen", "düşen",
    "kaçan", "kalan", "bekleyen", "unutan", "arayan",
    "giden", "gelen", "geçen", "koşan", "duran",
    "ağlayan", "yiten", "biten", "doğan",
    "yükselen", "alçalan", "uçan", "çöken", "kırılan",
    "dağılan", "biriken", "savrulan", "silinen", "kaybolan",
    "sürüklenen", "uzanan", "bürünen", "saklanan"
  ]
};

// ─────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────

/** Strips Turkish diacritics to produce ASCII-safe output. */
function toAscii(str) {
  return str
    .replace(/ğ/g, "g").replace(/Ğ/g, "G")
    .replace(/ü/g, "u").replace(/Ü/g, "U")
    .replace(/ş/g, "s").replace(/Ş/g, "S")
    .replace(/ı/g, "i").replace(/İ/g, "I")
    .replace(/ö/g, "o").replace(/Ö/g, "O")
    .replace(/ç/g, "c").replace(/Ç/g, "C");
}

/** Returns a random element from an array. */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Uppercases the first character of a string. */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─────────────────────────────────────────────────────────────
// WORD RESOLUTION
// Merges user-supplied word lists with (or in place of) defaults.
//
// opts.words  — object with any of: adjectives, nouns, colors, numbers, verbs
// opts.extend — if true, user lists are appended to defaults (extend mode)
//               if false/omitted, user lists replace defaults (replace mode)
// ─────────────────────────────────────────────────────────────
function resolveWords(opts) {
  const custom  = opts.words  || {};
  const extend  = opts.extend === true;

  const resolve = (key) => {
    const userList = custom[key];
    if (!userList || !Array.isArray(userList) || userList.length === 0) {
      return DEFAULT_WORDS[key];
    }
    return extend ? [...DEFAULT_WORDS[key], ...userList] : userList;
  };

  return {
    adjectives: resolve("adjectives"),
    nouns:      resolve("nouns"),
    colors:     resolve("colors"),
    numbers:    resolve("numbers"),
    verbs:      resolve("verbs"),
  };
}

// ─────────────────────────────────────────────────────────────
// FORMATS
// Each format is a function (opts) => string.
// All word access goes through resolveWords(opts) so custom
// lists are respected automatically.
// ─────────────────────────────────────────────────────────────
const FORMATS = {
  /** "Sabah Sisi" — spaced, title-cased */
  spaced: (opts = {}) => {
    const w   = resolveWords(opts);
    const raw = `${capitalize(pick(w.adjectives))} ${capitalize(pick(w.nouns))}`;
    return opts.ascii ? toAscii(raw) : raw;
  },

  /** "sabahsisi" — lowercase, no separator */
  joined: (opts = {}) => {
    const w   = resolveWords(opts);
    const raw = `${pick(w.adjectives)}${pick(w.nouns)}`;
    return opts.ascii ? toAscii(raw) : raw;
  },

  /** "SabahSisi" — PascalCase */
  pascal: (opts = {}) => {
    const w   = resolveWords(opts);
    const raw = `${capitalize(pick(w.adjectives))}${capitalize(pick(w.nouns))}`;
    return opts.ascii ? toAscii(raw) : raw;
  },

  /** "sabah_sisi" — snake_case */
  snake: (opts = {}) => {
    const w   = resolveWords(opts);
    const raw = `${pick(w.adjectives)}_${pick(w.nouns)}`;
    return opts.ascii ? toAscii(raw) : raw;
  },

  /** "sabah-sisi" — kebab-case */
  kebab: (opts = {}) => {
    const w   = resolveWords(opts);
    const raw = `${pick(w.adjectives)}-${pick(w.nouns)}`;
    return opts.ascii ? toAscii(raw) : raw;
  },

  /** "SabahSisi42" — PascalCase with a number suffix */
  pascalNumber: (opts = {}) => {
    const w   = resolveWords(opts);
    const raw = `${capitalize(pick(w.adjectives))}${capitalize(pick(w.nouns))}${pick(w.numbers)}`;
    return opts.ascii ? toAscii(raw) : raw;
  },

  /** "sabahsisi_42" — joined with a number suffix */
  joinedNumber: (opts = {}) => {
    const w   = resolveWords(opts);
    const raw = `${pick(w.adjectives)}${pick(w.nouns)}_${pick(w.numbers)}`;
    return opts.ascii ? toAscii(raw) : raw;
  },

  /** "GriMektup" — color + noun, PascalCase */
  colorNoun: (opts = {}) => {
    const w   = resolveWords(opts);
    const raw = `${capitalize(pick(w.colors))}${capitalize(pick(w.nouns))}`;
    return opts.ascii ? toAscii(raw) : raw;
  },

  /** "AkanDuman" — verb-participle + noun, PascalCase */
  verbNoun: (opts = {}) => {
    const w   = resolveWords(opts);
    const raw = `${capitalize(pick(w.verbs))}${capitalize(pick(w.nouns))}`;
    return opts.ascii ? toAscii(raw) : raw;
  },

  /** "SabahSisiVeYağmur" — adj + noun + "Ve" + noun (double-noun) */
  double: (opts = {}) => {
    const w    = resolveWords(opts);
    const adj  = pick(w.adjectives);
    const n1   = pick(w.nouns);
    // if only one noun in the list, reuse it rather than looping forever
    const pool = w.nouns.length > 1 ? w.nouns.filter(x => x !== n1) : w.nouns;
    const n2   = pick(pool);
    const raw  = `${capitalize(adj)}${capitalize(n1)}Ve${capitalize(n2)}`;
    return opts.ascii ? toAscii(raw) : raw;
  },
};

const FORMAT_KEYS = Object.keys(FORMATS);

// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────

/**
 * Generate a single nickname.
 *
 * @param {object}   [opts]
 * @param {string}   [opts.format='random']   One of the format keys or 'random'.
 * @param {boolean}  [opts.ascii=false]        Strip diacritics for ASCII-safe output.
 * @param {boolean}  [opts.extend=false]       true → user words are appended to defaults.
 *                                             false → user words replace defaults entirely.
 * @param {object}   [opts.words]              Custom word lists (any key is optional).
 * @param {string[]} [opts.words.adjectives]
 * @param {string[]} [opts.words.nouns]
 * @param {string[]} [opts.words.colors]
 * @param {string[]} [opts.words.numbers]
 * @param {string[]} [opts.words.verbs]
 * @returns {string}
 */
function generate(opts = {}) {
  const { format = "random" } = opts;
  const selected = format === "random" ? pick(FORMAT_KEYS) : format;
  const fn = FORMATS[selected];
  if (!fn) throw new Error(`Unknown format: "${selected}". Valid formats: ${FORMAT_KEYS.join(", ")}`);
  return fn({ ...opts });
}

/**
 * Generate multiple nicknames.
 *
 * @param {number} [count=10]
 * @param {object} [opts]      Same options as generate().
 * @returns {string[]}
 */
function generateMany(count = 10, opts = {}) {
  return Array.from({ length: count }, () => generate(opts));
}

/**
 * Generate one nickname in every available format.
 *
 * @param {object} [opts]  Same options as generate() (except format).
 * @returns {object}       { formatKey: nickname, … }
 */
function allFormats(opts = {}) {
  return Object.fromEntries(
    FORMAT_KEYS.map(f => [f, FORMATS[f]({ ...opts })])
  );
}

module.exports = {
  // primary API
  generate,
  generateMany,
  allFormats,
  // internals exposed for customisation
  DEFAULT_WORDS,
  FORMAT_KEYS,
  toAscii,
};

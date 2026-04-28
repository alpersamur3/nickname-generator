const tng = require("./index.js");

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`✓ ${name}`); passed++; }
  catch (e) { console.log(`✗ ${name}: ${e.message}`); failed++; }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || "Assertion failed"); }

// — Core API —
test("generate() returns a string", () => assert(typeof tng.generate() === "string"));
test("generateMany(5) returns 5 items", () => assert(tng.generateMany(5).length === 5));
test("allFormats() covers every format", () => {
  const r = tng.allFormats();
  assert(Object.keys(r).length === tng.FORMAT_KEYS.length);
});
test("spaced format contains a space", () => assert(tng.generate({ format: "spaced" }).includes(" ")));
test("kebab format contains a hyphen", () => assert(tng.generate({ format: "kebab" }).includes("-")));
test("snake format contains an underscore", () => assert(tng.generate({ format: "snake" }).includes("_")));
test("ascii mode strips Turkish characters", () => {
  for (let i = 0; i < 100; i++) {
    const r = tng.generate({ ascii: true });
    assert(!/[ğüşıöçĞÜŞİÖÇ]/.test(r), `Turkish character found: "${r}"`);
  }
});
test("unknown format throws an error", () => {
  try { tng.generate({ format: "nonexistent" }); throw new Error("Expected error"); }
  catch (e) { assert(e.message.includes("Unknown format")); }
});
test("100 generations have < 30% duplicates", () => {
  const set = new Set(Array.from({ length: 100 }, () => tng.generate({ format: "joined" })));
  assert(set.size > 70, `Too many duplicates: ${set.size}/100`);
});

// — Custom word lists: REPLACE mode (default) —
test("words.nouns fully replaces defaults", () => {
  const result = tng.generate({ format: "joined", words: { nouns: ["gezegen", "yıldız"] } });
  assert(result.endsWith("gezegen") || result.endsWith("yıldız"), `Unexpected: ${result}`);
});

test("words.adjectives fully replaces defaults", () => {
  const result = tng.generate({ format: "joined", words: { adjectives: ["kozmik"] } });
  assert(result.startsWith("kozmik"), `Unexpected: ${result}`);
});

test("words.colors affects colorNoun format", () => {
  const result = tng.generate({ format: "colorNoun", words: { colors: ["neon"] } });
  assert(result.startsWith("Neon"), `Unexpected: ${result}`);
});

test("words.numbers affects pascalNumber format", () => {
  for (let i = 0; i < 20; i++) {
    const result = tng.generate({ format: "pascalNumber", words: { numbers: ["2024"] } });
    assert(result.endsWith("2024"), `Unexpected: ${result}`);
  }
});

test("words.verbs affects verbNoun format", () => {
  const result = tng.generate({ format: "verbNoun", words: { verbs: ["parlayan"] } });
  assert(result.startsWith("Parlayan"), `Unexpected: ${result}`);
});

// — Custom word lists: EXTEND mode —
test("extend:true appends to defaults (nouns)", () => {
  const custom = ["zirve"];
  const results = Array.from({ length: 500 }, () =>
    tng.generate({ format: "joined", words: { nouns: custom }, extend: true })
  );
  const defaultFound = results.some(s => !s.endsWith("zirve"));
  const customFound  = results.some(s => s.endsWith("zirve"));
  assert(defaultFound, "Default nouns never appeared");
  assert(customFound,  "Custom 'zirve' never appeared");
});

test("extend:true works for adjectives too", () => {
  const results = Array.from({ length: 500 }, () =>
    tng.generate({ format: "joined", words: { adjectives: ["neon"] }, extend: true })
  );
  assert(results.some(s => s.startsWith("neon")),  "Custom adjective never appeared");
  assert(results.some(s => !s.startsWith("neon")), "Default adjectives never appeared");
});

// — Multiple custom lists at once —
test("multiple categories customized simultaneously", () => {
  const result = tng.generate({
    format: "colorNoun",
    words: { colors: ["gök"], nouns: ["taş"] }
  });
  assert(result === "GökTaş", `Expected GökTaş, got: ${result}`);
});

// — generateMany passes options —
test("generateMany passes words.nouns", () => {
  const list = tng.generateMany(10, { format: "joined", words: { nouns: ["nehir"] } });
  assert(list.every(s => s.endsWith("nehir")), "Some items did not end with 'nehir'");
});

// — allFormats passes options —
test("allFormats passes words.nouns", () => {
  const r = tng.allFormats({ words: { nouns: ["kapı"] } });
  assert(r.joined.endsWith("kapı"), `joined: ${r.joined}`);
  assert(r.pascal.endsWith("Kapı"), `pascal: ${r.pascal}`);
});

// — Edge cases —
test("empty array falls back to defaults", () => {
  const result = tng.generate({ format: "joined", words: { nouns: [] } });
  assert(typeof result === "string" && result.length > 0);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

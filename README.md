# nickname-generator

[![npm version](https://img.shields.io/npm/v/%40alpersamur3%2Fnickname-generator.svg)](https://www.npmjs.com/package/@alpersamur3/nickname-generator)
[![npm downloads](https://img.shields.io/npm/dm/%40alpersamur3%2Fnickname-generator.svg)](https://www.npmjs.com/package/@alpersamur3/nickname-generator)
[![license](https://img.shields.io/npm/l/%40alpersamur3%2Fnickname-generator.svg)](./LICENSE)
[![node](https://img.shields.io/node/v/%40alpersamur3%2Fnickname-generator.svg)](https://www.npmjs.com/package/@alpersamur3/nickname-generator)

> A poetic, combinatorial **nickname generator** and **username generator**.  
> Ships with **Turkish** word lists by default — fully replaceable with any language.

Generate unique **display names**, **gamer tags**, **Discord handles**, **Twitch usernames**, **bot names**, and more. 10 output formats including PascalCase, snake_case, kebab-case, and ASCII-safe slugs. Zero dependencies.

*Sabah Sisi · Kayıp Plak · soluk_avlu · GriMektup42*

---

**[English](#english) · [Türkçe](#türkçe)**

---

<a name="english"></a>

## Features

- 10 built-in formats: spaced, pascal, snake, kebab, colorNoun, verbNoun, double, …
- Bundled with curated **Turkish** word lists (poetic / melancholic register)
- Word lists are fully **replaceable or extendable** per call — works with any language
- ASCII mode: strips diacritics for URL-safe / social-media-friendly output
- Zero dependencies

---

## Installation

```bash
npm install @alpersamur3/nickname-generator
```

---

## Quick Start

```js
const { generate, generateMany, allFormats } = require("@alpersamur3/nickname-generator");

// Single nickname — random format
generate();                              // → "YorgunTren"

// Specific format
generate({ format: "spaced" });          // → "Sabah Sisi"
generate({ format: "kebab" });           // → "kayıp-plak"
generate({ format: "pascalNumber" });    // → "KırıkAnahtar42"

// ASCII mode — strips diacritics (URL-safe, social-media-friendly)
generate({ format: "joined", ascii: true });  // → "sabahsisi"
generate({ format: "pascal", ascii: true });  // → "KayipPlak"

// Bulk generation
generateMany(5);
// → ["SolukAvlu", "GeceMektup", "BoşVagon", …]

generateMany(5, { format: "snake", ascii: true });
// → ["sabah_sis", "kayip_duman", …]

// One nickname in every format
allFormats({ ascii: true });
// → { spaced: "Sabah Sisi", joined: "sabahsisi", pascal: "SabahSisi", … }
```

---

## API

### `generate(opts?)`

Generates a single nickname.

| Option | Type | Default | Description |
|---|---|---|---|
| `format` | `string` | `"random"` | Format key or `"random"` |
| `ascii` | `boolean` | `false` | Strip diacritics for ASCII-safe output |
| `words` | `object` | — | Custom word lists (any category, see below) |
| `extend` | `boolean` | `false` | `true` → append to defaults; `false` → replace defaults |

### `generateMany(count?, opts?)`

Returns an array of `count` nicknames (default: `10`). Accepts the same options as `generate()`.

### `allFormats(opts?)`

Returns one nickname per format as `{ formatKey: nickname, … }`. Accepts the same options as `generate()` (except `format`).

---

## Formats

| Key | Example | Description |
|---|---|---|
| `spaced` | `Sabah Sisi` | Title-cased, space-separated |
| `joined` | `sabahsisi` | Lowercase, no separator |
| `pascal` | `SabahSisi` | PascalCase |
| `snake` | `sabah_sisi` | snake_case |
| `kebab` | `sabah-sisi` | kebab-case |
| `pascalNumber` | `SabahSisi42` | PascalCase + number suffix |
| `joinedNumber` | `sabahsisi_42` | Joined + number suffix |
| `colorNoun` | `GriMektup` | Color + noun, PascalCase |
| `verbNoun` | `AkanDuman` | Verb-participle + noun, PascalCase |
| `double` | `SabahSisiVeYağmur` | Adj + noun + connector + noun |

---

## Custom Word Lists

Word lists can be swapped per call. **Replace mode** (default) discards the built-in list entirely; **extend mode** appends to it.

### Replace (default)

```js
// Override nouns — built-in Turkish list is discarded for this call
generate({ format: "pascal", words: { nouns: ["galaxy", "orbit", "pulsar"] } });
// → "SolukGalaxy"

// Override multiple categories at once
generate({
  format: "colorNoun",
  words: { colors: ["neon", "plasma"], nouns: ["grid", "core"] }
});
// → "NeonCore"
```

### Extend

```js
// Append to the default Turkish lists
generate({
  format: "pascal",
  words: { nouns: ["galaxy", "orbit"] },
  extend: true
});
// → may produce "SolukGalaxy" or "YorgunTren" (both pools active)
```

### Inspecting the defaults

```js
const { DEFAULT_WORDS } = require("@alpersamur3/nickname-generator");

console.log(DEFAULT_WORDS.adjectives); // ["eski", "geç", "son", …]
console.log(DEFAULT_WORDS.nouns);      // ["tren", "vagon", "iskele", …]
```

---

## ASCII Mode

Strips Turkish diacritics (ğ ü ş ı ö ç) for ASCII-safe output:

```js
generate({ format: "pascal", ascii: true }); // → "KayipPlak"  (no diacritics)
generate({ format: "snake",  ascii: true }); // → "sabah_sis"

// Direct utility
const { toAscii } = require("@alpersamur3/nickname-generator");
toAscii("şişli köşe"); // → "sisli kose"
```

---

## Default Word Lists (Turkish)

The bundled word lists are curated for a poetic, melancholic tone in Turkish.  
All categories are fully replaceable via `opts.words`.

| Category | Key | Sample words |
|---|---|---|
| Adjectives | `adjectives` | `eski`, `sessiz`, `soluk`, `yalnız`, `donmuş` |
| Nouns | `nouns` | `tren`, `sis`, `mektup`, `ayna`, `şafak` |
| Colors | `colors` | `sarı`, `mavi`, `gümüş`, `eflatun`, `kiremit` |
| Numbers | `numbers` | `0`, `1`, `7`, `13`, `42` |
| Verbs | `verbs` | `akan`, `yanan`, `sönen`, `kaybolan`, `sürüklenen` |

---

## License

MIT

---

## Keywords

`nickname generator` · `username generator` · `random name generator` · `display name` · `gamer tag` · `gamertag generator` · `Discord username` · `Twitch handle` · `bot name` · `Turkish` · `slug` · `ASCII` · `no dependencies`

---

<a name="türkçe"></a>

## Türkçe

Şiirsel ve melankolik bir **nickname üreteci**.  
Varsayılan olarak **Türkçe** kelime listeleriyle gelir — `words` seçeneğiyle istediğiniz dile göre tamamen değiştirilebilir veya genişletilebilir.

### Kurulum

```bash
npm install @alpersamur3/nickname-generator
```

### Hızlı Başlangıç

```js
const { generate, generateMany, allFormats } = require("@alpersamur3/nickname-generator");

// Tek nickname — rastgele format
generate();                                  // → "YorgunTren"

// Belirli format
generate({ format: "spaced" });              // → "Sabah Sisi"
generate({ format: "kebab" });               // → "kayıp-plak"
generate({ format: "pascalNumber" });        // → "KırıkAnahtar42"

// ASCII modu — Türkçe karakterleri kaldırır (URL ve sosyal medya dostu)
generate({ format: "joined", ascii: true }); // → "sabahsisi"
generate({ format: "pascal", ascii: true }); // → "KayipPlak"

// Toplu üretim
generateMany(5);
// → ["SolukAvlu", "GeceMektup", "BoşVagon", …]

// Tüm formatlarda birer tane
allFormats({ ascii: true });
// → { spaced: "Sabah Sisi", joined: "sabahsisi", pascal: "SabahSisi", … }
```

### Kelime Listelerini Özelleştirme

```js
// Sadece kendi isimlerinizi kullanın (varsayılan liste devre dışı)
generate({ format: "pascal", words: { nouns: ["gezegen", "yıldız", "nebula"] } });
// → "SessizGezegen"

// Varsayılan listeye ekleme yapın (extend modu)
generate({ format: "pascal", words: { nouns: ["meteor"] }, extend: true });
// → varsayılan Türkçe isimler + "meteor" arasından rastgele seçer

// Birden fazla kategoriyi aynı anda değiştirin
generate({
  format: "colorNoun",
  words: { colors: ["neon", "plazma"], nouns: ["çekirdek", "ızgara"] }
});
// → "NeonIzgara"
```

### Formatlar

| Anahtar | Örnek | Açıklama |
|---|---|---|
| `spaced` | `Sabah Sisi` | Boşluklu, başharfler büyük |
| `joined` | `sabahsisi` | Bitişik, küçük harf |
| `pascal` | `SabahSisi` | PascalCase |
| `snake` | `sabah_sisi` | Alt tire |
| `kebab` | `sabah-sisi` | Tire |
| `pascalNumber` | `SabahSisi42` | PascalCase + sayı |
| `joinedNumber` | `sabahsisi_42` | Bitişik + sayı |
| `colorNoun` | `GriMektup` | Renk + isim |
| `verbNoun` | `AkanDuman` | Fiil + isim |
| `double` | `SabahSisiVeYağmur` | Sıfat + isim + bağlaç + isim |

### API

| Fonksiyon | Açıklama |
|---|---|
| `generate(opts?)` | Tek nickname üretir |
| `generateMany(count?, opts?)` | `count` adet nickname döner (varsayılan: 10) |
| `allFormats(opts?)` | Her format için birer nickname döner |
| `toAscii(str)` | Türkçe karakterleri ASCII'ye çevirir |
| `DEFAULT_WORDS` | Varsayılan kelime listelerine erişim |
| `FORMAT_KEYS` | Geçerli format anahtarları dizisi |

- 10 built-in formats: spaced, pascal, snake, kebab, colorNoun, verbNoun, double, …
- Bundled with curated **Turkish** word lists (poetic / melancholic register)
- Word lists are fully **replaceable or extendable** per call — works with any language
- ASCII mode: strips diacritics for URL-safe / social-media-friendly output
- Zero dependencies

---

## Installation

```bash
npm install @alpersamur3/nickname-generator
```

---

## Quick Start

```js
const { generate, generateMany, allFormats } = require("@alpersamur3/nickname-generator");

// Single nickname — random format
generate();                              // → "YorgunTren"

// Specific format
generate({ format: "spaced" });          // → "Sabah Sisi"
generate({ format: "kebab" });           // → "kayıp-plak"
generate({ format: "pascalNumber" });    // → "KırıkAnahtar42"

// ASCII mode — strips diacritics (URL-safe, social-media-friendly)
generate({ format: "joined", ascii: true });  // → "sabahsisi"
generate({ format: "pascal", ascii: true });  // → "KayipPlak"

// Bulk generation
generateMany(5);
// → ["SolukAvlu", "GeceMektup", "BoşVagon", …]

generateMany(5, { format: "snake", ascii: true });
// → ["sabah_sis", "kayip_duman", …]

// One nickname in every format
allFormats({ ascii: true });
// → { spaced: "Sabah Sisi", joined: "sabahsisi", pascal: "SabahSisi", … }
```

---

## API

### `generate(opts?)`

Generates a single nickname.

| Option | Type | Default | Description |
|---|---|---|---|
| `format` | `string` | `"random"` | Format key or `"random"` |
| `ascii` | `boolean` | `false` | Strip diacritics for ASCII-safe output |
| `words` | `object` | — | Custom word lists (any category, see below) |
| `extend` | `boolean` | `false` | `true` → append to defaults; `false` → replace defaults |

### `generateMany(count?, opts?)`

Returns an array of `count` nicknames (default: `10`). Accepts the same options as `generate()`.

### `allFormats(opts?)`

Returns one nickname per format as `{ formatKey: nickname, … }`. Accepts the same options as `generate()` (except `format`).

---

## Formats

| Key | Example | Description |
|---|---|---|
| `spaced` | `Sabah Sisi` | Title-cased, space-separated |
| `joined` | `sabahsisi` | Lowercase, no separator |
| `pascal` | `SabahSisi` | PascalCase |
| `snake` | `sabah_sisi` | snake_case |
| `kebab` | `sabah-sisi` | kebab-case |
| `pascalNumber` | `SabahSisi42` | PascalCase + number suffix |
| `joinedNumber` | `sabahsisi_42` | Joined + number suffix |
| `colorNoun` | `GriMektup` | Color + noun, PascalCase |
| `verbNoun` | `AkanDuman` | Verb-participle + noun, PascalCase |
| `double` | `SabahSisiVeYağmur` | Adj + noun + connector + noun |

---

## Custom Word Lists

Word lists can be swapped per call. **Replace mode** (default) discards the built-in list entirely; **extend mode** appends to it.

### Replace (default)

```js
// Override nouns — built-in Turkish list is discarded for this call
generate({ format: "pascal", words: { nouns: ["galaxy", "orbit", "pulsar"] } });
// → "SolukGalaxy"

// Override multiple categories at once
generate({
  format: "colorNoun",
  words: { colors: ["neon", "plasma"], nouns: ["grid", "core"] }
});
// → "NeonCore"
```

### Extend

```js
// Append to the default Turkish lists
generate({
  format: "pascal",
  words: { nouns: ["galaxy", "orbit"] },
  extend: true
});
// → may produce "SolukGalaxy" or "YorgunTren" (both pools active)
```

### Inspecting the defaults

```js
const { DEFAULT_WORDS } = require("@alpersamur3/nickname-generator");

console.log(DEFAULT_WORDS.adjectives); // ["eski", "geç", "son", …]
console.log(DEFAULT_WORDS.nouns);      // ["tren", "vagon", "iskele", …]
```

---

## ASCII Mode

Strips Turkish diacritics (ğ ü ş ı ö ç) for ASCII-safe output:

```js
generate({ format: "pascal", ascii: true }); // → "KayipPlak"  (no diacritics)
generate({ format: "snake",  ascii: true }); // → "sabah_sis"

// Direct utility
const { toAscii } = require("@alpersamur3/nickname-generator");
toAscii("şişli köşe"); // → "sisli kose"
```

---

## Default Word Lists (Turkish)

The bundled word lists are curated for a poetic, melancholic tone in Turkish.  
All categories are fully replaceable via `opts.words`.

| Category | Key | Sample words |
|---|---|---|
| Adjectives | `adjectives` | `eski`, `sessiz`, `soluk`, `yalnız`, `donmuş` |
| Nouns | `nouns` | `tren`, `sis`, `mektup`, `ayna`, `şafak` |
| Colors | `colors` | `sarı`, `mavi`, `gümüş`, `eflatun`, `kiremit` |
| Numbers | `numbers` | `0`, `1`, `7`, `13`, `42` |
| Verbs | `verbs` | `akan`, `yanan`, `sönen`, `kaybolan`, `sürüklenen` |

---

## License

MIT

---

## Keywords

`nickname generator` · `username generator` · `random name generator` · `display name` · `gamer tag` · `gamertag generator` · `Discord username` · `Twitch handle` · `bot name` · `Turkish` · `slug` · `ASCII` · `no dependencies`

---

*Varsayılan kelime listeleri Türkçe'dir. `words` seçeneğiyle herhangi bir dildeki kelimelerle değiştirilebilir veya genişletilebilir.*

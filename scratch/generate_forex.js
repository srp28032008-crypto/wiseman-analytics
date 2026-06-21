// generate_forex.js - Generate 100 Forex Pairs and discovery candidates
const fs = require('fs');

const majors = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'];
const minors = ['INR', 'CNY', 'HKD', 'SGD', 'SEK', 'NOK', 'DKK', 'MXN', 'ZAR', 'TRY', 'AED', 'SAR', 'THB', 'KRW'];

// Base exchange rates relative to USD (1 USD = X Currency)
const rates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 156.40,
  AUD: 1.50,
  CAD: 1.36,
  CHF: 0.89,
  NZD: 1.63,
  INR: 83.50,
  CNY: 7.25,
  HKD: 7.80,
  SGD: 1.35,
  SEK: 10.45,
  NOK: 10.60,
  DKK: 6.85,
  MXN: 18.20,
  ZAR: 18.10,
  TRY: 32.80,
  AED: 3.67,
  SAR: 3.75,
  THB: 36.60,
  KRW: 1385.0
};

// Full names of currencies
const names = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'Pound Sterling',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  NZD: 'New Zealand Dollar',
  INR: 'Indian Rupee',
  CNY: 'Chinese Yuan',
  HKD: 'Hong Kong Dollar',
  SGD: 'Singapore Dollar',
  SEK: 'Swedish Krona',
  NOK: 'Norwegian Krone',
  DKK: 'Danish Krone',
  MXN: 'Mexican Peso',
  ZAR: 'South African Rand',
  TRY: 'Turkish Lira',
  AED: 'UAE Dirham',
  SAR: 'Saudi Riyal',
  THB: 'Thai Baht',
  KRW: 'South Korean Won'
};

const pairs = [];
const seen = new Set();

function addPair(base, quote) {
  if (base === quote) return;
  const key = `${base.toLowerCase()}${quote.toLowerCase()}`;
  if (seen.has(key)) return;

  // Calculate realistic base price
  const baseInUSD = 1 / rates[base];
  const price = baseInUSD * rates[quote];

  // Decimals logic
  let decimals = 5;
  if (quote === 'JPY' || quote === 'KRW') {
    decimals = 3;
  } else if (price > 100) {
    decimals = 3;
  } else if (price > 10) {
    decimals = 4;
  }

  pairs.push({
    key,
    symbol: `${base}_${quote}`,
    yahooSymbol: `${base}${quote}=X`,
    name: `${names[base]} / ${names[quote]}`,
    basePrice: parseFloat(price.toFixed(decimals)),
    decimals
  });
  seen.add(key);
}

// 1. Add all major cross-pairs first (8 * 7 = 56 pairs)
for (const base of majors) {
  for (const quote of majors) {
    addPair(base, quote);
  }
}

// 2. Add USD base exotic pairs
for (const quote of minors) {
  addPair('USD', quote);
}

// 3. Add EUR base exotic pairs
for (const quote of minors) {
  addPair('EUR', quote);
}

// 4. Add GBP base exotic pairs
for (const quote of minors) {
  addPair('GBP', quote);
}

// 5. Add JPY base exotic pairs
for (const base of minors) {
  if (base !== 'JPY') {
    addPair(base, 'JPY');
  }
}

console.log(`Generated total pairs: ${pairs.length}`);

// Select first 100 pairs for core list
const corePairs = pairs.slice(0, 100);
// Select another 20 pairs for discovery candidates
const discoveryPairs = pairs.slice(100, 125);

const output = {
  corePairs,
  discoveryPairs
};

fs.writeFileSync('C:\\Users\\Shardul Patil\\.gemini\\antigravity\\scratch\\wiseman_analytics\\scratch\\forex_data.json', JSON.stringify(output, null, 2));
console.log('Saved forex data to scratch/forex_data.json');

const getCarbonValue = (categories = '', productName = '') => {
  const text = `${categories} ${productName}`.toLowerCase();

  if (text.includes('beef') || text.includes('meat') || text.includes('chicken')) {
    return 5;
  }

  if (text.includes('dairy') || text.includes('milk')) {
    return 1.5;
  }

  if (text.includes('snack') || text.includes('chips')) {
    return 2;
  }

  if (text.includes('plastic')) {
    return 0.1;
  }

  return 0.5;
};

const getEcoScore = (carbonValue) => {
  if (carbonValue <= 0.5) return 'A';
  if (carbonValue <= 1) return 'B';
  if (carbonValue <= 2) return 'C';
  if (carbonValue <= 3) return 'D';
  if (carbonValue <= 4) return 'E';
  return 'F';
};

const getImpact = (carbonValue) => {
  const km = Number((carbonValue * 5).toFixed(1));
  return `Equivalent to driving ${km} km`;
};

const getAlternatives = (categories = '', productName = '') => {
  const text = `${categories} ${productName}`.toLowerCase();

  if (text.includes('milk')) return ['Almond milk', 'Oat milk'];
  if (text.includes('meat') || text.includes('beef') || text.includes('chicken')) return ['Plant-based meat', 'Tofu'];
  if (text.includes('plastic')) return ['Reusable alternatives'];

  return [];
};

const evaluateSugar = (sugar100g) => {
  if (sugar100g === null) return null; // Unknown

  let level = '';
  if (sugar100g > 22.5) level = 'High ⚠️';
  else if (sugar100g > 5) level = 'Moderate';
  else level = 'Low';

  return `${level} (${sugar100g}%)`;
};

const evaluateSaturatedFat = (satFat100g) => {
  if (satFat100g === null) return null; // Unknown

  let level = '';
  if (satFat100g > 5) level = 'High ⚠️';
  else if (satFat100g > 1.5) level = 'Moderate';
  else level = 'Low';

  return `${level} (${satFat100g}%)`;
};

const evaluateNova = (novaGroup) => {
  if (!novaGroup) return null; // Unknown
  if (novaGroup === 1 || novaGroup === 2) return `Unprocessed (NOVA ${novaGroup})`;
  if (novaGroup === 3) return `Processed (NOVA 3)`;
  if (novaGroup === 4) return `Ultra-processed (NOVA 4) ⚠️`;
  return `Unknown Processing (NOVA ${novaGroup})`;
};

const generateSmartSummary = (ecoScore, sugarEvaluation, fatEvaluation, novaEvaluation) => {
  const isBadEco = ['D', 'E', 'F'].includes(ecoScore);
  const isHighSugar = sugarEvaluation ? sugarEvaluation.includes('High ⚠️') : false;
  const isHighFat = fatEvaluation ? fatEvaluation.includes('High ⚠️') : false;
  const isUltraProcessed = novaEvaluation ? novaEvaluation.includes('Ultra-processed') : false;

  let issues = [];
  if (isHighSugar) issues.push('high sugar');
  if (isHighFat) issues.push('high saturated fat');
  if (isUltraProcessed) issues.push('ultra-processed');

  if (isBadEco && issues.length > 0) {
    return `High environmental impact and ${issues.join(' and ')} make this less suitable for daily consumption.`;
  }
  if (!isBadEco && issues.length > 0) {
    return `Low environmental impact, but ${issues.join(' and ')} make it less healthy.`;
  }
  if (isBadEco && issues.length === 0) {
    return `Nutritionally moderate, but carries a high environmental footprint.`;
  }
  return `Good choice! Low environmental impact and reasonably balanced nutrition.`;
};

module.exports = {
  getCarbonValue,
  getEcoScore,
  getImpact,
  getAlternatives,
  evaluateSugar,
  evaluateSaturatedFat,
  evaluateNova,
  generateSmartSummary,
};

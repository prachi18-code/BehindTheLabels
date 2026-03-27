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

  if (text.includes('milk')) {
    return ['Almond milk', 'Oat milk'];
  }

  if (text.includes('meat') || text.includes('beef') || text.includes('chicken')) {
    return ['Plant-based meat', 'Tofu'];
  }

  if (text.includes('plastic')) {
    return ['Reusable alternatives'];
  }

  return [];
};

module.exports = {
  getCarbonValue,
  getEcoScore,
  getImpact,
  getAlternatives,
};

const { fetchProductByBarcode } = require('../services/openFoodFactsService');
const { saveScanHistory } = require('../services/scanHistoryService');
const {
  getAlternatives,
  getCarbonValue,
  getEcoScore,
  getImpact,
  evaluateSugar,
  evaluateSaturatedFat,
  evaluateNova,
  generateSmartSummary,
} = require('../utils/carbonLogic');

const scanBarcodeController = async (req, res, next) => {
  try {
    const barcode = String(req.body?.barcode || req.params?.barcode || '').trim();

    if (!barcode) {
      return res.status(400).json({
        success: false,
        message: 'Barcode is required',
      });
    }

    if (!/^[0-9A-Za-z-]+$/.test(barcode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid barcode format',
      });
    }

    const product = await fetchProductByBarcode(barcode);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const carbonValue = getCarbonValue(product.categories, product.productName);
    const ecoScore = getEcoScore(carbonValue);
    
    const sugarLevel = evaluateSugar(product.sugar100g);
    const saturatedFatLevel = evaluateSaturatedFat(product.saturatedFat100g);
    const novaGroup = evaluateNova(product.novaGroup);
    const smartSummary = generateSmartSummary(ecoScore, sugarLevel, saturatedFatLevel, novaGroup);

    const payload = {
      success: true,
      productName: product.productName,
      image: product.image,
      carbonFootprint: `${carbonValue} CO2`,
      ecoScore,
      impact: getImpact(carbonValue),
      alternatives: getAlternatives(product.categories, product.productName),
      sugarLevel,
      saturatedFatLevel,
      novaGroup,
      smartSummary,
    };

    saveScanHistory({
      barcode,
      productName: payload.productName,
      carbonValue,
      ecoScore,
    }).catch(() => {
      // Intentionally ignored to keep response path fast.
    });

    return res.json(payload);
  } catch (error) {
    if (error.message === 'UPSTREAM_TIMEOUT') {
      return res.status(504).json({
        success: false,
        message: 'Product data source timed out. Please try again.',
      });
    }

    if (error.message === 'UPSTREAM_REQUEST_FAILED') {
      return res.status(502).json({
        success: false,
        message: 'Product data source is temporarily unavailable. Please try again.',
      });
    }

    return next(error);
  }
};

module.exports = {
  scanBarcodeController,
};

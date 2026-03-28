const { fetchProductByBarcode } = require('../services/openFoodFactsService');
const { analyzeNutritionWithAI } = require('../services/nutritionAnalysisService');
const { saveScanHistory } = require('../services/scanHistoryService');
const {
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
    const defaultSummary = generateSmartSummary(ecoScore, sugarLevel, saturatedFatLevel, novaGroup);

    const nutritionAnalysis = await analyzeNutritionWithAI({
      productName: product.productName,
      category: product.category,
      sugar100g: product.sugar100g,
      addedSugar100g: product.addedSugar100g,
      saturatedFat100g: product.saturatedFat100g,
      novaGroup: product.novaGroup,
      nutriScore: product.nutriScore,
    });

    if (nutritionAnalysis.alternativesSource === 'ai-unavailable') {
      return res.status(503).json({
        success: false,
        message: 'AI alternatives are currently unavailable. Please try again later.',
      });
    }

    const payload = {
      success: true,
      productName: product.productName,
      image: product.image,
      carbonFootprint: `${carbonValue} CO2`,
      ecoScore,
      impact: getImpact(carbonValue),
      alternatives: nutritionAnalysis.status === 'unhealthy' ? nutritionAnalysis.alternatives : [],
      alternativesSource: nutritionAnalysis.alternativesSource || 'none',
      nutritionStatus: nutritionAnalysis.status,
      sugarLevel,
      addedSugarLevel: product.addedSugar100g,
      saturatedFatLevel,
      novaGroup,
      nutriScore: product.nutriScore,
      smartSummary: nutritionAnalysis.verdict || defaultSummary,
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

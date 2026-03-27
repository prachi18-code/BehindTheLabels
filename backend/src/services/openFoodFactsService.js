const OPEN_FOOD_FACTS_URL = 'https://world.openfoodfacts.org/api/v0/product';

const fetchProductByBarcode = async (barcode) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${OPEN_FOOD_FACTS_URL}/${barcode}.json`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('OpenFoodFacts request failed');
    }

    const data = await response.json();
    if (!data || data.status !== 1 || !data.product) {
      return null;
    }

    const product = data.product;
    const nutriments = product.nutriments || {};

    const sugar100g = nutriments.sugars_100g ?? nutriments.sugars ?? null;
    const saturatedFat100g = nutriments['saturated-fat_100g'] ?? nutriments['saturated-fat'] ?? null;
    const novaGroup = product.nova_group ?? null;

    return {
      productName: product.product_name || 'Unknown Product',
      image: product.image_url || '',
      categories: product.categories || '',
      sugar100g: sugar100g !== null ? Number(sugar100g) : null,
      saturatedFat100g: saturatedFat100g !== null ? Number(saturatedFat100g) : null,
      novaGroup: novaGroup !== null ? Number(novaGroup) : null,
    };
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('UPSTREAM_TIMEOUT');
    }

    throw new Error('UPSTREAM_REQUEST_FAILED');
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = {
  fetchProductByBarcode,
};

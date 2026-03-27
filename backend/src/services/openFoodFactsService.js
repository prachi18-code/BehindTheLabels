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
    return {
      productName: product.product_name || 'Unknown Product',
      image: product.image_url || '',
      categories: product.categories || '',
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

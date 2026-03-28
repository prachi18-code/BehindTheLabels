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
    const addedSugar100g = nutriments['added-sugars_100g'] ?? nutriments['added-sugars'] ?? null;
    const saturatedFat100g = nutriments['saturated-fat_100g'] ?? nutriments['saturated-fat'] ?? null;
    const novaGroup = product.nova_group ?? null;
    const nutriScore = product.nutriscore_grade ? String(product.nutriscore_grade).toUpperCase() : null;
    const categoryTags = Array.isArray(product.categories_tags)
      ? product.categories_tags
          .slice(0, 20)
          .map((tag) => String(tag || '').replace(/^[a-z]{2}:/i, '').replace(/-/g, ' '))
          .filter(Boolean)
      : [];

    const category = [
      product.categories || '',
      categoryTags.join(', '),
      product.brands || '',
      product.product_name || '',
    ]
      .filter(Boolean)
      .join(' | ') || 'Unknown Category';

    return {
      productName: product.product_name || 'Unknown Product',
      image: product.image_url || '',
      categories: product.categories || '',
      category,
      sugar100g: sugar100g !== null ? Number(sugar100g) : null,
      addedSugar100g: addedSugar100g !== null ? Number(addedSugar100g) : null,
      saturatedFat100g: saturatedFat100g !== null ? Number(saturatedFat100g) : null,
      novaGroup: novaGroup !== null ? Number(novaGroup) : null,
      nutriScore,
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

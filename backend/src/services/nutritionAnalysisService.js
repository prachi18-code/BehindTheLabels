const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const toNumberOrZero = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isProductUnhealthy = ({ sugar100g, addedSugar100g, saturatedFat100g, novaGroup }) => {
  return (
    toNumberOrZero(sugar100g) > 10 ||
    toNumberOrZero(addedSugar100g) > 10 ||
    toNumberOrZero(saturatedFat100g) > 5 ||
    toNumberOrZero(novaGroup) >= 4
  );
};

const extractJsonString = (content) => {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map((part) => (typeof part?.text === 'string' ? part.text : '')).join('').trim();
  }
  return String(content);
};

const parseModelOutput = (rawText) => {
  const text = String(rawText || '').trim();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
};

const buildPrompt = ({ productName, category, sugar100g, addedSugar100g, saturatedFat100g, novaGroup, nutriScore }) => {
  return `You are a strict product analysis and alternative recommendation AI inside a food scanning app.

Your job is to strictly analyze the product data below and return ONLY valid JSON.

INPUT:
* Product Name: ${productName || 'Unknown Product'}
* Category: ${category || 'Unknown Category'}
* Sugar (per 100g/ml): ${sugar100g ?? 'unknown'}
* Added Sugar: ${addedSugar100g ?? 'unknown'}
* Saturated Fat: ${saturatedFat100g ?? 'unknown'}
* Processing Level (NOVA): ${novaGroup ?? 'unknown'}
* Nutri Score: ${nutriScore ?? 'unknown'}

DECISION RULES:
Mark product as ONLY "unhealthy" if ANY of these apply (else mark as "healthy"):
* Sugar > 10g
* OR Added Sugar > 10g
* OR Saturated Fat > 5g
* OR NOVA >= 4 (ultra-processed)

TASK:
IF UNHEALTHY:
* Write a short 12-15 word health verdict
* Suggest EXACTLY 3 healthier alternatives. NEVER suggest alternatives from wrong categories (e.g., drinks for snacks).

IF HEALTHY:
* Write 1 short positive verdict
* Return an empty array for alternatives

RULES:
* Alternatives must be:
  - Contextually exact (e.g. if chips -> healthy snacks; if cola -> healthy beverages)
  - Common and Affordable in India
  - Specific purchasable item names (2-5 words each)
* NEVER output extra text, markdown formatting, or explanations outside the JSON object.

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "status": "healthy" | "unhealthy",
  "category": "string specifying specific detected category",
  "verdict": "string",
  "alternatives": [
    { "name": "option 1", "reason": "brief reason why" }
  ],
  "confidence": "high" | "medium" | "low"
}`;
};

const callOpenRouter = async (prompt) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_MISSING_API_KEY');
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-oss-120b:free',
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You output ONLY valid JSON. No extra text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("OPENROUTER_ERROR: " + await response.text());
  }

  const data = await response.json();
  const parsed = parseModelOutput(extractJsonString(data?.choices?.[0]?.message?.content));
  
  if (!parsed) {
    throw new Error('OPENROUTER_INVALID_JSON');
  }
  
  return parsed;
};

const analyzeNutritionWithAI = async (product) => {
  try {
    const prompt = buildPrompt(product);
    const output = await callOpenRouter(prompt);

    const mappedAlternatives = (output.alternatives || []).map(alt => typeof alt === 'string' ? alt : alt.name);

    return {
      status: output.status === 'unhealthy' ? 'unhealthy' : 'healthy',
      verdict: output.verdict || 'Analysis complete.',
      alternatives: mappedAlternatives,
      alternativesSource: mappedAlternatives.length ? 'ai' : 'none'
    };
  } catch (err) {
    console.error('AI Analysis failed:', err.message);
    return {
      status: isProductUnhealthy(product) ? 'unhealthy' : 'healthy',
      verdict: 'Health analysis temporarily unavailable.',
      alternatives: [],
      alternativesSource: 'ai-unavailable',
    };
  }
};

module.exports = {
  analyzeNutritionWithAI,
};

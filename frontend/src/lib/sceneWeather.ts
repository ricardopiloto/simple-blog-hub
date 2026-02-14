/**
 * Detects scene weather (rain or snow) from post HTML content by matching keywords.
 * Includes synonyms and verb conjugations (PT and EN). Snow has priority over rain when both are present.
 */

const RAIN_WORDS = [
  // PT: substantivo e variantes
  'chuva',
  'chuvas',
  'chuvoso',
  'chuvosa',
  'chuvosos',
  'chuvosas',
  // PT: verbos (chover) – conjugações e formas
  'chover',
  'chove',
  'chovem',
  'chovia',
  'choviam',
  'choveu',
  'choveram',
  'chovendo',
  'chovido',
  // EN
  'rain',
  'rains',
  'raining',
  'rained',
  'rainy',
];

const SNOW_WORDS = [
  // PT: substantivo e variantes
  'neve',
  'neves',
  'nevasca',
  'nevado',
  'nevada',
  'nevados',
  'nevadas',
  // PT: verbos (nevar) – conjugações e formas
  'nevar',
  'neva',
  'nevam',
  'nevava',
  'nevavam',
  'nevou',
  'nevaram',
  'nevando',
  'nevado',
  // EN
  'snow',
  'snows',
  'snowing',
  'snowed',
  'snowy',
];

function extractTextFromHtml(html: string): string {
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
  }
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent ?? div.innerText ?? '').replace(/\s+/g, ' ').toLowerCase();
}

function hasWord(text: string, word: string): boolean {
  const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return re.test(text);
}

export function detectSceneWeather(htmlContent: string): 'rain' | 'snow' | null {
  if (!htmlContent || typeof htmlContent !== 'string') return null;
  const text = extractTextFromHtml(htmlContent);
  const hasSnow = SNOW_WORDS.some((w) => hasWord(text, w));
  const hasRain = RAIN_WORDS.some((w) => hasWord(text, w));
  if (hasSnow) return 'snow';
  if (hasRain) return 'rain';
  return null;
}

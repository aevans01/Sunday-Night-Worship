export const DAILY_ENDPOINT = 'https://beta.ourmanna.com/api/v1/get?format=json&order=daily';
export async function loadDailyKJV(signal, request = fetch) {
  const options = {signal, credentials:'omit', headers:{Accept:'application/json'}};
  const daily = await request(DAILY_ENDPOINT, options);
  if (!daily.ok) throw new Error('Daily verse unavailable');
  const data = await daily.json();
  const reference = data?.verse?.details?.reference;
  if (typeof reference !== 'string' || !reference.trim() || reference.length > 200) throw new Error('Invalid daily reference');
  // The daily provider chooses the reference; its translation text is never displayed.
  const response = await request(`https://bible-api.com/${encodeURIComponent(reference.trim())}?translation=kjv`, options);
  if (!response.ok) throw new Error('KJV verse unavailable');
  const kjv = await response.json();
  if (kjv.translation_id !== 'kjv' || typeof kjv.text !== 'string' || !kjv.text.trim() || kjv.text.length > 5000 || typeof kjv.reference !== 'string' || !kjv.reference.trim() || kjv.reference.length > 200) throw new Error('Invalid KJV response');
  return {text:kjv.text.trim(), reference:kjv.reference.trim(), version:'KJV'};
}

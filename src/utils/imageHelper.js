// ============================================================================
// SAFE & CUTE EDUCATIONAL ILLUSTRATION HELPER
// Ensures all AI images are cute, vibrant, child-friendly 3D Pixar cartoon
// or clean isometric vector art.
// Strictly eliminates photorealistic uncanny valley faces, creepy portraits,
// or inappropriate content.
// ============================================================================

export function getSafeEducationalImageUrl(rawPrompt, options = {}) {
  const { width = 600, height = 350, seed } = options;

  if (!rawPrompt || typeof rawPrompt !== 'string') {
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(
      'cute cheerful 3D Pixar cartoon book and pencil mascot, colorful educational illustration, bright clean background, friendly, high quality, no photorealistic faces'
    )}?width=${width}&height=${height}&nologo=true`;
  }

  // Extract English words and concepts, strip Vietnamese diacritics and code characters
  let cleanWords = rawPrompt
    .replace(/[^\x00-\x7F]/g, ' ') // Strip non-ASCII
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If no ASCII words remained, pick safe educational theme
  if (cleanWords.length < 3) {
    cleanWords = 'fun english learning classroom';
  } else {
    // Take top 4-5 core words
    cleanWords = cleanWords.split(' ').slice(0, 5).join(' ');
  }

  // Strict pedagogical cartoon style directive
  const safePrompt = `${cleanWords}, cute 3D Pixar style digital art, colorful cheerful educational cartoon illustration, bright clean background, friendly mascot, isometric vector, high quality, no photorealistic humans, no uncanny faces, child friendly`;

  const s = seed || Math.floor(Math.random() * 100000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(safePrompt)}?width=${width}&height=${height}&nologo=true&seed=${s}`;
}

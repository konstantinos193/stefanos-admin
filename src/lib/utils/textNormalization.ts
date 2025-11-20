/**
 * Normalizes Greek text by removing accents and converting to lowercase
 * This allows accent-insensitive and case-insensitive search
 * Handles all Greek accented characters: άέήίόύώ and their uppercase variants
 */
export function normalizeGreekText(text: string): string {
  if (!text) return ''
  
  return text
    .toLowerCase()
    // Replace all Greek accented characters with their non-accented equivalents
    .replace(/[άΆ]/g, 'α')
    .replace(/[έΈ]/g, 'ε')
    .replace(/[ήΉ]/g, 'η')
    .replace(/[ίϊΐΊ]/g, 'ι')
    .replace(/[όΌ]/g, 'ο')
    .replace(/[ύϋΰΎ]/g, 'υ')
    .replace(/[ώΏ]/g, 'ω')
    // Also handle any remaining diacritical marks using Unicode normalization
    .normalize('NFD') // Decompose characters (ά → α + ́)
    .replace(/[\u0300-\u036f]/g, '') // Remove any remaining diacritical marks
}

/**
 * Checks if text matches query (accent-insensitive and case-insensitive)
 */
export function matchesSearch(text: string, query: string): boolean {
  if (!text || !query) return false
  
  const normalizedText = normalizeGreekText(text)
  const normalizedQuery = normalizeGreekText(query)
  
  return normalizedText.includes(normalizedQuery)
}


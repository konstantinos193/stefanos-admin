const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api')
  .replace(/\/api\/?$/, '')

export function getImageUrl(src: string): string {
  if (!src) return ''
  if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('blob:')) return src
  return `${API_ORIGIN}${src.startsWith('/') ? '' : '/'}${src}`
}

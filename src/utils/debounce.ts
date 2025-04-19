export default function debounce(fn: Function, delay: number): () => void {
  let timer: NodeJS.Timeout
  return function (...args: any[]): void {
    if (!timer) clearTimeout(timer)
    timer = setTimeout(() => {
      typeof fn === 'function' && fn.apply(null, args)
      clearTimeout(timer)
    }, delay)
  }
}

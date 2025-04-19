import { onBeforeMount, onMounted, ref } from 'vue'

// 默认适配的宽高
export const designWidth = 1920
export const designHeight = 1080


type ResizeType = {
  w?: number
  h?: number
  fullScreen?: boolean
  delay?: number
}

/**
 * 函数防抖
 * @param fn
 * @param delay
 * @returns
 */
function debounce(fn: Function, delay: number) {
  let timer: NodeJS.Timeout;

  return function (...args: any[]): void {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      typeof fn === 'function' && fn.apply(null, args)
      clearTimeout(timer)
    }, delay > 0 ? delay : 100)
  }
}

export const useResize = (options: ResizeType = {}) => {
  const { w = designWidth, h = designHeight, fullScreen = false, delay = 100 } = options
  const screenRef = ref()
  const scale = ref(1)


  function resize() {
    // 获取浏览器的宽高
    const clientWidth = document.body.clientWidth
    const clientHeight = document.body.clientHeight

    // 计算缩放比例
    const scaleW = clientWidth / w
    const scaleH = clientWidth / h

    scale.value = Math.min(scaleW, scaleH)

    if (fullScreen) {
      // 不在乎缩放失真直接全屏
      screenRef.value.style.transform = `scale(${scaleW},${scaleH})`
    }
    else {
      screenRef.value.style.transform = `scale(${scale.value})`
      // 设置居中
      screenRef.value.style.left = `${(clientWidth - w * scale.value) / 2}px`
      screenRef.value.style.top = `${(clientHeight - h * scale.value) / 2}px`
    }
  }

  const resizeDelay = debounce(resize, delay)

  onMounted(() => {
    if (screenRef.value) {
      resize()
      window.addEventListener('resize', resizeDelay)
    }
  })

  onBeforeMount(() => {
    window.removeEventListener('resize', resizeDelay)
  })

  return {
    screenRef,
    scale
  }
}
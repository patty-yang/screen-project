import {
  defineComponent,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  onActivated,
  ref
} from 'vue'

import debounce from '@/utils/debounce'

import { props } from './props'
import { styles } from './styles'
import type { IState } from './types'

export default defineComponent({
  name: 'ScaleScreen',
  props,
  setup(props, { slots }) {
    let bodyOverflowHidden: string
    const state = reactive<IState>({
      width: 0, // 当前宽度
      height: 0, // 当前高度
      originalWidth: 0, // 原始宽度
      originalHeight: 0, // 原始高度
      observer: null // MutationObserver实例
    })

    const el = ref<HTMLElement>()
    /**
     * 初始化容器尺寸（异步）
     * 优先使用props传入的宽高，否则获取DOM实际尺寸
     */
    const initSize = () => {
      return new Promise<void>((resolve) => {
        // 等待DOM更新，nextTick 能保证获取到的是 DOM 更新后的最新值
        // 如果数据加载过慢，很可能导致clientWidth=0
        nextTick(() => {
          // 获取容器尺寸逻辑
          if (props.width && props.height) {
            state.width = props.width
            state.height = props.height
          } else {
            state.width = el.value?.clientWidth
            state.height = el.value?.clientHeight
          }

          // 初始化原始尺寸（取屏幕分辨率）
          if (!state.originalHeight || !state.originalWidth) {
            state.originalWidth = window.screen.width
            state.originalHeight = window.screen.height
          }
          resolve()
        })
      })
    }

    /** 初始化body样式（隐藏滚动条） */
    function initBodyStyle() {
      if (props.bodyOverflowHidden) {
        bodyOverflowHidden = document.body.style.overflow
        document.body.style.overflow = 'hidden'
      }
    }

    /** 更新容器尺寸 */
    const updateSize = () => {
      if (state.width && state.height) {
        el.value!.style.width = `${state.width}px`
        el.value!.style.height = `${state.height}px`
      } else {
        // 回退到原始尺寸
        el.value!.style.width = `${state.originalWidth}px`
        el.value!.style.height = `${state.originalHeight}px`
      }
    }

    /**
     * 应用缩放变换
     * @param {number} scale - 计算出的缩放比例
     */
    const autoScale = (scale: number) => {
      if (!props.autoScale) return
      const domWidth = el.value!.clientWidth
      const domHeight = el.value!.clientHeight
      const currentWidth = document.body.clientWidth
      const currentHeight = document.body.clientHeight
      el.value!.style.transform = `scale(${scale},${scale})`
      // 计算居中偏移量（确保内容始终居中）
      let mx = Math.max((currentWidth - domWidth * scale) / 2, 0)
      let my = Math.max((currentHeight - domHeight * scale) / 2, 0)
      // 处理轴向锁定配置
      if (typeof props.autoScale === 'object') {
        !props.autoScale.x && (mx = 0)
        !props.autoScale.y && (my = 0)
      }
      el.value!.style.margin = `${my}px ${mx}px` // 应用偏移
    }

    /** 计算并更新缩放比例 */
    const updateScale = () => {
      // 获取真实视口尺寸
      const currentWidth = document.body.clientWidth
      const currentHeight = document.body.clientHeight
      // 获取大屏最终的宽高
      const realWidth = state.width || state.originalWidth
      const realHeight = state.height || state.originalHeight
      // 计算缩放比例
      const widthScale = currentWidth / +realWidth
      const heightScale = currentHeight / +realHeight
      // 若要铺满全屏，则按照各自比例缩放
      if (props.fullScreen) {
        el.value!.style.transform = `scale(${widthScale},${heightScale})`
        return false
      }
      // 按照宽高最小比例进行缩放
      const scale = Math.min(widthScale, heightScale)
      autoScale(scale)
    }

    /** 防抖处理的重置函数 */
    const onResize = debounce(async () => {
      await initSize()
      updateSize()
      updateScale()
    }, props.delay)

    /**
     * 初始化DOM变化观察器
     * MutationObserver 可以捕获 元素自身属性变化（如手动修改style、动态内容导致的尺寸变化等）
     * 如果其他代码意外修改了.screen-wrapper的内联样式
     * 确保会触发 onResize，重新计算正确比例
     */
    const initMutationObserver = () => {
      const observer = (state.observer = new MutationObserver(() => {
        onResize() // DOM属性变化时触发重计算
      }))
      observer.observe(el.value!, {
        attributes: true, // 监听属性变化
        attributeFilter: ['style'], // 只监听style属性
        attributeOldValue: true // 记录旧值
      })
    }
    onMounted(() => {
      initBodyStyle()
      nextTick(async () => {
        await initSize()
        updateSize()
        updateScale()
        window.addEventListener('resize', onResize)
        initMutationObserver()
      })
    })
    onUnmounted(() => {
      window.removeEventListener('resize', onResize)
      state.observer?.disconnect() // 清理观察器
      if (props.bodyOverflowHidden) {
        document.body.style.overflow = bodyOverflowHidden
      }
    })
    onActivated(updateScale) // keep-alive激活时更新

    return () => {
      return h(
        'div',
        {
          className: 'v-screen-box',
          style: { ...styles.box, ...props.boxStyle }
        },
        [
          h(
            'div',
            {
              className: 'screen-wrapper',
              style: { ...styles.wrapper, ...props.wrapperStyle },
              ref: el
            },
            slots.default?.()
          )
        ]
      )
    }
  }
})

import type { PropType, CSSProperties } from 'vue'
type IAutoScale = // 缩放方向配置

    | boolean // 是否启用自动缩放
    | {
        x?: boolean // X轴缩放
        y?: boolean // Y轴缩放
      }

export const props = {
  width: {
    // 设计稿基准宽度
    type: [String, Number],
    default: 1920
  },
  height: {
    // 设计稿基准高度
    type: [String, Number],
    default: 1080
  },
  fullScreen: {
    // 是否全屏拉伸
    type: Boolean,
    default: false
  },
  autoScale: {
    // 缩放方向配置
    type: [Object, Boolean] as PropType<IAutoScale>,
    default: true
  },
  delay: {
    // 防抖延迟时间
    type: Number,
    default: 500
  },
  boxStyle: {
    // 外层容器样式
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },
  wrapperStyle: {
    // 内容包裹层样式
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },
  bodyOverflowHidden: {
    // 是否隐藏页面滚动条
    type: Boolean,
    default: true
  }
}

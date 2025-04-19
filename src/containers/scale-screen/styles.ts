import type { CSSProperties } from 'vue'
// 基础样式配置
export const styles: Record<string, CSSProperties> = {
  box: {
    // 外层容器样式
    overflow: 'hidden',
    backgroundSize: `100% 100%`,
    backgroundColor: `#000`,
    width: `100vw`,
    height: `100vh`
  },
  wrapper: {
    // 内容包裹层样式
    transition: `all 500ms cubic-bezier(0.4, 0, 0.2, 1)`,
    position: `relative`,
    overflow: `hidden`,
    zIndex: 100,
    transformOrigin: `left top`
  }
}

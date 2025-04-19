export interface IState {
  originalWidth: string | number // 原始设计稿宽度
  originalHeight: string | number // 原始设计稿高度
  width?: string | number // 当前计算宽度
  height?: string | number // 当前计算高度
  observer: null | MutationObserver // DOM变化观察器
}

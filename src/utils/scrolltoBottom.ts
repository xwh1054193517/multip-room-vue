/**
 * @desc 让节点滚动到可视区域
 * @param {} el dom
 */
export function scrollBottom(options) {
  const { id = 'panel', animation = false } = options
  const el = document.getElementById(id)
  !animation ? el.scrollIntoView() : el.scrollIntoView({ behavior: "smooth" })
}
import type { ObjectDirective } from "vue"

/**
 * @note value passed to the directive should be stable
 */
export const vSelect: ObjectDirective<HTMLElement, boolean> = {
  mounted(element, binding) {
    if (binding.value) {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.select()
      } else {
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(element)
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }
  },
}

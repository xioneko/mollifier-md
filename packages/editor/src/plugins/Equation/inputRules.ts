import type { InputRule } from "#plugins/InputRule"
import { $createEquationBlockNode, $createInlineEquationNode } from "./nodes"
import { $isParagraphNode } from "lexical"

export const inputRules: InputRule[] = [
  {
    type: "node",
    transform(node, offset, editor) {
      if (offset < 4) return false
      const text = node.__text
      if (text[offset - 1] !== " " || text[offset - 2] !== "$" || text[offset - 3] === " ")
        return false

      const start = text.lastIndexOf("$", offset - 4)
      if (start === -1 || text[start + 1] === " ") return false

      editor.update(() => {
        const equation = text.slice(start + 1, offset - 2)
        const textNodes = node.splitText(start, offset)
        const equationNode = $createInlineEquationNode(equation)
        if (start === 0) {
          textNodes[0].replace(equationNode)
        } else {
          textNodes[1].replace(equationNode)
        }
      })
    },
  },
  {
    type: "node",
    transform(node, offset, editor) {
      if (offset !== 3 || !node.__text.startsWith("$$ ")) return false
      const block = node.getParent()
      if (
        !($isParagraphNode(block) || block?.canInsertTextBefore() === false) ||
        block.__first !== node.__key
      )
        return false
      const equation = block.getTextContent().slice(3)
      editor.update(() => {
        const equationBlock = $createEquationBlockNode(equation)
        block.replace(equationBlock)
        equationBlock.selectStart()
        // Wait for the decorator to be mounted
        window.setTimeout(() => {
          editor.read(() => {
            const decorator = equationBlock.getInstance()
            decorator?.openEditor()
          })
        })
      })
    },
  },
]

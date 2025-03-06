import type { EditorPlugin } from "#core/types.ts"
import MathPlugin from "./EquationPlugin.vue"
import { EquationBlockNode, InlineEquationNode } from "./nodes"
import { tex } from "@mdit/plugin-tex"

export default {
  id: "builtin:math",
  nodes: [InlineEquationNode, EquationBlockNode],
  component: MathPlugin,
  markdown: {
    extend: md =>
      md.use(tex, {
        render: () => {
          /* suppress exception */
        },
      }),
    tokenParserMap: {
      math_inline: {
        type: "node",
        createNode: token => {
          const equation = token.content
          return new InlineEquationNode(equation)
        },
      },
      math_block: {
        type: "node",
        createNode: token => {
          const equation = token.content
          return new EquationBlockNode(equation)
        },
      },
    },
  },
} satisfies EditorPlugin

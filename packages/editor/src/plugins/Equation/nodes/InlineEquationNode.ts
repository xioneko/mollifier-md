import type { NodeMarkdownSerializer } from "#core/markdown"
import { DecoratorNode, type Decorator } from "#core/nodes"
import type { EditorConfig } from "#core/types.ts"
import MathDecorator, { type MathNodeDecoratorProps } from "../components/EquationDecorator.vue"
import katex from "katex"
import type {
  DOMConversionMap,
  DOMExportOutput,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical"
import type { Simplify } from "type-fest"
import type { FunctionalComponent } from "vue"

export type SerializedInlineMathNode = Simplify<
  Spread<
    {
      equation: string
    },
    SerializedLexicalNode
  >
>

export class InlineEquationNode extends DecoratorNode<typeof MathDecorator> {
  __equation: string

  static override getType(): string {
    return "inline-equation"
  }

  static override clone(node: InlineEquationNode): InlineEquationNode {
    return new InlineEquationNode(node.__equation, node.__key)
  }

  constructor(equation: string, key?: NodeKey) {
    super(key)
    this.__equation = equation
  }

  getEquation(): string {
    return this.getLatest().__equation
  }

  setEquation(equation: string): this {
    this.getWritable().__equation = equation
    return this
  }

  override getTextContent(): string {
    return this.__equation
  }

  /* ---------------------------------- View ---------------------------------- */

  override createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const dom = super.createDOM(config, editor, "span")
    const theme = config.theme.equation
    if (theme?.inline) {
      dom.className = theme.inline
    }
    return dom
  }

  override createDecorator(
    _editor: LexicalEditor,
    _config: EditorConfig,
  ): Decorator<typeof MathDecorator> {
    return {
      component: MathDecorator,
      props: {
        nodeKey: this.__key,
        inline: true,
        equation: this.__equation,
      },
    }
  }

  override updateDecorator(
    _editor: LexicalEditor,
    _config: EditorConfig,
    props: MathNodeDecoratorProps,
  ): boolean {
    props.equation = this.__equation
    return false
  }

  override decorate(editor: LexicalEditor, config: EditorConfig): FunctionalComponent {
    return super.decorate(editor, config)
  }

  /* ------------------------------ Serialization ----------------------------- */

  override exportJSON(): SerializedInlineMathNode {
    return {
      type: InlineEquationNode.getType(),
      equation: this.__equation,
      version: 1,
    }
  }

  static override importJSON(serializedNode: SerializedInlineMathNode): InlineEquationNode {
    return $createInlineEquationNode(serializedNode.equation)
  }

  override exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement("span")
    katex.render(this.__equation, element, {
      throwOnError: false,
      output: "mathml",
    })
    return { element }
  }

  static override importDOM(): DOMConversionMap {
    return {
      math: () => {
        return {
          conversion(element) {
            const equation = element.querySelector("annotation")?.textContent || ""
            return {
              node: $createInlineEquationNode(equation),
            }
          },
        }
      },
    }
  }

  override exportMarkdown: NodeMarkdownSerializer = () => {
    return `$${this.__equation}$`
  }
}

export function $createInlineEquationNode(equation: string = ""): InlineEquationNode {
  return new InlineEquationNode(equation)
}

export function $isInlineEquationNode(
  node: LexicalNode | null | undefined,
): node is InlineEquationNode {
  return node instanceof InlineEquationNode
}

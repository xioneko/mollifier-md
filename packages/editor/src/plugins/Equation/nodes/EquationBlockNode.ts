import type { NodeMarkdownSerializer } from "#core/markdown"
import { DecoratorBlockNode, type Decorator, type SerializedDecoratorBlockNode } from "#core/nodes"
import type { EditorConfig } from "#core/types.ts"
import MathDecorator, { type MathNodeDecoratorProps } from "../components/EquationDecorator.vue"
import katex from "katex"
import type {
  DOMConversionMap,
  DOMExportOutput,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from "lexical"
import type { Simplify } from "type-fest"
import type { FunctionalComponent } from "vue"

export type SerializedMathBlockNode = Simplify<
  Spread<
    {
      equation: string
    },
    SerializedDecoratorBlockNode
  >
>

export class EquationBlockNode extends DecoratorBlockNode<typeof MathDecorator> {
  __equation: string

  static override getType(): string {
    return "equation-block"
  }

  static override clone(node: EquationBlockNode): EquationBlockNode {
    return new EquationBlockNode(node.__equation, node.__key)
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
    const dom = super.createDOM(config, editor, "div")
    const theme = config.theme.equation
    if (theme?.block) {
      dom.className = theme.block
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
        inline: false,
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

  override exportJSON(): SerializedMathBlockNode {
    return {
      type: EquationBlockNode.getType(),
      equation: this.__equation,
      version: 1,
    }
  }

  static override importJSON(serializedNode: SerializedMathBlockNode): EquationBlockNode {
    return $createEquationBlockNode(serializedNode.equation)
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
            const annotation = element.querySelector("annotation")
            const equation = annotation?.textContent || ""
            return {
              node: $createEquationBlockNode(equation),
            }
          },
        }
      },
    }
  }

  override exportMarkdown: NodeMarkdownSerializer = () => {
    return `$$\n${this.__equation}\n$$`
  }
}

export function $createEquationBlockNode(equation: string = ""): EquationBlockNode {
  return new EquationBlockNode(equation)
}

export function $isEquationBlockNode(
  node: LexicalNode | null | undefined,
): node is EquationBlockNode {
  return node instanceof EquationBlockNode
}

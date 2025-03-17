import type { SVGComponent } from "./types"
import LucideAlignCenter from "~icons/lucide/align-center"
import LucideAlignJustify from "~icons/lucide/align-justify"
import LucideAlignLeft from "~icons/lucide/align-left"
import LucideAlignRight from "~icons/lucide/align-right"
import LucideBaseline from "~icons/lucide/baseline"
import LucideBold from "~icons/lucide/bold"
import LucideCode from "~icons/lucide/code"
import LucideCopy from "~icons/lucide/copy"
import LucideCopyCheck from "~icons/lucide/copy-check"
import LucideEdit from "~icons/lucide/edit"
import LucideHeading1 from "~icons/lucide/heading-1"
import LucideHeading2 from "~icons/lucide/heading-2"
import LucideHeading3 from "~icons/lucide/heading-3"
import LucideHeading4 from "~icons/lucide/heading-4"
import LucideHeading5 from "~icons/lucide/heading-5"
import LucideHeading6 from "~icons/lucide/heading-6"
import LucideImage from "~icons/lucide/image"
import LucideItalic from "~icons/lucide/italic"
import LucideLink from "~icons/lucide/link"
import LucideList from "~icons/lucide/list"
import LucideListOrdered from "~icons/lucide/list-ordered"
import LucideListTodo from "~icons/lucide/list-todo"
import LucideMinus from "~icons/lucide/minus"
import LucidePaintBucket from "~icons/lucide/paint-bucket"
import LucidePlus from "~icons/lucide/plus"
import LucideRedo2 from "~icons/lucide/redo-2"
import LucideSquareCode from "~icons/lucide/square-code"
import LucideStrikethrough from "~icons/lucide/strikethrough"
import LucideSubscript from "~icons/lucide/subscript"
import LucideSuperscript from "~icons/lucide/superscript"
import LucideTable from "~icons/lucide/table"
import LucideType from "~icons/lucide/type"
import LucideUnderline from "~icons/lucide/underline"
import LucideUndo2 from "~icons/lucide/undo-2"
import LucideUnlink from "~icons/lucide/unlink"
import MaterialSymbolsDragIndicator from "~icons/material-symbols/drag-indicator"
import MaterialSymbolsFormatParagraphRounded from "~icons/material-symbols/format-paragraph-rounded"
import MaterialSymbolsFormatQuoteOutlineRounded from "~icons/material-symbols/format-quote-outline-rounded"
import MaterialSymbolsHorizontalRuleRounded from "~icons/material-symbols/horizontal-rule-rounded"
import TablerMath from "~icons/tabler/math"
import TablerSum from "~icons/tabler/sum"

export const Paragraph: SVGComponent = MaterialSymbolsFormatParagraphRounded

export const Heading: Record<string, SVGComponent> = {
  H1: LucideHeading1,
  H2: LucideHeading2,
  H3: LucideHeading3,
  H4: LucideHeading4,
  H5: LucideHeading5,
  H6: LucideHeading6,
}

export const Quote: SVGComponent = MaterialSymbolsFormatQuoteOutlineRounded

export const HorizontalRule: SVGComponent = MaterialSymbolsHorizontalRuleRounded

export const List: Record<string, SVGComponent> = {
  Bullet: LucideList,
  Number: LucideListOrdered,
  Todo: LucideListTodo,
}

export const Table: SVGComponent = LucideTable

export const CodeBlock: SVGComponent = LucideSquareCode

export const Image: SVGComponent = LucideImage

export const Format: Record<string, SVGComponent> = {
  Bold: LucideBold,
  Italic: LucideItalic,
  Underline: LucideUnderline,
  Strikethrough: LucideStrikethrough,
  Subscript: LucideSubscript,
  Superscript: LucideSuperscript,
  Code: LucideCode,
  TextColor: LucideBaseline,
  BackgroundColor: LucidePaintBucket,
}

export const Copy: SVGComponent = LucideCopy
export const CopyCheck: SVGComponent = LucideCopyCheck

export const Edit: SVGComponent = LucideEdit

export const Type: SVGComponent = LucideType

export const Link: SVGComponent = LucideLink
export const Unlink: SVGComponent = LucideUnlink

export const DragIndicator: SVGComponent = MaterialSymbolsDragIndicator

export const Sum: SVGComponent = TablerSum

export const Math: SVGComponent = TablerMath

export const Undo: SVGComponent = LucideUndo2
export const Redo: SVGComponent = LucideRedo2

export const Plus: SVGComponent = LucidePlus
export const Minus: SVGComponent = LucideMinus

export const Align: Record<string, SVGComponent> = {
  Left: LucideAlignLeft,
  Center: LucideAlignCenter,
  Right: LucideAlignRight,
  Justify: LucideAlignJustify,
}

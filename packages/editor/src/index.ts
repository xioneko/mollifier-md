import Autocomplete from "#plugins/Autocomplete"
import CodeBlock from "#plugins/CodeBlock"
import ContextMenu from "#plugins/ContextMenu"
import DraggableBlock from "#plugins/DraggableBlock"
import Equation from "#plugins/Equation"
import FloatingToolbar from "#plugins/FloatingToolbar"
import History from "#plugins/History"
import ImageBlock from "#plugins/ImageBlock"
import InputRule from "#plugins/InputRule"
import Link from "#plugins/Link"
import List from "#plugins/List"
import RichText from "#plugins/RichText"
import Table from "#plugins/Table"

export * from "./components"

export type { EditorStateConverter } from "#core/converter.ts"

export const defaultPlugins = [
  RichText,
  Link,
  List,
  Table,
  CodeBlock,
  ImageBlock,
  ContextMenu,
  Autocomplete,
  FloatingToolbar,
  DraggableBlock,
  History,
  InputRule,
  Equation,
]

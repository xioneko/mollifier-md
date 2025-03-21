import type { AutocompleteItem } from "#plugins/Autocomplete"
import { $getBlockElementNodeAtPoint } from "#shared/selection.ts"
import {
  $createListItemNode,
  $createListNode,
  $createListParagraphNode,
  type ListType,
} from "./nodes"
import { List } from "@mollifier-md/ui/icons"
import { $isParagraphNode, type RangeSelection } from "lexical"

export const autocompleteItems: AutocompleteItem[] = [
  {
    id: "list:bullet",
    title: "BulletedList",
    icon: List.Bullet,
    action(editor, selection) {
      editor.update(() => {
        $insertList("bullet", selection)
      })
    },
  },
  {
    id: "list:number",
    title: "NumberedList",
    icon: List.Number,
    action(editor, selection) {
      editor.update(() => {
        $insertList("number", selection)
      })
    },
  },
  {
    id: "list:check",
    title: "TodoList",
    icon: List.Todo,
    action(editor, selection) {
      editor.update(() => {
        $insertList("check", selection)
      })
    },
  },
]

function $insertList(listType: ListType, selection: RangeSelection) {
  const block = $getBlockElementNodeAtPoint(selection.anchor)
  if (block) {
    const list = $createListNode(listType)
    const listItem = $createListItemNode()
    const listParagraph = $createListParagraphNode()
    listItem.append(listParagraph)
    list.append(listItem)
    if (block.isEmpty() && $isParagraphNode(block)) {
      block.replace(list)
    } else {
      block.insertAfter(list)
    }
    listParagraph.select(0, 0)
  }
}

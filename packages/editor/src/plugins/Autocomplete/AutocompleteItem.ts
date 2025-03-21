import { type LexicalEditor, type RangeSelection } from "lexical"
import { h, type Component, type FunctionalComponent } from "vue"

export interface AutocompleteItem {
  id: string
  title: string
  icon?: Component
  action: (editor: LexicalEditor, selection: RangeSelection) => void
}

export const AutocompleteIcon: FunctionalComponent<{ component?: Component }> = props => {
  return props.component ? h(props.component, { width: "100%", height: "100%" }) : null
}

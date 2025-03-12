import type { EditorPlugin } from "../../core/types"
import AutocompletePlugin from "./AutocompletePlugin.vue"

export { type AutocompletePluginApi } from "./AutocompletePlugin.vue"
export type { AutocompleteItem } from "./AutocompleteItem"

export default {
  id: "builtin:autocomplete",
  component: AutocompletePlugin,
} satisfies EditorPlugin

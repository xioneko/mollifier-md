import { createGlobalComposable } from "@mollifier-md/ui/components"
import type { LexicalEditor } from "lexical"
import { onScopeDispose, ref } from "vue"

export const useEditable = createGlobalComposable((editor: LexicalEditor) => {
  const isEditable = ref(editor.isEditable())

  onScopeDispose(
    editor.registerEditableListener(editable => {
      isEditable.value = editable
    }),
  )

  return isEditable
})

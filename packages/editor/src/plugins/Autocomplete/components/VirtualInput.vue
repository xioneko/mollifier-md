<script setup lang="ts">
import { useComposerContext } from "#components"
import { mergeRegister } from "@lexical/utils"
import {
  type AutoCompleteContextValue,
  AutoCompleteRootContext,
  injectCollection,
} from "@mollifier-md/ui/components/AutoComplete"
import {
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_TAB_COMMAND,
} from "lexical"
import { inject, onUnmounted, watchEffect } from "vue"

const { query } = defineProps<{ query: string }>()

const { editor } = useComposerContext()
const { input, selectedId } = inject<AutoCompleteContextValue<string>>(AutoCompleteRootContext)!
const getItems = injectCollection()

watchEffect(() => {
  input.value = query
})

function navigate(direction: "up" | "down") {
  const items = getItems({ ordered: true }).filter(item => item.data.render)
  const index = items.findIndex(item => item.data.id === selectedId.value)
  const nextIndex =
    direction === "up" ? (index - 1 + items.length) % items.length : (index + 1) % items.length
  selectedId.value = items[nextIndex].data.id
  const itemEl = items[nextIndex].el
  itemEl.scrollIntoView({ block: "nearest" })
}

function accept() {
  const selectedItem = getItems().find(it => it.data.id === selectedId.value)!
  selectedItem.data.accept()
  input.value = ""
}

onUnmounted(
  mergeRegister(
    editor.registerCommand(
      KEY_ARROW_UP_COMMAND,
      event => {
        navigate("up")
        event.preventDefault()
        return true
      },
      COMMAND_PRIORITY_NORMAL,
    ),
    editor.registerCommand(
      KEY_ARROW_DOWN_COMMAND,
      event => {
        navigate("down")
        event.preventDefault()
        return true
      },
      COMMAND_PRIORITY_NORMAL,
    ),
    editor.registerCommand(
      KEY_ENTER_COMMAND,
      event => {
        accept()
        event?.preventDefault()
        return true
      },
      COMMAND_PRIORITY_CRITICAL,
    ),
    editor.registerCommand(
      KEY_TAB_COMMAND,
      event => {
        accept()
        event.preventDefault()
        return true
      },
      COMMAND_PRIORITY_CRITICAL,
    ),
  ),
)
</script>

<template />

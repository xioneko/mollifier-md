<script lang="ts">
const MIN_FONT_SIZE = 8
const MAX_FONT_SIZE = 72
const DEFAULT_FONT_SIZE = 16

function nextFontSize(current: number, increase: boolean) {
  if (increase) {
    if (current < MIN_FONT_SIZE) {
      return MIN_FONT_SIZE
    } else if (current < 12) {
      return current + 1
    } else if (current < 20) {
      return current + 2
    } else if (current < 36) {
      return current + 4
    } else if (current < 60) {
      return current + 12
    } else {
      return MAX_FONT_SIZE
    }
  } else {
    if (current > MAX_FONT_SIZE) {
      return MAX_FONT_SIZE
    } else if (current >= 48) {
      return current - 12
    } else if (current >= 24) {
      return current - 4
    } else if (current >= 14) {
      return current - 2
    } else if (current >= 9) {
      return current - 1
    } else {
      return MIN_FONT_SIZE
    }
  }
}
</script>

<script setup lang="ts">
import { useComposerContext } from "./EditorComposer.vue"
import * as css from "./EditorToolbar.css"
import { $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection"
import {
  Align,
  Chevron,
  Export,
  Format,
  Import,
  Minus,
  Plus,
  Redo,
  Save,
  Undo,
} from "@mollifier-md/ui/icons"
import { $getSelection } from "lexical"
import { onUnmounted, ref } from "vue"
import { clamp } from "#shared/utils.ts"
import { $isBlockSelection } from "#core/nodes"

const { editor } = useComposerContext()

const fontSizeInputValue = ref<string>(DEFAULT_FONT_SIZE.toString())
const fontSize = ref<number | null>(DEFAULT_FONT_SIZE)

function updateFontSize(next: number | ((prev: number) => number)) {
  editor.update(() => {
    const selection = $getSelection()
    if (selection) {
      $patchStyleText(selection, {
        "font-size":
          typeof next === "number"
            ? `${next}px`
            : (prev: string | null) => {
                const prevValue = prev ? parseInt(prev) : DEFAULT_FONT_SIZE
                return `${next(prevValue)}px`
              },
      })
    }
  })
}

onUnmounted(
  editor.registerUpdateListener(() => {
    const selection = editor.read($getSelection)
    if (selection && !$isBlockSelection(selection)) {
      fontSizeInputValue.value = editor.read(() =>
        $getSelectionStyleValueForProperty(
          // TODO: Implement $getSelectionStyleValueForProperty by ourselves
          // @ts-expect-error - @lexical/selection depends on @lexical/table
          selection,
          "font-size",
          `${DEFAULT_FONT_SIZE}px`,
        ).slice(0, -2),
      )
    }
  }),
)
</script>

<template>
  <div :class="css.root">
    <div :class="css.button">
      <Undo width="16px" height="16px" />
    </div>
    <div :class="css.button">
      <Redo width="16px" height="16px" />
    </div>
    <div :class="css.separator"></div>
    <div :class="css.dropdown">
      <Import width="16px" height="16px" />
      <div :class="css.arrowDown">
        <Chevron.Down width="14px" height="14px" />
      </div>
    </div>
    <div :class="css.dropdown">
      <Export width="16px" height="16px" />
      <div :class="css.arrowDown">
        <Chevron.Down width="14px" height="14px" />
      </div>
    </div>
    <div :class="css.button">
      <Save width="16px" height="16px" />
    </div>
    <div :class="css.separator"></div>
    <div :class="css.fontSize">
      <button
        :class="css.button"
        :disabled="fontSize !== null && fontSize <= MIN_FONT_SIZE"
        @click="updateFontSize(prev => nextFontSize(prev, false))"
      >
        <Minus width="16px" height="16px" />
      </button>
      <input
        :class="css.fontSizeInput"
        v-model="fontSizeInputValue"
        spellcheck="false"
        autocomplete="off"
        @change="
          ev => {
            const inputEl = ev.target as HTMLInputElement
            const value = parseInt(inputEl.value)
            if (!isNaN(value)) {
              fontSize = clamp(value, MIN_FONT_SIZE, MAX_FONT_SIZE)
              updateFontSize(fontSize)
              fontSizeInputValue = fontSize.toString()
            } else {
              fontSizeInputValue = fontSize?.toString() || ''
            }
          }
        "
      />
      <button
        :class="css.button"
        :disabled="fontSize !== null && fontSize >= MAX_FONT_SIZE"
        @click="updateFontSize(prev => nextFontSize(prev, true))"
      >
        <Plus width="16px" height="16px" />
      </button>
    </div>
    <div :class="css.separator"></div>
    <div :class="css.button">
      <Format.Bold width="16px" height="16px" />
    </div>
    <div :class="css.button">
      <Format.Italic width="16px" height="16px" />
    </div>
    <div :class="css.button">
      <Format.Underline width="16px" height="16px" />
    </div>
    <div :class="css.button">
      <Format.Strikethrough width="16px" height="16px" />
    </div>
    <div :class="css.button">
      <Format.Subscript width="16px" height="16px" />
    </div>
    <div :class="css.button">
      <Format.Superscript width="16px" height="16px" />
    </div>
    <div :class="css.button">
      <Format.Code width="16px" height="16px" />
    </div>
    <div :class="css.button">
      <Format.TextColor width="16px" height="16px" />
    </div>
    <div :class="css.button">
      <Format.BackgroundColor width="16px" height="16px" />
    </div>
    <div :class="css.separator"></div>
    <div :class="css.dropdown">
      <Align.Left width="16px" height="16px" />
      <div :class="css.arrowDown">
        <Chevron.Down width="14px" height="14px" />
      </div>
    </div>
  </div>
</template>

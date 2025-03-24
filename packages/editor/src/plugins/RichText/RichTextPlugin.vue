<script setup lang="ts">
import { getViewportElement, useComposerContext } from "#components"
import { usePluginsHostContext } from "#components/PluginsHost.vue"
import Autocomplete, { type AutocompletePluginApi } from "#plugins/Autocomplete"
import { OPEN_CONTEXT_MENU_COMMAND } from "#plugins/ContextMenu"
import InputRule, { type InputRulePluginApi } from "#plugins/InputRule"
import { autocompleteItems } from "./autocompleteItems"
import { inputRules } from "./inputRules"
import { $isHeadingNode, HeadingTagType } from "./nodes/HeadingNode"
import { $isQuoteNode, ColorValueHex, QuoteNode } from "./nodes/QuoteNode"
import { registerRichText } from "./registerRichText"
import { mergeRegister } from "@lexical/utils"
import { init as initColoris, coloris, close as closeColoris } from "@melloware/coloris"
import "@melloware/coloris/dist/coloris.css"
import { useDarkMode } from "@mollifier-md/ui/theme"
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, LexicalNode } from "lexical"
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue"

const { editor } = useComposerContext()
const { registerPluginMountedHook } = usePluginsHostContext()
const cleanupFns: (() => void)[] = []

const activeQuoteNode = ref<QuoteNode | null>(null)
const colorInputRef = useTemplateRef("colorInputKey")
const isDark = useDarkMode()

watch(isDark, dark => {
  coloris({
    el: "#coloris",
    themeMode: dark ? "dark" : "light",
  })
})

onMounted(() => {
  const rootElement = editor.getRootElement()!
  const viewportElement = getViewportElement(rootElement)
  const input = colorInputRef.value!
  let frameId: number | null
  initColoris()
  coloris({
    parent: viewportElement,
    el: "#coloris",
    themeMode: isDark.value ? "dark" : "light",
    alpha: false,
    wrap: false,
    swatches: ["#f9d98c", "#aedefc", "#a0e0a0"],
    onChange: color => {
      const node = activeQuoteNode.value
      if (node) {
        cancelAnimationFrame(frameId!)
        frameId = requestAnimationFrame(() => {
          editor.update(() => {
            node.setColor(color as ColorValueHex)
          })
        })
      }
    },
  })
  input.addEventListener("open", () => {
    viewportElement.addEventListener("scroll", () => closeColoris(), { once: true })
  })
  input.addEventListener("close", () => {
    activeQuoteNode.value = null
  })
})

onUnmounted(
  mergeRegister(
    registerRichText(editor),
    registerPluginMountedHook<AutocompletePluginApi>(Autocomplete.id, plugin => {
      cleanupFns.push(plugin.registerItems(...autocompleteItems))
    }),
    registerPluginMountedHook<InputRulePluginApi>(InputRule.id, plugin => {
      cleanupFns.push(plugin.registerInputRules(...inputRules))
    }),
    editor.registerCommand(
      OPEN_CONTEXT_MENU_COMMAND,
      ({ items, event }) => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode()
          let parent: LexicalNode | null = node
          while (parent) {
            if ($isHeadingNode(parent)) {
              const heading = parent
              const currentTag = heading.getTag()
              const tags = ["h1", "h2", "h3", "h4", "h5", "h6"].filter(tag => tag !== currentTag)
              items.push(
                {
                  type: "separator",
                },
                {
                  type: "submenu",
                  title: "Convert to",
                  children: tags.map(tag => {
                    return {
                      type: "item",
                      title: `Heading ${tag.slice(1)}`,
                      action: () => {
                        editor.update(() => heading.setTag(tag as HeadingTagType))
                      },
                    }
                  }),
                },
              )
            } else if ($isQuoteNode(parent)) {
              const quote = parent
              items.push(
                {
                  type: "separator",
                },
                {
                  type: "item",
                  title: "Change Quote Color",
                  action: () => {
                    activeQuoteNode.value = quote
                    const input = colorInputRef.value
                    if (input) {
                      Object.assign(input.style, {
                        top: `${event.clientY}px`,
                        left: `${event.clientX}px`,
                      })
                      let currentColor: string | undefined = editor.read(() => quote.getColor())
                      if (!currentColor) {
                        const quoteElem = editor.getElementByKey(quote.getKey())!
                        currentColor = window.getComputedStyle(quoteElem).borderLeftColor || ""
                      }
                      input.value = currentColor
                      input.click()
                    }
                  },
                },
              )
            }
            parent = parent.getParent()
          }
        }
        return false
      },
      COMMAND_PRIORITY_LOW,
    ),
    () => cleanupFns.forEach(fn => fn()),
  ),
)
</script>

<template>
  <Teleport to="body">
    <input
      type="text"
      id="coloris"
      :style="{
        position: 'fixed',
        visibility: 'hidden',
      }"
      ref="colorInputKey"
    />
  </Teleport>
</template>

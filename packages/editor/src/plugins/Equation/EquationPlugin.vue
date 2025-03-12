<script setup lang="ts">
import { useComposerContext, usePluginsHostContext } from "#components"
import Autocomplete, { AutocompletePluginApi } from "#plugins/Autocomplete"
import FloatingToolbar, { FloatingToolbarPluginApi } from "#plugins/FloatingToolbar"
import InputRule, { InputRulePluginApi } from "#plugins/InputRule"
import { __assert__ } from "#shared/dev.ts"
import { inputRules } from "./inputRules"
import { $createEquationBlockNode, $createInlineEquationNode } from "./nodes"
import { mergeRegister } from "@lexical/utils"
import { Math, Sum } from "@mollifier-md/ui/icons"
import { $getSelection, $isRangeSelection, $isTextNode, TextNode } from "lexical"
import { h, onUnmounted } from "vue"

const { editor } = useComposerContext()
const { registerPluginMountedHook } = usePluginsHostContext()
const cleanupFns: (() => void)[] = []

onUnmounted(
  mergeRegister(
    registerPluginMountedHook<AutocompletePluginApi>(Autocomplete.id, plugin => {
      const unregister = plugin.registerItems(
        {
          id: "inline-equation",
          title: "Inline equation",
          icon: Math,
          action(editor, selection) {
            const node = $createInlineEquationNode()
            editor.update(() => {
              selection.insertNodes([node])
              // Wait for the decorator to be mounted
              window.setTimeout(() => {
                editor.read(() => {
                  const decorator = node.getInstance()
                  decorator?.openEditor()
                })
              })
            })
          },
        },
        {
          id: "block-equation",
          title: "Block equation",
          icon: Sum,
          action(editor, selection) {
            const node = $createEquationBlockNode()
            editor.update(() => {
              selection.insertNodes([node])
              // Wait for the decorator to be mounted
              window.setTimeout(() => {
                editor.read(() => {
                  const decorator = node.getInstance()
                  decorator?.openEditor()
                })
              })
            })
          },
        },
      )
      cleanupFns.push(unregister)
    }),
    registerPluginMountedHook<InputRulePluginApi>(InputRule.id, plugin => {
      const unregister = plugin.registerInputRules(...inputRules)
      cleanupFns.push(unregister)
    }),
    registerPluginMountedHook<FloatingToolbarPluginApi>(FloatingToolbar.id, plugin => {
      const unregister = plugin.registerItem({
        id: "inline-equation",
        component: function InlineEquationButton() {
          return h(
            "button",
            {
              type: "button",
              onClick(event) {
                editor.update(
                  () => {
                    const selection = $getSelection()
                    __assert__($isRangeSelection(selection), "Expected a range selection")
                    const nodes = selection.extract()
                    let start = 0
                    while (start < nodes.length && !$isTextNode(nodes[start])) start++
                    let end = start + 1
                    while (end < nodes.length && $isTextNode(nodes[end])) end++
                    const textNodes = nodes.slice(start, end) as TextNode[]
                    if (textNodes.length > 0) {
                      const equation = textNodes.map(node => node.__text).join("")
                      const node = $createInlineEquationNode(equation)
                      textNodes[0].insertBefore(node)
                      textNodes.forEach(node => node.remove())
                      plugin.disable()
                    }
                  },
                  {
                    onUpdate() {
                      plugin.enable()
                    },
                  },
                )
              },
            },
            h(Math, { width: "100%", height: "100%" }),
          )
        },
      })
      cleanupFns.push(unregister)
    }),
    () => cleanupFns.forEach(fn => fn()),
  ),
)
</script>

<template></template>

<script setup lang="ts">
import { useComposerContext } from "#components"
import { usePluginsHostContext } from "#components/PluginsHost.vue"
import Autocomplete, { type AutocompletePluginApi } from "#plugins/Autocomplete"
import InputRule, { type InputRulePluginApi } from "#plugins/InputRule"
import { autocompleteItems } from "./autocompleteItems"
import { inputRules } from "./inputRules"
import { registerRichText } from "./registerRichText"
import { mergeRegister } from "@lexical/utils"
import { onUnmounted } from "vue"

const { editor } = useComposerContext()
const { registerPluginMountedHook } = usePluginsHostContext()
const cleanupFns: (() => void)[] = []

onUnmounted(
  mergeRegister(
    registerRichText(editor),
    registerPluginMountedHook<AutocompletePluginApi>(Autocomplete.id, plugin => {
      cleanupFns.push(plugin.registerItems(...autocompleteItems))
    }),
    registerPluginMountedHook<InputRulePluginApi>(InputRule.id, plugin => {
      cleanupFns.push(plugin.registerInputRules(...inputRules))
    }),
    () => cleanupFns.forEach(fn => fn()),
  ),
)
</script>

<template />

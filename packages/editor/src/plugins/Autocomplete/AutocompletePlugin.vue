<script lang="ts">
export interface AutocompletePluginApi {
  registerItems: (...items: AutocompleteItem[]) => () => void
}

function getTextAfterLastNonAlnum(str: string) {
  let match = str.match(/[^a-zA-Z0-9]([a-zA-Z0-9]*)$/)
  return match ? match[1] : str
}
</script>

<script setup lang="ts">
import { useComposerContext, getViewportElement } from "#components"
import { $isElementBlock } from "#core/nodes"
import * as css from "./Autocomplete.css"
import { AutocompleteItem, AutocompleteIcon } from "./AutocompleteItem"
import VirtualInput from "./components/VirtualInput.vue"
import { vDismissable, type vDismissableValue, vScrollLock } from "@mollifier-md/ui/components"
import * as AutoComplete from "@mollifier-md/ui/components/AutoComplete"
import * as Popper from "@mollifier-md/ui/components/Popper"
import { $getSelection, $isRangeSelection } from "lexical"
import { onMounted, onUnmounted, Ref, ref, shallowRef } from "vue"

const { editor } = useComposerContext()

const openMenu = ref(false)
const query = ref("")
const _inputValue = ref("")

const items = shallowRef<AutocompleteItem[]>([])
let viewportElement: HTMLElement
let menuAnchor: Ref<Popper.Measurable | null> = ref(null)

onMounted(() => {
  const rootElement = editor.getRootElement()
  viewportElement = getViewportElement(rootElement)
})

let prevTextContentLength = 0
onUnmounted(
  editor.registerTextContentListener(textContent => {
    editor.read(() => {
      if (editor.isComposing()) return

      const selection = $getSelection()
      if (
        !$isRangeSelection(selection) ||
        !selection.isCollapsed() ||
        selection.anchor.type !== "text"
      ) {
        openMenu.value = false
        prevTextContentLength = textContent.length
        return
      }

      const node = selection.anchor.getNode()
      const text = node.__text
      if (!node.isSimpleText() || selection.anchor.offset !== text.length) {
        openMenu.value = false
        prevTextContentLength = textContent.length
        return
      }

      if (openMenu.value) {
        const textAfter = getTextAfterLastNonAlnum(text)
        if (textContent.length < prevTextContentLength || !textAfter) {
          openMenu.value = false
        } else {
          query.value = textAfter
        }
      } else if (textContent.length >= prevTextContentLength) {
        const parent = node.getParent()
        if ($isElementBlock(parent)) {
          const textAfter = getTextAfterLastNonAlnum(text)
          if (textAfter) {
            query.value = textAfter
            openMenu.value = true
            const anchorElem = editor.getElementByKey(node.__key)!
            const { right, height, top } = anchorElem.getBoundingClientRect()
            menuAnchor.value = {
              getBoundingClientRect: () => DOMRect.fromRect({ x: right, y: top, height }),
            }
          }
        }
      }
      prevTextContentLength = textContent.length
    })
  }),
)

const handleNoMatch = () => {
  openMenu.value = false
}

const handleAccept = (item: AutocompleteItem) => {
  openMenu.value = false
  editor.update(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) return
    const anchor = selection.anchor
    anchor.set(anchor.key, anchor.offset - query.value.length, "text")
    selection.removeText()
    item.action(editor, selection)
  })
}

const handleDismiss: vDismissableValue = {
  onEscapeKeyDown() {
    openMenu.value = false
  },
  onPointerDownOutside() {
    openMenu.value = false
  },
  disableOutsidePointerEvents: true,
}

defineExpose<AutocompletePluginApi>({
  registerItems(...item) {
    items.value.push(...item)
    const ids = new Set(item.map(it => it.id))
    return () => {
      items.value = items.value.filter(it => !ids.has(it.id))
    }
  },
})
</script>

<template>
  <Popper.Root>
    <AutoComplete.Root v-model="_inputValue" :matcher="AutoComplete.wordAnchoredSubsequenceMatcher">
      <Popper.Anchor :virtual-element="menuAnchor" />
      <template v-if="openMenu">
        <VirtualInput :query />
        <Teleport to="body">
          <Popper.Content
            strategy="fixed"
            align="start"
            :side-offset="5"
            :auto-update-options="{ elementResize: true }"
            set-popper-available-size-css-var
            as-child
            v-dismissable="handleDismiss"
            v-scroll-lock="viewportElement"
          >
            <AutoComplete.Content
              :class="['Autocomplete__content', css.content]"
              @no-match="handleNoMatch"
            >
              <AutoComplete.Item
                v-for="item of items"
                :class="['Autocomplete__item', css.item]"
                :key="item.id"
                :value="item.title"
                @accept="handleAccept(item)"
              >
                <span :class="['Autocomplete__item-icon', css.itemIcon]">
                  <AutocompleteIcon :component="item.icon" />
                </span>
                <span :class="['Autocomplete__item-title']">
                  {{ item.title }}
                </span>
              </AutoComplete.Item>
            </AutoComplete.Content>
          </Popper.Content>
        </Teleport>
      </template>
    </AutoComplete.Root>
  </Popper.Root>
</template>

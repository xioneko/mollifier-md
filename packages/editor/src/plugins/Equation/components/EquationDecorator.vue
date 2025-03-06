<script lang="ts">
export interface MathNodeDecoratorProps {
  nodeKey: string
  equation: string
  inline: boolean
}

export interface MathNodeDecoratorExpose {
  openEditor(): void
}
</script>

<script setup lang="ts">
import "katex/dist/katex.css"
import katex from "katex"
import { onMounted, ref, useTemplateRef, watch } from "vue"
import * as Popper from "@mollifier-md/ui/components/Popper"
import {
  vDismissable,
  type vDismissableValue,
  vScrollLock,
  vSelect,
} from "@mollifier-md/ui/components"
import { getViewportElement, useComposerContext } from "#components"
import * as css from "./EquationDecorator.css"
import { $getNodeByKey } from "lexical"
import { EquationBlockNode, InlineEquationNode } from "../nodes"

const { nodeKey, equation, inline } = defineProps<MathNodeDecoratorProps>()

const { editor } = useComposerContext()
const katexElemRef = useTemplateRef("katexElemKey")
const showEditor = ref(false)
const renderedEquation = ref(equation)

onMounted(() => {
  katex.render(equation, katexElemRef.value!, {
    throwOnError: false,
    output: "html",
    displayMode: !inline,
  })
})

watch(
  () => equation,
  value => {
    renderedEquation.value = value
  },
)

watch(renderedEquation, value => {
  katex.render(value, katexElemRef.value!, {
    throwOnError: false,
    output: "html",
    displayMode: !inline,
  })
})

let viewportElement: HTMLElement
let rootElement: HTMLElement
onMounted(() => {
  rootElement = editor.getRootElement()!
  viewportElement = getViewportElement(rootElement)
})

const updateEquationAndHideEditor = () => {
  showEditor.value = false
  editor.update(() => {
    const equationNode = $getNodeByKey<EquationBlockNode | InlineEquationNode>(nodeKey)
    if (equationNode) {
      if (inline && !/[^\n]/.test(renderedEquation.value)) {
        equationNode.remove()
      } else {
        equationNode.setEquation(renderedEquation.value)
        if (!inline) {
          rootElement.focus({ preventScroll: true })
        }
      }
    }
  })
}

const handleDismiss: vDismissableValue = {
  onEscapeKeyDown() {
    updateEquationAndHideEditor()
  },
  onPointerDownOutside() {
    updateEquationAndHideEditor()
  },
  onFocusOutside() {
    updateEquationAndHideEditor()
  },
}

const handleClick = (event: MouseEvent) => {
  showEditor.value = true
  if (!inline) {
    editor.update(() => {
      const node = $getNodeByKey<EquationBlockNode>(nodeKey)
      node?.selectStart()
    })
  }
}

const handleInputKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && event.ctrlKey) {
    event.preventDefault()
    updateEquationAndHideEditor()
  }
}

defineExpose<MathNodeDecoratorExpose>({
  openEditor() {
    showEditor.value = true
  },
})
</script>

<template>
  <Popper.Root>
    <Popper.Anchor as-child>
      <span
        :class="css.equation"
        :data-display-mode="inline ? 'false' : 'true'"
        ref="katexElemKey"
        :style="{
          pointerEvents: showEditor ? 'none' : undefined,
        }"
        @click="handleClick"
      ></span>
    </Popper.Anchor>
    <Teleport to="body">
      <Popper.Transition @enter="Popper.fadeIn" @leave="Popper.fadeOut">
        <Popper.Content
          v-if="showEditor"
          :class="['Equation__editor', css.editor]"
          :side-offset="10"
          :collision-padding="5"
          v-scroll-lock="viewportElement"
          v-dismissable="handleDismiss"
        >
          <div
            :class="['Equation__editor-input', css.editorInput]"
            spellcheck="false"
            autocomplete="false"
            contenteditable="true"
            v-select="true"
            @keydown="handleInputKeyDown"
            @input="renderedEquation = ($event.target as HTMLDivElement).textContent || ''"
          >
            {{ equation }}
          </div>
        </Popper.Content>
      </Popper.Transition>
    </Teleport>
  </Popper.Root>
</template>

import { vars } from "@mollifier-md/ui/theme"
import { style } from "@vanilla-extract/css"

export const equation = style({
  userSelect: "none",
  cursor: "pointer",
  selectors: {
    '&[data-display-mode="true"]': {
      display: "grid",
      placeContent: "center",
      minHeight: "3.5rem",
    },
  },
})

export const editor = style({
  width: "320px",
  maxWidth: "calc(100vw - 24px)",
  padding: "12px",
  backgroundColor: vars.colors.gray3,
  borderRadius: vars.rounded.md,
  boxShadow: vars.shadow.sm,
  fontFamily: "monospace",
})

export const editorInput = style({
  resize: "none",
  width: "100%",
  outline: "none",
  wordBreak: "break-all",
  backgroundColor: vars.colors.gray3,
  fontSize: vars.text.base,
  selectors: {
    "&::placeholder": {
      color: vars.colors.grayA8,
    },
  },
})

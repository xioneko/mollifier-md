import { vars } from "@mollifier-md/ui/theme"
import { style } from "@vanilla-extract/css"

export const equation = style({
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

export const placeholder = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 10,
  height: "fit-content",
  marginBlock: "auto",
  WebkitUserSelect: "none",
  userSelect: "none",
  pointerEvents: "none",
  color: vars.colors.grayA9,
})

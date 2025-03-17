import { vars } from "@mollifier-md/ui/theme"
import { style } from "@vanilla-extract/css"

export const root = style({
  display: "flex",
  alignItems: "center",
  padding: "4px",
  userSelect: "none",
})

export const separator = style({
  marginInline: "6px",
  height: "24px",
  width: "1px",
  backgroundColor: vars.colors.gray6,
})

export const button = style({
  padding: "8px",
  borderRadius: vars.rounded.md,
  cursor: "pointer",
  selectors: {
    "&:hover": {
      backgroundColor: vars.colors.gray3,
    },
  },
})

export const dropdown = style([
  button,
  {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
])

export const arrowDown = style({
  color: vars.colors.gray11,
})

export const fontSize = style({
  display: "flex",
  alignItems: "center",
  gap: "4px",
})

export const fontSizeInput = style({
  width: "32px",
  height: "32px",
  padding: "4px",
  border: "none",
  borderRadius: vars.rounded.md,
  backgroundColor: "transparent",
  textAlign: "center",
  fontSize: vars.text.sm,
  appearance: "textfield",
  selectors: {
    "&:hover": {
      backgroundColor: vars.colors.gray3,
    },
    "&:focus-visible": {
      outlineStyle: "solid",
      outlineWidth: "1px",
      outlineColor: vars.colors.gray8,
      backgroundColor: vars.colors.gray3,
    },
  },
})

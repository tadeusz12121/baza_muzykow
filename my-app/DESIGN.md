---
version: alpha
name: "Nordic"
description: "Muted blues, soft greys and quiet confidence for productivity tools. Nordic brings Scandinavian restraint to software: near-white pages, a muted fjord blue for action, soft sea green and honey as secondary tones, and Manrope at comfortable sizes. Nothing shouts, so long feature pages and dense settings screens both stay easy on the eyes."
colors:
  primary: "#3A5BA0"
  on-primary: "#FFFFFF"
  secondary: "#5E9C8F"
  tertiary: "#C98A3E"
  neutral: "#5C636B"
  surface: "#FBFBFA"
  on-surface: "#1D2125"
typography:
  display-lg:
    fontFamily: "Manrope"
    fontSize: 60px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: "Manrope"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-md:
    fontFamily: "Manrope"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: "Manrope"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
  body-md:
    fontFamily: "Manrope"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "Manrope"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
rounded:
  sm: 8px
  md: 10px
  lg: 12px
  xl: 16px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
---

## Overview

Nordic brings Scandinavian restraint to software: near-white pages, a muted fjord blue for action, soft sea green and honey as secondary tones, and Manrope at comfortable sizes. Nothing shouts, so long feature pages and dense settings screens both stay easy on the eyes.

## Colors

- **primary (#3A5BA0):** Muted fjord blue, for primary buttons, links and selected items.
- **on-primary (#FFFFFF)**
- **secondary (#5E9C8F):** Sea green, for success, online status and the second chart series.
- **tertiary (#C98A3E):** Honey ochre, for highlights, pending items and a third series.
- **neutral (#5C636B):** Cool grey for descriptions, timestamps and placeholder text.
- **surface (#FBFBFA):** Near-white with a faint warmth; cards are pure white.
- **on-surface (#1D2125)**

## Typography

Manrope throughout: bold 700 for headings from a 60px display down to 20px with slightly tight tracking, body text in regular 400 at 16px on a 1.55 line height. JetBrains Mono for shortcuts and code.

## Layout

Layouts use 12 columns up to 1200px wide, 24px gutters and a 4px base unit. Marketing pages frame wide product screenshots with plenty of white; app views use a slim sidebar and a 68-character reading column.

## Shapes

12px corners on cards, inputs and buttons. 1px light grey borders; soft, low shadows on cards, popovers and screenshots.

## Components

Soft blue primary buttons, product screenshots in rounded frames, feature grids with small line icons, a three-tier pricing table and quiet testimonial cards.

## Do's and Don'ts

- Do leave generous white space around screenshots.
- Do keep icons thin and single-color.
- Don't put saturated brand colors next to the muted palette.
- Don't stack shadows; one soft level is enough.

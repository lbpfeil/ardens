---
created: 2026-01-22T15:45
title: Setup favicon for app
area: ui
files:
  - favicon-for-app/apple-icon.png
  - favicon-for-app/favicon.ico
  - favicon-for-app/icon0.svg
  - favicon-for-app/icon1.png
  - favicon-for-app/manifest.json
---

## Problem

Usuario adicionou arquivos de favicon em `favicon-for-app/` que precisam ser movidos para o local correto e configurados no Next.js app.

Arquivos disponiveis:
- apple-icon.png (Apple touch icon)
- favicon.ico (favicon tradicional)
- icon0.svg (icone SVG)
- icon1.png (icone PNG)
- manifest.json (web app manifest)

## Solution

1. Mover arquivos para `arden/app/`:
   - favicon.ico -> arden/app/favicon.ico
   - apple-icon.png -> arden/app/apple-icon.png
   - icon.svg/png -> arden/app/icon.png ou icon.svg
2. Atualizar/criar manifest.json em arden/app/manifest.json
3. Next.js App Router detecta automaticamente favicon.ico e apple-icon.png em app/
4. Remover pasta favicon-for-app/ apos migracao

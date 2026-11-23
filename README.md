# Slide Puzzle Generator

A sliding tile puzzle. Each new game picks a random nature picture (mountains,
waterfalls, forests, underwater scenes, space) and cuts it into a 3×3, 4×4 or
5×5 grid with one piece missing. Tap (or swipe) a piece next to the empty
square to slide it, and put the picture back together. "Solve it" finishes the
puzzle automatically (tap again to stop).

## Play on iPhone
1. Open the game's link in Safari.
2. Tap **Share** → **Add to Home Screen**.

## Files
- `index.html` — page layout
- `src/game.js` — game logic (the picture list is `PICTURES` at the top)
- `src/style.css` — styles
- `assets/pictures/` — the puzzle pictures (1200×1200 JPEG)
- `assets/levels.dat` — bonus level pack
- `manifest.json`, `sw.js` — home-screen app + offline support

When you change game files, bump `CACHE` in `sw.js` so installed copies update.

## Picture credits
All pictures are public domain (US government works) or CC0, from
Wikimedia Commons:
- Teton Range at sunrise, Schwabacher Landing — Grand Teton National Park (NPS)
- Upper and Lower Yosemite Falls — NPS / Damon Joyce
- Rainbow in the mist of Vernal Fall — NPS / Madelyn Carpenter
- Mount Rainier's wildflowers — NPS
- Green sea turtle — NOAA National Marine Sanctuaries
- Reef fish at 90 m off Kure Atoll — Richard L. Pyle (CC0)
- Reef scene, Flower Garden Banks — NOAA National Marine Sanctuaries
- Redwood National Park (REDW9356) — NPS
- Autumn river, October 2017 — Great Smoky Mountains NPS / Jessie Snow
- Meigs Falls, October 2013 — Great Smoky Mountains NPS / Warren Bielenberg
- "Cosmic Cliffs" in the Carina Nebula — NASA, ESA, CSA, STScI (Webb)
- Pillars of Creation (NIRCam) — NASA, ESA, CSA, STScI (Webb)
- Saturn, 6 October 2004 — NASA / JPL / Space Science Institute (Cassini)

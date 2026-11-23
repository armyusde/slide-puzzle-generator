# Mountain Slide Puzzle

A sliding tile puzzle. A picture of a mountain range is cut into a 3×3, 4×4 or
5×5 grid with one piece missing. Tap (or swipe) a piece next to the empty
square to slide it, and put the picture back together.

## Play on iPhone
1. Open the game's link in Safari.
2. Tap **Share** → **Add to Home Screen**.

## Files
- `index.html` — page layout
- `src/game.js` — game logic
- `src/style.css` — styles
- `assets/images/mountains.svg` — the puzzle picture
- `assets/levels.dat` — bonus level pack
- `manifest.json`, `sw.js` — home-screen app + offline support

When you change game files, bump `CACHE` in `sw.js` so installed copies update.

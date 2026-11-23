# Mountain Slide Puzzle

A sliding tile puzzle. A picture of a mountain range is cut into a 3×3, 4×4 or
5×5 grid with one piece missing. Tap (or swipe) a piece next to the empty
square to slide it, and put the picture back together. "Solve it" finishes the
puzzle automatically (tap again to stop).

## Play on iPhone
1. Open the game's link in Safari.
2. Tap **Share** → **Add to Home Screen**.

## Files
- `index.html` — page layout
- `src/game.js` — game logic
- `src/style.css` — styles
- `assets/images/mountains.jpg` — the puzzle picture: sunrise on the Teton Range from
  Schwabacher Landing, Grand Teton National Park (National Park Service photo, public domain)
- `assets/levels.dat` — bonus level pack
- `manifest.json`, `sw.js` — home-screen app + offline support

When you change game files, bump `CACHE` in `sw.js` so installed copies update.

Count and join the dots - Pineapple
===================================

A single-file worksheet game in plain HTML, CSS and vanilla JavaScript.
No build step, no dependencies, no internet needed.

To run
------
Open index.html in any browser (double-click it), or drop the folder
onto a static host.

How to play
-----------
1. The prompt asks for an answer, e.g. "Find the answer to 0 + 1".
2. Tap the dot whose equation gives that answer.
   A black line joins it to the previous dot.
   A wrong dot shakes red and draws nothing.
3. After dot 36 the outline closes and the colouring palette appears.
   You can also press "Colour it now" to skip straight to colouring.
4. Pick a colour, then tap a leaf or the pineapple body to fill it.

Where things are in index.html
------------------------------
CSS          : all styling, colours live in the :root variables at the top.
const EQ     : the 36 equations, in answer order (1 to 36).
const P      : the 36 dot positions, spaced 10 degrees apart around the body.
leaf()       : builds each crown leaf from a curve plus a width profile.
skin lines   : the printed diagonal pineapple pattern, snapped dot to dot.
pick()       : the game logic - correct dot, wrong dot, completion.
COLOURS      : the palette swatches.

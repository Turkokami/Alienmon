# 880 Coolant Reservoir: re-render

- **Attach:** `references/880_layout_guide.png` (the layout to follow) **and** `references/ferrox_style_reference.png` (the Ferrox look)
- **Optional:** `references/880_current_art.png` shows the current version (the problem: almost all water, only a thin shore walkable)
- **Save as:** `880_coolant_reservoir.png`, 1536x1024

## Prompt
```
Top-down 3/4 view pixel-art game map for the Alienmon game, in exactly the style of the attached ferrox_style_reference.png: Ferrox, a rusty scrapyard planet, with crisp detailed pixel art, warm rust, copper and orange tones, junk piles, old machinery and lamp posts.

This map is "Coolant Reservoir", a coolant reservoir: pools of glowing cyan-green coolant fluid with small grassy islands, crossed by riveted metal catwalks.

Follow the attached 880_layout_guide.png EXACTLY for where everything goes. Layout guide colours: dark red-brown = scrap walls, junk piles and cliffs (NOT walkable); tan = walkable dirt ground and paths; green = walkable patches of tall grass; cyan = glowing coolant water; grey = walkable metal catwalks and bridges over the water; brown = small wooden docks. Each square of the guide is one 64x64 tile.
Paths must be clearly readable as walkable ground. Walls, junk and cliffs must clearly read as blocked. The open tan path that touches the left or right edge of the guide must reach that edge of the image, because it joins the next map: Scrapyard Dome above (enter on the RIGHT edge, rows 5-8); and Reservoir Islands (LEFT edge, rows 4-7).

Canvas 1536x1024 (exactly 24 x 16 tiles of 64 px), landscape, filled edge to edge. No characters, no creatures, no text, no labels, no UI, no grid lines, no ball or capsule emblems. Lamp posts, railings, pipes and small details are welcome along the paths, as long as the layout stays the same.
```

## Layout (the same plan as the guide image, as text)
```
########################
####~~~~~~~~~~~~~~~~####
###~~,,,,~~~~~~~,,,,~~##
###~~,..,~~~~~~~,..,~~##
.....,..,=======,..,~~##
....~,,,,~~~~~~~,,,,~...
....~~~~~~~,,,~~~~~~~...
....~~~~~~~,.,~~~~~~....
###.~~~~~~~,,,~~~~~~....
###.~~~~~~~~=~~~~~~~.###
###.~~~~~~~~=~~~~~~~.###
###..DD.....=.....DD..##
###.....,,,,,,,,......##
###,,,,,,,,####,,,,,,###
########################
########################
```
Legend: # wall  . path  , tall grass  ~ coolant water  = catwalk  D dock

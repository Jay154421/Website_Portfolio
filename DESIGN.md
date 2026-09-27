# DESIGN.md

Direction for this portfolio and its mini-games. This file is the source of style
direction; `antislop.md` is the filter applied on top of it.

## Identity

A personal portfolio for Jay Bodiongan, full stack developer. The site itself is
clean, warm, and light: off-white ground (`#FAF9F6`), a brick-red accent
(`#95271D`), Poppins headings, Inter body.

The `/speedtype` mini-game is a deliberate break from that. It is an arcade
curiosity embedded in the portfolio, and it is allowed to look like a different
machine.

### The game: Keyboard Warrior

Reference supplied by the owner: *Keyboard Warrior Stickman - Typing Beat Em Up*
(Good Knight Collective, Steam app 4691530). Specifically its angle, not its art:
a typing-driven spectacle fighter set in the 2000s era of internet culture,
hardware, and operating systems.

What we take from it:
- Typing is the attack. Keystrokes are combat input, not a test.
- Stickman figures, no detailed character art.
- 2000s desktop and CRT as the whole visual world.
- Style ranking (Devil May Cry lineage): performance is scored and displayed live.

What we do not take: its art assets, its code, its characters, or its copy. Every
element here is drawn from scratch.

## Palette

Two palettes, one per surface. They do not blend.

### Portfolio (the site)
| Role | Hex | Use |
|---|---|---|
| Ground | `#FAF9F6` | Page background |
| Accent | `#95271D` | Links, headings, scrollbar |
| Accent (text-safe) | `#7c2219` | Red text on silver or light ground |
| Body text | `#1f2937` | Default copy |

### Game (the machine)
Core is the **Windows 98 default color scheme**, a named and fixed system rather
than a picked palette. Neutrals (black, white, grey) are excluded from the count.

| Role | Hex | Use |
|---|---|---|
| Desktop | `#008080` | Teal ground behind the window |
| Chrome | `#C0C0C0` | Window body, bevels |
| Title bar | `#000080` | Navy title bar, white text on it |
| CRT field | `#08090B` | The screen inside the window |
| Accent | `#e04d43` | Player state: player figure, player HP, rank |
| Accent (dark-safe) | `#95271D` | Red on silver only, never on the CRT field |
| Enemy | `#E5E7EB` | Enemy figure, enemy HP, damage numbers |

**Rule: red means you, white means the enemy.** Every colored element on the CRT
field follows that split. This is the identity motif of the game.

The portfolio red `#95271D` is too dark for text on black (2.58:1). On the CRT
field the accent is always `#e04d43` (5.31:1). On silver the red text is always
`#7c2219` (5.50:1).

## Typography

No new fonts. The game inherits the site's type system so it reads as part of the
same product rather than an embedded foreign page.

| Face | Use | Reason |
|---|---|---|
| Poppins 800 | Rank letter, big numbers | Display weight, readable at a glance mid-combat |
| Inter | HUD labels, chrome, buttons | Site body face, keeps the game in the family |
| Mono (system) | Passage text only | Monospace keeps caret position exact while typing |

Chrome does not try to fake MS Sans Serif with a bitmap font. The Win98 read comes
from bevel geometry and color, not from typeface.

## Mood

Arcade cabinet energy. Not minimal, not corporate. The game should say hello hard
and never feel quiet.

## Dials

**ENERGY 3 / RHYTHM 2 / MOTION 3**

- **ENERGY 3.** It is a beat 'em up. Hits land, ranks punch, the screen reacts.
  A calm version would be a different product.
- **RHYTHM 2.** Consistent with a few breaks. The HUD stays pinned in the same
  place every fight because a fighting-game HUD that moves is unreadable. Variety
  comes from wave state and enemy scale, not from reshuffling the layout.
- **MOTION 3.** Screen shake on impact, hit flash, damage numbers, rank
  transitions. All of it is gated by `prefers-reduced-motion`.

## Content rules

- No em dashes in UI copy.
- No invented statistics, testimonials, or claims anywhere.
- Every control does something. No dead buttons.
- Numbers shown are all computed from the player's own run.

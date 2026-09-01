# Project Conventions & Core Principles

## Baseline Rules & Preservation Standards
From this point forward, all future animations, interactions, and section enhancements must strictly preserve:
1. **Existing Navigation**: Keep all nav links, anchor jumps, header layout, and menu interactions intact.
2. **Existing Typography**: Retain font pairings, tracking, scales, and typography hierarchy.
3. **Existing Color Palette**: Preserve the high-contrast dark theme with `#FF4D1A`, `#FF7A00`, `#7C3AED`, and `#A855F7` accents.
4. **Existing Hero Character**: Never replace, alter, or remove the Kling hero character video and its integration.
5. **Existing Project Content**: Keep all 6 projects, their titles, subtitles, numbers, tabs, and details unchanged.
6. **Existing Images**: Retain all image URLs and asset pathways.
7. **Existing Buttons**: Keep all CTAs, icon buttons, view-all triggers, and modals functioning.
8. **Existing Responsive Layout**: Ensure fluid desktop, tablet, and mobile (>= 44px touch targets) responsiveness.
9. **Existing Working Functionality**: All modals, preloader, video playback, GSAP triggers, and scroll animations must remain functional.
10. **Targeted Surgical Edits**: Do not replace whole components when an enhancement can be achieved by modifying the existing component.
11. **No Unrequested Global Changes**: Never make global design shifts when tasked with modifying an individual section.

## Checkpoints & Restore Points
### Baseline / Base 0 (`base 0`)
- **Snapshot Locations**: `/.snapshots/baseline/` and `/.snapshots/base_0/`
- **Saved At**: 2026-08-19
- **Restore Command**: Whenever the user asks to "reverse back to Base 0" / "restore baseline" / "go back to base 0":
  `cp -r .snapshots/baseline/* . && npm run lint`

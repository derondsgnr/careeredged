# Mind Map — Open Bugs to Revisit

**Status**: Unresolved — paused for now, will revisit.

## Bug 1: Skill Bridge Milestone Overlap

**What's happening**: When the Skill Bridge phase is expanded, milestone pills overlap with the phase label block (title, weeks, progress bar, "3 paths" button, chevron). Despite two attempts to fix via:
- Removing non-chosen path milestone rendering (only show active path)
- Increasing `MILESTONE_Y_START` from 150 → 220 and `PHASE_Y_CENTER` from 140 → 160

The overlap persists. This suggests the constants may not be the root cause — likely a CSS/positioning issue where the phase label block's absolute positioning and the milestone nodes' absolute positioning are conflicting within the transformed canvas div.

**Investigation needed**:
- Inspect rendered DOM to verify actual pixel positions of phase labels vs milestone pills
- Check if the transform/scale on the canvas wrapper is distorting the spacing
- The phase label div uses `top: 80px` relative to its parent (phase circle div at `PHASE_Y_CENTER - 36`). Verify this stacks correctly with milestones at `PHASE_Y_CENTER + MILESTONE_Y_START`
- May need to restructure: milestones as children of the phase node div rather than separate absolute-positioned siblings

## Bug 2: "3 Paths" Button — Path Compare Panel Not Opening

**What's happening**: Clicking the "3 paths" button on the Skill Bridge phase node doesn't open the PathComparePanel. The button has:
- `data-node` attribute (to prevent canvas mouseDown from firing)
- `e.stopPropagation()` (to prevent parent phase onClick)
- `onClick` calls `setShowPathCompare(phase)`

Despite removing the canvas mouseDown panel-closing logic and adding a proper backdrop overlay, the panel still doesn't appear.

**Investigation needed**:
- Add `console.log` to the button's onClick to verify it fires
- Check if a parent element is intercepting the click (pointer-events, z-index)
- Verify PathComparePanel component renders correctly when `showPathCompare` is truthy
- Check if the `fixed` positioning on the panel is broken by a CSS `transform` ancestor (the canvas has `transform: translate(...) scale(...)` — `fixed` positioning breaks inside transformed elements)
- The button is inside the transformed canvas div — this is almost certainly the issue. The panel renders outside the transform, so `fixed` should work, but the *click event coordinates* and *event bubbling* through the transform layer may be the problem
- Consider moving the "3 paths" trigger outside the canvas transform entirely

## Changes Made (to revert or build on)

**File**: `/src/app/components/edgepath-mindmap.tsx`

1. SVG branch lines: Changed from rendering all 3 paths to only the chosen/active path, centered on phase X (no more PATH_SPREAD offsets)
2. Milestone nodes: Changed from rendering all paths' milestones (non-chosen at 0.2 opacity) to only the active path's milestones, centered on phase X
3. Removed `PATH_SPREAD` constant (was 220)
4. `PHASE_Y_CENTER`: 140 → 160
5. `MILESTONE_Y_START`: 150 → 220
6. `MILESTONE_GAP_Y`: 52 → 54
7. Canvas height calculation: Uses active path milestone count instead of max across all paths
8. `handleMouseDown`: Removed panel-closing logic (was: if panels open, close them on background click)
9. Added backdrop overlay (`fixed z-40`) behind side panels for dismissal
10. PathComparePanel now reads from live `data` state instead of stale `showPathCompare` snapshot

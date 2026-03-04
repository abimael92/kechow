# UX Enhancements Summary

Modern, delightful UI improvements with performance-safe and mobile-first constraints.

## Page transitions

- **Where:** All layouts (MainLayout, CustomerLayout, OwnerLayout, DeliveryLayout).
- **What:** `<Transition name="page" mode="out-in">` wraps `<router-view>`. Fade (opacity) over 150ms.
- **Performance:** Opacity-only; no layout thrash. Duration shortened to near-instant when `prefers-reduced-motion: reduce` is set.

## Skeleton loaders

- **Component:** `@/shared/ui/Skeleton.vue`. Variants: `text`, `avatar`, `card`, `block`. Optional `rounded`, `width`, `height`.
- **Styling:** `.skeleton` in `global.css` — shimmer animation; disabled when `prefers-reduced-motion: reduce`.
- **Usage:** Restaurant list loading grid (6 card skeletons); customer Orders panel (3 order-row skeletons). Reusable anywhere loading state is needed.

## Button feedback

- **BaseButton:** Added `btn-press` (slight scale down on `:active`) and `focus-visible:ring-2` for keyboard focus.
- **Global:** `.btn-press` and `.interactive-press` apply `transform: scale(0.98)` on active; `.interactive-lift` adds `translateY(-2px)` and shadow on hover. All respect `prefers-reduced-motion: reduce` (no transform when reduced).

## Micro-interactions

- **Classes in global.css:**
  - `.interactive-lift` — hover: lift + shadow.
  - `.interactive-press` — active: scale down.
  - `.btn-press` — active: scale down (buttons).
- **Existing:** Buttons already had hover/active states (purple/pink); these add consistent press/lift without heavy animation.

## Accessibility basics

- **Skip link:** “Skip to main content” link at the top of each layout; visible on focus only, moves focus to `#main-content`.
- **Focus-visible:** `button`, `a`, `[tabindex="0"]` get a 2px accent ring on `:focus-visible` (keyboard); `:focus:not(:focus-visible)` has no outline to avoid mouse-only focus ring.
- **Main landmark:** `<main id="main-content">` in all layouts for skip target and focus management.
- **Reduced motion:** All motion (page transition, skeleton shimmer, lift/press) is disabled or minimized inside `@media (prefers-reduced-motion: reduce)`.
- **Touch targets:** On viewports ≤768px, buttons and button-like links get `min-height: 44px` and `min-width: 44px` (plus padding) for tap-friendly size.

## Constraints

- **Performance-safe:** Transitions use opacity only; skeleton uses a simple gradient animation; no heavy layout or paint work.
- **Mobile-first:** Touch targets and padding scale from small screens up; transitions and focus styles work on touch and keyboard.

## Summary

| Area              | Enhancement                          | Location / usage                          |
|-------------------|--------------------------------------|-------------------------------------------|
| Page transitions  | Fade on route change                 | All layouts, `router-view`                |
| Skeleton loaders  | Shimmer placeholders                | `Skeleton.vue`; RestaurantList, OrdersPanel |
| Button feedback   | Press scale, focus ring             | BaseButton, `.btn-press`                   |
| Micro-interactions| Lift on hover, press on active      | `.interactive-lift`, `.interactive-press`  |
| Accessibility     | Skip link, focus-visible, reduced motion, 44px targets | Layouts, global.css        |

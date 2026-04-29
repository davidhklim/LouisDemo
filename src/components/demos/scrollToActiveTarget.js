/**
 * scrollToActiveTarget.js
 *
 * When a live demo advances to a new state, the gold-pulse target
 * (`.scene-target--active`) often renders inside an internal scroll container
 * (e.g. `.live-scenario-demo__scene` or `.live-demo__scripted-doc-col`) at a
 * position that may be off-screen relative to that container. This module
 * smooth-scrolls every scrollable ancestor *inside* the demo root so the new
 * target ends up centred — without ever scrolling the page itself.
 *
 * Why a custom walker instead of `Element.scrollIntoView()`?
 *   `scrollIntoView` will happily scroll the document/window to bring the
 *   target into view. That is the exact "page jumps" behaviour we want to
 *   avoid: the demo card is already on-screen; only its inner scroll
 *   containers should pan. By walking up from the target and stopping at
 *   `root`, we constrain scrolling to the demo's interior.
 *
 * Honours `prefers-reduced-motion: reduce` by switching to instant scroll.
 */

const isReducedMotion = () => {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const isScrollable = (el) => {
  if (!el || el.nodeType !== 1) return false;
  const style = getComputedStyle(el);
  const overflowY = style.overflowY;
  const overflowX = style.overflowX;
  const verticallyScrollable =
    /(auto|scroll|overlay)/.test(overflowY) &&
    el.scrollHeight > el.clientHeight + 1;
  const horizontallyScrollable =
    /(auto|scroll|overlay)/.test(overflowX) &&
    el.scrollWidth > el.clientWidth + 1;
  return verticallyScrollable || horizontallyScrollable;
};

/**
 * Smoothly scroll every scrollable ancestor between `target` and `root` so
 * `target` is centred. Stops at `root` — never scrolls past it.
 */
const scrollTargetIntoCenter = (target, root) => {
  if (!target || !root || !root.contains(target)) return;
  const behavior = isReducedMotion() ? "auto" : "smooth";

  let parent = target.parentElement;
  while (parent && parent !== root && root.contains(parent)) {
    if (isScrollable(parent)) {
      const tRect = target.getBoundingClientRect();
      const pRect = parent.getBoundingClientRect();

      // Centre vertically.
      const targetTopWithinParent =
        parent.scrollTop + (tRect.top - pRect.top);
      const desiredTop =
        targetTopWithinParent - (parent.clientHeight - tRect.height) / 2;

      // Centre horizontally only if the parent actually scrolls horizontally.
      const targetLeftWithinParent =
        parent.scrollLeft + (tRect.left - pRect.left);
      const desiredLeft =
        targetLeftWithinParent - (parent.clientWidth - tRect.width) / 2;

      const maxTop = Math.max(0, parent.scrollHeight - parent.clientHeight);
      const maxLeft = Math.max(0, parent.scrollWidth - parent.clientWidth);

      parent.scrollTo({
        top: Math.max(0, Math.min(desiredTop, maxTop)),
        left: Math.max(0, Math.min(desiredLeft, maxLeft)),
        behavior,
      });
    }
    parent = parent.parentElement;
  }
};

/**
 * Find the currently active scene target inside `root` and smooth-scroll it
 * into the centre of its enclosing scroll containers (without affecting the
 * page scroll position).
 *
 * Returns true if a target was found and a scroll was issued, false otherwise.
 */
export const scrollActiveTargetIntoView = (root) => {
  if (!root) return false;
  // `.scene-target--active` is the canonical class shared by every demo
  // (scenario renderers + AI Drafting). The legacy `.live-demo__clause-target`
  // selector is kept as a defensive fallback in case the AI Drafting clause
  // ever drops the scene-target wrapper in a future refactor.
  const target = root.querySelector(
    ".scene-target--active, .live-demo__clause-target",
  );
  if (!target) return false;
  scrollTargetIntoCenter(target, root);
  return true;
};

export default scrollActiveTargetIntoView;

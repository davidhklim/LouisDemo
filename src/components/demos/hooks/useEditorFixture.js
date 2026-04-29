import { useMemo } from "react";

/**
 * useEditorFixture — Memoize the three editor props sourced from a static
 * JSON fixture: `layout`, `content`, and `pageBreakBeforeRootIndices`.
 *
 * Keeping these memoized by fixture identity prevents the scripted editor
 * view from re-reading content on every render.
 *
 * @param {object | null} fixtureJson
 * @returns {{
 *   layout: object | null,
 *   content: object | null,
 *   pageBreakBeforeRootIndices: number[],
 * }}
 */
export const useEditorFixture = (fixtureJson) => {
  const layout = useMemo(() => fixtureJson?.layout ?? null, [fixtureJson]);
  const content = useMemo(() => fixtureJson?.content ?? null, [fixtureJson]);
  const pageBreakBeforeRootIndices = useMemo(
    () => fixtureJson?.pageBreakBeforeRootIndices ?? [],
    [fixtureJson],
  );
  return { layout, content, pageBreakBeforeRootIndices };
};

export default useEditorFixture;

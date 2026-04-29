import { useMemo } from "react";
import { buildLearnEntityMap, learnIndex } from "../../data/learnContent.js";

export default function useLearnIndex() {
  const entries = learnIndex;
  const loading = false;

  const entityMap = useMemo(() => buildLearnEntityMap(entries), [entries]);

  return { entries, entityMap, loading };
}

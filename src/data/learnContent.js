const contentModules = import.meta.glob("./learnContent/**/*.json", {
  eager: true,
  import: "default",
});

const TYPE_SLUG_MAP = {
  term: "terms",
  document_guide: "documents",
  role: "roles",
};

const entries = Object.values(contentModules)
  .map((entry) => ({
    ...entry,
    title: entry.term || entry.title || entry.role || entry.name,
  }))
  .sort((a, b) => {
    const typeOrder = { term: 0, role: 1, document_guide: 2 };
    const typeDelta = (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9);
    if (typeDelta !== 0) return typeDelta;
    return (a.title || "").localeCompare(b.title || "");
  });

export const learnEntries = entries;

export const learnIndex = entries.map((entry) => ({
  id: entry.id,
  type: entry.type,
  slug: entry.slug,
  title: entry.title,
  summary:
    entry.type === "term"
      ? entry.definition?.slice(0, 200)
      : entry.summary || "",
  synonyms: entry.synonyms || [],
  tags: entry.tags || [],
}));

export function getLearnEntry(typeSlug, slug) {
  const typeMap = { terms: "term", documents: "document_guide", roles: "role" };
  const type = typeMap[typeSlug];
  const entry = entries.find((item) => item.type === type && item.slug === slug);
  if (!entry) return null;

  return {
    ...entry,
    backlinks: computeBacklinks(entry.type, entry.slug),
  };
}

export function buildLearnEntityMap(index = learnIndex) {
  const map = new Map();

  for (const entry of index) {
    const target = {
      typeSlug: TYPE_SLUG_MAP[entry.type],
      slug: entry.slug,
      title: entry.title,
    };

    if (entry.title) {
      map.set(entry.title.toLowerCase(), target);
    }

    for (const synonym of entry.synonyms || []) {
      if (synonym.length >= 4 && !map.has(synonym.toLowerCase())) {
        map.set(synonym.toLowerCase(), target);
      }
    }
  }

  return map;
}

function computeBacklinks(targetType, targetSlug) {
  const backlinks = [];

  for (const entry of entries) {
    if (entry.type === targetType && entry.slug === targetSlug) continue;

    let via = null;
    if (targetType === "term" && entry.relatedTermSlugs?.includes(targetSlug)) {
      via = "related term";
    }
    if (targetType === "document_guide" && entry.relatedDocumentGuideSlugs?.includes(targetSlug)) {
      via = via ?? "related document";
    }
    if (targetType === "role" && entry.relatedRoleSlugs?.includes(targetSlug)) {
      via = via ?? "related role";
    }
    if (targetType === "term" && entry.keyTerms?.some((term) => term.termSlug === targetSlug)) {
      via = via ?? "key term";
    }

    if (via) {
      backlinks.push({
        type: TYPE_SLUG_MAP[entry.type],
        slug: entry.slug,
        title: entry.title,
        entryType: entry.type,
        via,
      });
    }
  }

  return backlinks;
}

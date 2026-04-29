import { useMemo } from "react";
import { Link } from "react-router-dom";

/**
 * LinkedText — renders plain text with inline links for recognized Learn entities.
 *
 * Design decisions:
 * - First-occurrence only: each entity is linked once per text block to reduce clutter.
 * - Minimum 4 characters: entity names shorter than 4 chars are skipped to prevent
 *   false positives on common words.
 * - Longest-first matching: entity names are sorted descending by length so multi-word
 *   phrases like "Right of First Refusal" match before a shorter substring like "First".
 * - Word boundaries: the regex uses \b to avoid partial-word matches.
 * - Skip self: if the match target's slug equals excludeSlug, the match is skipped.
 *
 * Props:
 *   text        {string}  — plain text to render
 *   entityMap   {Map}     — from useLearnIndex: lowercased name → { typeSlug, slug, title }
 *   excludeSlug {string}  — slug of the current page entry (prevents self-linking)
 */
export default function LinkedText({ text, entityMap, excludeSlug }) {
  const segments = useMemo(() => {
    // Guard: return plain text if nothing to work with
    if (!text || !entityMap || entityMap.size === 0) {
      return [{ text: text || "", isLink: false }];
    }

    // Sort entity names longest-first to prevent short matches shadowing multi-word phrases
    const names = Array.from(entityMap.keys()).sort((a, b) => b.length - a.length);

    // Drop names shorter than 4 characters
    const filteredNames = names.filter((n) => n.length >= 4);

    if (filteredNames.length === 0) {
      return [{ text, isLink: false }];
    }

    // Escape regex special characters in each entity name before building the pattern
    const escaped = filteredNames.map((n) =>
      n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );

    const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

    const result = [];
    let lastIndex = 0;
    // Track which entity slugs have already been linked (first-occurrence rule)
    const linked = new Set();

    let match;
    while ((match = pattern.exec(text)) !== null) {
      const matchedText = match[0];
      const entity = entityMap.get(matchedText.toLowerCase());

      // Skip if the entity is not in the map or maps to the current entry
      if (!entity || entity.slug === excludeSlug) continue;

      // First-occurrence only
      if (linked.has(entity.slug)) continue;
      linked.add(entity.slug);

      // Emit any plain text before this match
      if (match.index > lastIndex) {
        result.push({ text: text.slice(lastIndex, match.index), isLink: false });
      }

      result.push({
        text: matchedText,
        isLink: true,
        to: `/learn/${entity.typeSlug}/${entity.slug}`,
        title: entity.title,
      });

      lastIndex = match.index + matchedText.length;
    }

    // Emit trailing plain text
    if (lastIndex < text.length) {
      result.push({ text: text.slice(lastIndex), isLink: false });
    }

    // Fall back to plain text if the regex produced no links
    return result.length > 0 ? result : [{ text, isLink: false }];
  }, [text, entityMap, excludeSlug]);

  return (
    <>
      {segments.map((seg, i) =>
        seg.isLink ? (
          <Link
            key={i}
            to={seg.to}
            className="learn-entity-link"
            title={seg.title}
          >
            {seg.text}
          </Link>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  );
}

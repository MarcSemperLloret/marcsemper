import { getCollection, type CollectionEntry } from "astro:content";

export type PostEntry = CollectionEntry<"posts">;

export interface Post {
  entry: PostEntry;
  slug: string;
  lang: "es" | "en";
  readingTime: string;
}

/** Estimate reading time in minutes from markdown body. */
export function estimateReadingTime(body?: string, lang: "es" | "en" = "es"): string {
  if (!body) return lang === "es" ? "1 min de lectura" : "1 min read";
  const wordCount = body.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return lang === "es" ? `${minutes} min de lectura` : `${minutes} min read`;
}

function toPost(entry: PostEntry): Post {
  const segments = entry.id.split("/");
  const slug = segments.pop()?.replace(/\.(md|mdx)$/, "") ?? entry.id;
  return {
    entry,
    slug,
    lang: entry.data.lang,
    readingTime: estimateReadingTime(entry.body, entry.data.lang)
  };
}

/** Get all published posts, sorted by date descending (newest first). */
export async function getPosts(lang?: "es" | "en"): Promise<Post[]> {
  const entries = await getCollection("posts", ({ data }) => !data.draft);
  const allPosts = entries
    .map(toPost)
    .sort(
      (a, b) =>
        new Date(b.entry.data.date).getTime() - new Date(a.entry.data.date).getTime()
    );

  if (lang) {
    return allPosts.filter((post) => post.lang === lang);
  }
  return allPosts;
}

/** URL path for a blog post depending on its language. */
export function postPath(post: Post): string {
  return post.lang === "es"
    ? `/es/blog/${post.slug}/`
    : `/blog/${post.slug}/`;
}

/** Format ISO date into human-readable format. */
export function formatPostDate(dateStr: string, lang: "es" | "en" = "es"): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

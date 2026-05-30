import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { CivicFeedPostCard } from "@/components/civic-feed-post";
import { FeedChatbot } from "@/components/feed-chatbot";
import {
  CIVIC_FEED_MAX_STORIES,
  CIVIC_FEED_SOURCE_COUNT,
  getCivicFeed,
} from "@/lib/civic-feed";

export const metadata: Metadata = {
  title: "Civic feed | Evolucent",
  description:
    "Latest Ghana headlines reframed for citizens — see what is happening across the country.",
};

const getCachedFeed = unstable_cache(
  async () => getCivicFeed(),
  ["civic-feed-v2"],
  { revalidate: 600 },
);

export default async function FeedPage() {
  const { posts, fetchedAt: rawFetchedAt, source, error, feedsLoaded } =
    await getCachedFeed();
  const fetchedAt = new Date(rawFetchedAt);

  return (
    <div className="min-h-screen">
      {/* Dark Mesh Gradient Hero */}
      <section className="relative overflow-hidden bg-[#0d0d0d] py-16 text-evolucent-off-white md:py-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 size-[120%] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,135,90,0.15)_0,transparent_55%)] blur-[80px]" />
          <div className="absolute -right-1/4 -bottom-1/4 size-[120%] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,166,35,0.08)_0,transparent_55%)] blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-gold">
            Civic radar
          </p>
          <h1 className="mb-4 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-[1.05] tracking-tight">
            What&apos;s happening in <br />
            <span className="bg-gradient-to-r from-gold via-gold-light to-civic-green bg-clip-text text-transparent">Ghana</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-white/70">
            A living feed of public-interest stories — aggregated from open news
            sources and, when configured, shortened into citizen-friendly posts
            so you can spot problems and conversations worth your attention.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs font-mono text-white/70">
            <span className="rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1">
              Refreshes ~10 min
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1">
              {source === "rss+ai" ? "Headlines + AI briefs" : "Headlines only"}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1">
              Up to {CIVIC_FEED_MAX_STORIES} stories · {CIVIC_FEED_SOURCE_COUNT} feeds
              {posts.length > 0
                ? ` · ${feedsLoaded} loaded`
                : null}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        {error && posts.length === 0 ? (
          <div
            className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center"
            role="alert"
          >
            <p className="font-semibold text-destructive">
              We couldn&apos;t load the news feed right now.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </div>
        ) : null}

        {posts.length > 0 ? (
          <ul className="flex flex-col gap-6">
            {posts.map((post) => (
              <li key={post.id}>
                <CivicFeedPostCard post={post} />
              </li>
            ))}
          </ul>
        ) : !error ? (
          <p className="text-center text-muted-foreground">
            No stories available yet. Try again shortly.
          </p>
        ) : null}

        {posts.length > 0 && <FeedChatbot posts={posts} />}

        <p className="mt-10 text-center text-[11px] leading-relaxed text-muted-foreground">
          Stories merge several Ghana-focused RSS feeds (including Google News
          and major local outlets). Images come from the article when the feed
          provides one; otherwise we show a thematic placeholder. AI summaries use
          your Anthropic key when set — always read the original outlet. Last
          cache refresh:{" "}
          <time dateTime={fetchedAt.toISOString()}>
            {fetchedAt.toLocaleString("en-GH", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </time>
          .
        </p>
      </div>
    </div>
  );
}

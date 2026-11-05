import { getCollection } from 'astro:content';

export async function GET(context) {
  const site = context.site?.href.replace(/\/$/, '') ?? '';

  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const urls = [
    { loc: `${site}/`, lastmod: posts[0]?.data.date.toISOString() },
    { loc: `${site}/about/` },
    { loc: `${site}/tags/` },
    ...posts.map((post) => ({
      loc: `${site}/posts/${post.id}/`,
      lastmod: post.data.date.toISOString(),
    })),
    ...[...new Set(posts.flatMap((p) => p.data.tags))].map((tag) => ({
      loc: `${site}/tags/${encodeURIComponent(tag)}/`,
    })),
  ];

  const body = urls
    .map(
      (u) =>
        `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod.slice(0, 10)}</lastmod>` : ''}</url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

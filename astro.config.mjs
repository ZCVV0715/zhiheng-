import { defineConfig } from 'astro/config';

// 部署到 Cloudflare Pages 时，把 site 改成你的正式域名
export default defineConfig({
  site: 'https://zhiheng.cc.cd',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});

# config2ts demo site

Vue3 + Vite 展示站：把 `fixtures/` 里与单元测试共用的 `(源表, expected.ts)` 数据
渲染为「输入 → 输出」对照页面。数据经 `import.meta.glob(..., { query: "?raw" })`
直接读取仓库根的 `fixtures/`，无拷贝、无代码生成——golden 测试通过的内容就是
页面展示的内容。

- 开发：`npm run dev`（根目录也可 `npm run demo:dev`）
- 构建：`npm run build`，产物输出到 `../docs/app/`（GitHub Pages 子路径
  `/config2ts/app/`，见 `vite.config.ts` 的 `base`）
- dev server 通过 `server.fs.allow` 允许读取 website/ 之外的 fixtures 目录

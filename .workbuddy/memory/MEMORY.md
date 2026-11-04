# config2ts 项目长期记忆

## 项目约定
- Git：先追加 `.workbuddy/memory` → add → commit；仅 commit 不 push，发布由用户手动推送。
- `docs/` 是 GitHub Pages 根（index.md / index-zh.md），只放构建产物，不放源码。

## 通用能力扩展方案（2026-11-04 归档，详见 2026-11-04.md）
- 核心思路：**fixtures 单一事实来源**——本地预生成测试数据，同一份同时用于单元测试（golden file + tsc 校验）和 Vue 静态 demo 展示。
- 结构：`fixtures/<NN-feature>/{input.csv, expected.ts}`；`npm run fixtures:regen` 再生 + 人工 review；测试可私有、demo 只共享子集。
- 后续：`website/` Vue3+Vite 静态 demo（`?raw` 读 fixture），产物进 `docs/app/`（base `/config2ts/app/`）；P0 core/node 拆分（纯函数 core 零 fs）可后置。
- 工具事实：`startConvert` 非递归扫描 `-d` 目录；`pascalCase("x-y.csv")` → `XYCsv` 命名；Template override 值用逗号分隔，长文本不能走 override。

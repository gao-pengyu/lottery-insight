# docs/AGENTS.md - 文档目录导航

## 1. 文档分层

| 目录 | 类型 | 说明 |
|---|---|---|
| `docs/product/` | 产品文档 | PRD、范围、用户场景、版本规划 |
| `docs/technical/` | 技术文档 | 技术方案、当前实现、架构细节 |
| `docs/operations/` | 运维文档 | 启动、刷新、排障、部署建议 |
| `docs/specs/` | 实现规格 | 模块级行为规格，便于 智能体 修改代码前确认边界 |
| `docs/rules/` | 规则 | 合规、工程、智能体 规则 |
| `docs/superpowers/` | 执行计划 | 历史实现计划和后续计划 |

## 2. 文档索引

| 文档 | 用途 |
|---|---|
| `product/PRD.md` | 完整产品需求 |
| `technical/TECHNICAL_DESIGN.md` | 原技术方案 |
| `technical/CURRENT_IMPLEMENTATION.md` | 当前 最小可用版本 实现与原方案差异 |
| `operations/RUNBOOK.md` | 本地运维和排障 |
| `operations/DEPLOYMENT.md` | 生产化部署建议 |
| `specs/最小可用版本_SPEC.md` | 最小可用版本 功能验收规格 |
| `specs/DATA_REFRESH_SPEC.md` | 数据刷新规格 |
| `specs/ANALYSIS_SPEC.md` | 数据分析规格 |
| `specs/PREDICTION_SPEC.md` | 号码生成规格 |
| `rules/COMPLIANCE.md` | 彩票业务合规规则 |
| `rules/ENGINEERING.md` | 工程开发规则 |
| `rules/AI_AGENT_RULES.md` | 智能体 操作规则 |

## 3. 更新要求

- 改产品范围时，同步更新 `product/PRD.md` 和 `specs/最小可用版本_SPEC.md`。
- 改技术架构时，同步更新 `ARCHITECTURE.md` 和 `technical/CURRENT_IMPLEMENTATION.md`。
- 改命令、端口、数据刷新方式时，同步更新 `README.md` 和 `operations/RUNBOOK.md`。
- 改合规边界时，同步更新 `rules/COMPLIANCE.md`、`AGENTS.md` 和页面免责声明。

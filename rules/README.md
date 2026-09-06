# rules/README.md

本目录是给 AI/IDE/智能体 工具快速读取的规则入口。完整规则在 `docs/rules/`。

## 必读规则

- `docs/rules/COMPLIANCE.md`：彩票业务合规红线。
- `docs/rules/ENGINEERING.md`：工程修改和验证规则。
- `docs/rules/AI_AGENT_RULES.md`：智能体 工作流程规则。

## 最重要的约束

1. 不做售彩、支付、代购、合买、跟单。
2. 预测只允许作为娱乐性规则生成。
3. 修改核心逻辑必须补测试并运行 `npm test`。
4. 完成前运行 `npm run build`。

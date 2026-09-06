# 号码生成规格

## 1. 定位

号码生成是娱乐性工具，不是真实预测，不构成购彩建议。

## 2. 文件

实现文件：`src/lib/prediction.ts`

测试文件：`src/__tests__/prediction.test.ts`

前端页面：`src/app/ssq/predict/page.tsx`

客户端组件：`src/components/PredictionForm.tsx`

API：`src/app/api/predictions/ssq/generate/route.ts`

## 3. 支持模式

| mode | 说明 |
|---|---|
| `random` | 随机均衡 |
| `hot` | 热号优先 |
| `cold` | 冷号回补 |
| `mixed` | 综合频率、遗漏、形态 |
| `custom` | 支持必选、排除、和值、比例等约束 |

## 4. 输出要求

每组结果必须包含：

- 6 个红球
- 1 个蓝球
- 分数
- 和值
- 奇偶比
- 大小比
- 区间比
- 是否连号
- 解释文案

解释文案必须包含“仅供娱乐”或同等含义。

## 5. 约束规则

- 红球不能重复。
- 红球范围 1-33。
- 蓝球范围 1-16。
- 必选号码必须出现在结果中。
- 排除号码不得出现在结果中。
- 如果约束过强，应返回明确错误，而不是死循环。

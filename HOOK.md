---
name: serverchan
description: 当任务结束时自动提取并推送 <summary> 标签内的内容到微信。
homepage: https://sct.ftqq.com/
metadata:
  {
    "openclaw":
      {
        "emoji": "🔔",
        "events": ["message:received"],
        "requires":
          { "bins": ["node"], "env": ["SERVERCHAN_SENDKEY"] },
        "primaryEnv": [ "SERVERCHAN_SENDKEY" ],
        "install": [
          {
            "id": "node-types",
            "kind": "npm",
            "package": "@types/node",
            "label": "安装 Node 类型定义",
          }
        ],
      },
  }
---

# WeChat Summary Notification Hook

这个 Hook 采用了 OpenClaw 标准的 `HookHandler` 结构，运行效率高且逻辑确定。

## 工作流
1. **监听**：实时监控 Agent 的所有回复。
2. **过滤**：仅当检测到文本中包含 `<summary>...</summary>` 标签时才触发。
3. **推送**：通过 Server酱 将标签内的精简总结发送到用户的微信。

## 配置要求
必须在系统中配置环境变量 `SERVERCHAN_SENDKEY`。 这是 Server酱 的发送密钥，用于认证和推送消息。
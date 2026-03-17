---
name: serverchan
description: 通过 Server酱向用户的微信发送实时的消息推送。
metadata:
  {
    "openclaw":
      {
        "emoji": "🔔",
        "events": ["message"],
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

# WeChat Push Notification Skill (via ServerChan)

这个技能允许你（AI 助手）通过本地的 Python 脚本，直接将重要信息、任务结果或系统警告推送到用户的**微信**上。

## 什么时候使用该技能 (When to use)
- 当用户明确指示“发到我的微信上”、“推送到微信”、“用 Server酱通知我”时。
- 当你完成了一项耗时较长的后台任务，需要主动在微信上提醒用户。

## 如何使用 (How to use)

在这个技能的同级目录下有一个名为 `sc_send.py` 的 Python 脚本，通过终端执行工具（exec tool）运行。

### 参数说明

| 参数 | 必填 | 限制 | 说明 |
|------|------|------|------|
| `-t` / `--title` | ✅ 必填 | 最大 32 字符 | 消息标题 |
| `-d` / `--desp` | 选填 | 最大 32KB | 消息正文，支持 Markdown |
| `-s` / `--short` | 选填 | 最大 64 字符 | 微信卡片预览文字，不填则自动从 `desp` 截取 |
| `--noip` | 选填 | flag | 隐藏推送记录中的调用方 IP |
| `-k` / `--key` | 选填 | — | Server酱秘钥，默认读取环境变量 `SERVERCHAN_SENDKEY` |

### 示例

**仅发送标题：**

```bash
python ~/.openclaw/skills/serverchan/sc_send.py -t "任务已完成"
```

**发送标题与 Markdown 正文：**

```bash
python ~/.openclaw/skills/serverchan/sc_send.py \
  -t "数据分析已完成" \
  -d "## 结果汇总\n\n- 总计：100 条\n- 异常：3 条"
```

**自定义卡片预览文字：**

```bash
python ~/.openclaw/skills/serverchan/sc_send.py \
  -t "部署完成" \
  -d "详细部署日志..." \
  -s "生产环境已成功部署 v2.1.0"
```

**隐藏调用 IP：**

```bash
python ~/.openclaw/skills/serverchan/sc_send.py \
  -t "告警通知" \
  -d "磁盘使用率超过 90%" \
  --noip
```
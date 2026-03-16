---
name: wechat_notification_serverchan
description: 通过 Server酱 (ServerChan) 向用户的【微信】发送实时的消息推送。
---

# WeChat Push Notification Skill (via ServerChan)

这个技能允许你（AI 助手）通过本地的 Python 脚本，直接将重要信息、任务结果或系统警告推送到用户的**微信**上。

## 什么时候使用该技能 (When to use)
- 当用户明确指示“发到我的微信上”、“推送到微信”、“用 Server酱通知我”时。
- 当你完成了一项耗时较长的后台任务，需要主动在微信上提醒用户。

## 如何使用 (How to use)
在这个技能的同级目录下有一个名为 `sc_send.py` 的 Python 脚本。
你需要使用终端执行工具（exec tool）来运行这个脚本。

### 参数说明 (Arguments)
- `-t` 或 `--title`: 微信推送的主标题（必填，建议简短）。
- `-d` 或 `--desp`: 详细的补充说明（选填，支持 Markdown）。
- `-k` 或 `--key`: Server酱的秘钥。**（非必填：宿主系统已默认配置环境变量，你通常不需要传入此参数）**

### 执行命令示例：
```bash
python ~/.openclaw/skills/serverchan/sc_send.py -t "微信提醒：数据分析已完成" -d "以下是详细的数据汇总分析结果..."
# openclaw 微信推送

> 基于 [Server 酱](https://sct.ftqq.com) 实现的 openclaw 微信推送插件，可将 Agent 任务结果自动推送到你的微信。

---

## 工作原理

### Hook 方式

openclaw 在 Agent 完成任务后会触发 `message:received` 生命周期事件。本插件注册为一个 Hook，监听 Agent 回复中的 `<title>` 和 `<summary>` 标签，提取内容后调用 Server 酱 API 推送到微信。

### Skill 方式

将本插件作为 Skill 集成后，Agent 可能会在合适的时候主动调用推送功能，将指定标题和内容发送到微信。

---

## 快速开始

### 第一步：配置 SCKEY

前往 [Server 酱官方文档](https://sct.ftqq.com/sendkey) 获取你的 SCKEY，然后将其写入环境变量：

```bash
echo 'export SERVERCHAN_SCKEY=你的SCKEY' >> ~/.bashrc
source ~/.bashrc
```

---

### 方式一：Hook 方式（推荐）

**1. 配置 Agent 总结规则**

将以下内容添加到 Agent 的 `SOUL.md` 文件中，使 Agent 在任务结束时输出结构化摘要：

```markdown
## 总结规则

任务完成后，请在回复末尾用标签封装摘要，格式如下：

- `<title>简短标题</title>`（纯文本）
- `<summary>任务总结内容</summary>`（支持 Markdown）
```

**2. 安装 Hook**

将本项目复制到 openclaw 的 hooks 目录下：

```bash
cp -r serverchan ~/.openclaw/hooks/
```

> 默认 hooks 路径：`~/.openclaw/hooks`

**3. 启用 Hook**

```bash
# 验证 hook 已被发现
openclaw hooks serverchan

# 启用它
openclaw hooks enable serverchan
```

**4. 重启 Gateway**

- **macOS**：重启菜单栏中的 openclaw 应用
- **其他平台**：重启你的 openclaw 开发进程

**5. 触发测试**

通过你的消息渠道发送 `/new`，完成一次任务后即可收到微信推送。

---

### 方式二：Skill 方式

将本项目复制到 Agent 的 skills 目录下，Agent 即可将推送功能作为工具主动调用：

```bash
cp -r serverchan ~/.openclaw/skills/
```

> 默认 skills 路径：`~/.openclaw/skills`

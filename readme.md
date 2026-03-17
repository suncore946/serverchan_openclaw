# openclaw 微信推送

> 基于 [Server 酱](https://sct.ftqq.com) 实现的 openclaw 微信推送插件，可将 Agent 任务结果自动推送到你的微信。

---

## 工作原理

### Skill 方式（推荐）

将本插件作为 Skill 集成后，Agent 会在合适时机主动调用 `sc_send.py` 脚本，通过 [Server 酱 API](https://sctapi.ftqq.com) 将指定标题和内容推送到微信。Agent 可自由控制推送时机、标题与正文，灵活性更高。

### Hook 方式

openclaw 在 Agent 完成任务后触发 `message:received` 生命周期事件。Hook 会监听 Agent 回复中的 `<title>` 和 `<summary>` 标签并自动推送，无需 Agent 主动调用，但依赖结构化输出格式。

---

## 快速开始

### 第一步：配置 SendKey

前往 [Server 酱 SendKey 页面](https://sct.ftqq.com/sendkey) 获取你的 SendKey，然后写入环境变量：

```bash
echo 'export SERVERCHAN_SENDKEY=你的SendKey' >> ~/.bashrc
source ~/.bashrc
```

---

### 方式一：Skill 方式（推荐）

将本项目复制到 Agent 的 skills 目录下：

```bash
cp -r serverchan ~/.openclaw/skills/
```

> 默认 skills 路径：`~/.openclaw/skills`

安装完成后，Agent 即可主动调用推送脚本。你也可以在对话中直接说「把结果推送到我的微信」来触发推送。

推送脚本的详细参数说明见 [SKILL.md](./SKILL.md)。

---

### 方式二：Hook 方式

**1. 配置 Agent 总结规则**

将以下内容添加到 Agent 的 `SOUL.md` 文件中，使 Agent 在任务结束时输出结构化摘要：

```markdown
## 总结规则

任务完成后，请在回复末尾用标签封装摘要，格式如下：

- `<title>简短标题</title>`（纯文本）
- `<summary>任务总结内容</summary>`（支持 Markdown）
```

**2. 安装 Hook**

```bash
cp -r serverchan ~/.openclaw/hooks/
```

> 默认 hooks 路径：`~/.openclaw/hooks`

**3. 启用 Hook**

```bash
openclaw hooks list
openclaw hooks enable serverchan
```

**4. 重启 Gateway**

- **macOS**：重启菜单栏中的 openclaw 应用
- **其他平台**：重启你的 openclaw 开发进程

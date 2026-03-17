declare const process: any;

/**
 * 判断是否为机器人发出的消息事件
 */
const isMessageSentEvent = (event: { type: string; action: string }) =>
  event.type === "message" && event.action === "sent";

/**
 * [最佳实践] 异步推送函数，增加 title 参数
 */
const pushToServerChan = async (title: string, desp: string, sendkey: string) => {
  let url = '';
  if (sendkey.startsWith('sctp')) {
    const match = sendkey.match(/^sctp(\d+)t/);
    if (match && match[1]) {
      url = `https://${match[1]}.push.ft07.com/send/${sendkey}.send`;
    }
  } else {
    url = `https://sctapi.ftqq.com/${sendkey}.send`;
  }

  if (!url) return;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        title: title, // 使用动态捕获的标题
        desp: desp    // 使用动态捕获的总结
      })
    });

    const result: any = await response.json();
    if (result.code === 0 || result.data?.errno === 0) {
      console.log(`[WeChat Hook] 推送成功: ${title}`);
    } else {
      console.error('[WeChat Hook] ServerChan 报错:', result);
    }
  } catch (err) {
    console.error("[WeChat Hook] 推送失败:", err instanceof Error ? err.message : String(err));
  }
};

const handler = async (event: any) => {
  // 1. 基础过滤
  if (!event || typeof event !== 'object') return;

  // [最佳实践] 尽早过滤非发送事件
  if (!isMessageSentEvent(event as { type: string; action: string })) {
    return;
  }

  const messageText = event.context?.content || "";

  // 2. 捕获 <summary> (核心内容)
  const summaryMatch = messageText.match(/<summary>([\s\S]*?)<\/summary>/i);
  if (!summaryMatch) {
    return; // 没有总结内容，不触发推送
  }
  const cleanSummary = summaryMatch[1].trim();

  // 3. 捕获 <title> (可选标题)
  const titleMatch = messageText.match(/<title>([\s\S]*?)<\/title>/i);
  const finalTitle = titleMatch ? titleMatch[1].trim() : 'OpenClaw 任务执行完成';

  // 4. 环境校验
  const sendkey = process?.env?.SERVERCHAN_SENDKEY;
  if (!sendkey) {
    console.warn('[WeChat Hook] SERVERCHAN_SENDKEY 未配置。');
    return;
  }

  console.log(`[WeChat Hook] 检测到任务总结，准备异步推送...`);

  // [最佳实践] 保持处理器快速：使用 void 触发异步，不阻塞主流程
  void pushToServerChan(finalTitle, cleanSummary, sendkey);
};

export default handler;
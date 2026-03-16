/**
 * WeChat Notification Hook for OpenClaw (JavaScript Version)
 * 功能：捕获 <wechat_title> 和 <summary> 并推送到 ServerChan
 */

// 辅助函数：判断是否为机器人发出的消息
const isMessageSentEvent = (event) => 
  event?.type === "message" && event?.action === "sent";

/**
 * [最佳实践] 异步推送逻辑
 * 封装在独立函数中，方便主流程实现“火后即焚”
 */
async function pushToServerChan(title, desp, sendkey) {
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
      body: JSON.stringify({ title, desp })
    });

    const result = await response.json();
    if (result.code === 0 || result.data?.errno === 0) {
      console.log(`[WeChat Hook] 微信异步推送成功: ${title}`);
    } else {
      console.error('[WeChat Hook] ServerChan 返回错误:', result);
    }
  } catch (err) {
    // [最佳实践] 优雅处理错误，不中断网关运行
    console.error("[WeChat Hook] 网络请求异常:", err.message || String(err));
  }
}

/**
 * 主处理器
 */
const handler = async (event) => {
  // 1. [最佳实践] 尽早过滤无关事件
  if (!isMessageSentEvent(event)) {
    return;
  }

  const messageText = event.context?.content || "";

  // 2. 捕获 <summary> (核心内容，必选)
  const summaryMatch = messageText.match(/<summary>([\s\S]*?)<\/summary>/i);
  if (!summaryMatch) {
    return; // 没有总结标签，静默退出
  }
  const cleanSummary = summaryMatch[1].trim();

  // 3. 捕获 <wechat_title> (标题，可选)
  const titleMatch = messageText.match(/<title>([\s\S]*?)<\/title>/i);
  const finalTitle = titleMatch ? titleMatch[1].trim() : 'OpenClaw 任务执行完成';

  // 4. 读取环境变量
  const sendkey = process.env.SERVERCHAN_SENDKEY;
  if (!sendkey) {
    console.warn('[WeChat Hook] 警告: SERVERCHAN_SENDKEY 未在环境变量中配置。');
    return;
  }

  console.log(`[WeChat Hook] 发现总结内容，正在触发后台推送...`);

  // 5. [最佳实践] 保持处理器快速
  // 调用异步函数但不使用 await，从而不阻塞网关发送下一条消息
  pushToServerChan(finalTitle, cleanSummary, sendkey);
};

export default handler;
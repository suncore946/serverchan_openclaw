// test-local.js
import handler from './handler.ts'; // 确保你的 handler.ts 已编译为 .js 或直接运行 ts-node

// 1. 模拟 OpenClaw 的 message:sent 事件对象
const mockEvent = {
  type: 'message',
  action: 'sent', 
  context: {
    content: "这是一段模拟的机器人回复内容。\n<summary>恭喜！你的小龙虾 Hook 逻辑已经跑通了！</summary>\n请查收微信。",
    from: "Assistant",
    channelId: "manual-test"
  }
};

// 从环境变量读取（运行前请设置：export SERVERCHAN_SENDKEY=你的key）
async function runTest() {
  console.log("-----------------------------------------");
  console.log("🚀 开始执行 Hook 逻辑测试...");
  
  try {
    // 调用你写的 handler
    await handler(mockEvent);
    
    console.log("-----------------------------------------");
    console.log("💡 测试指令已发出，请观察上方是否有报错或成功日志。");
    console.log("注意：如果使用了异步 void 推送，‘成功’日志可能会在几秒后才弹出。");
  } catch (err) {
    console.error("❌ 测试运行过程崩溃:", err);
  }
}

runTest();
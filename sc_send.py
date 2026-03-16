import os
import sys
import requests
import re
import argparse

def sc_send(sendkey, title, desp='', options=None):
    if options is None:
        options = {}
    # 判断 sendkey 是否以 'sctp' 开头，并提取数字构造 URL
    if sendkey.startswith('sctp'):
        match = re.match(r'sctp(\d+)t', sendkey)
        if match:
            num = match.group(1)
            url = f'https://{num}.push.ft07.com/send/{sendkey}.send'
        else:
            raise ValueError('Invalid sendkey format for sctp')
    else:
        url = f'https://sctapi.ftqq.com/{sendkey}.send'
    
    params = {
        'title': title,
        'desp': desp,
        **options
    }
    headers = {
        'Content-Type': 'application/json;charset=utf-8'
    }
    response = requests.post(url, json=params, headers=headers)
    return response.json()

if __name__ == '__main__':
    # 使用 argparse 处理参数，支持指定参数和环境变量兜底
    parser = argparse.ArgumentParser(description="向微信发送 Server酱 推送通知")
    parser.add_argument('-k', '--key', type=str, default=os.environ.get('SERVERCHAN_SENDKEY'), 
                        help="Server酱秘钥。如果不传，默认读取环境变量 SERVERCHAN_SENDKEY")
    parser.add_argument('-t', '--title', type=str, required=True, 
                        help="微信推送的主标题 (必填)")
    parser.add_argument('-d', '--desp', type=str, default="此消息由 AI 助手发送", 
                        help="微信推送的详细内容 (选填，支持 Markdown)")
    
    args = parser.parse_args()

    # 最终校验秘钥是否存在
    if not args.key:
        print("Error: 缺少 SENDKEY。请通过 -k 参数传入，或在系统中设置 SERVERCHAN_SENDKEY 环境变量。")
        sys.exit(1)

    try:
        ret = sc_send(args.key, args.title, args.desp)
        print("ServerChan WeChat Push Response:", ret)
    except Exception as e:
        print(f"Error during push: {e}")
        sys.exit(1)
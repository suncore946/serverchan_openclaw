import os
import sys
import requests
import re
import argparse

def sc_send(sendkey, title, desp='', short='', noip=0):
    if len(title) > 32:
        raise ValueError(f'title 最大长度为 32，当前长度为 {len(title)}')
    if len(desp.encode('utf-8')) > 32 * 1024:
        raise ValueError('desp 最大长度为 32KB')
    if short and len(short) > 64:
        raise ValueError(f'short 最大长度为 64，当前长度为 {len(short)}')

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

    params = {'title': title}
    if desp:
        params['desp'] = desp
    if short:
        params['short'] = short
    if noip:
        params['noip'] = 1

    headers = {'Content-Type': 'application/json;charset=utf-8'}
    response = requests.post(url, json=params, headers=headers)
    return response.json()

if __name__ == '__main__':
    # 使用 argparse 处理参数，支持指定参数和环境变量兜底
    parser = argparse.ArgumentParser(description="向微信发送 Server酱 推送通知")
    parser.add_argument('-k', '--key', type=str, default=os.environ.get('SERVERCHAN_SENDKEY'),
                        help="Server酱秘钥。如果不传，默认读取环境变量 SERVERCHAN_SENDKEY")
    parser.add_argument('-t', '--title', type=str, required=True,
                        help="消息标题，必填，最大长度 32")
    parser.add_argument('-d', '--desp', type=str, default='',
                        help="消息内容，选填，支持 Markdown，最大 32KB")
    parser.add_argument('-s', '--short', type=str, default='',
                        help="消息卡片内容，选填，最大长度 64。不填则自动从 desp 截取")
    parser.add_argument('--noip', action='store_true',
                        help="隐藏调用 IP")

    args = parser.parse_args()

    # 最终校验秘钥是否存在
    if not args.key:
        print("Error: 缺少 SENDKEY。请通过 -k 参数传入，或在系统中设置 SERVERCHAN_SENDKEY 环境变量。")
        sys.exit(1)

    try:
        ret = sc_send(args.key, args.title, args.desp, args.short, int(args.noip))
        print("ServerChan WeChat Push Response:", ret)
    except Exception as e:
        print(f"Error during push: {e}")
        sys.exit(1)
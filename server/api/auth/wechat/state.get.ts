import { createWechatLoginState } from '../../../utils/wechat-oauth'

/**
 * 前端在渲染微信二维码之前调用，返回一次性签名 state。
 */
export default defineEventHandler(() => {
  return { state: createWechatLoginState() }
})

import { clearAppSession } from '../../utils/session'

export default defineEventHandler(async (event) => {
  await clearAppSession(event)
  return { ok: true }
})

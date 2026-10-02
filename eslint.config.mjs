// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Local agent worktrees are separate checkouts, not project source.
  { ignores: ['.kilo/**', 'server/db/migrations/**'] }
)

import { describe, expect, test } from 'bun:test'
import { getContextWindowForModel, getModelMaxOutputTokens } from './context.js'
import {
  KIMI_K2_6_MODEL,
  NCODE_MANAGED_MODEL_MAX_PROMPT_TOKENS,
  NCODE_MANAGED_MODEL_MAX_SEQUENCE_TOKENS,
  NCODE_MANAGED_MODEL_MAX_TOKENS,
} from './model/ncodeModels.js'

describe('NCode managed model token contracts', () => {
  test.each([
    ['k2.6 alias', 'k2.6'],
    ['k2.6 model', KIMI_K2_6_MODEL],
  ])('%s uses the managed prompt and sequence token contract', (_label, model) => {
    expect(getContextWindowForModel(model)).toBe(
      NCODE_MANAGED_MODEL_MAX_PROMPT_TOKENS,
    )
    expect(NCODE_MANAGED_MODEL_MAX_SEQUENCE_TOKENS).toBe(256_000)
    expect(getModelMaxOutputTokens(model)).toEqual({
      default: NCODE_MANAGED_MODEL_MAX_TOKENS,
      upperLimit: NCODE_MANAGED_MODEL_MAX_TOKENS,
    })
  })
})

export type ContentPackId = 0 | 1 | 2 | 3
export type EffectPolarityId = 0 | 1
export type RecipeNatureId = 0 | 1 | 2

export type IngredientRecord = readonly [name: string, contentPackId: ContentPackId]
export type EffectRecord = readonly [name: string, polarityId: EffectPolarityId]
export type RecipeRecord = readonly [
  ingredientIds: readonly number[],
  effectIds: readonly number[],
  natureId: RecipeNatureId,
]

export interface RecipeDataset {
  schemaVersion: 1
  ingredients: readonly IngredientRecord[]
  effects: readonly EffectRecord[]
  recipes: readonly RecipeRecord[]
}

export const contentPackNames = [
  'Base Skyrim',
  'Dragonborn',
  'Dawnguard',
  'Hearthfire',
] as const

export const contentPackIds = [0, 1, 2, 3] as const

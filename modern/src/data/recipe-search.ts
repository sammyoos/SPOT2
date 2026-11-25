import type {
  ContentPackId,
  RecipeDataset,
} from './recipe-data'

export type IngredientCountFilter = 'any' | 2 | 3
export type EffectCountFilter = 'any' | 1 | 2 | 3 | 4 | 5
export type RecipeNatureFilter = 'any' | 'positive' | 'negative'

export const RECIPE_PAGE_SIZE = 50

export interface RecipeSearchOptions {
  enabledContentPacks: ReadonlySet<ContentPackId>
  selectedIngredientIds: ReadonlySet<number>
  selectedEffectIds: ReadonlySet<number>
  ingredientCount: IngredientCountFilter
  effectCount: EffectCountFilter
  nature: RecipeNatureFilter
}

export interface RecipeSearchResult {
  recipeIds: number[]
  availableIngredientIds: Set<number>
  availableEffectIds: Set<number>
}

export function searchRecipes(
  dataset: RecipeDataset,
  options: RecipeSearchOptions,
): RecipeSearchResult {
  const recipeIds: number[] = []
  const availableIngredientIds = new Set<number>()
  const availableEffectIds = new Set<number>()

  for (let recipeId = 0; recipeId < dataset.recipes.length; recipeId += 1) {
    const [ingredientIds, effectIds, natureId] = dataset.recipes[recipeId]

    if (
      !ingredientIds.every((id) =>
        options.enabledContentPacks.has(dataset.ingredients[id][1]),
      )
    ) {
      continue
    }

    if (
      options.ingredientCount !== 'any'
      && ingredientIds.length !== options.ingredientCount
    ) {
      continue
    }

    if (
      options.effectCount !== 'any'
      && effectIds.length !== options.effectCount
    ) {
      continue
    }

    if (
      options.nature === 'positive' && natureId !== 0
      || options.nature === 'negative' && natureId !== 1
    ) {
      continue
    }

    if (
      ![...options.selectedIngredientIds].every((id) =>
        ingredientIds.includes(id),
      )
      || ![...options.selectedEffectIds].every((id) =>
        effectIds.includes(id),
      )
    ) {
      continue
    }

    recipeIds.push(recipeId)
    ingredientIds.forEach((id) => availableIngredientIds.add(id))
    effectIds.forEach((id) => availableEffectIds.add(id))
  }

  return {
    recipeIds,
    availableIngredientIds,
    availableEffectIds,
  }
}

export function getRecipePage(recipeIds: readonly number[], page: number): number[] {
  const start = (page - 1) * RECIPE_PAGE_SIZE
  return recipeIds.slice(start, start + RECIPE_PAGE_SIZE)
}

export const recipeNatureLabels: readonly [
  'Positive',
  'Negative',
  'Mixed',
] = ['Positive', 'Negative', 'Mixed']

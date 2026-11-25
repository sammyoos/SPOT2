import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const legacyIndexPath = new URL('../../data/index_big.js', import.meta.url)
const outputPath = new URL('../public/data/recipes.json', import.meta.url)
const expectedCounts = {
  ingredients: 113,
  effects: 55,
  recipes: 36_731,
  twoIngredientRecipes: 1_814,
  threeIngredientRecipes: 34_917,
}

const source = await readFile(legacyIndexPath, 'utf8')
const match = source.match(
  /sns\.index\s*=\s*([\s\S]*?)\s*;\s*\n}\( window\.sns/,
)
assert.ok(match, 'Could not find the serialized legacy index')

const legacyIndex = JSON.parse(match[1])
assert.ok(Array.isArray(legacyIndex) && legacyIndex.length === 4)

const ingredientList = legacyIndex[0][1]
const effectList = legacyIndex[1][1]
const recipeList = legacyIndex[2][1]

assert.equal(ingredientList.length, expectedCounts.ingredients)
assert.equal(effectList.length, expectedCounts.effects)
assert.equal(recipeList.length, expectedCounts.recipes)

const ingredients = ingredientList.map(([name, , , , contentPack]) => {
  assert.equal(typeof name, 'string')
  assert.ok(Number.isInteger(contentPack) && contentPack >= 0 && contentPack < 4)
  return [name, contentPack]
})

const effects = effectList.map(([name, nature]) => {
  assert.equal(typeof name, 'string')
  assert.ok(nature === 0 || nature === 1)
  return [name, nature]
})

let twoIngredientRecipes = 0
let threeIngredientRecipes = 0
const recipes = recipeList.map(([ingredientIds, effectIds, nature]) => {
  assert.ok(ingredientIds.length === 2 || ingredientIds.length === 3)
  assert.ok(effectIds.length >= 1 && effectIds.length <= 5)
  assert.ok(nature === 0 || nature === 1 || nature === 2)
  assert.ok(
    ingredientIds.every((id) => Number.isInteger(id) && id >= 0 && id < ingredients.length),
  )
  assert.ok(
    effectIds.every((id) => Number.isInteger(id) && id >= 0 && id < effects.length),
  )

  if (ingredientIds.length === 2) twoIngredientRecipes += 1
  else threeIngredientRecipes += 1

  return [ingredientIds, effectIds, nature]
})

assert.equal(twoIngredientRecipes, expectedCounts.twoIngredientRecipes)
assert.equal(threeIngredientRecipes, expectedCounts.threeIngredientRecipes)

const payload = {
  schemaVersion: 1,
  ingredients,
  effects,
  recipes,
}
const outputDirectory = new URL('../public/data/', import.meta.url)
await mkdir(outputDirectory, { recursive: true })
await writeFile(outputPath, `${JSON.stringify(payload)}\n`)

console.info(
  `Prepared ${recipes.length.toLocaleString()} recipes at ${fileURLToPath(outputPath)}`,
)

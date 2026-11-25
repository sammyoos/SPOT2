import { useEffect, useMemo, useState } from 'react'
import './index.css'
import { loadRecipeDataset } from './data/recipe-data-loader'
import {
  contentPackIds,
  contentPackNames,
  type ContentPackId,
  type RecipeDataset,
} from './data/recipe-data'
import {
  getRecipePage,
  recipeNatureLabels,
  RECIPE_PAGE_SIZE,
  searchRecipes,
  type EffectCountFilter,
  type IngredientCountFilter,
  type RecipeNatureFilter,
} from './data/recipe-search'

interface SearchFilters {
  ingredientCount: IngredientCountFilter
  effectCount: EffectCountFilter
  nature: RecipeNatureFilter
}

const DEFAULT_FILTERS: SearchFilters = {
  ingredientCount: 'any',
  effectCount: 'any',
  nature: 'any',
}

function parseIngredientCount(value: string): IngredientCountFilter {
  if (value === '2') return 2
  if (value === '3') return 3
  return 'any'
}

function parseEffectCount(value: string): EffectCountFilter {
  switch (value) {
    case '1':
      return 1
    case '2':
      return 2
    case '3':
      return 3
    case '4':
      return 4
    case '5':
      return 5
    default:
      return 'any'
  }
}

function App() {
  const [dataset, setDataset] = useState<RecipeDataset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadAttempt, setLoadAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    loadRecipeDataset(controller.signal)
      .then((loadedDataset) => {
        setDataset(loadedDataset)
        setLoading(false)
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return
        setError(
          cause instanceof Error ? cause.message : 'An unexpected error occurred.',
        )
        setLoading(false)
      })

    return () => controller.abort()
  }, [loadAttempt])

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Skyrim alchemy companion</p>
          <h1>Skyrim Potion Optimizer</h1>
        </div>
        <p className="header-note">
          Find ingredient combinations for the effects you need.
        </p>
      </header>

      {loading && (
        <section className="loading-panel" role="status">
          <span className="loading-indicator" aria-hidden="true" />
          <div>
            <h2>Preparing the alchemy table</h2>
            <p>Loading the ingredient and recipe index…</p>
          </div>
        </section>
      )}

      {error && (
        <section className="error-panel" role="alert">
          <div>
            <h2>Recipe data could not be loaded</h2>
            <p>{error}</p>
          </div>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              setError(null)
              setLoading(true)
              setLoadAttempt((attempt) => attempt + 1)
            }}
          >
            Try again
          </button>
        </section>
      )}

      {dataset && !loading && <RecipeExplorer dataset={dataset} />}
    </main>
  )
}

function RecipeExplorer({ dataset }: { dataset: RecipeDataset }) {
  const [enabledContentPacks, setEnabledContentPacks] = useState<
    Set<ContentPackId>
  >(() => new Set(contentPackIds))
  const [selectedIngredientIds, setSelectedIngredientIds] = useState(
    () => new Set<number>(),
  )
  const [selectedEffectIds, setSelectedEffectIds] = useState(
    () => new Set<number>(),
  )
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)

  const searchResult = useMemo(
    () =>
      searchRecipes(dataset, {
        enabledContentPacks,
        selectedIngredientIds,
        selectedEffectIds,
        ...filters,
      }),
    [
      dataset,
      enabledContentPacks,
      selectedIngredientIds,
      selectedEffectIds,
      filters,
    ],
  )

  function resetResultWindow() {
    setCurrentPage(1)
  }

  function toggleContentPack(id: ContentPackId, isEnabled: boolean) {
    setEnabledContentPacks((current) => {
      const next = new Set(current)
      if (isEnabled) next.add(id)
      else next.delete(id)
      return next
    })

    if (!isEnabled) {
      setSelectedIngredientIds((current) =>
        new Set(
          [...current].filter(
            (ingredientId) => dataset.ingredients[ingredientId][1] !== id,
          ),
        ),
      )
    }

    resetResultWindow()
  }

  function toggleIngredient(id: number) {
    setSelectedIngredientIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    resetResultWindow()
  }

  function toggleEffect(id: number) {
    setSelectedEffectIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    resetResultWindow()
  }

  function resetAll() {
    setEnabledContentPacks(new Set(contentPackIds))
    setSelectedIngredientIds(new Set())
    setSelectedEffectIds(new Set())
    setFilters(DEFAULT_FILTERS)
    resetResultWindow()
  }

  const ingredientOptions = dataset.ingredients.flatMap((ingredient, id) =>
    searchResult.availableIngredientIds.has(id) && !selectedIngredientIds.has(id)
      ? [{ entry: ingredient, id }]
      : [],
  )
  const effectOptions = dataset.effects.flatMap((effect, id) =>
    searchResult.availableEffectIds.has(id) && !selectedEffectIds.has(id)
      ? [{ entry: effect, id }]
      : [],
  )
  const resultCount = searchResult.recipeIds.length
  const pageCount = Math.max(1, Math.ceil(resultCount / RECIPE_PAGE_SIZE))
  const firstVisible = resultCount === 0
    ? 0
    : (currentPage - 1) * RECIPE_PAGE_SIZE + 1
  const lastVisible = Math.min(currentPage * RECIPE_PAGE_SIZE, resultCount)
  const visibleRecipeIds = getRecipePage(searchResult.recipeIds, currentPage)

  return (
    <div className="explorer-layout">
      <aside className="controls-panel" aria-label="Recipe search controls">
        <div className="panel-heading">
          <div>
            <h2>Build your search</h2>
            <p>Choose required ingredients or effects.</p>
          </div>
          <button
            className="button button-secondary reset-button"
            type="button"
            onClick={resetAll}
          >
            Reset
          </button>
        </div>

        <fieldset className="filter-group">
          <legend>Content packs</legend>
          <p className="field-help">Include ingredients from these packs.</p>
          <div className="pack-options">
            {contentPackIds.map((id) => (
              <label className="pack-option" key={id}>
                <input
                  type="checkbox"
                  checked={enabledContentPacks.has(id)}
                  onChange={(event) =>
                    toggleContentPack(id, event.currentTarget.checked)
                  }
                />
                <span>{contentPackNames[id]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="filter-selects">
          <label className="select-field">
            <span>Ingredient count</span>
            <select
              value={filters.ingredientCount}
              onChange={(event) => {
                const ingredientCount = parseIngredientCount(
                  event.currentTarget.value,
                )
                setFilters((current) => ({
                  ...current,
                  ingredientCount,
                }))
                resetResultWindow()
              }}
            >
              <option value="any">Any count</option>
              <option value="2">Two ingredients</option>
              <option value="3">Three ingredients</option>
            </select>
          </label>
          <label className="select-field">
            <span>Effect count</span>
            <select
              value={filters.effectCount}
              onChange={(event) => {
                const effectCount = parseEffectCount(event.currentTarget.value)
                setFilters((current) => ({
                  ...current,
                  effectCount,
                }))
                resetResultWindow()
              }}
            >
              <option value="any">Any count</option>
              <option value="1">One effect</option>
              <option value="2">Two effects</option>
              <option value="3">Three effects</option>
              <option value="4">Four effects</option>
              <option value="5">Five effects</option>
            </select>
          </label>
          <label className="select-field">
            <span>Effect nature</span>
            <select
              value={filters.nature}
              onChange={(event) => {
                const value = event.currentTarget.value
                const nature: RecipeNatureFilter =
                  value === 'positive' || value === 'negative' ? value : 'any'
                setFilters((current) => ({ ...current, nature }))
                resetResultWindow()
              }}
            >
              <option value="any">Any type</option>
              <option value="positive">Only positive</option>
              <option value="negative">Only negative</option>
            </select>
          </label>
        </div>

        <SelectionGroup
          title="Required ingredients"
          help="Every result must include all selected ingredients."
          selectedIds={selectedIngredientIds}
          entries={dataset.ingredients}
          availableOptions={ingredientOptions}
          onToggle={toggleIngredient}
        />
        <SelectionGroup
          title="Required effects"
          help="Every result must have all selected effects."
          selectedIds={selectedEffectIds}
          entries={dataset.effects}
          availableOptions={effectOptions}
          onToggle={toggleEffect}
        />
      </aside>

      <section className="results-panel" aria-labelledby="results-heading">
        <div className="results-heading">
          <div>
            <p className="eyebrow">Matching combinations</p>
            <h2 id="results-heading">Recipes</h2>
          </div>
          <p className="result-count" role="status">
            {resultCount === 0
              ? 'Showing 0 of 0 viable recipes'
              : `Showing ${firstVisible.toLocaleString()}–${lastVisible.toLocaleString()} of ${resultCount.toLocaleString()} viable recipes`}
          </p>
        </div>

        {resultCount === 0 ? (
          <div className="empty-state">
            <h3>No matching recipes</h3>
            <p>Remove a selection or adjust a filter to broaden your search.</p>
          </div>
        ) : (
          <>
            <ol className="recipe-list" id="recipe-results">
              {visibleRecipeIds.map((recipeId) => {
                const [ingredientIds, effectIds, natureId] =
                  dataset.recipes[recipeId]
                const nature = recipeNatureLabels[natureId]

                return (
                  <li className="recipe-card" key={recipeId}>
                    <p className="recipe-ingredients">
                      {ingredientIds
                        .map((id) => dataset.ingredients[id][0])
                        .join(' + ')}
                    </p>
                    <p className="recipe-effects">
                      {effectIds.map((id) => dataset.effects[id][0]).join(', ')}
                    </p>
                    <span className={`nature-badge nature-${nature.toLowerCase()}`}>
                      {nature} effects
                    </span>
                  </li>
                )
              })}
            </ol>
            {pageCount > 1 && (
              <nav className="pagination" aria-label="Recipe result pages">
                <button
                  className="button button-secondary"
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                >
                  Previous
                </button>
                <span aria-live="polite">
                  Page {currentPage.toLocaleString()} of {pageCount.toLocaleString()}
                </span>
                <button
                  className="button button-secondary"
                  type="button"
                  disabled={currentPage === pageCount}
                  onClick={() => setCurrentPage((page) => page + 1)}
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  )
}

interface SelectionGroupProps<Entry extends readonly [string, number]> {
  title: string
  help: string
  selectedIds: ReadonlySet<number>
  entries: readonly Entry[]
  availableOptions: readonly { entry: Entry; id: number }[]
  onToggle: (id: number) => void
}

function SelectionGroup<Entry extends readonly [string, number]>({
  title,
  help,
  selectedIds,
  entries,
  availableOptions,
  onToggle,
}: SelectionGroupProps<Entry>) {
  return (
    <fieldset className="selection-group">
      <legend>{title}</legend>
      <p className="field-help">{help}</p>
      {selectedIds.size > 0 && (
        <ul className="selected-list" aria-label={`Selected ${title.toLowerCase()}`}>
          {[...selectedIds].map((id) => (
            <li className="selected-chip" key={id}>
              <span>{entries[id][0]}</span>
              <button
                type="button"
                aria-label={`Remove ${entries[id][0]}`}
                onClick={() => onToggle(id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="choice-list">
        {availableOptions.map(({ entry, id }) => (
          <button
            className="choice-button"
            key={id}
            type="button"
            aria-pressed={selectedIds.has(id)}
            onClick={() => onToggle(id)}
          >
            {entry[0]}
          </button>
        ))}
        {availableOptions.length === 0 && (
          <p className="empty-options">
            {selectedIds.size > 0
              ? 'No other choices match the current search.'
              : 'No choices match the current filters.'}
          </p>
        )}
      </div>
    </fieldset>
  )
}

export default App

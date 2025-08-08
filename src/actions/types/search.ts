import { type getSearchResults } from '../search'

// ── Search result item shapes ────────────────────────────────────────────────
export type EchoResult = {
	id: string | number
	name: string // post title
	desc: string | null // post description
	username: string // author username
	type: 'echo'
}

export type UserResult = {
	id: string | number
	name: string // "Firstname Lastname"
	username: string
	desc: string | null
	type: 'user'
}

export type TagResult = {
	id: string | number
	name: string
	desc: string | null
	type: 'tag' // NOTE: using 'tag' to match the group key
}

// Union if you ever need a single-item type
export type SearchItem = EchoResult | UserResult | TagResult

// Grouped payload shape your function returns in `data`
export type GroupedSearchData = {
	echo: EchoResult[]
	user: UserResult[]
	tag: TagResult[]
}

// Full response envelope
export type GetSearchResultsResponse = {
	message: string
	success: boolean
	data?: GroupedSearchData
}

// If you want inference from the actual function:
export type SearchResultsType = Awaited<ReturnType<typeof getSearchResults>> // equals GetSearchResultsResponse
export type SearchResultsData = NonNullable<SearchResultsType['data']> // equals GroupedSearchData
export type AnySearchItem = SearchResultsData[keyof SearchResultsData][number] // union item

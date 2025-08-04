export type SearchTypes = 'ECHO' | 'USER' | 'TAG'
export interface GetAllEchoesProps {
	page?: number
	limit?: number
	userId?: string | null
	chamberId?: string
	tagId?: string
	type?: EchoTypes
}

export type EchoTypes = 'all' | 'hidden' | 'mine' | 'saved' | 'archived'

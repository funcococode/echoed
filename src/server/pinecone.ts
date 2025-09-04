import { Pinecone } from '@pinecone-database/pinecone'
import { env } from 'process'

export const pc = new Pinecone({
	apiKey: env.PINECONE_API_KEY ?? '',
})
export const PINECONE_INDEX_NAME = 'echo-embeddings'
// await pc.createIndexForModel({
// 	name: PINECONE_INDEX_NAME,
// 	cloud: 'aws',
// 	region: 'us-east-1',
// 	embed: {
// 		model: 'llama-text-embed-v2',
// 		fieldMap: { text: 'chunk_text' },
// 	},
// 	waitUntilReady: true,
// })

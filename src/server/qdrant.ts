import { QdrantClient } from '@qdrant/js-client-rest'

export const qdrantClient = new QdrantClient({
	url: 'https://047f6901-f8a1-4152-a21a-7cbc9c757a1e.us-east4-0.gcp.cloud.qdrant.io:6333',
	apiKey: process.env.QDRANT_API_KEY ?? '',
})

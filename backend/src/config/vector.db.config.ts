import { Pinecone } from '@pinecone-database/pinecone'
import { env } from './env.js';


const pinecone = new Pinecone({ apiKey: env.VECTOR_DB_API_KEY! });

export default pinecone;
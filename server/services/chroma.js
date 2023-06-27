import { Chroma } from 'langchain/vectorstores/chroma';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { TextLoader } from 'langchain/document_loaders/fs/text';

const loader = new TextLoader('../docs/example.txt');
const docs = await loader.load();

// Create vector store and index the docs
const vectorStore = await Chroma.fromDocuments(docs, new OpenAIEmbeddings(), {
  collectionName: 'a-test-collection',
});

// Search for the most similar document
const response = await vectorStore.similaritySearch('hello', 1);

console.log('response: ', response);

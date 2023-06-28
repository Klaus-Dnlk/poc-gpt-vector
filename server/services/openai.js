import path from 'path';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { RetrievalQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ContextualCompressionRetriever } from 'langchain/retrievers/contextual_compression';
import { LLMChainExtractor } from 'langchain/retrievers/document_compressors/chain_extract';
import { ConversationChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { ConversationSummaryMemory } from 'langchain/memory';
import { OpenAI } from 'langchain/llms/openai';
import { getFileLoader } from '../utils/documentLoader.js';

class OpenAiService {
  constructor() {
    this.model = new OpenAI({
      temperature: 0,
      verbose: true,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.prompt = PromptTemplate.fromTemplate(`
    Current conversation:
    Human: {input}
    AI:`);

    this.memory = new ConversationSummaryMemory({
      llm: this.model,
      returnMessages: true,
    });
    this.vectorStore = null;
    this.retriever = null;
    this.chain = null;
  }

  assembleChain() {
    if (this.chain)
      return { chain: this.chain, inputType: 'query', responseType: 'text' };

    const chain = new ConversationChain({
      memory: this.memory,
      prompt: this.prompt,
      llm: this.model,
    });
    return { chain, inputType: 'input', responseType: 'response' };
  }

  async ingestFile(data) {
    const { files } = data;
    const file = files['chat-file'];
    if (!file || !file.originalFilename) {
      throw new Error('Missing or invalid file');
    }
    const { originalFilename, filepath } = files['chat-file'];
    const fileExtension = path.extname(originalFilename);

    const loader = getFileLoader(fileExtension, filepath);
    if (!loader) {
      throw Error('bad');
    }

    const docs = await loader.load();

    const baseCompressor = LLMChainExtractor.fromLLM(this.model);
    this.vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings()
    );
    this.retriever = new ContextualCompressionRetriever({
      baseCompressor,
      baseRetriever: this.vectorStore.asRetriever(),
    });

    this.chain = RetrievalQAChain.fromLLM(this.model, this.retriever, {
      returnSourceDocuments: true,
    });
    return { success: true };
  }

  call = async userInput => {
    const { chain, inputType, responseType } = this.assembleChain();

    const { [responseType]: response } = await chain.call({
      [inputType]: userInput,
    });

    return { response };
  };
}

export { OpenAiService };

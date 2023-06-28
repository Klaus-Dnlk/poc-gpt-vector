import path from 'path';
import { HfInference } from '@huggingface/inference';
import { getFileLoader } from '../utils/documentLoader.js';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { RetrievalQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ContextualCompressionRetriever } from 'langchain/retrievers/contextual_compression';
import { LLMChainExtractor } from 'langchain/retrievers/document_compressors/chain_extract';

const { HUGGINGFACEHUB_API_KEY } = process.env;

class HuggingFaceService {
  constructor() {
    this.modelName = 'microsoft/DialoGPT-large';
    this.model = new HfInference(HUGGINGFACEHUB_API_KEY);
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

  async call(userInput) {
    // TO DO: pass in past_user_inputs for context
    const response = await this.model.conversational({
      model: this.modelName,
      temperature: 0,
      inputs: {
        text: userInput,
      },
    });

    return { response: response && response.generated_text };
  }
}

export { HuggingFaceService };

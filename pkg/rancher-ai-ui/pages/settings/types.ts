/* eslint-disable no-unused-vars */
export enum Settings {
  EMBEDDINGS_MODEL = 'EMBEDDINGS_MODEL',
  ENABLE_RAG = 'ENABLE_RAG',
  LANGFUSE_HOST = 'LANGFUSE_HOST',
  LANGFUSE_PUBLIC_KEY = 'LANGFUSE_PUBLIC_KEY',
  LANGFUSE_SECRET_KEY = 'LANGFUSE_SECRET_KEY',
  MODEL = 'MODEL',
  OLLAMA_MODEL = 'OLLAMA_MODEL',
  OPENAI_MODEL = 'OPENAI_MODEL',
  DEEPSEEK_API_KEY = 'DEEPSEEK_API_KEY',
  DEEPSEEK_MODEL = 'DEEPSEEK_MODEL',
  OLLAMA_URL = 'OLLAMA_URL',
  OPENAI_THIRD_PARTY_URL = 'OPENAI_URL',
  OPENAI_API_KEY = 'OPENAI_API_KEY',
  SYSTEM_PROMPT = 'SYSTEM_PROMPT',
  ACTIVE_CHATBOT = 'ACTIVE_LLM'
}

export interface FormData {
  [Settings.EMBEDDINGS_MODEL]?: string;
  [Settings.ENABLE_RAG]?: string;
  [Settings.LANGFUSE_HOST]?: string;
  [Settings.LANGFUSE_PUBLIC_KEY]?: string;
  [Settings.LANGFUSE_SECRET_KEY]?: string;
  [Settings.MODEL]?: string;
  [Settings.OLLAMA_MODEL]?: string;
  [Settings.OPENAI_MODEL]?: string;
  [Settings.DEEPSEEK_API_KEY]?: string;
  [Settings.DEEPSEEK_MODEL]?: string;
  [Settings.OLLAMA_URL]?: string;
  [Settings.OPENAI_THIRD_PARTY_URL]?: string;
  [Settings.OPENAI_API_KEY]?: string;
  [Settings.SYSTEM_PROMPT]?: string;
  [Settings.ACTIVE_CHATBOT]?: string;
}

export interface Workload {
  nameDisplay: string;
  type: string;
  schema?: any;
  spec: {
    template: {
      metadata?: {
        annotations?: Record<string, string>;
      };
    };
  };
  save: () => Promise<void>;
}

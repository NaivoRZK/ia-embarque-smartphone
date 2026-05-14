export const MODEL_FILENAME = 'qwen2.5-0.5b-instruct-q4_k_m.gguf';
export const MODEL_URL =
  'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf';
export const MODEL_ASSET = 'models/qwen2.5-0.5b-instruct-q4_k_m.gguf';
export const MODEL_DIR_NAME = 'models';

export const LLM_INIT_CONFIG = {
  n_ctx: 2048,
  n_threads: 4,
  n_gpu_layers: 0,
  use_mmap: true,
  use_mlock: false,
  embedding: false,
};

export const LLM_COMPLETION_CONFIG = {
  n_predict: 512,
  temperature: 0.7,
  top_k: 40,
  top_p: 0.95,
  stop: ['<|im_end|>', '<|end|>'],
};

export const TTS_LANG = 'fr-FR';
export const TTS_RATE = 0.5;
export const VOICE_LOCALE = 'fr-FR';

export const GREETING_MESSAGE =
  "Bonjour ! Je suis Tsaty, votre assistant IA local. Je peux vous aider en traduction, encyclopédie et bien plus. Posez-moi toutes vos questions ! \uD83D\uDC42";

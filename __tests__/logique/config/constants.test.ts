import {
  MODEL_FILENAME,
  MODEL_URL,
  MODEL_ASSET,
  MODEL_DIR_NAME,
  LLM_INIT_CONFIG,
  LLM_COMPLETION_CONFIG,
  TTS_LANG,
  TTS_RATE,
  VOICE_LOCALE,
  GREETING_MESSAGE,
} from '../../../src/logique/config/constants';

describe('constants', () => {
  it('has correct model filename', () => {
    expect(MODEL_FILENAME).toContain('qwen2.5');
    expect(MODEL_FILENAME).toContain('.gguf');
  });

  it('has a valid HuggingFace URL', () => {
    expect(MODEL_URL).toContain('huggingface.co');
    expect(MODEL_URL).toContain('.gguf');
  });

  it('has correct asset path', () => {
    expect(MODEL_ASSET).toContain('models/');
  });

  it('has correct dir name', () => {
    expect(MODEL_DIR_NAME).toBe('models');
  });

  it('has LLM init config values', () => {
    expect(LLM_INIT_CONFIG.n_ctx).toBe(2048);
    expect(LLM_INIT_CONFIG.n_threads).toBe(4);
    expect(LLM_INIT_CONFIG.use_mmap).toBe(true);
  });

  it('has LLM completion config values', () => {
    expect(LLM_COMPLETION_CONFIG.temperature).toBe(0.7);
    expect(LLM_COMPLETION_CONFIG.top_k).toBe(40);
    expect(LLM_COMPLETION_CONFIG.n_predict).toBe(512);
  });

  it('has TTS config', () => {
    expect(TTS_LANG).toBe('fr-FR');
    expect(TTS_RATE).toBe(0.5);
  });

  it('has voice locale', () => {
    expect(VOICE_LOCALE).toBe('fr-FR');
  });

  it('has a greeting message', () => {
    expect(GREETING_MESSAGE).toContain('Tsaty');
    expect(GREETING_MESSAGE).toContain('Bonjour');
  });
});

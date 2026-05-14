import { initLlama, LlamaContext } from 'llama.rn';
import { LLM_INIT_CONFIG, LLM_COMPLETION_CONFIG } from '../config/constants';
import type { Message } from '../../entities/Message';

export class LlmService {
  private context: LlamaContext | null = null;
  private _cancelled = false;

  get isReady(): boolean {
    return this.context !== null;
  }

  cancel(): void {
    this._cancelled = true;
  }

  async init(modelPath: string, onProgress: (pct: number) => void): Promise<void> {
    const ctx = await initLlama(
      {
        model: modelPath,
        ...LLM_INIT_CONFIG,
      },
      onProgress,
    );
    this.context = ctx;
  }

  async generate(
    messages: Message[],
    onToken: (text: string) => void,
  ): Promise<string> {
    if (!this.context) {
      throw new Error('Modèle non initialisé');
    }

    this._cancelled = false;
    const history = messages.map((m) => ({
      role: m.role,
      content: m.text,
    }));

    let fullResponse = '';
    let partial = '';

    try {
      await this.context.completion(
        {
          messages: history,
          ...LLM_COMPLETION_CONFIG,
        },
        (token) => {
          if (this._cancelled) return;
          if (token.token) {
            partial += token.token;
            fullResponse += token.token;
            onToken(partial);
          }
        },
      );
    } catch {
      if (this._cancelled) return '';
      throw new Error('Erreur de génération');
    }

    if (this._cancelled) return '';
    return fullResponse;
  }

  dispose(): void {
    this.context = null;
  }
}

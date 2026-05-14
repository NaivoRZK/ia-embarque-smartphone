import { ModelRepository } from '../../stockage/repositories/ModelRepository';
import { LlmService } from './LlmService';
import type { ScreenState } from '../../entities/ScreenState';

export type StateChangeCallback = (state: ScreenState, progress: number, error?: string) => void;

export class ModelService {
  private repo: ModelRepository;
  private llm: LlmService;
  private onStateChange: StateChangeCallback;

  constructor(llm: LlmService, onStateChange: StateChangeCallback) {
    this.repo = new ModelRepository();
    this.llm = llm;
    this.onStateChange = onStateChange;
  }

  get llmService(): LlmService {
    return this.llm;
  }

  async initialize(): Promise<void> {
    try {
      await this.repo.ensureDir();
      const exists = await this.repo.modelExists();

      if (exists) {
        await this.loadModel();
        return;
      }

      const hasAsset = await this.repo.assetExists();
      if (hasAsset) {
        this.onStateChange('loading', 0);
        await this.repo.copyFromAsset();
        await this.loadModel();
      } else {
        await this.downloadModel();
      }
    } catch {
      this.onStateChange('error', 0, "Erreur de vérification du stockage de l'appareil");
    }
  }

  private async downloadModel(): Promise<void> {
    this.onStateChange('downloading', 0);

    try {
      await this.repo.downloadModel((pct) => {
        this.onStateChange('downloading', pct);
      });
      await this.loadModel();
    } catch (err: any) {
      this.onStateChange('error', 0, `Erreur: ${err.message}`);
    }
  }

  private async loadModel(): Promise<void> {
    this.onStateChange('loading', 0);

    try {
      await this.llm.init(this.repo.modelPath, (pct) => {
        this.onStateChange('loading', pct);
      });
      this.onStateChange('ready', 100);
    } catch (err: any) {
      this.onStateChange('error', 0, `Erreur chargement modèle: ${err.message}`);
    }
  }
}

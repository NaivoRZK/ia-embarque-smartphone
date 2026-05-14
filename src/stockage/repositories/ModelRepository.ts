import RNFS from 'react-native-fs';
import { MODEL_DIR_NAME, MODEL_FILENAME, MODEL_URL, MODEL_ASSET } from '../../logique/config/constants';

export class ModelRepository {
  private basePath: string;

  constructor() {
    this.basePath = RNFS.DocumentDirectoryPath;
  }

  get modelDir(): string {
    return `${this.basePath}/${MODEL_DIR_NAME}`;
  }

  get modelPath(): string {
    return `${this.modelDir}/${MODEL_FILENAME}`;
  }

  async ensureDir(): Promise<void> {
    const exists = await RNFS.exists(this.modelDir);
    if (!exists) {
      await RNFS.mkdir(this.modelDir);
    }
  }

  async modelExists(): Promise<boolean> {
    return RNFS.exists(this.modelPath);
  }

  async assetExists(): Promise<boolean> {
    return RNFS.existsAssets(MODEL_ASSET);
  }

  async copyFromAsset(): Promise<void> {
    await RNFS.copyFileAssets(MODEL_ASSET, this.modelPath);
  }

  downloadModel(onProgress: (pct: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const { promise } = RNFS.downloadFile({
        fromUrl: MODEL_URL,
        toFile: this.modelPath,
        progress: (res) => {
          const pct = Math.round((res.bytesWritten / res.contentLength) * 100);
          onProgress(pct);
        },
        progressDivider: 1,
      });

      promise
        .then((result) => {
          if (result.statusCode === 200) {
            resolve();
          } else {
            reject(new Error(`Échec téléchargement (code ${result.statusCode})`));
          }
        })
        .catch(reject);
    });
  }
}

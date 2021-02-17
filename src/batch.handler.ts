import axios from 'axios';

const BATCH_TIME = 300;
export class BatchHandler {
  private static readonly queue: Set<string> = new Set();
  private static futurePromise: any;
  private static readonly BatchURL =
    'https://europe-west1-quickstart-1573558070219.cloudfunctions.net/file-batch-api';

  public static async updateBatch(id: string[]): Promise<any> {
    this.addToQueue(id);
    if (this.futurePromise !== undefined) {
      return this.futurePromise;
    } else {
      this.futurePromise = new Promise((resolve) =>
        setTimeout(() => {
          resolve(this.createRequest());
        }, BATCH_TIME),
      );
      return this.futurePromise;
    }
  }

  private static addToQueue(id: string[]): void {
    id.forEach((d) => this.queue.add(d));
  }

  private static emptyQueue(): void {
    this.queue.clear();
  }

  private static async createRequest(): Promise<any> {
    console.log('called');
    const queuValues = [...this.queue];
    this.emptyQueue();
    this.futurePromise = undefined;
    return await axios.get(BatchHandler.BatchURL, {
      params: { ids: queuValues },
    });
  }
}

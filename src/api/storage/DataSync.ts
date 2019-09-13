
import { SubStorageApi } from "./StorageApi";

// Creator if instance of this class, service worker, should pass the correct storage depending on the action
export class DataSync {

    private readonly from: SubStorageApi;
    private readonly to: SubStorageApi;

    constructor(from: SubStorageApi, to: SubStorageApi) {
        console.info('Data Sync instantiated');
        this.from = from;
        this.to = to;
    }

    async sync() {
        const pending = await this.from.getPendingSync(await this.to.getLastTimeSaved());
        if (pending) {
            await this.to.import(pending);
            return this.from.cleanupPendingSync(pending);    
        }
        console.info('Nothing to sync');
    }
}

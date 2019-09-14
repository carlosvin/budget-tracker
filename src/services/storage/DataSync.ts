
import { SubStorageApi } from "./StorageApi";

export class DataSync {

    private readonly from: SubStorageApi;
    private readonly to: SubStorageApi;
    private readonly name: string;

    // Creator should pass the correct storage depending on the action
    constructor(from: SubStorageApi, to: SubStorageApi) {
        this.from = from;
        this.to = to;
        this.name = `${this.from.constructor.name} > ${this.to.constructor.name}`;
    }

    async sync() {
        // TODO implement a synchronization mechanism **to get only the pending changes**
        // For now we are reading all the data from firestore, which is far to be optimal
        // Saving synched device IDs per document would work if we could check that array does not
        // contains current device ID, "array not contains" feature is not supported by firestore
        console.debug(this.name);
        const pending = await this.from.export();
        if (pending) {
            return this.to.import(pending);
        }
        console.info('Nothing to sync');
    }
}

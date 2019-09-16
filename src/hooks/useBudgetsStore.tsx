import { useState, useEffect } from 'react';
import { btApp } from '../BudgetTracker';
import { BudgetsStore } from '../domain/stores/interfaces';
import { StorageObserver } from '../services/storage/StorageApi';

export function useBudgetsStore() {
    const [store, setStore] = useState<BudgetsStore>();

    useEffect(() => {
        async function fetchStore () {
            setStore(await btApp.getBudgetsStore());
        }

        let isSubscribed = true;
        if (isSubscribed) {
            fetchStore();
        }

        return () => { isSubscribed = false };
        
    }, [store]);

    useEffect(() => {
        let isSubscribed = true;
        const observer: StorageObserver = {onStorageDataChanged: () => {
            setStore(undefined);
        }};

        if (isSubscribed) {
            btApp.storage.addObserver(observer);
        }

        return () => {
            isSubscribed = false;
            btApp.storage.deleteObserver(observer);
        };
    }, []);

    return store;
}
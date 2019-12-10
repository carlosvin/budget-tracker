import { useState, useEffect } from 'react';
import { BudgetsStore } from '../domain/stores';
import { StorageObserver } from '../services/storage';
import { useAppContext } from '../contexts/AppContext';

export function useBudgetsStore() {
    const [store, setStore] = useState<BudgetsStore>();
    const btApp = useAppContext();

    useEffect(() => {
        async function fetchStore () {
            setStore(await btApp.getBudgetsStore());
        }

        let isSubscribed = true;
        if (isSubscribed) {
            fetchStore();
        }

        return () => { isSubscribed = false };
        
    }, [store, btApp]);

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
    }, [btApp]);

    return store;
}
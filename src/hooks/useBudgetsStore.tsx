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

        fetchStore();        
    }, [store, btApp]);

    useEffect(() => {
        const observer: StorageObserver = {onStorageDataChanged: () => {
            setStore(undefined);
        }};

        btApp.storage.addObserver(observer);

        return () => (btApp.storage.deleteObserver(observer));
    }, [btApp]);

    return store;
}
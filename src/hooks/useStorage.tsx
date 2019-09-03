import { useState, useEffect } from 'react';
import { btApp } from '../BudgetTracker';
import { AppStorageApi } from '../api/storage/StorageApi';

export function useStorage() {
    const [storage, setStorage] = useState<AppStorageApi>();

    useEffect(() => {
        async function getStorage () {
            setStorage(await btApp.getStorage());
        }

        let isSubscribed = true;

        if (isSubscribed) {
            getStorage();
        }

        return () => {isSubscribed = false};
        
    }, []);

    return storage;
}
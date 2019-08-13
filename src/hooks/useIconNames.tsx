import { useState, useEffect } from 'react';
import { btApp } from '../BudgetTracker';

export function useIconNames() {
    const [iconNames, setIconNames] = useState<string[]>();

    useEffect(() => {
        async function fetchIconNames () {
            const store = await btApp.getIconsStore();
            setIconNames(await store.iconNames);
        }

        let isSubscribed = true;
        if (isSubscribed) {
            fetchIconNames();
        }
        
        return () => {isSubscribed = false};

    });

    return iconNames;
}
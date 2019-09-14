import { useState, useEffect } from 'react';
import { btApp } from '../BudgetTracker';
import { ColoredLazyIcon } from '../domain/stores/interfaces';

export function useIcon(name: string) {
    const [icon, setIcon] = useState<ColoredLazyIcon>();

    useEffect(() => {
        async function fetchIcon () {
            const store = await btApp.getIconsStore();
            setIcon(store.getIcon(name));
        }

        let isSubscribed = true;
        if (isSubscribed) {
            fetchIcon();
        }
        
        return () => {isSubscribed = false};
    }, [name]);

    return icon;
}
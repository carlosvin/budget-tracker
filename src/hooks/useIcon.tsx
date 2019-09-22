import { useState, useEffect } from 'react';
import { ColoredLazyIcon } from '../domain/stores/interfaces';
import { useAppContext } from '../contexts/AppContext';

export function useIcon(name: string) {
    const [icon, setIcon] = useState<ColoredLazyIcon>();
    const btApp = useAppContext();

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
    }, [name, btApp]);

    return icon;
}
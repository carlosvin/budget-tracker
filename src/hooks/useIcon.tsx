import { useState, useEffect } from 'react';
import { ColoredLazyIcon } from '../domain/stores';
import { useAppContext } from '../contexts/AppContext';

export function useIcon(name: string) {
    const btApp = useAppContext();
    const [icon, setIcon] = useState<ColoredLazyIcon>();

    useEffect(() => {
        async function fetchIcon () {
            const store = await btApp.getIconsStore();
            setIcon(store.getIcon(name));
        }
        fetchIcon();
    }, [name, btApp]);

    return icon;
}
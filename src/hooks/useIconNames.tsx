import { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

export function useIconNames() {
    const [iconNames, setIconNames] = useState<string[]>();
    const btApp = useAppContext();
    
    useEffect(() => {
        async function fetchIconNames () {
            const store = await btApp.getIconsStore();
            setIconNames(store.iconNames);
        }

        fetchIconNames();
    }, [btApp]);

    return iconNames;
}
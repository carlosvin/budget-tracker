
import { useAppContext } from '../contexts/AppContext';

export function useLoc() {
    const app = useAppContext();
    
    return function loc(key: string) {
        return app.localization.get(key);
    };
}
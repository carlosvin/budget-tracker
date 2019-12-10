
import { useAppContext } from '../contexts/AppContext';

export function useLocalization() {
    const app = useAppContext();
    
    return app.localization;
}

import { History } from "history";

/** 
 * It navigates back in history if there are enough elements in it to do so. 
 * If it can't go back, it will navigate to @param path
 * */
export const goBack = (history: History, path = '/') => {
    if (history.length > 2) {
        history.goBack();
    } else {
        history.replace(path);
    }
}

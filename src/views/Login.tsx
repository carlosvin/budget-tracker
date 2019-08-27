import React from 'react';
import { btApp } from '../BudgetTracker';

export const Login: React.FC = () => {

    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean|undefined>();

    React.useEffect(
        () => {
            async function initUserId () {
                const auth = await btApp.getAuth();
                const userId = await auth.getUserId();
                console.log(userId);
                setIsLoggedIn(!!userId);
            }
            initUserId();
        }, []);

    async function handleLogin() {
        setIsLoggedIn(undefined);
        const uid = await (await btApp.getAuth()).startAuth();
        if (uid) {
            await btApp.initRemoteStorage();
        }
        setIsLoggedIn(!!uid);
    }

    async function handleLogout() {
        setIsLoggedIn(undefined);
        const uid = await (await btApp.getAuth()).getUserId();
        setIsLoggedIn(!!uid);
    }

    if (isLoggedIn===undefined) {
        return <p>Loading</p>;
    }

    if (isLoggedIn) {
        return <button onClick={handleLogout}>Logout</button>;
    } else {
        return <button onClick={handleLogin}>Login using google</button>;
    }

}

export default Login;

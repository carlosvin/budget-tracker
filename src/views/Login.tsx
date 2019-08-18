// Import FirebaseAuth and firebase.
import React from 'react';
import { authApi } from '../api/AuthApi';


export const Login: React.FC = () => {

    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean|undefined>();

    React.useEffect(
        () => {
            return authApi.auth.onAuthStateChanged((user)=>{
                console.log(user);
                setIsLoggedIn(!!user);
            });
        }, []);

    async function handleLogin() {
        setIsLoggedIn(undefined);
        await authApi.startAuth();
        setIsLoggedIn(true);
    }

    if (isLoggedIn===undefined) {
        return <p>Loading</p>;
    }

    if (isLoggedIn) {
        return <button onClick={() => authApi.logout()}>Logout</button>;
    } else {
        return <button onClick={handleLogin}>Login using google</button>;
    }

}

export default Login;

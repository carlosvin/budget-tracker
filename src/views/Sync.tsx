import React from 'react';
import { btApp } from '../BudgetTracker';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { SnackbarError } from '../components/SnackbarError';
import ListSubheader from '@material-ui/core/ListSubheader';
import Link from '@material-ui/core/Link';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import SyncDisabledIcon from '@material-ui/icons/SyncDisabled';
import SyncIcon from '@material-ui/icons/Sync';
import { HeaderNotifierProps } from '../routes';
import CircularProgress from '@material-ui/core/CircularProgress';

export const Sync: React.FC<HeaderNotifierProps> = (props) => {

    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean|undefined>();
    const [error, setError] = React.useState();

    React.useEffect(
        () => {
            async function initUserId () {
                try {
                    const auth = await btApp.getAuth();
                    const userId = await auth.getUserId();
                    setIsLoggedIn(!!userId);
                } catch (error) {
                    setError('Error signing in.');
                    setIsLoggedIn(false);
                }  
            }
            initUserId();
            props.onTitleChange('Account sync');
        // eslint-disable-next-line
        }, []);

    React.useLayoutEffect(()=>{}, [isLoggedIn]);

    function handleLogin() {
        setIsLoggedIn(undefined);
        login();
    }

    async function login(){
        const uid = await (await btApp.getAuth()).startAuth();
        if (uid) {
            await btApp.cleanupStores();
        }
        setIsLoggedIn(!!uid);
    }

    function handleLogout() {
        setIsLoggedIn(undefined);
        logout();
    }

    async function logout () {
        const auth = await btApp.getAuth();
        await auth.logout();
        const uid = await auth.getUserId();
        setIsLoggedIn(!!uid);
    }

    function title () {
        if (isLoggedIn === undefined) {
            return 'Synchronizing...';
        } else if (isLoggedIn) {
            return 'Your account is synchronized';
        } else {
            return 'Account not synchronized';
        }
    }

    function avatar () {
        if (isLoggedIn === undefined) {
            return <CircularProgress/>;
        } else if (isLoggedIn) {
            return <SyncIcon/>;
        } else {
            return <SyncDisabledIcon />;
        }
    }

    return <Card>
        {error && <SnackbarError error={error}/>}
        <CardHeader
            action={ avatar() } 
            title={ title() }/>
        <CardContent>
            <Benefits />
        </CardContent>
        <CardActions>
            <ActionButton
                disabled={ isLoggedIn === undefined } 
                onAction={ isLoggedIn ? handleLogout : handleLogin }>
                { isLoggedIn ? 'Logout' : 'Synchronize' }
            </ActionButton>
            <Link 
                href='/privacy_policy.html' 
                variant='caption'>Privacy policy</Link>
        </CardActions>
    </Card>;
}

const Benefits = () => (
    <List>
        <ListSubheader disableGutters >
            Benefits of synchronized accounts
        </ListSubheader>
        <ListItemText 
            primary='Use different devices' 
            secondary='You can manage your budgets using your different devices'/>
        <ListItemText 
            primary='Do not lose your data' 
            secondary='Your data is backed up remotely.'/>
    </List>
);

const ActionButton: React.FC<{onAction: () => void, disabled?: boolean}> = (props) => (
    <Button onClick={props.onAction} color='primary' disabled={props.disabled}>
        {props.children}
    </Button>
);

export default Sync;

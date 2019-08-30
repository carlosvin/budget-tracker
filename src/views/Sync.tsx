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
        }, [isLoggedIn]);

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
        const auth = await btApp.getAuth();
        await auth.logout();
        const uid = await auth.getUserId();
        setIsLoggedIn(!!uid);
    }

    if (isLoggedIn===undefined) {
        return <p>Loading</p>;
    }

    function title () {
        return isLoggedIn ? 
            'Your account is synchronized' : 
            'Account not synchronized';
    }

    function avatar () {
        return isLoggedIn ? <SyncIcon/> : <SyncDisabledIcon />;
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

const ActionButton: React.FC<{onAction: () => Promise<void>}> = (props) => (
    <Button onClick={props.onAction} color='primary'>
        {props.children}
    </Button>
);

export default Sync;

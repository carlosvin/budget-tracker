import React from 'react';
import { btApp } from '../BudgetTracker';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { SnackbarError } from '../components/snackbars';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import SyncDisabledIcon from '@material-ui/icons/SyncDisabled';
import SyncIcon from '@material-ui/icons/Sync';
import { HeaderNotifierProps } from '../routes';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import { AppPaths } from '../domain/paths';
import { CloseButton } from '../components/buttons/CloseButton';
import { RouterProps } from 'react-router';

export function Sync(props: HeaderNotifierProps&RouterProps) {

    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean|undefined>();
    const [error, setError] = React.useState();
    const {history, onActions, onTitleChange} = props;

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
            onTitleChange('Account sync');
            onActions(<CloseButton history={history}/>);
            return function () { onActions(undefined); }
        // eslint-disable-next-line
        }, []);

    React.useLayoutEffect(()=>{}, [isLoggedIn]);

    async function login(){
        let uid = undefined;
        try {
            uid = await (await btApp.getAuth()).startAuth();
        } catch (error) {
            setError('Error synchronizing account, please try again later.');
            console.error(error);
        }
        if (uid) {
            await btApp.refreshStores();
        }
        setIsLoggedIn(!!uid);
    }

    function handleLogin() {
        setIsLoggedIn(undefined);
        login();
    }

    async function logout () {
        const auth = await btApp.getAuth();
        let uid = undefined;
        try {
            await auth.logout();
            uid = await auth.getUserId();
        } catch (error) {
            setError('There were some problems signing out');
            console.error(error);
        }
        await btApp.refreshStores();
        setIsLoggedIn(!!uid);
    }

    function handleLogout() {
        setIsLoggedIn(undefined);
        logout();
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
        {error && <SnackbarError message={error}/>}
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
            <Button component={Link}
                to={AppPaths.Privacy} 
                variant='text'>Privacy policy</Button>
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

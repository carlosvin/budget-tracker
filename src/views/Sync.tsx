import React from 'react';
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
import { CloseButtonHistory } from '../components/buttons/CloseButton';
import { RouterProps } from 'react-router';
import { useAppContext } from '../contexts/AppContext';
import { useHeaderContext } from '../hooks/useHeaderContext';

export const Sync: React.FC<HeaderNotifierProps&RouterProps> = (props) => {

    const btApp = useAppContext();

    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean|undefined>();
    const [error, setError] = React.useState();
    const {history} = props;

    useHeaderContext('Account sync', <CloseButtonHistory history={history}/>, props);

    React.useEffect(() => {
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
        return function () { }
    }, [btApp]);

    React.useLayoutEffect(()=>{}, [isLoggedIn]);

    function handleLogin() {
        setIsLoggedIn(undefined);
        login();
    }

    async function login(){
        try {
            const uid = await (await btApp.getAuth()).startAuth();
            setIsLoggedIn(!!uid);
        } catch (error) {
            setError('Error synchronizing account, please try again later.');
            setIsLoggedIn(false);
            console.error(error);
        }
    }

    function handleLogout() {
        setIsLoggedIn(undefined);
        logout();
    }

    async function logout () {
        const auth = await btApp.getAuth();
        try {
            await auth.logout();
            setIsLoggedIn(false);
        } catch (error) {
            setError('There were some problems signing out');
            console.error(error);
        }
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

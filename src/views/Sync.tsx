import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { SnackbarError } from '../components/snackbars';
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
import { useLocalization } from '../hooks/useLocalization';
import { LocalizationApi } from '../services';

export const Sync: React.FC<HeaderNotifierProps & RouterProps> = (props) => {

    const btApp = useAppContext();

    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | undefined>();
    const [error, setError] = React.useState<string>();
    const { history } = props;

    const loc = useLocalization();

    useHeaderContext(
        loc.get('Account sync'),
        <CloseButtonHistory history={history} />, props);

    React.useEffect(() => {
        async function initUserId() {
            try {
                const auth = await btApp.getAuth();
                const userId = await auth.getUserId();
                setIsLoggedIn(!!userId);
            } catch (error) {
                setError(btApp.localization.get('Error signing in'));
                setIsLoggedIn(false);
            }
        }
        initUserId();
        return function () { }
    }, [btApp]);

    React.useLayoutEffect(() => { }, [isLoggedIn]);

    function handleLogin() {
        setIsLoggedIn(undefined);
        login();
    }

    async function login() {
        try {
            const uid = await (await btApp.getAuth()).startAuth();
            setIsLoggedIn(!!uid);
        } catch (error) {
            setError(`${loc.get('Error synchronizing account')}. 
                ${loc.get('Try later')}.`);
            setIsLoggedIn(false);
            console.error(error);
        }
    }

    function handleLogout() {
        setIsLoggedIn(undefined);
        logout();
    }

    async function logout() {
        const auth = await btApp.getAuth();
        try {
            await auth.logout();
            setIsLoggedIn(false);
        } catch (error) {
            setError(`${loc.get('Sign out problem')}. 
            ${loc.get('Try later')}.`);
            console.error(error);
        }
    }

    function title() {
        if (isLoggedIn === undefined) {
            return loc.get('Synchronizing') + '...';
        } else if (isLoggedIn) {
            return loc.get('Account synched');
        } else {
            return loc.get('Account not synched');
        }
    }

    function avatar() {
        if (isLoggedIn === undefined) {
            return <CircularProgress />;
        } else if (isLoggedIn) {
            return <SyncIcon />;
        } else {
            return <SyncDisabledIcon />;
        }
    }

    function action() {
        return isLoggedIn ? loc.get('Logout') : loc.get('Synchronize');
    }

    function color() {
        return isLoggedIn ? 'secondary' : 'primary';
    }

    return <Card>
        {error && <SnackbarError message={error} />}
        <CardHeader
            action={avatar()}
            title={title()} />
        <CardContent>
            <Benefits loc={loc} />
        </CardContent>
        <CardActions>
            <ActionButton
                color={color()}
                disabled={isLoggedIn === undefined}
                onAction={isLoggedIn ? handleLogout : handleLogin}>
                {action()}
            </ActionButton>
            <Button component={Link}
                to={AppPaths.Privacy}
                variant='text'>{loc.get('Privacy policy')}</Button>
        </CardActions>
    </Card>;
}

const Benefits = ({loc}: {loc: LocalizationApi}) => {

    return <List>
        <ListItemText
            primary={loc.get('Benefits')} primaryTypographyProps={{ variant: 'subtitle1' }} />
        <ListItemText
            primary={loc.get('Different devices')}
            secondary={loc.get('Different devices desc')} />
        <ListItemText
            primary={loc.get('No data loss')}
            secondary={loc.get('No data loss desc')} />
    </List>;
}

interface ActionButtonProps {
    onAction: () => void;
    disabled?: boolean;
    color: 'primary' | 'secondary';
};

const ActionButton: React.FC<ActionButtonProps> = ({ onAction, disabled, color, children }) => (
    <Button onClick={onAction} disabled={disabled} color={color}>
        {children}
    </Button>
);

export default Sync;

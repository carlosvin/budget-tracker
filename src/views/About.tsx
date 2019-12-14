import * as React from "react";
import { version } from '../../package.json';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link as RouterLink } from 'react-router-dom';
import { AppPaths } from "../domain/paths";
import { HeaderNotifierProps } from "../routes";
import { useHeaderContext } from "../hooks/useHeaderContext";
import WarningIcon from '@material-ui/icons/Warning';
import { AppStorageManager } from "../services/storage/AppStorageManager";
import { useLocalization } from "../hooks/useLocalization";

const About: React.FC<HeaderNotifierProps> = (props) => {
    useHeaderContext(`Budget tracker ${version}`, [], props);
    const loc = useLocalization();

    const [persisted, setPersisted] = React.useState<boolean>();

    React.useEffect(() => {
        AppStorageManager
            .isPersisted()
            .then((p)=> setPersisted(p))
            .catch((_)=>setPersisted(false));
    }, 
    []);

    return (
        <Card>
            <CardHeader title={loc.get('Track your expenses')} />
            <CardContent>
                {persisted === false && <Typography color='secondary'>
                    <WarningIcon/> {loc.get('Persistence disabled')}.
                </Typography>}
                <Typography>
                    {loc.get('Track your expenses Desc')}.
                </Typography>

                <Typography variant='body2'>
                {loc.get('Add issue to github')}.
                </Typography>

            </CardContent>
            <CardActions>
                <Button component={RouterLink}
                    to={AppPaths.Privacy}
                    variant='text'>{loc.get('Privacy')}</Button>
                <Button component={Link}
                    href='https://github.com/carlosvin/budget-tracker/issues' >{loc.get('Issues')}</Button>
            </CardActions>
        </Card>
    );
}

export default About;
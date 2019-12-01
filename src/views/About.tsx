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
import { useLoc } from "../hooks/useLoc";
import WarningIcon from '@material-ui/icons/Warning';
import { AppStorageManager } from "../services/storage/AppStorageManager";

const About: React.FC<HeaderNotifierProps> = (props) => {
    useHeaderContext(`Budget tracker ${version}`, [], props);
    const loc = useLoc();

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
            <CardHeader title={loc('Track your expenses')} />
            <CardContent>
                {persisted === false && <Typography color='secondary'>
                    <WarningIcon/> {loc('Persistence disabled')}.
                </Typography>}
                <Typography>
                    {loc('Track your expenses Desc')}.
                </Typography>

                <Typography variant='body2'>
                {loc('Add issue to github')}.
                </Typography>

            </CardContent>
            <CardActions>
                <Button component={RouterLink}
                    to={AppPaths.Privacy}
                    variant='text'>{loc('Privacy')}</Button>
                <Button component={Link}
                    href='https://github.com/carlosvin/budget-tracker/issues' >{loc('Issues')}</Button>
            </CardActions>
        </Card>
    );
}

export default About;
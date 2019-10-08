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

const About: React.FC<HeaderNotifierProps> = (props) => {
    useHeaderContext(`Budget tracker ${version}`, [], props);
    const loc = useLoc();

    return (
        <Card>
            <CardHeader title={loc('Track your expenses')} />
            <CardContent>
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
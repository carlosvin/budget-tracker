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
import { BudgetPath } from "../domain/paths/BudgetPath";

const About: React.FC<HeaderNotifierProps> = (props) => {
    useHeaderContext(`Budget tracker ${version}`, [], props);

    return (
        <Card>
            <CardHeader title='Track your expenses' />
            <CardContent>
                <Typography>
                    It helps you to verify how your expenses stick to your <RouterLink to={BudgetPath.base}>budget</RouterLink>.
                </Typography>

                <Typography variant='body2'>
                    Do not hesitate to add <Link href='https://github.com/carlosvin/budget-tracker/issues'>issues or requests at github</Link>.
                </Typography>
            </CardContent>
            <CardActions>
                <Button component={RouterLink}
                    to={AppPaths.Privacy}
                    variant='text'>Privacy</Button>
                <Button component={Link}
                    href='https://github.com/carlosvin/budget-tracker/issues' >Issues</Button>
            </CardActions>
        </Card>
    );
}

export default About;
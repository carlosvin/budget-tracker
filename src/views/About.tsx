import * as React from "react";
import Typography from '@material-ui/core/Typography';
import { TitleNotifierProps } from "src/interfaces";

const About = (props: TitleNotifierProps) => {

    React.useEffect(() => {
        props.onTitleChange('About');
    });

    return (
        <React.Fragment>
            <Typography variant="h5" component="h3">
                Budget tracker
            </Typography>
            <Typography component="p">
                Version 1.2.3
            </Typography>
        </React.Fragment>);
}

export default About;
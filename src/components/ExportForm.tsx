import * as React from "react";
import { AppButton } from "./buttons/buttons";
import FileCopy from '@material-ui/icons/FileCopy';
import { ExportDataSet } from "../interfaces";
import { Card, Link, CardContent, CardActions, IconButton, Typography } from "@material-ui/core";
import DownloadIcon from '@material-ui/icons/SaveAlt';
import { SnackbarInfo } from "./snackbars";

interface ExportFormProps {
    fileName: string;
    data: ExportDataSet;
}

export const ExportForm: React.FC<ExportFormProps> = (props) => {

    const [info, setInfo] = React.useState<string>();
    const fileName = `${props.fileName}.json`;

    function handleCopy() {
        navigator.clipboard.writeText(json());
        setInfo('Copied to clipboard');
    }

    function json(){
        return JSON.stringify(props.data);
    }

    function url () {
        const blob = new Blob([json()], { type: 'application/octet-stream' });
        return URL.createObjectURL(blob);
    }

    return <Card>
        {info && <SnackbarInfo message={info} />}
        <CardContent>
            <Typography 
                color='textSecondary' 
                variant='body2'>You can download all the data saved in this app in JSON file.
            </Typography>
            <Link href={url()} download={ fileName } variant='body1'>
                { fileName }
            </Link>
        </CardContent>
        <CardActions>
            <IconButton color='primary' href={url()} download={ `${props.fileName}.json`}>
                <DownloadIcon />
            </IconButton>
            <AppButton key='export-copy-to-clipboard'
                icon={FileCopy} 
                aria-label='Copy JSON' 
                onClick={handleCopy} />

        </CardActions>
    </Card>;
}

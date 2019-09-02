import * as React from "react";
import { AppButton } from "./buttons/buttons";
import FileCopy from '@material-ui/icons/FileCopy';
import { ExportDataSet } from "../interfaces";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import DownloadIcon from '@material-ui/icons/SaveAlt';
import { SnackbarInfo } from "./snackbars";

interface ExportCardProps {
    fileName: string;
    fetchDataPromise: Promise<ExportDataSet>;
}

export const ExportCard: React.FC<ExportCardProps> = (props) => {

    const [info, setInfo] = React.useState<string>();
    const fileName = `${props.fileName}.json`;
    const [json, setJson] = React.useState<string>();

    React.useEffect(() => {
        async function fetchJson () {
            setJson(JSON.stringify(await props.fetchDataPromise));
        }
        fetchJson();
    }, [props.fetchDataPromise]);

    async function handleCopy() {
        if (json) {
            navigator.clipboard.writeText(json);
            setInfo('Copied to clipboard');
        }
    }

    function url () {
        if (json) {
            const blob = new Blob([json], { type: 'application/octet-stream' });
            return URL.createObjectURL(blob);    
        }
        return '#';
    }

    return <Card>
        <CardHeader title='Export to JSON'></CardHeader>
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
            <IconButton disabled={!json} color='primary' href={url()} download={ `${props.fileName}.json`}>
                <DownloadIcon />
            </IconButton>
            <AppButton
                disabled={!json} 
                key='export-copy-to-clipboard'
                icon={FileCopy} 
                aria-label='Copy JSON' 
                onClick={handleCopy} />

        </CardActions>
    </Card>;
}

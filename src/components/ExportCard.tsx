import * as React from "react";
import FileCopy from '@material-ui/icons/FileCopy';
import { ExportDataSet } from "../api";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import DownloadIcon from '@material-ui/icons/SaveAlt';
import { SnackbarInfo } from "./snackbars";
import { useLocalization } from "../hooks/useLocalization";

interface ExportCardProps {
    fileName: string;
    dataToExport: ExportDataSet;
}

function download(fileName: string) {
    return `${fileName}-${new Date().toLocaleDateString()}.json`;
}

export const ExportCard: React.FC<ExportCardProps> = (props) => {
    const [info, setInfo] = React.useState<string>();
    const [json, setJson] = React.useState<string>();
    const loc = useLocalization();

    const url = React.useMemo(() => {
        if (json) {
            const blob = new Blob([json], { type: 'application/octet-stream' });
            return URL.createObjectURL(blob);
        } else {
            return '#';
        }
    }, [json]);

    React.useEffect(() => {
        setJson(JSON.stringify(props.dataToExport));
    }, [props.dataToExport]);

    async function handleCopy() {
        if (json) {
            navigator.clipboard.writeText(json);
            setInfo(loc.get('Copied to clipboard'));
        }
    }

    return <Card>
        <CardHeader title={loc.get('Export JSON')} />
        {info && <SnackbarInfo message={info} />}
        <CardContent>
            {!json && info && <Typography color='error'>{info}</Typography>}
            {json && <Content 
                fileName={props.fileName} 
                url={url}
                description={loc.get('Download JSON file')}
                />
            }
        </CardContent>
        {json && <CardActions>
            <IconButton
                color='primary'
                disabled={!json}
                href={url}
                download={download(props.fileName)}>
                <DownloadIcon />
            </IconButton>
            <IconButton
                disabled={!json}
                key='export-copy-to-clipboard'
                aria-label={loc.get('Copy JSON')}
                onClick={handleCopy} >
                <FileCopy />
            </IconButton>
        </CardActions>}
    </Card>;
}

interface ContentProps { 
    fileName: string;
    url: string; 
    description: string 
};

const Content: React.FC<ContentProps> = (props) => (
    <React.Fragment>
        <Typography
            color='textSecondary'
            variant='body2'>
            {props.description}
            : <Link href={props.url} 
            download={download(props.fileName)} 
            variant='body1'>
            {`${props.fileName}.json`}
        </Link>
        </Typography>
        
    </React.Fragment>
);
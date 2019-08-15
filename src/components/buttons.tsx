import * as React from 'react';
import '@material/react-fab/dist/fab.css';
import Fab from '@material/react-fab';
import MaterialIcon from '@material/react-material-icon';

interface FabButtonProps {
    path: string; 
    onRedirect: (path: string) => void;
    icon: string;
}

export const FabButton: React.FC<FabButtonProps> = (props) => {
    function handleClick () {
        props.onRedirect(props.path);
    }

    return <Fab icon={<MaterialIcon icon={props.icon}/>} onClick={handleClick}/>;
}

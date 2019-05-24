import * as React from 'react';
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

const Actions: React.FC<{children: React.ReactNode}> = (props) => (
    <Box mt={2}>
        <Grid justify='space-between' container wrap='nowrap'>
            { props.children }
        </Grid>
    </Box>
);
  
export default Actions;

import * as React from "react";
import { Paper, Typography } from "@material-ui/core";
import { RouteComponentProps } from "react-router";

export class BudgetView extends React.PureComponent<RouteComponentProps<{id:string}>> {

    render() {
        return (<div>
        <Paper elevation={3}>
          
          <Typography component="p">
            Found {this.props.match.params.id}
          </Typography>
        </Paper>
        </div>);
    }
}
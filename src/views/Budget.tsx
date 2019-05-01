import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
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
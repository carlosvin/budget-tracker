
import * as React from "react";
import * as ReactDOM from "react-dom";
import Button from "./Button";
import { AppBar } from "./AppBar";

export const StoryBook: React.FC = () => (
    <div>
        <AppBar title='Story Book'></AppBar>
        <h1>Hello world!</h1>
        <Button>Asdf</Button>
    </div>
);

ReactDOM.render(
    <StoryBook />,
    document.getElementById("root")
);

import * as React from "react";
import { version, name } from '../../package.json';

const About: React.FC = () => (<p>{name} {version}</p>);

export default About;
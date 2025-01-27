import { Link } from "react-router";

export default function TOC() {
    return (
        <ul>
            <li><Link to="/Labs">Labs</Link></li>
            <li><Link to="/Labs/Lab1">Lab 1</Link></li>
            <li><Link to="/Labs/Lab2">Lab 2</Link></li>
            <li><Link to="/Labs/Lab3">Lab 3</Link></li>
            <li><Link to="/Kambaz">Kambaz</Link></li>
            <li><a id="wd-github" href="https://github.com/edemarest/kambaz-react-web-app" target="_blank">GitHub Repository</a></li>
        </ul>
    );
}

import react from 'react';
import ReactDOM from 'react-dom';
import AppBody from './AppBody';
import AppFooter from './AppFooter';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

const header = () => {
    return (
        <div style={{textAlign: 'left', marginLeft: "2.5%",paddingTop: "1.25%"}}>
            <a href="/"><h1>My Portfolio Site</h1></a>
            <ul style={{listStyleType: "none", width: "5%"}}>
                <a href="/projects"><li id="projects">My Projects</li></a>
                <a href="/cv"><li id="cv">My C.V.</li></a>
                <a href="/about"><li id="aboutMe">About Me</li></a>
            </ul>
        </div>
    )
}

export default header;
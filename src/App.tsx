import React, {useEffect, useState} from 'react';
import './App.css';
import {getBooleanWithExpiry, setWithExpiry} from "./utils/ExpireLocalStorage";
import LocalStorage from "./constant/LocalStorage";
import {dark, light} from "./ui/theme/theme";
import styled, {ThemeProvider} from "styled-components";
import {BrowserRouter} from "react-router-dom";
import GlobalStyles from "./ui/theme/GlobalStyles";
import Router from "./ui/router/Router";
import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import axios from "axios";

export interface AppProps {
    darkMode: boolean,
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function App() {
    axios.defaults.withCredentials = false;
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyBFkyRS6hHHCliQjSVuQlifbCkh1hoNi1Q",
        authDomain: "ienlab-layoveroad.firebaseapp.com",
        projectId: "ienlab-layoveroad",
        storageBucket: "ienlab-layoveroad.firebasestorage.app",
        messagingSenderId: "1007278531212",
        appId: "1:1007278531212:web:72b0a7d3370c6e81ebd1a9",
        measurementId: "G-HLQL0CF8N0"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    const initialDarkMode = getBooleanWithExpiry(LocalStorage.Key.IS_DARK_MODE, window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const [darkMode, setDarkMode] = useState(initialDarkMode);
    const theme = darkMode ? dark : light;

    const [position, setPosition] = useState({x: 0, y: 0});
    const [hidden, setHidden] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [linkHovered, setLinkHovered] = useState(false);

    useEffect(() => {
        addEventListeners();
        handleLinkHoverEvents();
        return () => {
            removeEventListeners();
            removeLinkHoverEvents();
            setLinkHovered(false);
        }
    }, [window.location.href]);

    const addEventListeners = () => {
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseenter", onMouseEnter);
        document.addEventListener("mouseleave", onMouseLeave);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mouseup", onMouseUp);
    };

    const removeEventListeners = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseenter", onMouseEnter);
        document.removeEventListener("mouseleave", onMouseLeave);
        document.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mouseup", onMouseUp);
    };

    const selectors = ["a", "button", "input", ".link"]

    const handleLinkHoverEvents = () => {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.addEventListener("mouseover", onLinkHovered);
                el.addEventListener("mouseout", onLinkUnhovered);
            })
        })
    }

    const removeLinkHoverEvents = () => {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.removeEventListener("mouseover", onLinkHovered);
                el.removeEventListener("mouseout", onLinkUnhovered);
            })
        })
    }

    const onLinkHovered = () => {
        setLinkHovered(true);
    }

    const onLinkUnhovered = () => {
        setLinkHovered(false);
    }

    const onMouseMove = (e: MouseEvent) => {
        setPosition({x: e.clientX, y: e.clientY});
    };

    const onMouseLeave = () => {
        setHidden(true);
    };

    const onMouseEnter = () => {
        setHidden(false);
    };

    const onMouseDown = () => {
        setClicked(true);
    };

    const onMouseUp = (e: MouseEvent) => {
        setClicked(false);
    };

    useEffect(() => {
        let defaultDarkMode = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (defaultDarkMode !== darkMode) {
            setWithExpiry(LocalStorage.Key.IS_DARK_MODE, darkMode.toString(), 30 * 60 * 1000);
        } else {
            localStorage.removeItem(LocalStorage.Key.IS_DARK_MODE);
        }

        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <AppWrapper theme={theme}>
            <link rel="stylesheet" as="style"
                  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"/>
            <div className={'cursor' + (hidden ? ' hidden' : '') + (clicked ? ' clicked' : '') + (linkHovered ? ' hovered' : '')} style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}/>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <GlobalStyles/>
                <ThemeProvider theme={theme}>
                    <AppContainer>
                        <Router darkMode={darkMode} setDarkMode={setDarkMode}/>
                    </AppContainer>
                </ThemeProvider>
            </BrowserRouter>
        </AppWrapper>
    )

}

const AppWrapper = styled.div`
    color: ${props => props.theme.colors.colorOnSurface};

    .cursor {
        width: 20px;
        height: 20px;
        display: none;
        position: fixed;
        transform: translate(-50%, -50%);
        border: 2px solid #fefefe;
        border-radius: 100%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: all 0.15s ease;
        transition-property: opacity, background-color, transform, mix-blend-mode;

        &.hidden {
            opacity: 0;
        }

        &.clicked {
            transform: translate(-50%, -50%) scale(0.9);
            background-color: #fefefe;
        }

        &.hovered {
            transform: translate(-50%, -50%) scale(1.5);
            background-color: #fefefe;
        }

        @media (hover: hover) and (pointer: fine) {
            display: initial;
        }
    }
`

const AppContainer = styled.div`
    width: 100%;
    position: relative;
    margin: 0 auto;
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
`;

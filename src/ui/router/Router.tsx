import React from "react";
import {AppProps} from "../../App";
import {Route, Routes} from "react-router-dom";
import TransportScreen from "../screens/home/transport/TransportScreen";
import ProfileScreen from "../screens/home/profile/ProfileScreen";

export default function Router({darkMode, setDarkMode}: AppProps) {
    return (
        <>
            <Routes>
                <Route path={"/"} element={<TransportScreen darkMode={darkMode} setDarkMode={setDarkMode}/>} />
                <Route path={"/profile"} element={<ProfileScreen darkMode={darkMode} setDarkMode={setDarkMode}/> } />
            </Routes>
        </>
    )
}

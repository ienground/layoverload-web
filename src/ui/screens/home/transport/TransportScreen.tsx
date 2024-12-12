import React, {useEffect, useState} from "react";
import {AppProps} from "../../../../App";
import styled from "styled-components";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";

export default function TransportScreen({darkMode, setDarkMode}: AppProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    let map: naver.maps.Map;
    const mapOption = {
        center: new naver.maps.LatLng(37.52133, 126.9522),
        zoom: 17,
        minZoom: 15,
        tileDuration: 300,
        // 확대 시 타일 변경되는 시간
        baseTileOpacity: 1,
        // 타일 투명도 ( 투명도 낮추면 배경 색이 보임 )
        background: 'white',
        //배경 색
        tileSpare: 7,
        //화면 바깥 여분 타일 개수
    };

    useEffect(() => {
        if (!map) {
            map = new naver.maps.Map('map', mapOption);
        }
    }, []);

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log(position);
                        map.setCenter(new naver.maps.LatLng(position.coords.latitude, position.coords.longitude));
                    },
                    (err) => {

                    }
                )
            } else {

            }
        }

        getLocation();
    }, []);

    return (
        <Wrapper>
            <MapContainer id="map"></MapContainer>
            <Header isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} darkMode={darkMode} setDarkMode={setDarkMode}/>
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>
        </Wrapper>
    );
}

const Wrapper= styled.div`
    
`

const MapContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 0;
    
`;

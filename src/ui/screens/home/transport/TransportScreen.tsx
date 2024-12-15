import React, {useEffect, useRef, useState} from "react";
import {AppProps} from "../../../../App";
import styled from "styled-components";
import Header from "../../../components/Header";
import Sidebar from "../../../components/sidebar/Sidebar";
import SideDetail from "../../../components/sidebar/item/SideDetail";
import {QueryResultData} from "../../../components/sidebar/item/SideMap";
import {Fade} from "@mui/material";
import LatLng = naver.maps.LatLng;

export interface TransportProps {
    latLng: naver.maps.LatLng,
    setLatLng: React.Dispatch<React.SetStateAction<naver.maps.LatLng>>,
    selectedQuery: QueryResultData | null,
    setSelectedQuery: React.Dispatch<React.SetStateAction<QueryResultData | null>>,
    currentTab: number,
    setCurrentTab: React.Dispatch<React.SetStateAction<number>>,
    routes: RouteResult[],
    setRoutes: React.Dispatch<React.SetStateAction<RouteResult[]>>,
}

export interface RouteResult {
    waypoint: string,
    latLng: LatLng,
    distance: number,
    duration: number,
    tollFare: number,
    taxiFare: number,
    path: LatLng[]
}

export default function TransportScreen({darkMode, setDarkMode}: AppProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentTab, setCurrentTab] = useState(0);
    const [latLng, setLatLng] = useState<naver.maps.LatLng>(new naver.maps.LatLng(37.552987017, 126.972591728));
    const [selectedQuery, setSelectedQuery] = useState<QueryResultData | null>(null);
    const [routes, setRoutes] = useState<RouteResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0); // route

    const mapRef = useRef<naver.maps.Map | null>(null);
    const markerRef = useRef<naver.maps.Marker | null>(null);
    const polygonRef = useRef<naver.maps.Polyline | null>(null);
    const mapOption = {
        center: new naver.maps.LatLng(37.52133, 126.9522),
        zoom: 17,
        minZoom: 8,
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
        if (!mapRef.current) {
            // map = new naver.maps.Map('map', mapOption);
            mapRef.current = new naver.maps.Map('map', mapOption);
        }
    }, []);

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLatLng(new naver.maps.LatLng(position.coords.latitude, position.coords.longitude));
                        if (mapRef.current) {
                            mapRef.current.setCenter(new naver.maps.LatLng(position.coords.latitude, position.coords.longitude));
                        }
                    },
                    (err) => {

                    }
                )
            } else {

            }
        }

        getLocation();
    }, []);

    useEffect(() => {
        if (selectedQuery !== null) {
            if (mapRef.current) {
                const selectedLatLng = new naver.maps.LatLng(selectedQuery.y, selectedQuery.x);
                mapRef.current.setCenter(selectedLatLng);

                if (!markerRef.current) {
                    markerRef.current = new naver.maps.Marker({
                        position: selectedLatLng,
                        map: mapRef.current
                    });
                } else {
                    markerRef.current.setPosition(selectedLatLng);
                    mapRef.current.setCenter(selectedLatLng);
                    mapRef.current.setZoom(17);
                }

            }
        }
    }, [selectedQuery]);

    useEffect(() => {
        if (mapRef.current) {
            if (routes.length > 0) {
                if (!polygonRef.current) {
                    polygonRef.current = new naver.maps.Polyline({
                        path: routes[selectedIndex].path,
                        strokeColor: '#00CA00',
                        strokeOpacity: 0.8,
                        strokeWeight: 6,
                        zIndex: 2,
                        clickable: true,
                        map: mapRef.current
                    });
                } else {
                    polygonRef.current.setPath(routes[selectedIndex].path);
                }
            }
        }

    }, [selectedIndex, routes]);


    useEffect(() => {
        console.log(routes);
    }, [routes]);

    return (
        <Wrapper>
            <MapContainer id="map"></MapContainer>
            <Header isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} darkMode={darkMode} setDarkMode={setDarkMode} currentTab={currentTab} setCurrentTab={setCurrentTab}/>
            <Sidebar selectedQuery={selectedQuery} setSelectedQuery={setSelectedQuery} latLng={latLng} setLatLng={setLatLng} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} currentTab={currentTab} setCurrentTab={setCurrentTab} routes={routes} setRoutes={setRoutes} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}/>
            <SideDetail latLng={latLng} setLatLng={setLatLng} selectedQuery={selectedQuery} setSelectedQuery={setSelectedQuery} currentTab={currentTab} setCurrentTab={setCurrentTab} routes={routes} setRoutes={setRoutes}/>
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

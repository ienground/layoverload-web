import React, {useState} from "react";
import styled from "styled-components";
import {ChevronLeft, ChevronRight, Search} from "@mui/icons-material";
import {TransportProps} from "../../screens/home/transport/TransportScreen";
import LatLng = naver.maps.LatLng;
import axios from "axios";
import SideMap from "./item/SideMap";
import SideDetail from "./item/SideDetail";
import SideRoute from "./item/SideRoute";
import SideCandidate, {SideCandidateProps} from "./item/SideCandidate";
import SideBookmark from "./item/SideBookmark";

export interface SidebarProps {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    currentTab: number,
    setCurrentTab: React.Dispatch<React.SetStateAction<number>>,
}

export default function Sidebar({selectedQuery, setSelectedQuery, latLng, setLatLng, isOpen, setIsOpen, currentTab, setCurrentTab, routes, setRoutes, selectedIndex, setSelectedIndex}: SidebarProps & TransportProps & SideCandidateProps) {

    return (
        <Wrapper className={isOpen ? 'open' : ''}>
            <ContentWrapper>
                { currentTab === 0 ?
                    <SideMap selectedQuery={selectedQuery} setSelectedQuery={setSelectedQuery} latLng={latLng} setLatLng={setLatLng} currentTab={currentTab} setCurrentTab={setCurrentTab} routes={routes} setRoutes={setRoutes}/>
                : <></>}
                { currentTab === 1 ?
                    <SideRoute selectedQuery={selectedQuery} setSelectedQuery={setSelectedQuery} latLng={latLng} setLatLng={setLatLng} currentTab={currentTab} setCurrentTab={setCurrentTab} routes={routes} setRoutes={setRoutes}/>
                : <></>}
                { currentTab === 2 ?
                    <SideCandidate routes={routes} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}/>
                : <></> }
                { currentTab === 3 ?
                    <SideBookmark selectedQuery={selectedQuery} setSelectedQuery={setSelectedQuery} latLng={latLng} setLatLng={setLatLng} currentTab={currentTab} setCurrentTab={setCurrentTab} routes={routes} setRoutes={setRoutes} />
                : <></>}
            </ContentWrapper>
            <Handle onClick={() => setIsOpen(!isOpen)}>{!isOpen ? <ChevronRight /> : <ChevronLeft />}</Handle>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    position: absolute;
    display: flex;
    flex-direction: row;
    align-items: center;
    
    top: 0;
    left: -300px;
    width: 380px;
    height: 100%;
    z-index: 20;
    transition: left 0.3s ease;
    
    &.open {
        left: 60px;
    }
`

const ContentWrapper = styled.div`
    width: calc(360px - 2rem);
    height: calc(100% - 2rem);
    padding: 1rem;
    
    transition: background-color 0.3s ease;
    background-color: ${props => props.theme.colors.colorSurface};
    
    
`

const Handle = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 40px;
    border: none;
    border-radius: 0 0.4rem 0.4rem 0;

    transition: background-color 0.3s ease;
    background-color: ${props => props.theme.colors.colorPrimary};
    
    & > svg {
        color: ${props => props.theme.colors.colorOnPrimary};
    }
`

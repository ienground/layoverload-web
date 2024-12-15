import React from "react";
import {TransportProps} from "../../../screens/home/transport/TransportScreen";
import styled from "styled-components";
import {Button, Divider} from "@mui/material";
import {Bookmark, BookmarkRemove, Navigation} from "@mui/icons-material";
import {QueryResultData} from "./SideMap";
import LocalStorage from "../../../../constant/LocalStorage";

function addBookmark(query: QueryResultData) {
    const storedBookmarks = JSON.parse(localStorage.getItem(LocalStorage.Key.BOOKMARKS) || "[]");
    const data = {
        "title": query.place_name,
        "latitude": query.y,
        "longitude": query.x,
        "address": query.address_name,
        "timestamp" : Date.now()
    };
    storedBookmarks.push(data);
    localStorage.setItem(LocalStorage.Key.BOOKMARKS, JSON.stringify(storedBookmarks));
}

function removeBookmark(query: QueryResultData) {
    const storedBookmarks = JSON.parse(localStorage.getItem(LocalStorage.Key.BOOKMARKS) || "[]");
    const filter = storedBookmarks.filter((bookmark: {title: string, latitude: number, longitude: number, timestamp: number}) => !(bookmark.latitude === query.y && bookmark.longitude === query.x));
    localStorage.setItem(LocalStorage.Key.BOOKMARKS, JSON.stringify(filter));
}

function checkBookmarkExist(query: QueryResultData) {
    const storedBookmarks = JSON.parse(localStorage.getItem(LocalStorage.Key.BOOKMARKS) || "[]");
    return storedBookmarks.some((bookmark: {title: string, latitude: number, longitude: number, timestamp: number}) => bookmark.latitude === query.y && bookmark.longitude === query.x);
}

function addHistory(query: QueryResultData) {
    const storedHistory = JSON.parse(localStorage.getItem(LocalStorage.Key.HISTORY) || "[]");
    const data = {
        "title": query.place_name,
        "latitude": query.y,
        "longitude": query.x,
        "address": query.address_name,
        "timestamp" : Date.now()
    };

    if (checkHistoryExist(query)) removeHistory(query);
    storedHistory.push(data);
    localStorage.setItem(LocalStorage.Key.HISTORY, JSON.stringify(storedHistory));
}

function removeHistory(query: QueryResultData) {
    const storedHistory = JSON.parse(localStorage.getItem(LocalStorage.Key.HISTORY) || "[]");
    const filter = storedHistory.filter((history: {title: string, latitude: number, longitude: number, timestamp: number}) => !(history.latitude === query.y && history.longitude === query.x));
    localStorage.setItem(LocalStorage.Key.HISTORY, JSON.stringify(filter));
}

function checkHistoryExist(query: QueryResultData) {
    const storedHistory = JSON.parse(localStorage.getItem(LocalStorage.Key.HISTORY) || "[]");
    return storedHistory.some((history: {title: string, latitude: number, longitude: number, timestamp: number}) => history.latitude === query.y && history.longitude === query.x);
}

export default function SideDetail({selectedQuery, setSelectedQuery, latLng, setLatLng, currentTab, setCurrentTab, routes, setRoutes}: TransportProps) {
    return (
        <Wrapper className={!selectedQuery || currentTab !== 0 ? 'hidden' : ''}>
            <div>
                <div className={"info"}>
                    <div className={"title"}>{selectedQuery?.place_name}</div>
                    <div className={"address"}>{selectedQuery?.address_name}</div>
                </div>
                <Button variant="contained" className={"primary"} onClick={() => {
                    if (selectedQuery) {
                        addHistory(selectedQuery);
                        setCurrentTab(1)
                    }
                }}
                ><Navigation/></Button>
            </div>
            <Divider/>
            <div>
                <Button variant="contained" className={"tertiary"} onClick={() => {
                    if (selectedQuery) {
                        if (checkBookmarkExist(selectedQuery)) removeBookmark(selectedQuery);
                        else addBookmark(selectedQuery);
                    }
                }}>
                    {selectedQuery && checkBookmarkExist(selectedQuery) ? <BookmarkRemove/> : <Bookmark/>}
                </Button>
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    top: 1rem;
    left: calc(420px + 1rem);
    width: 380px;
    height: fit-content;
    z-index: 10;
    
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    background-color: ${props => props.theme.colors.colorSurfaceVariant};
    transition: left 0.3s ease;
    
    &.hidden {
        left: -460px;
    }
    
    & > div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 1rem;
        
        & > .info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            
            & > .title {
                font-size: 1.4rem;
                font-weight: bold;
            }

            & > .address {
                font-size: 0.8rem;
            }
        }

        & > button {
            box-shadow: none;
            border-radius: 2rem;

            &:hover {
                box-shadow: none;
            }
            
            &.primary {
                background-color: ${props => props.theme.colors.colorPrimary};
                color: ${props => props.theme.colors.colorOnPrimary};
                
                &:hover {
                    background-color: ${props => props.theme.colors.colorPrimaryContainer};
                    color: ${props => props.theme.colors.colorOnPrimaryContainer};
                }
            }
            
            &.tertiary {
                background-color: ${props => props.theme.colors.colorTertiary};
                color: ${props => props.theme.colors.colorOnTertiary};
                
                &:hover {
                    background-color: ${props => props.theme.colors.colorTertiaryContainer};
                    color: ${props => props.theme.colors.colorOnTertiaryContainer};
                }
            }
        }
    }
    
    
`

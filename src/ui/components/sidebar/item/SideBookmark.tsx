import React from "react";
import {TransportProps} from "../../../screens/home/transport/TransportScreen";
import LocalStorage from "../../../../constant/LocalStorage";
import styled from "styled-components";
import QueryResultRow from "./QueryResultRow";
import HistoryRow from "./HistoryRow";
import BookmarkRow from "./BookmarkRow";

export default function SideBookmark({selectedQuery, setSelectedQuery, latLng, setLatLng}: TransportProps) {
    const storedBookmarks = JSON.parse(localStorage.getItem(LocalStorage.Key.BOOKMARKS) || "[]");

    return (
        <Wrapper size={storedBookmarks.length}>
            {
                storedBookmarks.map((bookmark: { title: string; address: string; latitude: number; longitude: number; }) => (
                    bookmark ?
                        <BookmarkRow title={bookmark?.title} address={bookmark?.address} latLng={new naver.maps.LatLng(bookmark?.latitude, bookmark?.longitude)} onClick={() => {
                            console.log(bookmark);
                            if (bookmark) {
                                const data = {
                                    place_name: bookmark.title,
                                    category_group_name: "",
                                    address_name: bookmark.address,
                                    road_address_name: bookmark.address,
                                    y: bookmark.latitude,
                                    x: bookmark.longitude
                                };
                                setSelectedQuery(data);
                            }
                        }} />
                    : <></>
                ))
            }
        </Wrapper>
    )
}

const Wrapper = styled.div<{ size: number }>`
    display: flex;
    flex-direction: column;

    & > :last-child {
        border-radius: 0 0 1rem 1rem;
    }

    & > :first-child {
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
        border-bottom-left-radius: ${props => props.size === 1 ? "1rem" : "0"};
        border-bottom-right-radius: ${props => props.size === 1 ? "1rem" : "0"};
    }
`

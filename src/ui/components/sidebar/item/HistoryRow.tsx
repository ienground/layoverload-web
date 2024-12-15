import React from "react";
import styled from "styled-components";
import {QueryResultData} from "./SideMap";
import {History, LocationOn} from "@mui/icons-material";
import {diffToString, measureLocation} from "../../../../utils/Utils";

interface HistoryProps {
    title: string,
    address: string,
    latLng: naver.maps.LatLng,
    onClick: () => void,
}

export default function HistoryRow({title, address, latLng, onClick}: HistoryProps) {
    return (
        <Wrapper onClick={onClick}>
            <History />
            <div>
                <div className={"title"}>{title}</div>
                <div>{address}</div>
            </div>
        </Wrapper>
        // <>{object["address_name"]}</>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    width: calc(100% - 2rem);
    padding: 1rem;
    background-color: ${props => props.theme.colors.colorSurfaceVariant};
    transition: background-color 0.3s ease;
    
    &:hover {
        background-color: ${props => props.theme.colors.colorSurfaceContainer};
    }
    
    & > div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;

        & > .title {
            font-weight: bold;
        }
    }
`

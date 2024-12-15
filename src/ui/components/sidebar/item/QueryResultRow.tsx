import React from "react";
import styled from "styled-components";
import {QueryResultData} from "./SideMap";
import {LocationOn} from "@mui/icons-material";
import {diffToString, measureLocation} from "../../../../utils/Utils";

interface QueryResultProps {
    latLng: naver.maps.LatLng,
    data: QueryResultData,
    onClick: () => void,
}

export default function QueryResultRow({latLng, data, onClick}: QueryResultProps) {
    return (
        <Wrapper onClick={onClick}>
            <LocationOn />
            <div>
                <div>
                    <div>{data.place_name}</div>
                    <div className={"bold"}>{data.category_group_name}</div>
                </div>
                <div>
                    <div>{data.address_name}</div>
                    <div className={"bold"}>{diffToString(measureLocation(latLng, new naver.maps.LatLng(data.y, data.x)))}</div>
                    {/*<div>{data.category_group_name}</div>*/}
                </div>
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
        
        & > div {
            display: flex;
            flex-direction: row;
            width: 100%;
            justify-content: space-between;
            
            & > .bold {
                font-weight: bold;
            }
        }
    }
`

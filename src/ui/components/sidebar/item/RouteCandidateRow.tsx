import React from "react";
import styled from "styled-components";
import {QueryResultData} from "./SideMap";
import {LocationOn, Navigation} from "@mui/icons-material";
import {diffToString, measureLocation} from "../../../../utils/Utils";
import {RouteResult} from "../../../screens/home/transport/TransportScreen";
import {Button} from "@mui/material";

interface RouteCandidateProps {
    route: RouteResult,
    selected: boolean,
    onClick: () => void,
}

export default function RouteCandidateRow({route, selected, onClick}: RouteCandidateProps) {
    return (
        <Wrapper onClick={onClick} className={selected ? 'selected' : ''}>
            <div className={"info"}>
                <div className={"title"}>{route.waypoint}</div>
                <div className={"duration"}>
                    <div className={"duration"}>{getTimeStr(route.duration / 1000)}</div>
                    <div className={"distance"}>{diffToString(route.distance)}</div>
                </div>
                <div className={"taxi"}>택시비 약 {Intl.NumberFormat('ko-KR', {style: 'currency', currency: 'KRW'}).format(route.taxiFare)}</div>
            </div>
            <div className={"action"}>
                <Button variant="contained" className={"primary"} onClick={() => {}}><Navigation /></Button>
                <div>안내시작</div>
            </div>
        </Wrapper>
        // <>{object["address_name"]}</>
    )
}

function getTimeStr(duration: number): string {
    const hour = duration / 3600;
    const minute = (duration / 60) % 60;
    const result = [];
    if (hour >= 1) {
        result.push(`${hour.toFixed()}시간`);
    }

    if (minute >= 1) {
        result.push(`${minute.toFixed()}분`)
    }

    return result.join(' ');
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
    width: calc(100% - 2rem);
    padding: 1rem;
    background-color: ${props => props.theme.colors.colorSurfaceVariant};
    border-radius: 1rem;
    transition: background-color 0.3s ease;
    
    &:hover {
        background-color: ${props => props.theme.colors.colorSurfaceContainer};
    }
    
    &.selected {
        background-color: ${props => props.theme.colors.colorPrimaryContainer};
    }
    
    & > div.info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        
        & > .title {
            max-lines: 1;
        }
        
        & > .duration {
            display: flex;
            flex-direction: row;
            align-items: baseline;
            gap: 0.5rem;
            
            & > .duration {
                color: ${props => props.theme.colors.colorPrimary};
                font-weight: bold;
                font-size: xx-large;
            }
        }
        
        & > .taxi {
            color: ${props => props.theme.colors.colorOnSurface};
        }
    }
    
    & > div.action {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
        width: fit-content;
        
        & > button {
            width: fit-content;
            aspect-ratio: 1;
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
        
        & > div {
            width: fit-content;
            font-size: 0.8rem;
            color: ${props => props.theme.colors.colorOnSurfaceVariant};
        }
    }
`

import React from "react";
import styled from "styled-components";
import {RouteResult} from "../../../screens/home/transport/TransportScreen";
import RouteCandidateRow from "./RouteCandidateRow";
import {Fade} from "@mui/material";
import RouteCandidateRowSkeleton from "./RouteCandidateRowSkeleton";

export interface SideCandidateProps {
    routes: RouteResult[],
    selectedIndex: number,
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>,
}

export default function SideCandidate({routes, selectedIndex, setSelectedIndex}: SideCandidateProps) {
    return (
        <Wrapper>
            <Fade in={routes.length === 0}>
                <div>
                    <RouteCandidateRowSkeleton />
                    <RouteCandidateRowSkeleton />
                    <RouteCandidateRowSkeleton />
                </div>
            </Fade>
            <Fade in={routes.length > 0}>
                <div>
                    {
                        routes.map((route, index) =>
                            <RouteCandidateRow selected={index === selectedIndex} route={route} onClick={() => {setSelectedIndex(index)}} />
                        )
                    }
                </div>
            </Fade>
        </Wrapper>
    )
};

const Wrapper = styled.div`
    
    & > div {
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 1rem;    
        width: calc(360px - 2rem);
    }
`

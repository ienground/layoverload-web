import React, {useEffect, useState} from "react";
import {Fade, FilledInput, FormControl, IconButton, InputAdornment, InputLabel} from "@mui/material";
import {Search} from "@mui/icons-material";
import axios from "axios";
import LatLng = naver.maps.LatLng;
import {TransportProps} from "../../../screens/home/transport/TransportScreen";
import styled from "styled-components";
import QueryResultRow from "./QueryResultRow";
import LocalStorage from "../../../../constant/LocalStorage";
import HistoryRow from "./HistoryRow";

interface SearchResponse {
    documents: QueryResultData[]
}

export interface QueryResultData {
    place_name: string,
    category_group_name: string,
    address_name: string,
    road_address_name: string,
    y: number,
    x: number
}

function searchDestination(latLng: LatLng, query: string, setQueryResult: React.Dispatch<React.SetStateAction<QueryResultData[]>>) {
    axios.get<SearchResponse>(`https://dapi.kakao.com/v2/local/search/keyword.JSON?query=${query}&x=${latLng.lng()}&y=${latLng.lat()}&sort=accuracy&page=1&size=5`, {
        headers: {
            Authorization: process.env.REACT_APP_KAKAO_API_KEY
        }
    }).then(response => {
        setQueryResult(response.data.documents)
    })
}

export default function SideMap({selectedQuery, setSelectedQuery, latLng, setLatLng}: TransportProps) {
    const [query, setQuery] = useState('');
    const [queryResult, setQueryResult] = useState<QueryResultData[]>([]);
    const [isInitialized, setInitialized] = useState(true);
    const textFieldStyle = {
        width: '100%',
    }
    const histories = JSON.parse(localStorage.getItem(LocalStorage.Key.HISTORY) || "[]").sort((a: {title: string, address: string, latitude: number, longitude: number, timestamp: number}, b: {title: string, address: string, latitude: number, longitude: number, timestamp: number}) => b.timestamp - a.timestamp).slice(0, 3);

    useEffect(() => {
        setSelectedQuery(null);
    }, []);

    return (
        <Wrapper size={histories.length}>
            <FormControl sx={textFieldStyle} variant={"filled"}>
                <InputLabel>검색..</InputLabel>
                <FilledInput endAdornment={
                    <InputAdornment position={"end"}>
                        <IconButton onClick={() => {
                            searchDestination(latLng, query, setQueryResult);
                            setInitialized(false);
                        }}><Search /></IconButton>
                    </InputAdornment>
                } value={query} onChange={(e) => setQuery(e.target.value)} />
            </FormControl>
            {/*<div>{JSON.stringify(queryResult)}</div>*/}
            <div className="content">
                <div className={"list"}>
                    {queryResult?.map((result) => (
                        <QueryResultRow latLng={latLng} data={result} onClick={() => { setSelectedQuery(result) }}/>
                    ))}
                </div>
                <div className="history">
                    <div className={"title"}>최근</div>
                    {histories.map((history: {title: string, address: string, latitude: number, longitude: number, timestamp: number}) => (
                        <HistoryRow title={history.title} address={history.address} latLng={new naver.maps.LatLng(history.latitude, history.longitude)} onClick={() => { setSelectedQuery({"place_name": history.title, "category_group_name": history.address, "address_name": history.address, "road_address_name": history.address, "y": history.latitude, "x": history.longitude}) }} />
                    ))}
                </div>
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div<{size: number}>`
    & > div.MuiFormControl-root {
        & > label {
            font-family: Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            color: ${props => props.theme.name === "light" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)" };
            
            &.Mui-focused {
                color: ${props => props.theme.colors.colorPrimary };
            }
            
            &.Mui-error {
                color: ${props => props.theme.colors.colorError};
            }
        }
        & > div.MuiFilledInput-root {
            font-family: Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            background-color: ${props => props.theme.name === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)" };
            border-radius: 0.5rem 0.5rem 0 0;
        }
        
        &:has(:-webkit-autofill) > label {
            color: #000000;
            &.Mui-focused {
                color: ${props => props.theme.colors.colorPrimary };
            }
        }

        & > div.MuiFilledInput-root > input, textarea {
            transition: background-color 0.5s ease, color 0.5s ease !important;
            color: ${props => props.theme.colors.colorOnSurface };
            
            &:-webkit-autofill,
            &:-webkit-autofill:hover,
            &:-webkit-autofill:focus,
            &:-webkit-autofill:active {
                animation-name: none;
                //background-color: transparent !important;
                // background-color:  ${props => props.theme.colors.colorSurfaceVariant} !important;
                // -webkit-box-shadow: 0 0 0 30px ${props => props.theme.colors.colorSurfaceVariant} inset !important;
            }
        }
        
        & > p {
            color: ${props => props.theme.colors.colorOnSurface};
            &.Mui-error {
                color: ${props => props.theme.colors.colorError};
            }
        }
    }
    
    & > div.MuiFormControl-root > div.MuiFilledInput-root {
        &::before {
            border-bottom-color: ${props => props.theme.name === "light" ? "rgba(0, 0, 0, 0.42)" : "rgba(255, 255, 255, 0.42)" };

            &:invalid {
                //background-color: red;
            }
        }
        
        &::after {
            border-bottom-color: ${props => props.theme.colors.colorPrimary };
        }

        &.Mui-error::before {
            border-bottom-color: ${props => props.theme.colors.colorError};
        }

        &.Mui-error::after {
            border-bottom-color: ${props => props.theme.colors.colorError};
        }
    }
    
    & > div.MuiFormControl-root > div.MuiFilledInput-root > div.MuiInputAdornment-root > button {
        
        & > svg {
            fill: ${props => props.theme.colors.colorOnSurface};
            transition: color 0.3s ease;
        }
    }
    
    & > .content {
        & > .list {
            & > :last-child {
                border-radius: 0 0 1rem 1rem;
            }
        }
        
        & > .history {
            & > .title {
                padding: 1rem 0;
            }

            & > :last-child {
                border-radius: 0 0 1rem 1rem;
            }
            
            & > :nth-child(2) {
                border-top-left-radius: 1rem;
                border-top-right-radius: 1rem;
                border-bottom-left-radius: ${props => props.size === 1 ? "1rem" : "0"};
                border-bottom-right-radius: ${props => props.size === 1 ? "1rem" : "0"};
            }
        }
    }
`

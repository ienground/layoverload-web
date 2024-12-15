import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Add, DragHandle, Flag, Navigation, NearMe, RemoveCircle, Search} from "@mui/icons-material";
import {Button, FilledInput, FormControl, IconButton, InputAdornment, InputLabel} from "@mui/material";
import {RouteResult, TransportProps} from "../../../screens/home/transport/TransportScreen";
import axios from "axios";
import LatLng = naver.maps.LatLng;

function extractRepresentativeCoordinatesByCount(path: LatLng[], count: number): LatLng[] {
    if (path.length === 0 || count <= 0) return [];

    // 결과 리스트에 첫 번째 좌표를 추가
    const representativeCoords = [path[0]]

    if (path.length === 1 || count === 1) {
        return representativeCoords // 경로가 하나뿐이거나 대표 좌표가 하나인 경우
    }

    const step = (path.length - 1) / (count - 1) // 각 대표 좌표 간의 간격 계산

    for (let i = 1; i < count; i++) {
        const index = Math.min(Math.floor(i * step), path.length - 1); // 인덱스를 경로 크기 범위 내로 제한
        representativeCoords.push(path[index]);
    }

    return representativeCoords
}

function requestRouteInitial(waypoint: string, start: naver.maps.LatLng, dest: naver.maps.LatLng, setInitRoute: React.Dispatch<React.SetStateAction<naver.maps.LatLng[]>>, setRoutes: React.Dispatch<React.SetStateAction<RouteResult[]>>) {
    axios.get<RouteResponse>(`naverapi/map-direction/v1/driving?goal=${dest.lng()}%2C${dest.lat()}&start=${start.lng()}%2C${start.lat()}`, {
        headers: {
            "X-NCP-APIGW-API-KEY-ID": process.env.REACT_APP_NAVER_MAP_CLIENT_ID,
            "X-NCP-APIGW-API-KEY": process.env.REACT_APP_NAVER_MAP_CLIENT_SECRET
        }
    }).then(response => {
        if (response.data.route.traoptimal.length > 0) {
            const path = response.data.route.traoptimal[0].path.map(point => new naver.maps.LatLng(point[1], point[0]));
            if (path.length > 0) {
                const represent = extractRepresentativeCoordinatesByCount(path, 3);
                setInitRoute(represent);
                console.log(represent);
                requestWaypoints(represent, waypoint, start, dest, setRoutes);
            }
        }
    })
        .catch(error => {
            console.log(error);
        })
}

interface Meta {
    same_name: {
        region: string[];
        keyword: string;
        selected_region: string;
    };
    pageable_count: number;
    total_count: number;
    is_end: boolean;
}

interface Document {
    place_name: string;
    distance: string; // 거리 (문자열로 제공)
    place_url: string;
    category_name: string;
    address_name: string;
    road_address_name: string;
    id: string;
    phone: string;
    category_group_code: string;
    category_group_name: string;
    x: string; // 경도 (문자열로 제공)
    y: string; // 위도 (문자열로 제공)
}

interface WaypointResponse {
    meta: Meta;
    documents: Document[];
}

function requestWaypoints(routes: naver.maps.LatLng[], waypoint: string, start: LatLng, dest: LatLng, setRoutes: React.Dispatch<React.SetStateAction<RouteResult[]>>) {
    const results: RouteResult[] = [];

    routes.forEach(route => {
        axios.get<WaypointResponse>(`https://dapi.kakao.com/v2/local/search/keyword.JSON?query=${waypoint}&x=${route.lng()}&y=${route.lat()}&sort=accuracy&page=1&size=3`, {
            headers: {
                Authorization: process.env.REACT_APP_KAKAO_API_KEY
            }
        }).then(response => {
            if (response.data.documents.length > 0) {
                console.log(response.data.documents[0]);
                const title = response.data.documents[0].place_name;
                const latLng = new naver.maps.LatLng(dest.lng(), dest.lat());
                axios.get<RouteResponse>(`naverapi/map-direction/v1/driving?goal=${dest.lng()}%2C${dest.lat()}&start=${start.lng()}%2C${start.lat()}&waypoints=${response.data.documents[0].x},${response.data.documents[0].y}`, {
                    headers: {
                        "X-NCP-APIGW-API-KEY-ID": process.env.REACT_APP_NAVER_MAP_CLIENT_ID,
                        "X-NCP-APIGW-API-KEY": process.env.REACT_APP_NAVER_MAP_CLIENT_SECRET
                    }
                }).then(response => {
                    console.log(response.data);
                    if (response.data.route.traoptimal.length > 0) {
                        const summary = response.data.route.traoptimal[0].summary;
                        const path = response.data.route.traoptimal[0].path.map(point => new naver.maps.LatLng(point[1], point[0]));
                        const result = {
                            waypoint: title,
                            latLng: latLng,
                            distance: summary.distance,
                            duration: summary.duration,
                            tollFare: summary.tollFare,
                            taxiFare: summary.taxiFare,
                            path: path
                        }
                        results.push(result)
                    }
                })
                    .catch(error => {
                        console.log(error);
                    })
            }
        })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setRoutes(results);
            })
    })
}

function toRoadAddress(results: Result[]): string {
    const address = results.find(result => result.name === "roadaddr");

    if (address) {
        const result: string[] = [];
        const area1 = address.region.area1.name;
        const area2 = address.region.area2.name;
        const area3 = address.region.area3.name;
        const land = address.land?.name ? address.land?.name : "";
        const number1 = address.land?.number1 ? address.land?.number1 : "";
        const number2 = address.land?.number2;

        if (area1 !== "") result.push(area1);
        if (area2 !== "") result.push(area2);
        if (area3 !== "") result.push(area3);
        if (land !== "") result.push(land);

        if (number2 === "") result.push(number1)
        else result.push(`${number1}-${number2}`)

        return result.join(" ");


    } else return ""
}

function toAddress(results: Result[]): string {
    const address = results.find(result => result.name === "addr");

    if (address) {
        const result: string[] = [];
        const area1 = address.region.area1.name;
        const area2 = address.region.area2.name;
        const area3 = address.region.area3.name;
        const area4 = address.region.area4.name;
        const number1 = address.land?.number1 ? address.land?.number1 : "";
        const number2 = address.land?.number2;

        if (area1 !== "") result.push(area1);
        if (area2 !== "") result.push(area2);
        if (area3 !== "") result.push(area3);
        if (area4 !== "") result.push(area4);

        if (number2 === "") result.push(number1)
        else result.push(`${number1}-${number2}`)

        return result.join(" ");


    } else return ""
}

interface CenterCoords {
    crs: string;
    x: number;
    y: number;
}

interface Area {
    name: string;
    coords: {
        center: CenterCoords;
    };
    alias?: string; // alias는 선택적 속성
}

interface Code {
    id: string;
    type: string;
    mappingId: string;
}

interface Land {
    type: string;
    number1: string;
    number2: string;
    addition0: Addition;
    addition1: Addition;
    addition2: Addition;
    addition3: Addition;
    addition4: Addition;
    coords: {
        center: CenterCoords;
    };
    name: string;
}

interface Addition {
    type: string;
    value: string;
}

interface Result {
    name: string;
    code: Code;
    region: {
        area0: Area;
        area1: Area;
        area2: Area;
        area3: Area;
        area4: Area;
    };
    land?: Land; // land는 선택적 속성
}

interface ApiResponse {
    results: Result[];
}

interface RouteResponse {
    code: number;
    message: string;
    currentDateTime: string;
    route: {
        traoptimal: Traoptimal[];
    };
}

interface Traoptimal {
    summary: Summary;
    path: number[][]; // 경로 좌표 배열 (x, y)
    section: Section[];
    guide: Guide[];
}

interface Summary {
    start: {
        location: number[]; // 시작 위치 좌표 [longitude, latitude]
    };
    goal: {
        location: number[]; // 목표 위치 좌표 [longitude, latitude]
        dir: number; // 방향
    };
    distance: number; // 총 거리 (미터)
    duration: number; // 총 소요 시간 (초)
    departureTime: string; // 출발 시간
    bbox: [number[], number[]]; // 경계 박스 좌표 [[minLng, minLat], [maxLng, maxLat]]
    tollFare: number; // 통행료
    taxiFare: number; // 택시 요금
    fuelPrice: number; // 연료 비용
}

interface Section {
    pointIndex: number; // 포인트 인덱스
    pointCount: number; // 포인트 수
    distance: number; // 거리 (미터)
    name: string; // 도로 이름
    congestion: number; // 혼잡도 (0: 원활, 1: 보통, 2: 혼잡)
    speed: number; // 속도 (km/h)
}

interface Guide {
    pointIndex: number; // 포인트 인덱스
    type: number; // 안내 타입
    instructions: string; // 안내 메시지
    distance: number; // 남은 거리 (미터)
    duration: number; // 남은 시간 (초)
}

function convertAddress(latLng: naver.maps.LatLng, setAddress: React.Dispatch<React.SetStateAction<string>>) {
    // @ts-ignore
    // console.log(process.env.REACT_APP_NAVER_MAP_CLIENT_ID);
    // console.log(process.env.REACT_APP_NAVER_MAP_CLIENT_SECRET);
    // fetch(`https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${latLng.lng()}%2C${latLng.lat()}&output=json&orders=legalcode%2Cadmcode%2Caddr%2Croadaddr`, {
    //     mode: 'no-cors',
    //     method: 'GET',
    //     headers: {
    //         "X-NCP-APIGW-API-KEY-ID": process.env.REACT_APP_NAVER_MAP_CLIENT_ID || "fd38h4wr3e",
    //         "X-NCP-APIGW-API-KEY": process.env.REACT_APP_NAVER_MAP_CLIENT_SECRET || "mzF8dkqK4euyaBc7XtWCuPm4NyCo4Q4TGke1KkfX",
    //     }
    // })
    // axios.get<ApiResponse>(`https://ienlab-layoveroad.cloudfunctions.net/proxyNaverAPI?lat=${latLng.lat()}&lng=${latLng.lng()}`, {
    // axios.get<ApiResponse>(`https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${latLng.lng()}%2C${latLng.lat()}&output=json&orders=legalcode%2Cadmcode%2Caddr%2Croadaddr`, {
    axios.get<ApiResponse>(`naverapi/map-reversegeocode/v2/gc?coords=${latLng.lng()}%2C${latLng.lat()}&output=json&orders=legalcode%2Cadmcode%2Caddr%2Croadaddr`, {
        headers: {
            "X-NCP-APIGW-API-KEY-ID": process.env.REACT_APP_NAVER_MAP_CLIENT_ID,
            "X-NCP-APIGW-API-KEY": process.env.REACT_APP_NAVER_MAP_CLIENT_SECRET,
        }
    })
        .then(response => {
            console.log(`req: ${JSON.stringify(response.request)}`);
            console.log(`header: ${JSON.stringify(response)}`);
            console.log(`config: ${JSON.stringify(response.config)}`);
            // console.log(`data: ${response.request}`);
            // console.log(`data: ${JSON.stringify(response.data)}`);
            setAddress(toRoadAddress(response.data.results))
        })
        .catch(error => {
            console.log(error);
        })
}

export default function SideRoute({selectedQuery, setSelectedQuery, latLng, setLatLng, currentTab, setCurrentTab, routes, setRoutes}: TransportProps) {
    // const textFieldStyle = {
    //     width: '100%',
    // }
    const [currentAddress, setCurrentAddress] = useState("");
    const [waypointVisible, setWaypointVisible] = useState(false);
    const [waypoint, setWaypoint] = useState("");
    const [initRoute, setInitRoute] = useState<naver.maps.LatLng[]>([]);

    useEffect(() => {
        convertAddress(latLng, setCurrentAddress);
    }, []);

    return (
        <Wrapper>
            <div>
                <NearMe />
                <FormControl variant={"filled"}>
                    <InputLabel>출발지</InputLabel>
                    <FilledInput value={currentAddress} onChange={(e) => {}} />
                </FormControl>
            </div>
            {
                waypointVisible ?
                <div>
                    <DragHandle />
                    <FormControl variant={"filled"}>
                        <InputLabel>경유지</InputLabel>
                        <FilledInput endAdornment={
                            <InputAdornment position={"end"}>
                                <IconButton onClick={() => {
                                    setWaypointVisible(false);
                                }}><RemoveCircle /></IconButton>
                            </InputAdornment>
                        } value={waypoint} onChange={(e) => { setWaypoint(e.target.value) }} />
                    </FormControl>
                </div> : <></>
            }
            <div>
                <Flag />
                <FormControl variant={"filled"}>
                    <InputLabel>도착지</InputLabel>
                    <FilledInput endAdornment={
                        !waypointVisible ? <InputAdornment position={"end"}>
                            <IconButton onClick={() => {
                                setWaypointVisible(true);
                            }}><Add /></IconButton>
                        </InputAdornment> : <></>
                    } value={selectedQuery?.place_name} onChange={(e) => {}} />
                </FormControl>
            </div>
            <Button className={"primary"} variant="contained" onClick={() => {
                if (selectedQuery) {
                    requestRouteInitial(waypoint, latLng, new naver.maps.LatLng(selectedQuery.y, selectedQuery.x), setInitRoute, setRoutes);
                    setSelectedQuery(null);
                    setCurrentTab(2);
                }
            }}><Navigation /></Button>

        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    
    & > div {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
        
        & > div.MuiFormControl-root {
            width: 100%;
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
        
    }
    
    & > button {
        box-shadow: none;
        border-radius: 2rem;
        margin-top: 1rem;

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
`

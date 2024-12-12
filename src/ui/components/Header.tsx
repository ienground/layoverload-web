import React from "react";
import styled, {useTheme} from "styled-components";
import {SidebarProps} from "./Sidebar";
import {AppProps} from "../../App";
import mainIcon from "../../assets/icon_final.svg";
import {Icon} from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {Bookmarks, ForkLeft, Map} from "@mui/icons-material";

type Props = SidebarProps & AppProps;

export default function Header({isOpen, setIsOpen, darkMode, setDarkMode}: Props) {
    const theme = useTheme();

    return (
        <Wrapper>
            <MenuButtonGroup>
                <Logo />
                <MenuButton>
                    <Icon baseClassName={"material-icons-round"}><Map /></Icon>
                    <div>지도</div>
                </MenuButton>
                <MenuButton>
                    <Icon baseClassName={"material-icons-round"}><ForkLeft /></Icon>
                    <div>길찾기</div>
                </MenuButton>
                <MenuButton>
                    <Icon baseClassName={"material-icons-round"}><Bookmarks /></Icon>
                    <div>북마크</div>
                </MenuButton>
            </MenuButtonGroup>

            <MenuButton className={"last"} onClick={() => setDarkMode(!darkMode)}>
                <Icon baseClassName={"material-icons-round"}>{darkMode ? <DarkModeIcon/> : <LightModeIcon/>}</Icon>
                {/*<Icon baseClassName={"material-icons-round"} sx={iconStyle}>{darkMode ? "dark_mode" : "light_mode"}</Icon>*/}
            </MenuButton>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    top: 0;
    left: 0;
    width: 60px;
    height: 100%;
    z-index: 999;
    
    transition: border-right-color, background-color 0.3s ease;
    border-right: 1px solid ${props => props.theme.colors.colorSurfaceVariant};
    background-color: ${props => props.theme.colors.colorSurface};
`

const Logo = styled.button`
    aspect-ratio: 1;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-color: transparent;
    background-image: url(${mainIcon});
    border: none;
    border-bottom: 1px solid ${props => props.theme.colors.colorSurfaceVariant};
    transition: background-image, border-bottom-color 0.3s ease;
`

const MenuButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
`

const MenuButton = styled.button`
    aspect-ratio: 1;
    border: none;
    background-color: transparent;
    transition: background-color 0.3s ease;
    
    &.last {
        border-top: 1px solid ${props => props.theme.colors.colorSurfaceVariant};
    }
    
    & > span, div {
        color: ${props => props.theme.colors.colorOnSurface};
        transition: color 0.3s ease;
    }
    
    &:hover {
        background-color: ${props => props.theme.colors.colorPrimary};
        
        & > span, div {
            color: ${props => props.theme.colors.colorOnPrimary}
        }
    }
`

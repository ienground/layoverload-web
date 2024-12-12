import React from "react";
import styled from "styled-components";

export interface SidebarProps {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({isOpen, setIsOpen}: SidebarProps) {
    return (
        <Wrapper className={isOpen ? 'open' : ''}>
            <ContentWrapper />
            <Handle onClick={() => setIsOpen(!isOpen)}/>
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
    transition: left 0.3s ease;
    
    &.open {
        left: 60px;
    }
`

const ContentWrapper = styled.div`
    width: 400px;
    height: 100%;
    
    transition: background-color 0.3s ease;
    background-color: ${props => props.theme.colors.colorSurface};
`

const Handle = styled.button`
    width: 20px;
    height: 40px;

    transition: background-color 0.3s ease;
    background-color: ${props => props.theme.colors.colorPrimary};
`

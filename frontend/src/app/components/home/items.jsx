import styled from "styled-components";
import { FaSearch } from 'react-icons/fa';

import { colorData } from "../color.data";

export const Dropdown = styled.div`
    position: relative;
    display: inline-block;
    margin-right: ${props => props.$margin ? '20px' : '0px'};
`;

export const DropdownTrigger = styled.div`
    cursor: pointer;
`;

export const DropdownMenu = styled.div`
    display: flex;
    flex-direction: column;

    position: absolute;
    right: 5%;

    border-radius: 5px;

    margin-top: 20px;

    background-color: ${colorData.primary};

    /* min-width: 200px; */
    /* width: fit-content; */
    max-width: 15em;
    max-height: 21em;

    z-index: ${props => props.$isOpen ? '1' : '0'};
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};

    opacity: ${props => props.$isOpen ? '1' : '0'};
    transition: opacity 0.4s ease, visibility 0.4s ease, z-index 0.4s ease;

    overflow-y: scroll;    
    scrollbar-width: none;
`;

export const DropdownItem = styled.button`
    display: flex;
    align-items: center;
    /* justify-content: cen; */

    color: ${colorData.quaternary};

    padding: 12px 16px;

    cursor: pointer;

    text-transform: capitalize;

    width: 100%;

    padding-top: ${props => props['border-top'] ? '15px' : '12px'};
    padding-bottom: ${props => props['border-bottom'] ? '15px' : '12px'};

    font-size: 20px;
    /* word-wrap: break-word;
    white-space: pre-wrap; */

    &:hover {
        background-color: ${colorData.secondary};
        color: white;
        border-radius: ${props => props['border-top'] ? '5px 5px 0 0' : props['border-bottom'] ? '0 0 5px 5px' : '0'};
    }
`;

export const DropdownNotif = styled(DropdownItem)`
    width: 15em;
    text-transform: none;
    word-wrap: break-word;
    white-space: pre-wrap;
`;

export const BtnContainer = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
`;

export const HeaderBtn = styled.button`
    background-color: ${colorData.primary};
    color: ${colorData.quaternary};

    margin: ${props => props.$margin ? '0px 40px 0px 20px' : '0px 0px 0px 20px'};

    border: solid 1px ${colorData.secondary};
    border-radius: 10px;
    
    display: flex;
    align-items: center;
    
    cursor: pointer;
    transition: all ease-in-out .2s;

    &:hover {
        background-color: #80808089;
        color: white;
        border-color: white;
    }
`;

export const SearchBar = styled.input`
    background-color: transparent;
    font-size: ${props => props.fontSize};
    border: none;
    border-radius: 3px;
    width: 100%;
    padding: 5px;
    color: white;

    transition: all ease-in-out .2s;
    
    &::placeholder {
        color: white;
    }

    &:focus-within {
        outline: none;
        font-weight: 300;
    }
`;

export const SearchIcon = styled(FaSearch)`
    color: white;
    margin: ${props => props.$isfocused ? '0' : '0px 10px 0px 10px'};
    font-size: ${props => props.$isfocused ? '0' : '0.8em'};
    transition: font-size 0.3s ease;
`;

export const SearchContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    width: ${props => props.width};
    height: ${props => props.height};

    position: relative;

    border: ${props => props.$isfocused ? `solid 1px ${colorData.quinary}` : `solid 1px ${colorData.secondary}`};
    border-radius: 8px;

    padding: 3px;

    transition: all ease-in-out .2s;
    /* background-color: ${props => props.$isfocused ? '${colorData.secondary}' : '#${colorData.primary}'}; */
    background-color: ${colorData.primary};
    color: white;
`;

export const LoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100vw;
    /* height: 10px; */
`;

export const SearchBarSuggestions = styled.div`
    /* top: 100%; // cela positionne le haut de SearchBarSuggestions juste en dessous du bas de SearchContainer     */
    z-index: 999;
    width: auto;
    height: auto;
    background-color: ${colorData.primary};
    border-radius: 1px;
    border: solid 1px ${colorData.secondary};
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
    position: relative;
`;

export const SuggestionsContainer = styled.div`
    width: auto;
    height: 100%;
    flex-direction: column;
    align-items: center;
    left : 45%;
    padding: 10px;
    color: white;
    
    cursor: pointer;
    position: absolute;
    top: 55px;
`;

export const AcceptButton = styled.button`
    background-color: ${colorData.primary};
    color: ${colorData.quaternary};
    border: solid 1px ${colorData.secondary};
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
    transition: all ease-in-out .2s;

    &:hover {
        background-color: #80808089;
        color: white;
        border-color: white;
    }
`;

export const DeclineButton = styled.button`
    background-color: ${colorData.primary};
    color: ${colorData.quaternary};
    border: solid 1px ${colorData.secondary};
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
    transition: all ease-in-out .2s;

    &:hover {
        background-color: #80808089;
        color: white;
        border-color: white;
    }
`;

export const NotifItem = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${colorData.quinary};
    position: absolute;
    left: 106px;
`;
import styled from "styled-components";
import { colorData } from "../color.data";

export const Container = styled.div`
    background-color: ${colorData.tertiary};

    /* width: 17%; */
    width: ${props => props.$msgMode ? '25%' : '17%'};

    border-width: ${props => props['$border-width']};
    border-style: solid;
    border-color: ${colorData.secondary};

    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: auto;

    transition: all ease-in-out .2s;
`;

export const RadioLabel = styled.label`
    width: 50%;
    height: 100%;

    appearance: none;

    background-color: ${colorData.tertiary};
    color: ${colorData.quaternary};

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 25px;
    font-weight: 600;

    padding-top: 4px;

    cursor: pointer;

    &:hover {
        background-color: ${colorData.secondary};
        color: white;
    }
`;

export const Switcher = styled.div`
    display: flex;
    flex-direction: row;

    text-transform: capitalize;

    width: 100%;
    height: 6%;

    border-bottom: solid 1px ${colorData.secondary};

    input[type='radio']:checked + ${RadioLabel} {
        background-color: ${colorData.quinary};
        color: white;
    }
`;

export const Friend = styled.button`
    width: 100%;
    /* height: 100%; */
    /* height: ${props => props.$chat ? '0' : '100%'}; */

    background-color: transparent;
    color: ${colorData.quaternary};

    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 20px;
    font-weight: 500;

    border-radius: 4px;
    border-bottom: ${props => props.$chat ? 'solid 1px ' + colorData.secondary :'none'};
/* 
    margin-top: ${props => props.$chat ? '0' : props.$msgIsOpen ? '2%' : '3%'}; */
    padding: 15px;

    transition: all ease-in-out .2s;

    cursor: pointer;

    &:hover {
        color: white;
        background-color: ${props => props.$chat ? `${colorData.nonary}`: 'transparent'};
    }
`;

export const Status = styled.div`
    width: 10px;
    height: 10px;

    background-color: ${colorData.quinary};

    border-radius: 50%;

    margin-left: 10px;
`;

export const NameContainer = styled.div`
    max-width: 75%;
    max-height: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
`;
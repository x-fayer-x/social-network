import styled from "styled-components";
import { colorData } from "../color.data";

export const Title = styled.h1`
    color: white;

    font-size: 2em;
    font-weight: bold;
    font-family: Arial, sans-serif;
    text-align: center;

    padding-top: 20px;
    padding-bottom: 70px;
    height: 7vh;

    border-bottom: solid 1px ${colorData.secondary};
    /* margin-bottom: 10%; */
`;

export const Content = styled.div`
    display: flex;
    flex-direction: row;

    justify-content: space-evenly;
    align-items: center;

    background-color: #131418;
    color: ${colorData.quaternary};

    height: 90vh;
    /* padding-bottom: 100px; */

    /* margin-top: 5vh; */
`;

export const BtnContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const StyledLink = styled.button`
    background-color: ${colorData.tertiary};
    color: ${colorData.quaternary};

    border: solid 1px ${colorData.secondary};
    border-radius: 10px;

    padding: 10px 20px;
    margin: 20px 0;

    width: 300px;

    font-size: 20px;

    &:hover {
        background-color: ${colorData.secondary};
        border: solid 1px ;
        color: white;
    }
`;

export const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 1.5em;
`;
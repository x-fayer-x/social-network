import styled from "styled-components";
import { colorData } from "../color.data";

export const HeaderBar = styled.div`
background-color: ${colorData.primary};
color: white;

padding: 0 15px;
margin-bottom: 20px;

width: 100vw;
height: 7vh;

font-size: 1.5em;
font-weight: bold;
font-family: Arial, sans-serif;
text-transform: uppercase;

display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;

border-bottom: solid 1px ${colorData.secondary};

position: fixed;
z-index: 100;
`;

export const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;
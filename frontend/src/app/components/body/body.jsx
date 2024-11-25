import styled from "styled-components";
import {colorData} from "../color.data";

export const Body = styled.div`
    background-color: ${colorData.primary};
    height: 93vh;

    display: flex;
    flex-direction: row;
    justify-content: space-between;

    position: relative;
    top: 7vh;
`;
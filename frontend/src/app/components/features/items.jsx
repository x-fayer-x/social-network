import styled from "styled-components";
import Link from "next/link";
import { colorData } from "../color.data";

export const Feature = styled(Link)`
    width: 86%;
    height: 8%;

    background-color: ${colorData.tertiary};
    color: ${colorData.quaternary};

    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 20px;
    font-weight: 500;
    text-transform: capitalize;

    border: solid 1px ${colorData.secondary};
    border-radius: 10px;

    margin-top: 6%;
    padding: 0 10px;

    cursor: pointer;

    &:hover {
        /* background-color: ${colorData.secondary}; */
        background-color: ${colorData.quinary};
        /* color: ${colorData.quinary}; */
        color: white;
    }
`;

export const FeatureBtn = styled(Feature).attrs({ as: 'button' })`
`;
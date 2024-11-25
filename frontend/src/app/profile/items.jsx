import styled from 'styled-components';

import { Label } from '../register/page.jsx';
import { colorData } from '../components/color.data.js';

export const ToggleContainer = styled.div`
    width: 100%;

    display: flex;
    flex-direction: row;
`;

export const ChatBtn = styled.button`
    width: ${props => props.$pending == 1 ? '40%' : '0%'};
    height: 50px;

    background-color: ${colorData.quinary};
    color: white;

    border-radius: 10px;
    border: solid 1px ${colorData.secondary};

    margin-top: 10px;

    cursor: pointer;

    transition: 0.2s;

    position: relative;
    left: 15%;

    &:hover {
        background-color: ${colorData.senary};
    }   

    opacity: ${props => props.$pending == 1 ? '1' : '0'};
`;

export const FollowersBtn = styled(Label).attrs({ as: 'button' })`
    width: fit-content;
    &:hover {
        color: white;
    }
`;

export const FollowButton = styled.button`
    position: relative;
    left: ${props => props.$pending ? '5%' : '5%'};

    width: ${props => props.$pending == 1 ? '40%' : '90%'};
    height: 50px;
    /* #fa000061 */
    background-color: ${props => props.$pending != -1 ? `${colorData.tertiary}` : `${colorData.quinary}`};
    color: white;
    
    border-radius: 10px;
    border: solid 1px ${colorData.secondary};

    margin-top: 10px;

    cursor: pointer;

    transition: 0.2s;

    font-weight: 500;
    font-size: ${props => props.$pending != -1 ? '15px' : '20px'};

    &:hover {
        background-color: ${props => props.$pending != -1 ? `${colorData.secondary}` : `${colorData.senary}`};
        color: white;
        /* border: solid 1px white; */
        /* border: ${props => props.pending ? 'solid 1px white' : 'solid 1px ${colorData.secondary}'}; */
    }
`;

export const ProfileContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
`;

export const BannerContainer = styled.div`
    width: 90%;
    height: fit-content;

    padding: 15px;
    /* margin-left: 10%; */

    display: flex;
    flex-direction: column;

    background-color: ${colorData.tertiary};
    color: white;
    
    border-radius: 10px;
    border: solid 1px ${colorData.secondary};
`;

export const FollowInfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    

    width: 100%;
    height: 50px;

    text-align: center;
    font-size: 20px;

    margin-top: 10px;
`;

export const ProfileInfosContainer = styled.div`
    width: 30%;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding-top: 30px;
    margin-right: 0;

    background-color: #1C1F24;
    border-right: solid 1px #46505a;
`;


export const ProfilePic = styled.button`
    width: 80px;
    height: 80px;

    border-radius: 50%;
    border: solid 1px ${colorData.secondary};

    /* background-color: ${colorData.tertiary}; */
    color: ${colorData.quaternary};

    display: flex;
    justify-content: center;
    align-items: center;

    /* margin-left: 10%; */

    cursor: pointer;

    transition: 0.2s;
    &:hover {
        background-color: ${colorData.secondary};
        color: white;
        border: solid 1px white;
    }
`;

export const ProfileBody = styled.div`
    width: 60%;
    height: 100%;

    margin-bottom: 30px;
    padding: 10px 0;
    flex: 1;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const Banner = styled.div`
    width: 90%;
    height: 100px;
    color: white;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;

    margin-left: 10%;
`;

export const Username = styled.h1`
    font-size: 30px;
    font-weight: 400;
    margin-left: 5%;

    text-transform: capitalize;
`;

export const SubName = styled.h3`
    font-size: 15px;
    font-weight: 300;
    margin-left: 5%;
    color: ${colorData.quaternary};
`;

export const NameContainer = styled.div`
    display: flex;
    flex-direction: column;
    /* justify-content: center;
    align-items: center; */
    width: 80%;
    /* margin-left: 5%; */
    /* text-align: center; */
`;

export const SideInfosContainer = styled.div`
    width: 90%;
    height: fit-content;
    max-height: 65%;

    margin-top: 30px;
    padding: 20px;
    /* margin-left: 10%; */
    /* margin-right: 10%; */

    display: flex;
    flex-direction: column;

    background-color: ${colorData.tertiary};
    color: white;

    border-radius: 10px;
    border: solid 1px ${colorData.secondary};
`;

export const BaseInfosContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;

    margin-top: 20px;
`;

export const LabelInfo = styled(Label)`
    width: fit-content;
    /* margin-left: 3%; */
    margin-right: 3%;
`;

export const DescriptionContent = styled.div`
    width: 100%;

    margin-top: 20px;
    /* margin-left: 5%; */
    padding: 10px;

    border-radius: 10px;
    border: solid 1px ${colorData.secondary};
`;

export const PrivacyContainer = styled.div`
    width: 100%;
    height: fit-content;

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;

    font-size: 20px;
    font-weight: 600;

    color: #1DB954;

    cursor: pointer;
`;
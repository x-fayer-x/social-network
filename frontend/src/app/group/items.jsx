import styled from 'styled-components';
import { colorData } from '../components/color.data';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined.js';

export const GroupContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 66%;
    height: 100%;
`;


export const BannerContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: ${props => props.$isScrolled ? '5%' : '15%'};
    position: relative;
    /* border-bottom: 1px solid ${colorData.secondary}; */
    transition: all ease-in-out .2s;
`;

export const Banner = styled.div`
    display: flex; 
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: ${colorData.tertiary};
    padding: 10px;
`;

export const BannerSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const BannerBtn = styled.button`
    border: 1px solid ${colorData.secondary};
    border-radius: 5px;
    color: ${colorData.quaternary};
    margin-right: 10px;
    font-size: ${props => props.$isScrolled ? '15px' : '20px'};
    padding: ${props => props.$isScrolled ? '2px' : '5px'};
    &:hover {
        background-color: ${colorData.quinary};
        color: white;
    }
`;

export const DescriptionBanner = styled.div`
    width: 100%;
    height: 15%;
    background-color: ${colorData.tertiary};
    padding: 10px;
    border-bottom: 1px solid ${colorData.secondary};
    color: ${colorData.quaternary};
    font-size: 20px;
`;
// export const InviteBtn = styled.button`
//     border: 1px solid ${colorData.secondary}
//     border-radius: 5px;
// `;

export const IconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${props => props.$isScrolled ? '30px' : '100px'};
    height: ${props => props.$isScrolled ? '30px' : '100px'};
    border: 1px solid ${colorData.secondary};
    border-radius: ${props => props.$isScrolled ? '8px' : '15px'};;
    margin: 20px;
    color: ${colorData.quaternary};
    transition: all ease-in-out .2s;
`;

export const GroupIcon = styled(Groups2OutlinedIcon)`
    font-size: 70px;
`;

export const GroupName = styled.h1`
    /* font-size: 40px;
    font-weight: 700; */
    font-size: ${props => props.$isScrolled ? '20px' : '40px'};
    font-weight: ${props => props.$isScrolled ? '500' : '700'};
    /* color: white; */
    color: ${colorData.quaternary};
    margin-right: ${props => props.$isScrolled ? '10px' : '0'};
    transition: all ease-in-out .2s;
`;

export const Members = styled.h2`
    /* font-size: 20px;
    font-weight: 500; */
    font-size: ${props => props.$isScrolled ? '16px' : '20px'};
    font-weight: ${props => props.$isScrolled ? '400' : '500'};
    /* color: ${colorData.secondary}; */
    color: ${colorData.quinary};
`;

export const BaseInfosContainer = styled.div`
    display: flex;
    flex-direction: ${props => props.$isScrolled ? 'row' : 'column'};
    justify-content: flex-start;
    align-items: ${props => props.$isScrolled ? 'center' : 'start'};
    margin-left: 10px;
    transition: all ease-in-out .2s;
`;

export const PostsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: ${props => props.$isScrolled ? '80%' : '70%'};
    /* bottom: ${props => props.$isScrolled ? '5%' : '0'}; */
    position: relative;
    transition: all ease-in-out .2s;
    /* top: 7%; */
    /* margin-top: 10%; */
    /* background-color: #f0f0f0; */
`;
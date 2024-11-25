import styled from "styled-components";
import { colorData } from "../color.data";

export const PostContainer = styled.div`
    background-color: ${colorData.tertiary};
    color: white;   

    width: ${props => props.width ? props.width : '50%'};
    height: fit-content;
    min-height: 5vh;
    
    margin-bottom: 30px;
    padding: 10px 0;
    margin-left: ${props => props.width ? '0' : '24%'};
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    border-radius: 10px;
    border: solid 1px ${colorData.secondary};
`;

export const PostHeader = styled.div`
    width:90%;

    display: flex;
    flex-direction: row;
    align-items: center;
    padding: ${props => props.$padding ? props.$padding : '0'};
`;

export const ProfilePic = styled.button`
    color: ${colorData.quaternary};

    /* border: solid 1px ${colorData.secondary}; */
    border: ${props => props.$img != '' ? 'none' : 'solid 1px ' + colorData.secondary};
    border-radius: 50%;

    padding: 3px;
    margin-right: 20px;

    width: 45px;
    height: 45px;
`;


export const PostInfo = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: space-between;
`;

export const PostUsername = styled.h3`
    font-size: 1.1em;
    cursor: pointer;
`;

export const PostDate = styled.p`
    font-size: 0.8em;
    position: relative;
`;

export const PostContent = styled.div`
    display: flex;
    flex-direction: column;
    flex:1;
    
    height: fit-content;
    width:100%;

    margin-top: 10px;
    padding: 10px 20px;
    
    border: solid 1px ${colorData.secondary};
    border-left: none;
    border-right: none;
`;

export const ReadButton = styled.button`
    color: ${colorData.quinary};
    border: none;
    font-weight: bold;
    margin-top: 10px;

    transition: all ease-in-out .2s;
    &:hover {
        color: ${colorData.senary};
    }
`;

export const PostText = styled.p`
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 20px;
    letter-spacing: 1.2px;

    max-height: ${props => props.$readMore ? 'fit-content' : '145px'};

    overflow: hidden;

    word-wrap: break-word;

    transition: .2s;
`;

export const PostImage = styled.div`
    background-color: white;
    /* height: fit-content; */
    margin-top: 20px;
    color:black;
    position: relative;
    width: auto;
    height: 300px;
`;

export const Img = styled.img`
    width: auto;
    height: 200px;
    object-fit: cover;
`;

export const PostFooter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 90%;

    margin-top: 10px;
`;

export const Button = styled.button`
    position: relative;
    color: ${colorData.quaternary};
    
    /* border: solid 1px ${colorData.secondary}; */
    border-radius: 10px;
    
    width: 40px;
    height: 40px;
    
    display: flex;
    justify-content: center;
    align-items: center;
    
    cursor: pointer;
    transition: all ease-in-out .2s;

    &:hover {
        /* background-color: #80808089; */
        color: white;
        /* border-color: white; */
    }
`;

export const LikeIconContainer = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform ease-in-out .2s;
    transform: ${props => props.$liked ? 'scale(0)' : 'scale(1)'};

    &:hover {
        opacity: ${props => props.$liked ? '1' : '0.8'};
    }
`;


export const PostFeedContainer = styled.div`
    width: ${props => props.width};

    padding-top: 20px;

    flex: 1;

    overflow-y: scroll;
    overflow-x: hidden;
    -ms-overflow-style: none;
    scrollbar-width: none;  
    &::-webkit-scrollbar {
        display: none;
    }
`;

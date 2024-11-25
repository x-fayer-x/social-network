import React from "react";
import styled from "styled-components";

import { colorData } from "../../color.data";
import { ProfilePic } from "../../post/items";

import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';

function MsgComponent({ msgType, children }) {
    return (
        <Message $msgType={msgType}>
            {msgType == 0 &&
                <MessageProfilePic>
                    <PermIdentityOutlinedIcon style={{ fontSize: '18px' }}></PermIdentityOutlinedIcon>
                </MessageProfilePic>
            }
            <MessageContainer $msgType={msgType}>
                <MessageContent>{children}</MessageContent>
            </MessageContainer>
        </Message>
    )
}

export const Message = styled.div`
    width: 100%;
    height: auto;

    display: flex;
    flex-direction: row;
    justify-content: ${props => props.$msgType == 0 ? 'flex-start' : 'flex-end'};
    align-items: flex-start;

    padding: 10px;
`;

export const MessageProfilePic = styled(ProfilePic)`
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
`;

export const MessageContent = styled.div`
    width: 100%;
    height: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
`;

export const MessageContainer = styled.div`
    width: fit-content;
    max-width: 63%;
    min-width: 5%;
    min-height: 32px;
    /* float: right; */
    height: auto;

    border: ${props => props.$msgType == 0 ? `1px solid ${colorData.secondary}` : `1px solid ${colorData.quinary}`};
    border-radius: 5px;
    padding: 5px;
`;



export default MsgComponent;
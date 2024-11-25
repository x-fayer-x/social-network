import React, { useState } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";

import { Container } from "../contacts/items.jsx";
import { useUser } from "../../contexts/user.js";
import { Feature, FeatureBtn } from "./items.jsx";
import { FollowersModal, GroupsModal, EventsModal } from "../modal/modal.jsx";

import { useLoading } from "../../contexts/loading_context.js";
import { usePost } from "../../contexts/post.js";

import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';

export default function FeaturesContainer() {
    const { user, setUser } = useUser();
    const { postData, setPostData } = usePost();

    const { loading, setLoading, data, setData } = useLoading();
    const [followersIsOpen, setFollowersIsOpen] = useState(false);
    const [eventIsOpen, setEventIsOpen] = useState(false);
    const [groupsIsOpen, setGroupsIsOpen] = useState(false);

    const handleStalk = () => { // implémenter logique gestion données coté front
        setLoading(true);
        fetch(`https://localhost:8080/api/user/{${user.uuid}}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log("data : ", data);
            setData(data);
            localStorage.setItem('data', JSON.stringify(data));
            setPostData(data.posts);
        });
    }

    return (
        <Container
            $border-width={'0px 1px 0px 0px;'}
        >
            <Feature href='/profile'>
                <TestDiv onClick={() => handleStalk()}>
                    {user.avatar && user.avatar != '' ? <img src={user.avatar} style={{ width: '35px', height: '35px', borderRadius: '50%' }}></img> :
                        <PermIdentityOutlinedIcon style={{ fontSize: '31px' }}></PermIdentityOutlinedIcon>
                    }
                    {user.nickname != '' ? user.nickname : user.firstname + ' ' + user.lastname}
                    <div style={{ width: '10%', height: '100%' }}></div>
                </TestDiv>
            </Feature>
            <FeatureBtn onClick={() => setFollowersIsOpen(true)}>
                <GroupOutlinedIcon style={{ fontSize: '31px' }}></GroupOutlinedIcon>
                Followers
                <div style={{ width: '10%', height: '100%' }}></div>
            </FeatureBtn>
            <FeatureBtn onClick={() => setEventIsOpen(true)}>

                <EventNoteOutlinedIcon style={{ fontSize: '31px' }}></EventNoteOutlinedIcon>
                Events
                <div style={{ width: '10%', height: '100%' }}></div>
            </FeatureBtn>
            <FeatureBtn onClick={() => setGroupsIsOpen(true)}>
                <Groups2OutlinedIcon style={{ fontSize: '31px' }}></Groups2OutlinedIcon>
                Groups
                <div style={{ width: '10%', height: '100%' }}></div>
            </FeatureBtn>
            <FollowersModal isOpen={followersIsOpen} setIsOpen={setFollowersIsOpen} sameUser={true}></FollowersModal>
            <GroupsModal isOpen={groupsIsOpen} setIsOpen={setGroupsIsOpen}></GroupsModal>
            <EventsModal isOpen={eventIsOpen} setIsOpen={setEventIsOpen}></EventsModal>
        </Container>
    )
}

export const TestDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
`;
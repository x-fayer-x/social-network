"use client";

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Cookies from "js-cookie";
import { HomeHeader } from '../components/home/home.jsx';
import PostFeed from '../components/post/post.jsx';
import FeaturesContainer from '../components/features/features.jsx';
import FriendsContainer from '../components/contacts/contacts.jsx';
import { Body } from '../components/body/body.jsx';
import { CreateEventModal, InviteModal } from '../components/modal/modal.jsx';
import {
    GroupContainer,
    BannerContainer,
    Banner,
    BannerSection,
    IconContainer,
    GroupIcon,
    BaseInfosContainer,
    GroupName,
    Members,
    BannerBtn,
    PostsContainer,
    DescriptionBanner
} from './items.jsx';

import { useUser } from '../contexts/user.js';
import { useLoading } from '../contexts/loading_context.js';

import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { set } from 'lodash';
import useNotifWebSocket from '../custom/ws-notif.jsx';

function GroupPage() {
    const { user, setUser } = useUser();
    const { loading, setLoading, data, setData } = useLoading();

    const [isScrolled, setIsScrolled] = useState(false);
    const [groupIconSize, setGroupIconSize] = useState('70px');
    const [otherIconSize, setOtherIconSize] = useState('20px');
    const [scrollPosition, setScrollPosition] = useState(0);
    const [eventIsOpen, setEventIsOpen] = useState(false);
    const [inviteIsOpen, setInviteIsOpen] = useState(false);
    const [NbrgroupMembers, setNbrGroupMembers] = useState(0);
    const [userIsInGroup, setUserIsInGroup] = useState(0);

    const socket = useNotifWebSocket();


    const postContainerRef = useRef(null);
    // // fetch pour ajouter un membre au groupe
    // useEffect(() => {
    //     const useruuid = user.uuid;
    //     const group_id = data.id;
    // }, [user])

    useEffect(() => {
        console.log("GROUP DATA : ", data);
    }, [data]);

    const AddMemberGroup = () => {
        fetch('https://localhost:8080/api/group/member', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'group_id': data.id,
            },
            body: JSON.stringify([{ uuid: user.uuid }]),
        })
            .then(response => {
                console.log('Response:', response);
                return response.json();
            })
            .then(success => {
                console.log('Success:', success);
                setUserIsInGroup(2);
                const socketObj = {
                    content: ' want to join the group',
                    type: 'group_request',
                    sender_uuid: user.uuid,
                    receiver_uuid: data.creator_uuid,
                    target_id: data.id,
                }
                socket.send(JSON.stringify(socketObj));
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    // fetch pour avoir le nombre de membres du groupe (compteur de membres)
    const fetchGroupMembers = () => {
        // fetch pour avoir le nombre de membres du groupe (compteur de membres)
        fetch(`https://localhost:8080/api/group/members/${data.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {

                setNbrGroupMembers(data.length);

                setLoading(false);

                // // Vérifiez si l'UUID de l'utilisateur est dans le tableau des membres du groupe
                // const member = data.filter(member => member.user_uuid == user.uuid);
                // if (!Array.isArray(member) || member.length == 0) {
                //     setUserIsInGroup(0);
                // } else {
                //     setUserIsInGroup(member[0].pending);
                // }

                // if (userIsInGroup == 1) {
                //     console.log('User is in the group');
                // } else {
                //     console.log('User is not in the group');
                // }

                let nombredemembre = 0;

                data.forEach(compteur => {
                    if (compteur.pending == 1) {
                        nombredemembre += 1;
                    }
                });

                setNbrGroupMembers(nombredemembre);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                console.log(error);
            });
    } // Ajoutez d'autres dépendances si nécessaire
    useEffect(() => {
        if (isScrolled) {
            setGroupIconSize('20px');
            setOtherIconSize('16px');
        } else {
            setGroupIconSize('70px');
            setOtherIconSize('22px');
        }
    }, [isScrolled]);

    function handleScroll(wheelPosition) {
        if (wheelPosition > 0 || scrollPosition > 0) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    }
    if (user === null || data == null || typeof (data) != 'object') {
        console.log(user, data)
        return <div></div>;
    } else {
        fetchGroupMembers();
        return (
            <>
                <HomeHeader></HomeHeader>
                <Body>
                    <FeaturesContainer />
                    <GroupContainer>
                        <BannerContainer $isScrolled={isScrolled}>
                            <Banner $isScrolled={isScrolled}>
                                <BannerSection $isScrolled={isScrolled}>
                                    <IconContainer $isScrolled={isScrolled}>
                                        <GroupIcon style={{ fontSize: `${groupIconSize}`, transition: 'all ease-in-out .2s' }} />
                                    </IconContainer>
                                    <BaseInfosContainer $isScrolled={isScrolled}>
                                        <GroupName $isScrolled={isScrolled}>{data.title}</GroupName>
                                        <Members $isScrolled={isScrolled}>{NbrgroupMembers} Members</Members>
                                    </BaseInfosContainer>
                                </BannerSection>
                                <BannerSection>
                                    {userIsInGroup == 1 ? (
                                        <>
                                            <BannerBtn $isScrolled={isScrolled} onClick={() => setEventIsOpen(true)}>
                                                <AddOutlinedIcon style={{ fontSize: `${otherIconSize}`, transition: 'font-size ease-in-out .2s' }} /> Create event
                                            </BannerBtn>
                                            <BannerBtn $isScrolled={isScrolled} onClick={() => setInviteIsOpen(true)}>
                                                <PersonAddIcon style={{ fontSize: `${otherIconSize}`, transition: 'font-size ease-in-out .2s' }} /> Invite
                                            </BannerBtn>
                                        </>
                                    ) : userIsInGroup == 2 ? (
                                        <HourglassTopIcon ></HourglassTopIcon>
                                    ) : (
                                        <BannerBtn $isScrolled={isScrolled} onClick={AddMemberGroup}>
                                            <GroupAddIcon /> Join group
                                        </BannerBtn>
                                    )}
                                </BannerSection>
                            </Banner>
                        </BannerContainer>
                        <DescriptionBanner>{data.description}</DescriptionBanner>
                        <PostsContainer ref={postContainerRef} $isScrolled={isScrolled} onWheel={(e) => handleScroll(e.target.scrollTop)}>
                            <PostFeed width='90%' setScrollPosition={setScrollPosition} type={'group'} />
                        </PostsContainer>
                    </GroupContainer >
                    <FriendsContainer />
                    <CreateEventModal isOpen={eventIsOpen} setIsOpen={setEventIsOpen}></CreateEventModal>
                </Body >
                <InviteModal isOpen={inviteIsOpen} setIsOpen={setInviteIsOpen} group_id={data.id} />
            </>
        );
    }
}

export default GroupPage;
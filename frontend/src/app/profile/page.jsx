"use client";
import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';

import { HomeHeader } from '../components/home/home.jsx';
import { Body } from '../components/body/body.jsx';
import PostFeed from '../components/post/post.jsx';
import { Title } from '../components/modal/items.jsx';
import {
    ProfileInfosContainer,
    BannerContainer,
    Banner,
    ProfilePic,
    NameContainer,
    Username,
    SubName,
    FollowInfoContainer,
    FollowersBtn,
    ToggleContainer,
    FollowButton,
    ChatBtn,
    SideInfosContainer,
    BaseInfosContainer,
    LabelInfo,
    DescriptionContent,
    ProfileContainer,
    ProfileBody,
    PrivacyContainer
} from './items.jsx';

import { useUser } from '../contexts/user.js';
import { useLoading } from '../contexts/loading_context.js';

import Switch from '@mui/material/Switch';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import FriendsContainer from '../components/contacts/contacts.jsx';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { FollowersModal } from '../components/modal/modal.jsx';

import useNotifWebSocket from '../custom/ws-notif.jsx';

function ProfilePage() {
    const { user, setUser } = useUser();
    const { loading, setLoading, data, setData } = useLoading();

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <>
            <HomeHeader></HomeHeader>
            <Body>
                {/* <FeaturesContainer /> */}
                <ProfileContainer>
                    <ProfileInfos />
                    <ProfileBody>
                        <PostFeed width='80%' childrenWidth={'100%'} type={'profile'} />
                    </ProfileBody>
                </ProfileContainer>
                <FriendsContainer />
            </Body>
        </>
    );
}

function ProfileInfos() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, setUser } = useUser();
    const { data, setData } = useLoading();
    const [pending, setPending] = useState(0);
    const [sameUser, setSameUser] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [userinfo, setuserinfo] = useState(false);
    const [option, setOption] = useState('follows');

    const fileInput = useRef(null);
    const privacySwitch = useRef(null);

    const [file, setFile] = useState(null);

    useEffect(() => {
        console.log('user : ', user, 'data : ', data)
    }, []);

    useEffect(() => {
        if (user != null && data != null) {
            setSameUser(user.uuid == data.uuid);
            console.log('data : ', data);
        }
    }, [data]);

    useEffect(() => {
        if (data != null) {
            setIsPublic(data.private);
            setPending(data.pending);
        }
    }, []);

    useEffect(() => {
        if (file != null) {
            const formData = new FormData();
            formData.append('Avatar', file);
            fetch(`https://localhost:8080/api/user/avatar`, {
                method: 'POST',
                headers: {
                    'Session-Token': Cookies.get('Token')
                },
                body: formData
            }).then((response) => {
                response.text();
            }).then((data) => {
                Cookies.set('user', json.stringify({ ...user, avatar: data }));
            });
        }
    }, [file]);

    // useEffect(() => {
    //     setIsPublic(data.private !== true)
    // }, [data.private]);

    // useEffect(() => {
    //     if (data){
    //         console.log('data : ', data);
    //     }
    // }, [data]);

    const togglePrivacy = () => {
        // Inversez l'état de isPublic et mettez à jour le serveur via handlePrivacyChange
        if (!sameUser) return;
        const newIsPublic = !isPublic;
        setIsPublic(newIsPublic); // Mettez à jour l'état local
        handlePrivacyChange(); // Mettez à jour le serveur
    };

    const handlePrivacyChange = (event) => {
        fetch(`https://localhost:8080/api/profile/privacy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            },
            body: JSON.stringify({
                private: !isPublic,
                uuid: user.uuid
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            setIsPublic(!isPublic);
        });
    }

    if (user === null || data === null) {
        return <div></div>;
    } else {
        return (
            <ProfileInfosContainer>
                <BannerContainer>
                    <Banner>
                        <ProfilePic onClick={() => fileInput.current.click()}>
                            {data.avatar != null && data.avatar != '' ?
                                <img src={data.avatar} style={{ width: '100%', height: '100%', borderRadius: '50%' }}></img> :
                                <PermIdentityOutlinedIcon style={{ fontSize: '60px', top: '30px' }}></PermIdentityOutlinedIcon>
                            }
                            <input
                                type="file"
                                ref={fileInput}
                                id="file"
                                style={{ display: 'none' }}
                                onChange={(e) => setFile(e.target.files[0])}
                                accept='.gif, .jpeg, .png, .jpg' />
                        </ProfilePic>
                        <NameContainer>
                            <Username>{`${data.fName} ${data.lName}`}</Username>
                            <SubName>{`@${data.nName}`}</SubName>
                        </NameContainer>
                    </Banner>
                    <PrivacyContainer onClick={togglePrivacy}>
                        {sameUser &&
                            <Switch
                                ref={privacySwitch}
                                checked={isPublic}
                                onChange={handlePrivacyChange}
                                name="privacyToggle"
                                inputProps={{ 'aria-label': 'Public' }}
                                sx={{
                                    '& .MuiSwitch-switchBase': {
                                        // Appliquer le style pour l'état non-checké
                                        color: 'white', // Couleur du thumb quand le Switch est off
                                        '&.Mui-checked': {
                                            // Styles pour l'état checké
                                            color: 'white', // Couleur du thumb quand le Switch est on
                                            '& + .MuiSwitch-track': {
                                                backgroundColor: '#1DB954', // Couleur du track quand le Switch est on
                                            },
                                        },
                                    },
                                    '& .MuiSwitch-track': {
                                        backgroundColor: 'white', // Couleur du track quand le Switch est off
                                    },
                                }}
                            />
                        }

                        {isPublic ? 'Private' : 'Public'}
                    </PrivacyContainer>
                    <FollowInfoContainer>
                        {/* 130 follows | 200 followers */}
                        <FollowersBtn onClick={() => { setIsOpen(true); setOption('follows') }}>{data.following} follows</FollowersBtn>
                        <FollowersBtn onClick={() => { setIsOpen(true); setOption("followers") }}>{data.followers} followers</FollowersBtn>
                    </FollowInfoContainer>
                    {!sameUser && <ToggleFollowButton pending={pending} setPending={setPending} />}
                </BannerContainer>

                <SideInfosContainer>
                    <Title>Profile Infos</Title>
                    <BaseInfosContainer>
                        <LabelInfo>Email:</LabelInfo>
                        {data.email}
                    </BaseInfosContainer>
                    <BaseInfosContainer>
                        <LabelInfo>Birth:</LabelInfo>
                        {data.birthdate}
                    </BaseInfosContainer>
                    <BaseInfosContainer>
                    </BaseInfosContainer>
                    <DescriptionContent style={{ display: data.description ? 'block' : 'none' }}>
                        <LabelInfo>Description:</LabelInfo>
                        {data.description}
                    </DescriptionContent>
                </SideInfosContainer>
                <FollowersModal isOpen={isOpen} setIsOpen={setIsOpen} sameUser={sameUser} option={option}></FollowersModal>
            </ProfileInfosContainer>
        );
    }
}

function ToggleFollowButton({ pending, setPending }) {
    const { data, setData } = useLoading();
    // const [isPublic, setIsPublic] = useState(false);
    const { user, setUser } = useUser();
    const socket = useNotifWebSocket();

    const handleFollow = () => {
        fetch(`https://localhost:8080/api/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            },
            body: JSON.stringify({
                'uuid': data.uuid
            })
        }).then((response) => {
            console.log("reponse follow : ", response);
            return response.json();
        }).then((responseData) => {
            console.log("data : ", responseData);
            if (responseData.pending == -1) {
                if (!data.private) {
                    setData({ ...data, followers: data.followers - 1 })
                }
            } else {
                if (!data.private) {
                    setData({ ...data, followers: data.followers + 1 })
                }
            }
            if (data.private) {
                const socketObj = {
                    content: ' want to follow you',
                    type: 'follow_request',
                    sender_uuid: user.uuid,
                    receiver_uuid: data.uuid,
                    target_id: 0,
                };
                socket.send(JSON.stringify(socketObj));
            } else {
                const socketObj = {
                    content: ' started to follow you',
                    type: 'follow',
                    sender_uuid: user.uuid,
                    receiver_uuid: data.uuid,
                    target_id: 0,
                };
                socket.send(JSON.stringify(socketObj));
            }
            setPending(responseData.pending);
        });
    }

    useEffect(() => {
        console.log('pending : ', pending)
    }, [pending]);

    return (
        <ToggleContainer>
            <FollowButton $pending={pending} onClick={() => handleFollow()}>
                {pending == 1 ? 'Unfollow' : pending == -1 ? 'Follow' : "pending..."}
            </FollowButton>
            <ChatBtn $pending={pending}>
                <ChatBubbleOutlineOutlinedIcon style={{ fontSize: '30px' }}></ChatBubbleOutlineOutlinedIcon>
            </ChatBtn>
        </ToggleContainer>
    );
}


export default ProfilePage;
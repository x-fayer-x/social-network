import React, { useState, useEffect, useRef } from 'react';
import { PostsModal } from '../modal/modal.jsx';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { BarLoader } from "react-spinners"

import { useUser } from '../../contexts/user.js';
import { useLoading } from '../../contexts/loading_context.js';
import { usePost } from '../../contexts/post.js';

import useNotifWebSocket from '@/app/custom/ws-notif.jsx';

import { Body } from '../body/body.jsx';
import PostFeed from '../post/post.jsx';
import FriendsContainer from '../contacts/contacts.jsx';
import FeaturesContainer from '../features/features.jsx';
import Welcome from '../welcome/welcome.jsx';
import Header from '../header/header.jsx';
import {
    HeaderBtn,
    SearchBar,
    SearchIcon,
    SearchContainer,
    BtnContainer,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownNotif,
    LoaderContainer,
    SuggestionsContainer,
    SearchBarSuggestions,
    AcceptButton,
    DeclineButton,
    NotifItem
} from './items.jsx';

import { getDuration } from '../post/post.jsx';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

export default function Home() {
    const { user, setUser } = useUser();

    // const [loading, setLoading] = useState(false);
    return (
        <div className="App">
            {user == null ? (
                <Welcome></Welcome>
            ) : (
                <>
                    <HomeHeader></HomeHeader>
                    <Body>
                        <FeaturesContainer></FeaturesContainer>
                        <PostFeed $width='40%'></PostFeed>
                        <FriendsContainer></FriendsContainer>
                    </Body>
                </>
            )}
        </div>
    );
}

export function HomeHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifs, setNotifs] = useState([]);
    const [seen, setSeen] = useState(false);

    const { user, setUser } = useUser();
    const { loading, setLoading, data, setData } = useLoading();
    const { postData, setPostData } = usePost();

    const socket = useNotifWebSocket();

    useEffect(() => {

        if (socket == null) return;
        socket.onopen = function (event) {
            const msg = {
                "type": "init",
                "content": "init",
                "sender_uuid": user.uuid,
                "receiver_uuid": user.uuid
            }
            socket.send(JSON.stringify(msg));
        };
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (!Array.isArray(notifs)) {
                setNotifs([message]);
            } else {
                setNotifs([message, ...notifs]);
            }
        }

        socket.onclose = function (event) {
            console.log("WebSocket connection closed.");
        }
    }), [socket];

    const openModal = () => {
        setIsOpen(true);
    }

    const handleLogout = () => {
        fetch('https://localhost:8080/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: Cookies.get('Token') }),
        }).then((response) => {
            Cookies.remove('Token');
            Cookies.remove('user');
            setTimeout(() => {
                setUser(null);
            }, 50);
        });
    }

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
            setData(data);
            localStorage.setItem('data', JSON.stringify(data));
            setPostData(data.posts);
        });
    }

    useEffect(() => {
        fetch(`https://localhost:8080/api/notifs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setNotifs(data);
        });
    }, []);

    const handleFollow = (choice, sender) => {
        fetch(`https://localhost:8080/api/follow/accept`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            },
            body: JSON.stringify({ sender: sender, choice: choice })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
        });
    }

    const FetchPending = async (action, groupMemberId, sender_uuid) => {
        try {
            console.log('Updating pending status...');
            const pendingValue = action === 'accept' ? 1 : 0;
            console.log('Pending value dans home.jsx : ', pendingValue);
            const response = await fetch('https://localhost:8080/api/group/group_member/pending', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    group_id: groupMemberId,
                    member_uuid: sender_uuid,
                    pending: pendingValue,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Network response was not ok:', errorText);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Pending status updated:', data);
        } catch (error) {
            console.error('Error updating pending status:', error);
        }
    };

    function getNotifs() {
        if (Array.isArray(notifs) && notifs != null && notifs.length > 0) {
            return (
                notifs.map((notif, index) => {
                    return (
                        <DropdownNotif $border-top={index == 0 ? '5px' : '0'} $border-bottom={index == notifs.length - 1 ? '5px' : '0'} key={index}>
                            <PermIdentityOutlinedIcon style={{ fontSize: '32px' }} />
                            {notif.content}
                            {" " + getDuration(notif.at)}
                            {notif.type == 'follow_request' &&
                                <div>
                                    <AcceptButton onClick={() => handleFollow('accept', notif.sender_uuid)}>Accept</AcceptButton>
                                    <DeclineButton onClick={() => handleFollow('decline', notif.sender_uuid)}>Decline</DeclineButton>
                                </div>
                            }
                            {notif.type == 'group_request' &&
                                <div>
                                    <AcceptButton onClick={() => FetchPending('accept', notif.target_id, notif.sender_uuid)}>Accept</AcceptButton>
                                    <DeclineButton onClick={() => FetchPending('decline', notif.target_id, notif.sender_uuid)}>Decline</DeclineButton>
                                </div>
                            }
                            {notif.type == 'group_invite' &&
                                <div>
                                    <AcceptButton onClick={() => FetchPending('accept', notif.target_id, notif.receiver_uuid)}>Accept</AcceptButton>
                                    <DeclineButton onClick={() => FetchPending('decline', notif.target_id, notif.receiver_uuid)}>Decline</DeclineButton>
                                </div>
                            }
                        </DropdownNotif>
                    )
                })
            )
        }
    }

    const UpdateSeen = () => {
        console.log('Updating seen status...');
        fetch('https://localhost:8080/api/seen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('home.jsx l208 Network response was not ok');
                }
                return response;
            })
            .then(data => {
                setSeen(false);
            })
    }

    useEffect(() => {
        if (notifs){
            setSeen(notifs.some(notification => notification.read === 0));
        }
    }, [notifs]);

    if (user === null) {
        return <div></div>;
    } else {
        return (
            <>
                <Header>
                    <Link href='/'>Social Network</Link>
                    <SearchComponent width={'20%'} height={'60%'} fontSize={'15px'}></SearchComponent>
                    <BtnContainer>
                        <HeaderBtn onClick={openModal}><AddOutlinedIcon style={{ fontSize: '35px' }}></AddOutlinedIcon></HeaderBtn>
                        {/* <HeaderBtn><NotificationsNoneOutlinedIcon style={{ fontSize: '35px' }}></NotificationsNoneOutlinedIcon></HeaderBtn> */}
                        <DropdownComponent
                            icon={<NotificationsNoneOutlinedIcon style={{ fontSize: '35px' }} onClick={UpdateSeen}/>}
                            width={'400px'}
                            onClick={UpdateSeen}
                        >
                            {getNotifs()}
                        </DropdownComponent>

                        {seen && <NotifItem />}

                        <DropdownComponent
                            icon={user.avatar && user.avatar != '' ? <img src={user.avatar} style={{ width: '35px', height: '35px', borderRadius: '10px' }}></img> :
                                <PermIdentityOutlinedIcon style={{ fontSize: '35px' }}></PermIdentityOutlinedIcon>
                            }
                            $margin={true}
                        >
                            <Link href='/profile' onClick={() => handleStalk()}>
                                <DropdownItem $border-top={'5px'}>
                                    {user.avatar && user.avatar != '' ? <img src={user.avatar} style={{ width: '35px', height: '35px', borderRadius: '50%' }}></img> :
                                        <PermIdentityOutlinedIcon fontSize='large' style={{ marginRight: '10px' }}></PermIdentityOutlinedIcon>
                                    }
                                    <span>{user.nickname != '' ? ' ' + user.nickname : ' ' + user.firstname}</span>
                                </DropdownItem>
                            </Link>
                            <DropdownItem>
                                <SettingsOutlinedIcon fontSize='large' style={{ marginRight: '10px' }}></SettingsOutlinedIcon>
                                <span>Settings</span>
                            </DropdownItem>
                            <Link href='/'>
                                <DropdownItem $border-bottom={'5px'} onClick={handleLogout}>
                                    <LogoutOutlinedIcon fontSize='large' style={{ marginRight: '10px' }}></LogoutOutlinedIcon>
                                    <span>Log out</span>
                                </DropdownItem>
                            </Link>
                        </DropdownComponent>
                        <PostsModal isOpen={isOpen} setIsOpen={setIsOpen}></PostsModal>
                    </BtnContainer>
                </Header >
            </>
        );
    }
}

export function SearchComponent({ width, height, fontSize }) {
    const [isfocused, setIsFocused] = useState(false);
    const [input, setInput] = useState('');
    const timer = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const { loading, setLoading, data, setData } = useLoading();

    const { postData, setPostData } = usePost();


    const fetchSuggestions = async (query) => {
        // premier fetch pour recuperer les info des users en fonction de la saisie user
        const response = await fetch(`https://localhost:8080/api/search?q=${query}`);
        const data = await response.json();

        // Faites quelque chose avec les suggestions ici
        setSuggestions(data);
    };

    useEffect(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        if (input) {
            timer.current = setTimeout(() => {
                fetchSuggestions(input);
            }, 500); // Attend 500ms après la fin de la saisie pour déclencher la requête
        }
    }, [input]);
    // second fetch pour recuperer les info de la page profile de l'user selectionné
    // handlestalker est appelé lorsqu'on clique sur une suggestion et generer la page profile
    const handleStalk = (uuid) => { // implémenter logique gestion données coté front
        setLoading(true);
        fetch(`https://localhost:8080/api/user/${uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setData(data);
            localStorage.setItem('data', JSON.stringify(data));
        });
    }

    const getGroupInfos = (id) => {
        setLoading(true);
        fetch(`https://localhost:8080/api/group/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setData(data);
            localStorage.setItem('data', JSON.stringify(data));
        });
        fetch(`https://localhost:8080/api/group/posts/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then(response => { return response.json() })
            .then(data => {
                setPostData(data);
            });
    }

    const displaySuggestions = () => {
        let userSuggestions = [];
        if ((Array.isArray(suggestions.users) && suggestions.users.length > 0)) {
            userSuggestions = [...suggestions.users];
        }
        let groupSuggestions = [];
        if (Array.isArray(suggestions.groups) && suggestions.groups.length > 0) {
            groupSuggestions = [...suggestions.groups];
        }
        const allSuggestions = [...userSuggestions, ...groupSuggestions];
        if (allSuggestions.length === 0) {
            return
        }
        return allSuggestions.map((suggestion, index) => {
            const isUser = index < userSuggestions.length;
            return (
                <Link key={index} href={isUser ? '/profile' : '/group'} onClick={() => isUser ? handleStalk(suggestion.uuid) : getGroupInfos(suggestion.id)}>
                    <SearchBarSuggestions ref={timer}>
                        {isUser ? suggestion.fName : suggestion.title}
                    </SearchBarSuggestions>
                </Link>
            )
        });
    }

    return (
        <>
            <SearchContainer $isfocused={isfocused} width={width} height={height}>
                <SearchIcon $isfocused={isfocused} />
                <SearchBar
                    placeholder='Search'
                    type="SearchBar"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setTimeout(() => {
                            setIsFocused(false);
                            setSuggestions([]);
                            setInput('');
                        }, 150);
                    }}
                    fontSize={fontSize}
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                />
            </SearchContainer>
            <SuggestionsContainer>
                {isfocused && displaySuggestions()}
            </SuggestionsContainer>
        </>
    );
}

function DropdownComponent({ children, icon, width, margin }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const closeMenu = () => {
            setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('click', closeMenu);
        }

        return () => {
            document.removeEventListener('click', closeMenu);
        };
    }, [isOpen]);

    return (
        <Dropdown $margin={margin}>
            <DropdownTrigger>
                <HeaderBtn onClick={() => setIsOpen(!isOpen)}>{icon}</HeaderBtn>
            </DropdownTrigger>
            <DropdownItemObject isOpen={isOpen} $width={width}>
                {children}
            </DropdownItemObject>
        </Dropdown>
    );
}

function DropdownItemObject({ isOpen, children, width }) {
    return (
        <DropdownMenu $isOpen={isOpen} width={width}>
            {children}
        </DropdownMenu>
    );
}




import React, { useState, useEffect, useRef, use } from "react";
import styled, { keyframes } from "styled-components";
import Select, { components } from "react-select";
import Image from 'next/image';
import Cookies from "js-cookie";
import Link from 'next/link';

import {
    ModalBackground,
    Title,
    BtnContainer,
    selectStyle,
    PostButton,
    TextArea,
    Img,
    ModalContent,
    CloseButton,
    ModalSectionContainer,
    PostModalContainer,
    SelectFollowersPrivacyContainer,
    InputLabel,
    ModalBody,
    CommentsModalContainer,
    CommentsModalContent,
    CommentsModalDate,
    CommentsModalFooter,
    CommentsModalHeader,
    CommentsModalText,
    CommentsModalImage,
    CommentsModalReadButton,
    CommentsModalContentContainer,
    //modal groups
    ListGroup,
    PhotoProfileGroup,
    NameGroup,
    GroupCreateGroup,
    ///Modal create groups
    ModalTitle,
    ModalBody1,
    InputGroup,
    InputLabel1,
    TextInputDesciption1,
    TextInputName,
    ImageInput,
    SubmitButton,
    GroupButtonBack,
    //modal Followers
    ListFollow,
    PhotoProfileFollow,
    NameFollow,
    //// Modal Events
    EventLeftContainer,
    EventRightContainerImg,
    EventContainer,
    EventHeader,
    EventHeaderLeft,
    EventHeaderLeftText,
    EventBody,
    EventFooter,
    EventHeaderRight,
    EventHeaderRightText,
    EventLeftContainerText,
    EventFooterlefttext,
    EventFotterRight,
    EventFotterMid,
    EventFottercontainerButton,
    TextInputDesciption,
    EventBannerBtn,
    DivModalClick,
    ScrollableContainer,
    Follower,
    SelectedFollower,
    SelectedViewersContainer,
    EventsModalImage
} from './items';
import { StyledInput } from '../../register/page.jsx'
import { Switch } from '../contacts/contacts';
import { SearchComponent } from "../home/home";
import { Post } from "../post/post";
import { PostContainer, PostHeader, ProfilePic, PostInfo, PostUsername, PostDate, PostContent, PostText, PostImage, PostFooter, Button, LikeIcon, LikedIcon, LikeIconContainer, PostFeedContainer } from '../post/items.jsx';
import CommentComponent from "../comment/comment";
import { colorData } from '../color.data.js';
import { BackBtn, BirthDateComp } from "../../register/page.jsx";
import { getDuration } from "../post/post";

import useNotifWebSocket from "@/app/custom/ws-notif";

import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

import { usePost } from "@/app/contexts/post";
import { useUser } from "@/app/contexts/user";
import { useLoading } from "@/app/contexts/loading_context";

function Modal({ isOpen, setIsOpen, width, height, children }) {
    const [description, setDescription] = useState('');
    const [image_URL, setImage_URL] = useState('');
    const [isClosing, setIsClosing] = useState(false);

    const modalBackgroundRef = useRef(null);
    const closeButtonRef = useRef(null);
    const closeRef = useRef(null);

    const handleClose = (e) => {
        if (e.target === modalBackgroundRef.current || e.target === closeButtonRef.current || e.target === closeRef.current) {
            setIsClosing(true);
            setTimeout(() => {
                setIsClosing(false)
                setIsOpen(false)
            }, 300);
        }
    };

    return (
        isOpen && (
            <ModalBackground ref={modalBackgroundRef} onClick={(e) => handleClose(e)}>
                <ModalContent className={isClosing ? "closing" : "opening"} width={width} height={height}>
                    <CloseButton ref={closeRef} onClick={(e) => handleClose(e)}><CloseOutlinedIcon ref={closeButtonRef} style={{ fontSize: '31px' }}></CloseOutlinedIcon></CloseButton>
                    {children}
                </ModalContent>
            </ModalBackground>
        )
    );
}

export function PostsModal({ isOpen, setIsOpen }) {
    const { postData, setPostData } = usePost();
    const { user, setUser } = useUser();
    const { loading, setLoading, data, setData } = useLoading();

    const [content, setContent] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [section, setSection] = useState(0);
    const [clickable, setClickable] = useState(false);
    const [scope, setScope] = useState('home');
    const [followersList, setFollowersList] = useState([]);
    const [groupID, setGroupID] = useState(0);
    const [imageURL, setImageURL] = useState('');
    const [viewerList, setViewerList] = useState([]);

    const privacyRef = useRef(null);
    const fileField = useRef(null);

    useEffect(() => {
        if (privacy == 'almost private') {
            setSection(1);
        } else {
            setSection(0);
        }
    }, [privacy])

    useEffect(() => {
        if (privacy == 'almost private' && !isOpen) {
            setPrivacy('public');
            setViewerList([]);
        }
        if (window.location.pathname == '/group') {
            setScope('group');
            setGroupID(data.id);
            setPrivacy('group');
        } else {
            setScope('home');
            setGroupID(0);
            setPrivacy('public');
        }
    }, [isOpen])

    useEffect(() => {
        if (privacy != '' && content != '') {
            setClickable(true);
        } else {
            setClickable(false);
        }
    }, [privacy, content])

    const options = [
        { value: 'public', label: 'Public', icon: <PublicOutlinedIcon /> },
        { value: 'private', label: 'Private', icon: <LockOutlinedIcon /> },
        { value: 'almost private', label: 'Only Friends', icon: <GroupOutlinedIcon /> },
    ];

    const CustomOption = ({ data, ...props }) => (
        <components.Option {...props}>
            {data.icon} {data.label}
        </components.Option>
    );

    const CustomSingleValue = ({ data, ...props }) => (
        <components.SingleValue {...props}>
            {data.icon} {data.label}
        </components.SingleValue>
    );

    const sendRequest = () => {
        let tempList = [user.uuid];
        if (content != '' && privacy != '') {
            if (privacy == 'almost private') {
                setViewerList((viewerList) => [...viewerList, user]);
                viewerList.map((viewer) => {
                    tempList.push(viewer.uuid);
                });
            }
            fetch('https://localhost:8080/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Token': Cookies.get('Token')
                },
                body: JSON.stringify({
                    body: content,
                    privacy: privacy,
                    viewerList: tempList,
                    group: groupID,
                    Avatar: user.avatar
                })
            })
                // .then(response => response.json())
                .then((response) => {
                    let a = response.json();
                    return a
                })
                .then(data => {
                    setIsOpen(false);
                    setContent('');
                    setPrivacy('');
                    // data.Name = user.nickname;
                    if (postData) {
                        let newPostData = [...postData];
                        newPostData.unshift(data);
                        setPostData(newPostData);
                    } else {
                        setPostData([data]);
                    }
                    setViewerList([]);
                    if (imageURL) {
                        handleImage(data.id);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }

    useEffect(() => {
        fetch(`https://localhost:8080/api/followers/${user.uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then(response => { return response.json() })
            .then(data => {
                setFollowersList(data);
            })
    }, [section])

    const handleImage = async (id) => {
        const formData = new FormData();

        formData.append('image', fileField.current.files[0]);
        formData.append('id', id);

        try {
            const response = await fetch('https://localhost:8080/api/post/image', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erreur réseau lors de la requête.');
            }

            const data = await response.json();

            // Faire quelque chose avec data
        } catch (error) {
            console.error('Erreur:', error);
        }
    }


    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} width={'50%'}>
            <ModalSectionContainer $sectionId={0} $section={section}>
                <Title>New Post</Title>
                <BtnContainer>
                    {scope == 'home' &&
                        <Select
                            ref={privacyRef}
                            options={options}
                            components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                            styles={selectStyle}
                            placeholder='Privacy...'
                            onChange={option => {
                                if (option != null) {
                                    setPrivacy(option.value)
                                }
                            }}>
                        </Select>
                    }
                    {scope == 'group' &&
                        <p style={{ color: `${colorData.quaternary}`, textTransform: 'Capitalize', fontSize: '20px' }}>Group : {data.title} </p>
                    }
                    <input ref={fileField} id="file" style={{ display: 'none' }} type='file' accept=".gif, .jpeg, .png, .jpg" onChange={(e) => setImageURL(e.target.value)}></input>
                    <InputLabel htmlFor="file"><AddPhotoAlternateOutlinedIcon style={{ fontSize: '50px' }}></AddPhotoAlternateOutlinedIcon></InputLabel>
                </BtnContainer>
                <TextArea placeholder='Description' onChange={(e) => setContent(e.target.value)}></TextArea>
                <PostButton $clickable={clickable} type="button" onClick={() => sendRequest()}>Post</PostButton>
            </ModalSectionContainer>
            <ModalSectionContainer $sectionId={1} $section={section}>
                {/* {Div Modal Click permet d'aligner en ligne mes element contenus} */}
                <SelectFollowersComponent setPrivacy={setPrivacy} followersList={followersList} setFollowersList={setFollowersList} viewerList={viewerList} setViewerList={setViewerList} section={section} OKFunction={setSection}></SelectFollowersComponent>
            </ModalSectionContainer>
        </Modal>
    );
}

export function SelectFollowersComponent({ setPrivacy, followersList, setFollowersList, viewerList, setViewerList, section, OKFunction }) {
    const getFollowers = () => {
        if (followersList != null && followersList.length > 0 && section == 1) {
            return followersList.map((follower, index) => {
                return (
                    <Follower key={index} onClick={() => { addViewer(follower) }}>
                        <div key={index} style={{ display: 'flex', alignItems: 'center', padding: "5px" }}>
                            <PhotoProfileFollow><PermIdentityOutlinedIcon></PermIdentityOutlinedIcon></PhotoProfileFollow>
                            <NameFollow>{follower.Name}</NameFollow>
                        </div>
                    </Follower>
                )
            })
        }
    }

    const displayViewers = () => {
        if (viewerList != null && viewerList.length > 0) {
            return viewerList.map((viewer, index) => {
                return (
                    <SelectedFollower key={index} onClick={() => removeViewer(viewer)}>{viewer.Name}</SelectedFollower>
                )
            })
        }
    }

    const addViewer = (itemToAdd) => {
        setViewerList((viewerList) => [...viewerList, itemToAdd]);
        setFollowersList((followersList) => followersList.filter(item => item !== itemToAdd));
    }

    const removeViewer = (itemToRemove) => {
        setViewerList((viewerList) => viewerList.filter(item => item !== itemToRemove));
        setFollowersList((followersList) => [...followersList, itemToRemove]);
    }

    return (
        <>
            <DivModalClick style={{ justifyContent: 'space-between', marginBottom: '20px' }}>
                <BackBtn onClick={() => {
                    setPrivacy('');
                    setViewerList([]);
                    privacyRef.current.clearValue();
                }}>
                    <KeyboardBackspaceOutlinedIcon style={{ fontSize: '35px' }}></KeyboardBackspaceOutlinedIcon>
                </BackBtn>
                <Title>Almost Private</Title>
                <div style={{ width: '10%' }}></div>
            </DivModalClick>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <SearchComponent width='40%' height='90%' fontSize='0.6em' />
            </div>
            <SelectFollowersPrivacyContainer>
                <SelectedViewersContainer>
                    {displayViewers()}
                </SelectedViewersContainer>
                {section == 1 && getFollowers()}
            </SelectFollowersPrivacyContainer>
            <DivModalClick style={{ justifyContent: 'center' }}>
                <SubmitButton onClick={() => OKFunction(0)}>OK</SubmitButton>
            </DivModalClick>
        </>
    );
}

export function InviteModal({ isOpen, setIsOpen, group_id }) {
    const [followersList, setFollowersList] = useState([]);
    const [viewerList, setViewerList] = useState([]);

    const { user, setUser } = useUser();

    const socket = useNotifWebSocket();

    useEffect(() => {
        if (isOpen) {
            fetch(`https://localhost:8080/api/group/invite/${group_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Token': Cookies.get('Token')
                }
            }).then(response => { return response.json() })
                .then(data => {
                    setFollowersList(data);
                })
        } else {
            setViewerList([]);
        }
    }, [isOpen])

    const submitViewers = () => {
        fetch('https://localhost:8080/api/group/member', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'group_id': group_id,
            },
            body: JSON.stringify(viewerList),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                setIsOpen(false);
                viewerList.map((viewer) => {
                    const socketObj = {
                        content: ' invited you to join his group',
                        type: 'group_invite',
                        sender_uuid: user.uuid,
                        receiver_uuid: viewer.uuid,
                        target_id: group_id
                    }
                    socket.send(JSON.stringify(socketObj));
                });
                setViewerList([]);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} width={'50%'}>

            <ModalSectionContainer $sectionId={1} $section={1}>
                {/* {Div Modal Click permet d'aligner en ligne mes element contenus} */}
                <SelectFollowersComponent followersList={followersList} setFollowersList={setFollowersList} viewerList={viewerList} setViewerList={setViewerList} section={1} OKFunction={submitViewers}></SelectFollowersComponent>
            </ModalSectionContainer>
        </Modal>
    )
}

export function CommentsModal({ isOpen, setIsOpen, textContent, liked, setLiked, id, post, imgPath, commentData, setCommentData }) {
    const [readMore, setReadMore] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [writeComment, setWriteComment] = useState(false);
    const [comment, setComment] = useState(false);
    const [scrollState, setScrollState] = useState(70);
    const [imageURL, setImageURL] = useState('');
    const [commentLike, setCommentLike] = useState({});

    const TextRef = useRef(null);
    const testRef = useRef(null);
    const CommentsRef = useRef(null);
    const contentContainerRef = useRef(null);
    const inputRef = useRef(null);
    const fileInput = useRef(null);
    const fileInputLogo = useRef(null);
    const fileInputBtn = useRef(null);

    const socket = useNotifWebSocket();

    // const { postData, setPostData } = usePost();
    const { user, setUser } = useUser();
    const { loading, setLoading, data, setData } = useLoading();

    useEffect(() => {
        // setIsOpen(true);
        fetch(`https://localhost:8080/api/comments/${post.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setCommentData(data);
        });
    }, []);


    useEffect(() => {
        if (readMore) {
            testRef.current.addEventListener('click', handleText);
        }

        return () => {
            if (testRef.current) {
                testRef.current.removeEventListener('click', handleText);
            }
        };
    }, [readMore]);

    useEffect(() => {
        setPageLoaded(true);
    }, []);

    const handleText = () => {
        setReadMore(false);
        TextRef.current.scrollTop = 0;
    }

    let timer;
    const handleScroll = (e) => {
        if (e.target === TextRef.current) {
            return;
        }
        let time = 400;
        clearTimeout(timer); // Annule le temporisateur précédent

        // Calcule l'incrémentation en fonction de la vitesse de défilement
        let increment = Math.abs(e.deltaY) / 30;
        if (increment < 1) {
            increment = 1;
            time = 2000;
        }
        timer = setTimeout(() => {
            setScrollState(prevState => {
                if (prevState > 30) {
                    return 70;
                } else {
                    return 0;
                }
            });
        }, time);

        if (e.deltaY > 0) {
            setScrollState(prevState => {
                if (prevState > 0) {
                    return Math.max(prevState - increment, 0);
                } else {
                    return prevState;
                }
            });
        } else if (e.deltaY < 0) {
            setScrollState(prevState => {
                if (prevState < 70 && CommentsRef.current.scrollTop === 0) {
                    return Math.min(prevState + increment, 70);
                } else {
                    return prevState;
                }
            });
        }
    }
    const handleCommentInput = (e) => {
        console.log("target : ", e.target, "inputs :\n", inputRef.current, "\n", fileInput.current, "\n", fileInputLogo.current, "\n", fileInputBtn.current);
        if (e.target != inputRef.current && e.target != fileInput.current && e.target != fileInputLogo.current && e.target != fileInputBtn.current) {
            setWriteComment(false);
        }
    }

    useEffect(() => {
        if (writeComment) {
            document.addEventListener('click', handleCommentInput);
        } else {
            document.removeEventListener('click', handleCommentInput);
        }

        return () => {
            document.removeEventListener('click', handleCommentInput);
        };
    }, [writeComment]);

    const sendComment = () => {
        fetch('https://localhost:8080/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            },
            body: JSON.stringify({
                body: comment,
                post_id: post.id,
                user_id: user.uuid
            })
        }).then(response => response.json())
            .then(newComment => {
                setComment('');
                let newCommentData;
                if (commentData != null) {
                    newCommentData = [...commentData];
                    newCommentData.unshift(newComment);
                    setCommentData(newCommentData);
                } else {
                    setCommentData([newComment]);
                }
                setData(newCommentData);
                setComment('');
                if (imageURL) {
                    handleImage(newComment.id);
                }
                const socketObj = {
                    type: 'comment',
                    target_id: post.id,
                    sender_uuid: user.uuid,
                    receiver_uuid: post.user_uuid,
                    content: ' commented on your post'
                }
                socket.send(JSON.stringify(socketObj));
                // inputRef.current.clearValue();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleImage = async (id) => {
        const formData = new FormData();

        formData.append('image', fileInput.current.files[0]);
        formData.append('id', id);

        try {
            const response = await fetch('https://localhost:8080/api/comment/image', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erreur réseau lors de la requête.');
            }

            const data = await response.json();

            // Faire quelque chose avec data
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    useEffect(() => {
        if (socket != null && commentLike != {}) {
            socket.send(JSON.stringify(commentLike))
        }
    }, [commentLike]);

    const displayComments = () => {
        if (commentData != null) {
            return commentData.map((comment, index) => {
                return (
                    <CommentComponent key={index} comment={comment} commentLike={commentLike} setCommentLike={setCommentLike}></CommentComponent>
                )
            })
        }
    }
    // if (Array.isArray(data) || data == []) {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} width={'35%'} height={'92%'}>
            <CommentsModalContainer width={'100%'}>
                <CommentsModalHeader>
                    <ProfilePic>
                        <PermIdentityOutlinedIcon style={{ fontSize: '31px' }}></PermIdentityOutlinedIcon>
                    </ProfilePic>
                    <PostInfo>
                        <PostUsername>{post.Name}</PostUsername>
                    </PostInfo>
                </CommentsModalHeader>
                <CommentsModalContent ref={testRef} onWheel={(e) => handleScroll(e)}>
                    <CommentsModalContentContainer ref={contentContainerRef} $scrollState={scrollState}>
                        <CommentsModalText $readMore={readMore} ref={TextRef}>{post.body}</CommentsModalText>
                        {!readMore && post.body.length > 486 &&
                            <CommentsModalReadButton onClick={() => setReadMore(true)} $readMore={readMore}>
                                Read More
                            </CommentsModalReadButton>
                        }
                        {readMore &&
                            <CommentsModalReadButton onClick={() => handleText()} $readMore={readMore}>
                                Read Less
                            </CommentsModalReadButton>
                        }
                        {imgPath != '' &&
                            <CommentsModalImage>
                                {pageLoaded &&
                                    <Image src={'/ressources/post/' + imgPath}
                                        alt='ed'
                                        layout='fill'
                                        objectFit='cover'
                                    >
                                    </Image>
                                }
                            </CommentsModalImage>
                        }
                        <CommentsModalDate>{getDuration(post.creation_date)}</CommentsModalDate>
                    </CommentsModalContentContainer>
                    <CommentContainer ref={CommentsRef} $scrollState={scrollState}>
                        {isOpen && displayComments()}
                    </CommentContainer>
                </CommentsModalContent>
                <CommentsModalFooter $writeComment={writeComment}>
                    <Button onClick={() => setLiked(!liked)}>
                        <LikeIconContainer $liked={liked}>
                            <FavoriteBorderOutlinedIcon style={{ fontSize: '30px' }} />
                        </LikeIconContainer>
                        <LikeIconContainer $liked={!liked} >
                            <FavoriteIcon style={{ color: `${colorData.quinary}`, fontSize: '30px' }} />
                        </LikeIconContainer>
                    </Button>
                    {!writeComment ?
                        <Button>
                            <ModeCommentOutlinedIcon onClick={(e) => setWriteComment(true)} style={{ fontSize: '27px' }}></ModeCommentOutlinedIcon>
                        </Button> :
                        <Button onClick={() => fileInput.current.click()} ref={fileInputBtn}>
                            <AddAPhotoOutlinedIcon style={{ fontSize: '27px' }} ref={fileInputLogo} />
                            <input
                                type="file"
                                ref={fileInput}
                                id="file"
                                style={{ display: 'none' }}
                                onChange={(e) => setImageURL(e.target.files[0])} />
                        </Button>
                    }
                    <CommentInput
                        ref={inputRef}
                        $writeComment={writeComment}
                        placeholder='Comment...'
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (comment != '') {
                                    sendComment();
                                }
                                e.target.value = '';
                            }
                        }}
                    ></CommentInput>
                </CommentsModalFooter>
            </CommentsModalContainer>
        </Modal>
    );
    // }
}


export const CommentContainer = styled.div`
            width: 100%;
            background-color: ${colorData.primary};
            border-radius: 10px;
            margin-top: 10px;
            margin-bottom: 35px;
            padding: 10px;
            box-sizing: border-box;
            overflow-y: ${props => props.$scrollState === 0 ? 'scroll' : 'hidden'};
            &::-webkit-scrollbar {
                display: none;
            }
            `;


export const CommentInput = styled.textarea`
            position: absolute;
            left: 11%;
            width: 76%;
            transition: .2s;
            height: 80%;
            padding: 10px;
            box-sizing: border-box;
            resize: none;
            border: none;
            background-color: ${colorData.primary};
            color: ${colorData.septenary};
            font-size: 1em;
            font-family: 'Roboto', sans-serif;
            scale: ${props => props.$writeComment ? '1' : '0'};
            outline: none;
            `;


// export default Modal;
// verifier FollowersModalque le switch selected marche bien et gener le bon style(actuellemen les deux onglet on le meme menu
export function FollowersModal({ isOpen, setIsOpen, sameUser, option }) {
    const [selected, setSelected] = useState("followers");
    const { loading, setLoading, data, setData } = useLoading();
    const [FollowerData, setFollowerData] = useState([]);
    const { user, setUser } = useUser();
    const { postData, setPostData } = usePost();
    //b2ab8c12168a73f1f9b855465dd0d1f5415a4126


    const GetAllFollowers = (selected) => {
        const uuid = data == null || sameUser == true ? user.uuid : data.uuid;
        fetch(`https://localhost:8080/api/${selected}/${uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then((response) => {
            return response.json();
        }).then((follow_data) => {
            setFollowerData(follow_data);
        });
    }
    const handleStalk = (uuid) => {
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
            setPostData(data.posts);
            console.log("postdata : ", data.posts);
        });
    }
    useEffect(() => {
        if (isOpen) {
            GetAllFollowers(selected);
        }
    }, [isOpen, selected]);

    useEffect(() => {
        if (option) {
            setSelected(option);
        }
    }, [isOpen]);
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} width={'30%'}>

            <Title>Follow</Title>
            <ModalBody>
                <div style={{ marginBottom: '20px' }}></div>
                <Switch selected={selected} setSelected={setSelected} value1='followers' value2='follows' name='FollowersModal_switch'></Switch>
                <div style={{ marginBottom: '20px' }}></div>
                <SearchComponent width={'70%'} height={'5%'} fontSize={'0.9em'}></SearchComponent>
            </ModalBody>

            {Array.isArray(FollowerData) && FollowerData.map((follower, index) => (
                <ListFollow key={index}>
                    <Link href={'/profile/'}>
                        <div style={{ display: 'flex', alignItems: 'center', padding: "5px", }} onClick={() => handleStalk(follower.uuid)}>
                            <PhotoProfileFollow><GroupOutlinedIcon></GroupOutlinedIcon></PhotoProfileFollow>
                            <NameFollow>{follower.Name}</NameFollow>
                        </div>
                    </Link>
                </ListFollow>
            ))}
        </Modal>
    );
}



export function EventsModal({ isOpen, setIsOpen }) {
    const [section, setSection] = useState(0);
    const [events, setEvents] = useState([]);



    const getEvents = () => {
        fetch('https://localhost:8080/api/event', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then(response => { return response.json() })
            .then(data => {
                setEvents(data);
            })
    }

    useEffect(() => {
        if (isOpen) {
            getEvents();
        }
    }, [isOpen]);

    const handleCloseModal = () => {
        setIsOpen(false);
        setSection(0); // réinitialise la section à 0 lorsque la modal est fermée
    };
    return (
        <Modal isOpen={isOpen} setIsOpen={handleCloseModal} width={'40%'}>
            <ModalSectionContainer $sectionId={0} $section={section}>
                <ScrollableContainer>
                    <Title>Events</Title>
                    <DivModalClick>
                        <SearchComponent width={'70%'} height={'5%'} fontSize={'0.9em'}></SearchComponent>

                    </DivModalClick>
                    {events && events.map(event => (
                        <EventComponent event={event}></EventComponent>
                    ))}
                </ScrollableContainer>
            </ModalSectionContainer>
        </Modal>
    );
}

export function EventComponent({ event }) {
    const [pageLoaded, setPageLoaded] = useState(false);
    const [choice, setChoice] = useState(event.choice);

    const handleChoice = (option) => {
        console.log("choice : ", event.choice);
        const obj = {
            choice: option,
            event_id: event.id
        }

        fetch('https://localhost:8080/api/event/choice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            },
            body: JSON.stringify(obj)
        }).then(response => response.json())
            .then(data => {
                setChoice(option);
            })
    }

    useEffect(() => {
        setPageLoaded(true);
    }, []);

    if (choice != 2) {
        console.log("event : ", event);
        return (
            <EventContainer key={event.id}>
                <EventHeader>
                    <EventHeaderLeft>
                        <CalendarMonthIcon></CalendarMonthIcon>
                        <EventHeaderLeftText>{event.event_date}</EventHeaderLeftText>
                    </EventHeaderLeft>
                    <EventHeaderRight>
                        <EventHeaderRightText>{event.group_title}</EventHeaderRightText>
                        <PersonIcon></PersonIcon>
                    </EventHeaderRight>
                </EventHeader>
                <EventBody>
                    <EventLeftContainer>
                        Titre : {event.title}
                        <EventLeftContainerText>Description : {event.description}</EventLeftContainerText>
                    </EventLeftContainer>
                    {event.img_path != '' &&
                        <EventsModalImage>
                        <>
                            {pageLoaded &&
                                <Image src={'/ressources/event/' + event.img_path}
                                    alt='ed'
                                    layout='fill'
                                    objectFit='cover'
                                >
                                </Image>
                            }
                        </>
                        </EventsModalImage>
                    }
                    {/* <EventRightContainerImg></EventRightContainerImg> */}

                </EventBody>
                <EventFooter>
                    <EventFooterlefttext><PlaceIcon></PlaceIcon>{event.location}</EventFooterlefttext>
                    {choice == 0 &&
                        <EventFottercontainerButton>
                            <EventFotterMid onClick={() => handleChoice(1)}>
                                <CheckIcon />
                            </EventFotterMid>
                            <EventFotterRight onClick={() => handleChoice(2)} >
                                <ClearIcon >
                                </ClearIcon>
                            </EventFotterRight>
                        </EventFottercontainerButton>
                    }
                </EventFooter>
            </EventContainer >
        )
    }
}

export function CreateEventModal({ isOpen, setIsOpen }) {
    const [section, setSection] = useState(0);
    const [monthOption, setMonthOption] = useState('');
    const [dayOption, setDayOption] = useState('');
    const [yearOption, setYearOption] = useState('');
    const [location, setLocation] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageURL, setImageURL] = useState('');

    const { user, setUser } = useUser();
    const { data, setData } = useLoading();

    const fileField = useRef(null);

    const handleLocationChange = async (event) => {
        setLocation(event.target.value);
        const query = event.target.value.replace(/ /g, '+');
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}`);
        const data = await response.json();
        setSuggestions(data.features.map(feature => feature.properties.label));
    };

    const handleDropdownChange = (newLocation) => {
        setLocation(newLocation);
        if (newLocation === '') {
            setSuggestions([]);
        }
    }

    const createEvent = () => {
        const obj = {
            group_id: data.id,
            title: title,
            description: description,
            event_date: `${yearOption}-${monthOption}-${dayOption}`,
            location: location,
            creator_uuid: user.uuid,
            choice: 0
        }
        fetch('https://localhost:8080/api/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            },
            body: JSON.stringify(obj)
        }).then(response => { return response.json() })
            .then(data => {
                setSection(0);
                setIsOpen(false);
                console.log("event data : ", data);
                if (imageURL) {
                    handleImage(data.id);
                }
            })
    }

    const handleImage = async (id) => {
        const formData = new FormData();

        formData.append('image', fileField.current.files[0]);
        formData.append('id', id);

        try {
            const response = await fetch('https://localhost:8080/api/event/image', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erreur réseau lors de la requête.');
            }

            const resp = await response.json();

            // Faire quelque chose avec data
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} width={'40%'}>
            <ModalSectionContainer $sectionId={0} $section={section}>
                <DivModalClick>
                    <ModalTitle >New Event</ModalTitle>
                    <div></div>
                </DivModalClick>
                <ModalBody1>
                    <InputGroup>
                        <InputLabel1>Title</InputLabel1>
                        <StyledInput onChange={(e) => setTitle(e.target.value)}></StyledInput>
                    </InputGroup>
                    <BirthDateComp
                        selectedDay={dayOption}
                        setSelectedDay={setDayOption}
                        selectedMonth={monthOption}
                        setSelectedMonth={setMonthOption}
                        selectedYear={yearOption}
                        setSelectedYear={setYearOption}
                    />
                    <InputGroup>
                        <InputLabel1>Location</InputLabel1>
                        <StyledInput value={location} onChange={handleLocationChange} />
                        {suggestions.length > 0 && (<select onChange={(e) => handleDropdownChange(e.target.value)}>
                            {suggestions.map((suggestion, index) => (
                                <option key={index} value={suggestion}>{suggestion}</option>
                            ))}
                        </select>
                        )}
                    </InputGroup>
                    <InputGroup>
                        <InputLabel1>Description</InputLabel1>
                        <TextInputDesciption1 onChange={(e) => setDescription(e.target.value)} ></TextInputDesciption1>
                    </InputGroup>
                    <InputGroup>
                        {/* <InputLabel1>Image</InputLabel1>
                        <ImageInput type="file"></ImageInput> */}
                        <input ref={fileField} id="file" style={{ display: 'none' }} type='file' accept=".gif, .jpeg, .png, .jpg" onChange={(e) => setImageURL(e.target.value)}></input>
                        <InputLabel htmlFor="file"><AddPhotoAlternateOutlinedIcon style={{ fontSize: '50px' }}></AddPhotoAlternateOutlinedIcon></InputLabel>
                    </InputGroup>
                    <div style={{ display: 'flex', alignItems: 'center', padding: "5px", }}>
                        <SubmitButton onClick={createEvent}>Create Event</SubmitButton>

                    </div>
                </ModalBody1>
            </ModalSectionContainer>
        </Modal>
    )
}
//// MODAL GROUP///////////////////

export function GroupsModal({ isOpen, setIsOpen }) {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [groupImage, setGroupImage] = useState('');
    const [section, setSection] = useState(0);
    const [groupList, setGroupList] = useState([]);

    const { data, setData, loading, setLoading } = useLoading();
    const { postData, setPostData } = usePost();

    const handleGroupCreateClick = () => {
        setSection(1); // change la section à 1 lorsque le bouton est cliqué
    };
    const handleBackClick = () => {
        setSection(0); // change la section à 0 lorsque le bouton est cliqué
    };

    const handleGroupCreate = () => {
        const obj = {
            title: groupName,
            description: groupDescription,
            creator_uuid: Cookies.get('Token')
        }
        fetch('https://localhost:8080/api/group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            },
            body: JSON.stringify(obj)
        }).then(response => { return response })
            .then(data => {
                setSection(0);
                setIsOpen(false);
            })
    }

    useEffect(() => {
        const uuid = Cookies.get('Token');
        fetch(`https://localhost:8080/api/grouplist/${uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then(response => { return response.json() })
            .then(data => {
                setGroupList(data);
            })
    }, [isOpen])

    const handleGroupPage = (group) => {
        setIsOpen(false);
        setData(group);
        localStorage.setItem('data', JSON.stringify(group));
        setLoading(true);
        fetch(`https://localhost:8080/api/group/posts/${group.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then(response => { return response.json() })
            .then(data => {
                setPostData(data);
            })
    }

    const getGroups = () => {
        if (groupList && groupList.length > 0) {
            return groupList.map((group, index) => {
                return (
                    <ListGroup key={index}>
                        <Link href='/group'>
                            <div style={{ display: 'flex', alignItems: 'center', padding: "5px" }} onClick={() => { handleGroupPage(group) }}>
                                <PhotoProfileGroup><Groups2OutlinedIcon></Groups2OutlinedIcon></PhotoProfileGroup>
                                <NameGroup>{group.title}</NameGroup>
                            </div>
                        </Link>
                    </ListGroup>
                )
            })
        }
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} width={'30%'}>

            <ModalSectionContainer $sectionId={0} $section={section}>
                <Title>Groups</Title>
                <DivModalClick style={{ justifyContent: 'center' }}>
                    <SearchComponent width={'70%'} height={'5%'} fontSize={'0.9em'}></SearchComponent>
                    <GroupCreateGroup onClick={handleGroupCreateClick}>
                        <GroupAddIcon></GroupAddIcon>
                    </GroupCreateGroup>
                </DivModalClick>
                {getGroups()}
            </ModalSectionContainer>
            <ModalSectionContainer $sectionId={1} $section={section}>
                <ScrollableContainer>
                    <DivModalClick>
                        <GroupButtonBack onClick={handleBackClick}>
                            <ArrowBackIcon></ArrowBackIcon>
                        </GroupButtonBack>
                        <ModalTitle style={{ marginLeft: '190px' }}>New Group</ModalTitle>
                        <div></div>
                    </DivModalClick>
                    <ModalBody1>
                        <InputGroup>
                            <InputLabel1>Group Name</InputLabel1>
                            <StyledInput value={groupName} onChange={e => setGroupName(e.target.value)} />
                        </InputGroup>
                        <InputGroup>
                            <InputLabel1>Group Description</InputLabel1>
                            <TextInputDesciption1 value={groupDescription} onChange={e => setGroupDescription(e.target.value)} />
                        </InputGroup>
                        <InputGroup>
                            <InputLabel1>Group Image</InputLabel1>
                            <ImageInput type="file" onChange={e => setGroupImage(e.target.files[0])} />
                        </InputGroup>
                        <div style={{ display: 'flex', alignItems: 'center', padding: "5px", }}>
                            <SubmitButton onClick={handleGroupCreate}>Create Group</SubmitButton>
                        </div>
                    </ModalBody1>
                </ScrollableContainer>
            </ModalSectionContainer>
        </Modal>
    );
}
// "use client";
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Cookies from 'js-cookie';
import Link from 'next/link';

import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';


import { PostContainer, PostHeader, ProfilePic, PostInfo, PostUsername, PostDate, PostContent, ReadButton, PostText, PostImage, Img, PostFooter, Button, LikeIcon, LikedIcon, LikeIconContainer, PostFeedContainer } from './items.jsx';
import { CommentsModal } from '../modal/modal.jsx';
import { ContentContainer } from '../modal/items.jsx';
import { colorData } from '../color.data.js';

import { usePost } from '../../contexts/post.js';
import { useLoading } from '@/app/contexts/loading_context.js';
import { Label } from '@/app/register/page.jsx';
import { useUser } from '@/app/contexts/user.js';

import useNotifWebSocket from "@/app/custom/ws-notif";

export default function PostFeed({ width, children, childrenWidth, setScrollPosition, type }) {
    const containerRef = useRef(null);
    const { postData, setPostData } = usePost();
    const [url, setUrl] = useState('https://localhost:8080/api/post');
    const [likeNotif, setLikeNotif] = useState({});
    // const [postData, setPostData] = useState([]);

    const socket = useNotifWebSocket();

    useEffect(() => {
        if (type === 'profile' || type === 'group') {
            return;
        } else {
            fetch('https://localhost:8080/api/post', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Token': Cookies.get('Token')
                }
            }).then((response) => {
                let a = response.json();
                return a
            }).then((data) => {
                if (data === null) return;
                setPostData(data);
            });
        }
    }, []);

    useEffect(() => {
        if (likeNotif != {} && socket != null) {
            socket.send(JSON.stringify(likeNotif));
        }
    }, [likeNotif]);

    const generatePosts = () => {
        return (
            postData.map((post) => {
                // return (<Post key={post.id} width={childrenWidth} textContent={post.body} username={post.Name} date={post.creation_date} uuid={post.user_uuid} id={post.id}></Post>);
                return (<Post key={post.id} width={childrenWidth} post={post} setLikeNotif={setLikeNotif}></Post>)
            })
        );
    }

    const handleWheel = (e) => {
        if (setScrollPosition) {
            setScrollPosition(containerRef.current.scrollTop);
        }
    };

    if (postData == null || postData.length === 0) return (<div></div>)
    else {
        return (
            <PostFeedContainer ref={containerRef} width={width} onWheel={handleWheel}>
                {children}
                {generatePosts()}
            </PostFeedContainer>
        );
    }
}

export const getDuration = (date) => {
    let seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds <= 0) return 'now';
    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + "y";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + "m";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + "d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + "min";
    }
    return Math.floor(seconds) + "s";
}

export function Post({ post, width, setLikeNotif }) {
    const [readMore, setReadMore] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [imgPath, setImgPath] = useState('');
    const [commentData, setCommentData] = useState([]);


    const { data, setData, loading, setLoading } = useLoading();
    const { postData, setPostData } = usePost();
    const { user } = useUser();

    const handleStalk = () => { // implémenter logique gestion données coté front
        setLoading(true);
        fetch(`https://localhost:8080/api/user/{${post.user_uuid}}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then((response) => {
            return response.json();
        }).then((newdata) => {
            setData(newdata);
            localStorage.setItem('data', JSON.stringify(newdata));
            setPostData(newdata.posts);
        });
    }

    const getPostImage = () => {
        fetch(`https://localhost:8080/api/post/image/${post.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then((response) => {
            return response.text();
        }).then((data) => {
            setImgPath(data);
        });
    }

    const getPostLikes = () => {
        fetch(`https://localhost:8080/api/post/like/${post.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data === null || !Array.isArray(data)) {
                return;
            } else {
                setLikes(data.length);
                if (data.filter((like) => like.user_uuid === user.uuid).length > 0) {
                    setLiked(true);
                }
            }
        });
    }

    const handleLike = () => {
        if (!liked) {
            AddLike();
            return
        }
        RemoveLike();
    }

    const AddLike = () => {
        fetch(`https://localhost:8080/api/post/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            },
            body: JSON.stringify({
                post_id: post.id,
                user_uuid: user.uuid
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data === null) {
                return;
            } else {
                setLiked(true);
                setLikes(likes + 1);

                const socketObj = {
                    content: ' liked your post',
                    type: 'post_like',
                    sender_uuid: user.uuid,
                    receiver_uuid: post.user_uuid,
                    target_id: post.id
                }
                setLikeNotif(socketObj)
            }
        });
    }

    const RemoveLike = () => {
        fetch(`https://localhost:8080/api/post/like/${post.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data === null) {
                return;
            } else {
                setLiked(false);
                setLikes(likes - 1);
            }
        });
    }

    useEffect(() => {
        setPageLoaded(true);
        getPostLikes();
    }, []);

    return (
        <PostContainer width={width}>
            <PostHeader>
                <Link href='/profile'>
                    <ProfilePic onClick={handleStalk} $img={post.Avatar}>
                        {post.Avatar !== '' ?
                            <img style={{ width: '100%', height: '100%', borderRadius: '50%' }} src={post.Avatar} alt='ed' layout='fill' objectFit='cover'></img> :
                            <PermIdentityOutlinedIcon style={{ fontSize: '31px' }}></PermIdentityOutlinedIcon>
                        }
                    </ProfilePic>
                </Link>
                <PostInfo>
                    <Link href='/profile'>
                        <PostUsername onClick={handleStalk}>{post.Name}</PostUsername>
                    </Link>
                    <PostDate>{getDuration(post.creation_date)}</PostDate>
                </PostInfo>
            </PostHeader>
            <ContentContainer>
                <PostContent>
                    <PostText $readMore={readMore}>{post.body}</PostText>
                    {!readMore && post.body.length > 486 &&
                        <ReadButton onClick={() => setReadMore(true)}>
                            Read More
                        </ReadButton>
                    }
                    {readMore &&
                        <ReadButton onClick={() => setReadMore(false)}>
                            Read Less
                        </ReadButton>
                    }
                    {pageLoaded && getPostImage()}
                    {imgPath !== '' &&
                        <PostImage>
                            <Image src={'/ressources/post/' + imgPath}
                                alt='ed'
                                layout='fill'
                                objectFit='cover'
                            >
                            </Image>
                        </PostImage>
                    }
                </PostContent>
            </ContentContainer>
            <PostFooter>
                <IconsContainer>
                    <InfoLabel>{likes} like(s)</InfoLabel>

                    <Button onClick={() => handleLike()}>
                        <LikeIconContainer $liked={liked}>
                            <FavoriteBorderOutlinedIcon style={{ fontSize: '30px' }} />
                        </LikeIconContainer>
                        <LikeIconContainer $liked={!liked} >
                            <FavoriteIcon style={{ color: `${colorData.quinary}`, fontSize: '30px' }} />
                        </LikeIconContainer>
                    </Button>
                </IconsContainer>
                <IconsContainer>
                    <InfoLabel>{Array.isArray(commentData) ? commentData.length : '0'} comment(s)</InfoLabel>
                    <Button onClick={() => setIsOpen(true)}>
                        <ModeCommentOutlinedIcon style={{ fontSize: '27px' }}></ModeCommentOutlinedIcon>
                    </Button>
                </IconsContainer>
            </PostFooter>
            <CommentsModal isOpen={isOpen} setIsOpen={setIsOpen} liked={liked} setLiked={setLiked} post={post} imgPath={imgPath} commentData={commentData} setCommentData={setCommentData} />
        </PostContainer>
    );
}

export function InfosComponent({ post }) {
    return (
        <InfosContainer>
            <InfoLabel>10k likes</InfoLabel>
            <InfoLabel>10k comments</InfoLabel>
        </InfosContainer>
    );
}

export const InfoLabel = styled(Label)`
    font-size: 17px;
    text-align: center;
    /* width: 50%; */
`;

export const IconsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 35%;
`;


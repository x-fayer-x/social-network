import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import Image from 'next/image';

import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';

import { PostContainer, PostHeader, ProfilePic, PostInfo, PostUsername, PostDate, PostContent, ReadButton, PostText, PostImage, Img, PostFooter, Button, LikeIcon, LikedIcon, LikeIconContainer, PostFeedContainer } from '../post/items.jsx';
import { colorData } from '../color.data.js';
import { getDuration } from '../post/post.jsx';
import { useUser } from '../../contexts/user.js';

import useNotifWebSocket from '@/app/custom/ws-notif.jsx';

function CommentComponent({ comment, commentLike, setCommentLike }) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [imgPath, setImgPath] = useState('');
    const [pageLoaded, setPageLoaded] = useState(false);

    // const socket = useNotifWebSocket();

    const { user } = useUser();

    const handleLike = () => {
        if (!liked) {
            AddLike();
            return
        }
        RemoveLike();
    }

    const AddLike = () => {
        const obj = {
            comment_id: comment.id,
            user_uuid: user.uuid
        }
        fetch(`https://localhost:8080/api/comment/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Session-Token': Cookies.get('Token')
            },
            body: JSON.stringify(obj)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data === null) {
                return;
            } else {
                setLiked(true);
                setLikes(likes + 1);

                    const socketObj = {
                        content: ' liked your comment',
                        type: 'comment like',
                        sender_uuid: user.uuid,
                        receiver_uuid: comment.user_id,
                        target_id: comment.id
                    }
                setCommentLike(socketObj);
            }
        });
    }

    const RemoveLike = () => {
        fetch(`https://localhost:8080/api/comment/like/${comment.id}`, {
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
        fetch(`https://localhost:8080/api/comment/like/${comment.id}`, {
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
        setPageLoaded(true);
        getCommentImage();
    }, []);

    const getCommentImage = () => {
        fetch(`https://localhost:8080/api/comment/image/${comment.id}`, {
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

    return (
        // <CommentLine>
        <Comment>
            {/* <ProfilePicContainer> */}
            <CommentProfilePic>
                <PermIdentityOutlinedIcon style={{ fontSize: '18px' }}></PermIdentityOutlinedIcon>
            </CommentProfilePic>
            {/* </ProfilePicContainer> */}
            <CommentContainer>
                <CommentHeader>
                    <CommentUsername>{comment.UserName}</CommentUsername>
                    <CommentDate>{getDuration(comment.creation_date).split(' ')[0]}</CommentDate>
                </CommentHeader>
                <CommentBody>
                    <CommentText>{comment.body}</CommentText>
                </CommentBody>
                {/* {pageLoaded && getCommentImage()} */}
                {imgPath !== '' &&
                    <CommentImage>
                        <Image src={'/ressources/comment/' + imgPath}
                            alt='ed'
                            layout='fill'
                            objectFit='cover'
                        >
                        </Image>
                    </CommentImage>
                }
                <CommentFooter>
                    <CommentLikeButton onClick={() => handleLike()}>
                        <LikeIconContainer $liked={liked}>
                            <FavoriteBorderOutlinedIcon style={{ fontSize: '18px' }} />
                        </LikeIconContainer>
                        <LikeIconContainer $liked={!liked} >
                            <FavoriteIcon style={{ color: `${colorData.quinary}`, fontSize: '18px' }} />
                        </LikeIconContainer>
                    </CommentLikeButton>
                    <h3 style={{ color: `${colorData.quaternary}`, fontSize: '15px', lineHeight: '10px' }}>{likes}</h3>
                </CommentFooter>
            </CommentContainer>
        </Comment>
    )
}

export const Comment = styled.div`
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: flex-start;
            width: 100%;
            height: auto;
            margin-top: 20px;
            background-color: ${colorData.primary};
            `;

export const CommentContainer = styled.div`
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            width: 100%;
            background-color: ${colorData.primary};
            border-radius: 10px;
            /* margin-top: 10px;
            padding: 10px; */
            padding-left: 5px;
            /* padding-top: 10px; */
            height: auto;
            background-color: ${colorData.primary};
            `;

export const CommentHeader = styled.div`
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            border-top-right-radius: 10px;
            border-top-left-radius: 10px;
            /* border-color: ${colorData.quinary}; */
            border: solid 1px ${colorData.quinary};
            border-bottom: none;
            padding-top: 5px;

            /* background-color: ${colorData.quaternary}; */
            `;

export const CommentUsername = styled.h3`
            position: relative;
            margin-left: 10px;
            color: ${colorData.quaternary};
            font-size: 14px;
            line-height: 20px;
            `;

export const CommentDate = styled.h3`
            position: relative;
            margin-right: 10px;
            color: ${colorData.quaternary};
            font-size: 15px;
            line-height: 20px;
            font-size: 10px;
            `;

export const CommentBody = styled.div`
            border-end-end-radius: 10px;
            border-end-start-radius: 10px;
            width: 100%;
            border: solid 1px ${colorData.quinary};
            border-top: none;
            /* border-color: ${colorData.quinary}; */
            /* background: ${colorData.quaternary}; */
            `;

export const CommentText = styled.p`
            position: relative;
            color: white;
            margin: 10px 0;
            font-size: 16px;
            line-height: 19px;
            margin-left: 10px;
            `;

export const ProfilePicContainer = styled.div`
            position: relative;
            height: 100%;
            width: 20%;
            display: flex;
            flex-direction: row;
`;

export const CommentProfilePic = styled(ProfilePic)`
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 5px;
            `;

export const CommentImage = styled.div`
            position: relative !important;
            width: 100%;
            height: 200px;
            margin-top: 10px;
            overflow: hidden;
            border-radius: 10px;
`;

export const CommentFooter = styled.div`
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            background-color: ${colorData.primary};
            `;

export const CommentLikeButton = styled(Button)`
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            `;

export const CommentLine = styled.div`
            position: relative;
            display: flex;
            width: 100%;
            flex-direction: row;
            `;

export default CommentComponent;

import React from "react";
import styled from "styled-components";
import Link from "next/link";

import { Title, Content, BtnContainer, StyledLink, TextContainer } from './items.jsx';

export default function Welcome() {
    return (
        <div style={{backgroundColor: '#131418'}}>
            <Title>SOCIAL NETWORK</Title>
            <Content>
                <TextContainer>
                    <h2>Connect with friends and the world around you on Social Network.</h2>
                    <p>See photos and updates from friends in News Feed.</p>
                    <p>Share what's new in your life on your Timeline.</p>
                    <p>Find more of what you're looking for with Social Network Search.</p>
                </TextContainer>
                <BtnContainer>
                    <Link href={'/login'}>
                        <StyledLink>Login</StyledLink>
                    </Link>
                    <Link href={'/register'}>
                        <StyledLink>Register</StyledLink>
                    </Link>
                </BtnContainer>
            </Content>
        </div>
    );
}


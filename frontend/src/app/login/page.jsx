"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';
import styled from 'styled-components';

import { useUser } from '../contexts/user.js';

import { Container, DivInput, Label, LogWindow, StyledInput, InputContainer, NextBtn, Head, Title } from '../register/page.jsx';
import { SearchContainer, SearchBar } from '../components/home/items.jsx';
import { colorData } from '../components/color.data.js';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

function LoginPage() {
    const { user, setUser } = useUser();

    const [nextable, setNextable] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [invalidCreds, setInvalidCreds] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (user != null) {
            router.push('/');
        }
    }, [user]);

    const checkInput = (newEmail, newPassword) => {
        if (newEmail.length > 0 && newPassword.length > 0) {
            setNextable(true);
        } else {
            setNextable(false);
        }
    }

    const router = useRouter();
    const handleForm = () => {
        setLoading(true);
        fetch('https://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then((response) => {
            if (response.status !== 200) {
                if (response.status !== 401) {
                    setError(true);
                    setLoading(false);
                    
                } else {
                    setInvalidCreds(true);
                    setLoading(false);
                }
            }
            if (response.ok) {
                let resp = response.json();
                resp.then((data) => {
                    console.log(data);
                    Cookies.set('Token', data.token);
                    const userObject = {
                        email: data.email,
                        firstname: data.name.split(' ')[0],
                        lastname: data.name.split(' ')[1],
                        nickname: data.nickname,
                        birthdate: data.birthdate,
                        description: data.description,
                        uuid: data.uuid,
                        avatar: data.Avatar
                    };

                    Cookies.set('user', JSON.stringify(userObject));
                    setUser(userObject);
                });
            } 
        });
    };
    
    return (
        <Container>
            <LogWindow>
                <Head>
                    <Title>Login</Title>
                </Head>
                <InputContainer>
                    <DivInput>
                        <Label>Email: </Label>
                        <StyledInput type='email' placeholder='JohnSmith@example.com' $bordercolor={`${colorData.secondary}`} $bordercolorfocus={'white'}
                            onChange={(e) => {
                                const newEmail = e.target.value;
                                setEmail(newEmail);
                                checkInput(newEmail, password);
                            }} />
                    </DivInput>
                    <DivInput>
                        <Label>Password: </Label>
                        <PasswordComponent
                            setPassword={setPassword}
                            checkInput={checkInput}
                            email={email}
                        />
                        {invalidCreds === true && <p style={{ color: 'red' }}>Invalid email or password</p>}
                    </DivInput>
                    <NextBtn $loading={loading} $nextable={nextable} type='button' onClick={handleForm}>
                        {loading ? <ClipLoader size={30} color={'white'} loading={loading} /> : "Login"}
                    </NextBtn>
                    {error === true && <p style={{ color: 'red' }}>An error occured, please retry</p>}
                    <Link href="/register" style={{ textDecoration: 'underline' }}>Don't have account? Register</Link>
                </InputContainer>
            </LogWindow>
        </Container>
    )
}

function PasswordComponent({ setPassword, checkInput, email }) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <PasswordContainer $isfocused={isFocused}
            $bordercolor={`${colorData.secondary}`} $bordercolorfocus={'white'}>
            <PasswordInput
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={
                    (e) => {
                        const newPassword = e.target.value;
                        setPassword(newPassword);
                        checkInput(email, newPassword);
                    }
                }
                type={showPassword ? 'text' : 'password'}
                placeholder={showPassword ? 'password ?' : '**********'}
            />
            {showPassword ?
                <ShowPasswordIcon onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer', color: 'white' }} $isfocused={isFocused} /> :
                <DontShowPasswordIcon onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer', color: 'white' }} $isfocused={isFocused} />
            }
        </PasswordContainer>
    )
}

export const PasswordContainer = styled(SearchContainer)`
    width: 100%;
    background-color: ${props => props.$isfocused ? `${colorData.secondary}` : 'transparent'};

    border: 1px solid ${props => props.$isfocused ? props.$bordercolorfocus : props.$bordercolor};

    &:hover {
        border-color: ${props => props.$bordercolorfocus};
    }
    /* transition: all ease-in-out .2s; */
`;
export const PasswordInput = styled(SearchBar)`
    &::placeholder {
        color: #b7c3cf;
    }

    transition: none;
`;

export const ShowPasswordIcon = styled(VisibilityOffOutlinedIcon)`
    cursor: pointer;

    color: white;

    height: 100%;
`;

export const DontShowPasswordIcon = styled(VisibilityOutlinedIcon)``;

export default LoginPage;
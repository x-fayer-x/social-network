"use client";
import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Select, { components } from "react-select";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Cookies from 'js-cookie';
import zxcvbn from 'zxcvbn';
import { ClipLoader } from 'react-spinners';

import { selectStyle, InputLabel } from '../components/modal/items.jsx';
import { monthOptions, dayOptions, yearOptions, leapYearOptions } from './options.data.js';
import { ProfilePic } from '../components/post/items.jsx';
import { UserProvider, useUser } from '../contexts/user.js';
import { PasswordContainer, PasswordInput, ShowPasswordIcon, DontShowPasswordIcon } from '../login/page.jsx';
import { colorData } from '../components/color.data.js';

import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { image } from '@nextui-org/react';

//email, passW, FirstN, LastN, birth, pp, nickN, description

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [badEmail, setBadEmail] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [nName, setNName] = useState('');
  const [description, setDescription] = useState('');
  const [image_URL, setImage_URL] = useState('');

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(-1);

  const [nextable, setNextable] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileField = useRef(null);

  const { user, setUser, setAsyncUser } = useUser();

  async function sendForm() {
    setLoading(true);
    setUser({ email: email, nickname: nName, lastname: lName, firstname: fName }) //, pp: pp, description: description });
    const birthdate = selectedYear + '-' + selectedMonth + '-' + selectedDay;
    // formData.append('pp', pp);
    let userobj = {
      email: email,
      password: password,
      fName: fName,
      lName: lName,
      nName: nName,
      birthdate: birthdate,
      description: description
    }

    // let formData = new FormData();
    // formData.append('email', email);
    // formData.append('password', password);
    // formData.append('fName', fName);
    // formData.append('lName', lName);
    // formData.append('nName', nName);
    // formData.append('birthdate', birthdate);
    // formData.append('description', description);
    // formData.append('Avatar', fileField.current.files[0]);
    console.log(JSON.stringify(userobj));
    
    const response = fetch('https://localhost:8080/api/register', {
      method: 'POST',
      body: JSON.stringify(userobj),
    }).then(res => res.json()).then(data => {
      Cookies.set("user", JSON.stringify({ email: email, nickname: nName, lastname: lName, firstname: fName, birthdate: birthdate, description: description, uuid: data.uuid}))
      setAsyncUser({ email: email, nickname: nName, lastname: lName, firstname: fName, birthdate: birthdate, description: description, uuid: data.uuid})
      Cookies.set('Token', data.token)
    });
  }

  useEffect(() => {
    if (step === 1) {
      if (email !== '' && password !== '' && !badEmail && passwordStrength >= 2) {
        setNextable(true);
      } else {
        setNextable(false);
      }
    } else if (step === 2) {
      if (fName !== '' && lName !== '' && selectedDay && selectedMonth && selectedYear) {
        setNextable(true);
      } else {
        setNextable(false);
      }
    }
  }, [email, password, fName, lName, selectedDay, selectedMonth, selectedYear, step, badEmail]);

  const nextStep = () => {
    if (nextable) {
      setDirection(-1);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setDirection(1);
    setStep(step - 1);
  };

  const variants = {
    hidden: { opacity: 0, x: direction === 1 && step === 1 ? '100vw' : '-100vw', transition: { duration: 0.2 } },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 1 && step === 1 ? '-100vw' : '100vw', transition: { duration: 0.2 } }
  };
  return (
    <Container>
      <LogWindow $step={step}>
        <Head $justify={step > 1}>
          {step > 1 &&
            <BackBtn onClick={prevStep}>
              <KeyboardBackspaceOutlinedIcon style={{ fontSize: '35px' }}></KeyboardBackspaceOutlinedIcon>
            </BackBtn>
          }
          <Title>REGISTER</Title>

          {step > 1 &&
            <div style={{ width: '10%' }}></div>
          }
        </Head>
        <InputContainer $stepId={'1'} $step={step}>
          <EmailComp email={email} setEmail={setEmail} badEmail={badEmail} setBadEmail={setBadEmail}></EmailComp>
          <PasswordComp password={password} setPassword={setPassword} passwordStrength={passwordStrength} setPasswordStrength={setPasswordStrength}></PasswordComp>
          <NextBtn $nextable={nextable} type='button' onClick={nextStep}>Next <EastOutlinedIcon style={{ marginLeft: '10px' }}></EastOutlinedIcon></NextBtn>
        </InputContainer>

        <InputContainer $stepId={'2'} $step={step}>
          <DivInput>
            <Label>First name:</Label>
            <StyledInput id="fName" type="text" placeholder="John" onChange={(e) => { setFName(e.target.value) }} value={fName} />
          </DivInput>
          <DivInput>
            <Label>Last name:</Label>
            <StyledInput id="lName" type="text" placeholder="Smith" onChange={(e) => { setLName(e.target.value) }} value={lName} />
          </DivInput>
          <DivInput style={{ position: 'relative', left: '-4%' }}>
            <Label style={{ left: '4%' }}>Birthdate:</Label>
            <BirthDateComp
              selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear} setSelectedYear={setSelectedYear}
              selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
          </DivInput>
          <NextBtn $nextable={nextable} type='button' onClick={nextStep}>Next <EastOutlinedIcon style={{ marginLeft: '10px' }}></EastOutlinedIcon></NextBtn>
        </InputContainer>

        <InputContainer $stepId={'3'} $step={step}>
          <ProfileInfos>
            <DivInput>
              <Label>Profile Picture: (optional)</Label>
              {/* <ProfilePicPreview type='file' accept=".gif, .jpeg, .png, .jpg" onClick={(e) => e.preventDefault()}>
                        <AddAPhotoOutlinedIcon style={{ fontSize: '50px' }}></AddAPhotoOutlinedIcon>
                      </ProfilePicPreview> */}
              <input ref={fileField} id="file" style={{ display: 'none' }} type='file' accept=".gif, .jpeg, .png, .jpg" onChange={(e) => setImage_URL(e.target.value)}></input>
              <ProfilePicPreview htmlFor="file"><AddAPhotoOutlinedIcon style={{ fontSize: '50px', top: '30px' }}></AddAPhotoOutlinedIcon></ProfilePicPreview>
            </DivInput>
            <DivInput width={'70%'}>
              <Label>Nickname: (optional)</Label>
              <StyledInput id="nName" type="text" placeholder="JohnSmith" onChange={(e) => { setNName(e.target.value) }} value={nName} />
            </DivInput>
          </ProfileInfos>
          <DivInput>
            <Label>Description: (optional)</Label>
            <TextArea onChange={(e) => setDescription(e.target.value)}></TextArea>
          </DivInput>
          <Link href='/'>
            <NextBtn $loading={loading} $nextable={nextable} onClick={sendForm} type='button'>
              {loading ? <ClipLoader size={30} color={'white'} loading={loading} /> : "Register"}
            </NextBtn>
          </Link>
        </InputContainer>
        <RedirectLink href="/login" style={{ textDecoration: 'underline' }}>Already have an account? Login</RedirectLink>
      </LogWindow>
    </Container>
  )
}

const Register = () => {
  return (
    <RegisterPage></RegisterPage>
  )
}

export function BirthDateComp({ selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, selectedDay, setSelectedDay }) {
  const [dOptions, setDayOptions] = useState(dayOptions);
  const [yOptions, setYearOptions] = useState(yearOptions);
  const [mOptions, setMonthOptions] = useState(monthOptions);

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

  useEffect(() => {
    if (selectedMonth) {
      let daysInMonth;
      if (selectedYear != null) {
        daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      } else {
        if (selectedDay === '29' && selectedMonth === '02') {
          setYearOptions(leapYearOptions);
        } else {
          setYearOptions(yearOptions);
        }
        daysInMonth = new Date(2024, selectedMonth, 0).getDate();
      }
      const newDayOptions = Array.from({ length: daysInMonth }, (_, i) => ({ value: i + 1, label: i + 1 }));
      setDayOptions(newDayOptions);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (selectedYear) {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const newDayOptions = Array.from({ length: daysInMonth }, (_, i) => ({ value: i + 1, label: i + 1 }));

      setDayOptions(newDayOptions);
      if (selectedDay >= 29 && selectedYear % 4 !== 0) {
        setMonthOptions(monthOptions.filter(month => month.value !== '02'));
      } else {
        setMonthOptions(monthOptions);
      }
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedDay == '29' && selectedMonth == '02') {
      setYearOptions(leapYearOptions);
    } else {
      if (selectedDay > 28 && parseInt(selectedYear) % 4 !== 0 && selectedYear != null && selectedDay < 31 || selectedDay > 29 && selectedDay < 31) {
        setMonthOptions(monthOptions.filter(month => month.value !== '02'));
      } else if (selectedDay == '31') {
        setMonthOptions(monthOptions.filter(month => parseInt(month.value) % 2 != 0 && month.value <= 8 || month.value % 2 == 0 && month.value >= 8));
      } else {
        setMonthOptions(monthOptions);
      }
      setYearOptions(yearOptions);
    }
  }, [selectedDay]);

  return (
    <BirthdateContainer>
      <Select
        options={mOptions}
        components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
        styles={selectStyle}
        placeholder='Month'
        onChange={option => setSelectedMonth(option.value)}
        value={mOptions.find(option => option.value === selectedMonth)}>
      </Select>
      <Select
        options={dOptions}
        components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
        styles={selectStyle}
        placeholder='Day'
        onChange={option => setSelectedDay(option.value)}
        value={dOptions.find(option => option.value === selectedDay)}>
      </Select>
      <Select
        options={yOptions}
        components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
        styles={selectStyle}
        placeholder='Year'
        onChange={option => setSelectedYear(option.value)}
        value={yOptions.find(option => option.value === selectedYear)}>
      </Select>
    </BirthdateContainer>
  );
}

function EmailComp({ email, setEmail, badEmail, setBadEmail }) {
  const handleEmail = (e) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(e.target.value) && e.target.value !== '') {
      setBadEmail(true);
    } else {
      setBadEmail(false);
    }
    setEmail(e.target.value);
  }
  return (
    <DivInput>
      <Label>Email:</Label>
      <StyledInput $bordercolor={badEmail ? 'red' : `${colorData.secondary}`} $bordercolorfocus={badEmail ? 'red' : 'white'} id="email" type="email" placeholder="JohnSmith@example.com" onChange={(e) => setEmail(e.target.value)} onBlur={(e) => { handleEmail(e) }} value={email} />
      {badEmail === true && <p style={{ color: 'red' }}>Invalid email</p>}
    </DivInput>
  )
}

function PasswordComp({ password, setPassword, passwordStrength, setPasswordStrength }) {
  const [borderColor, setBorderColor] = useState(`${colorData.secondary}`);
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handlePassword = (e) => {
    setPasswordStrength(zxcvbn(e.target.value).score);
    setPassword(e.target.value);
    if (e.target.value === '') setBorderColor(`${colorData.secondary}`);
    else {
      switch (zxcvbn(e.target.value).score) {
        case 0:
          setBorderColor('red');
          break;
        case 1:
          setBorderColor('orange');
          break;
        case 2:
          setBorderColor('yellow');
          break;
        case 3:
          setBorderColor('lightgreen');
          break;
        case 4:
          setBorderColor('green');
          break;
      }
    }
  }
  return (
    <DivInput>
      <Label>Password:</Label>
      {/* <StyledInput $bordercolor={borderColor} $bordercolorfocus={borderColor == '#46505a' ? 'white' : borderColor} id="password" type="password" placeholder="(7-15 characters)" onChange={(e) => { handlePassword(e) }} value={password} /> */}
      <PasswordContainer $isfocused={isFocused}
        $bordercolor={borderColor} $bordercolorfocus={borderColor == `${colorData.secondary}` ? 'white' : borderColor}>
        <PasswordInput
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={
            (e) => {
              handlePassword(e);
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
      {passwordStrength == 0 && password != '' && <p style={{ color: borderColor }}>Super weak</p>}
      {passwordStrength == 1 && <p style={{ color: borderColor }}>Weak</p>}
      {passwordStrength == 2 && <p style={{ color: borderColor }}>Medium</p>}
      {passwordStrength == 3 && <p style={{ color: borderColor }}>Strong</p>}
      {passwordStrength == 4 && <p style={{ color: borderColor }}>Super strong</p>}
    </DivInput>
  )
}

export const LogWindow = styled.div`
    position: relative;
    background-color: ${colorData.tertiary};

    display: flex;
    flex-direction: column;
    align-items: center;

    width: ${props => props.$step === 3 ? '50vw' : '30vw'};
    height: ${props => props.$step === 3 ? '80vh' : '70vh'};

    border: solid 1px ${colorData.secondary};
    border-radius: 10px;

    overflow: hidden;

    transition: all ease-in-out .5s;
`;

export const Container = styled.div`
    background-color: ${colorData.primary};
    color: white;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    height: 100vh;

    overflow: hidden;
`;

export const InputContainer = styled.form`
    position: absolute;
    /* display: ${props => props.$step == props.$stepId ? 'flex' : 'none'}; */
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 100%;
    left: ${props => props.$step == props.$stepId ? '0' : props.$step > props.$stepId ? '-1200px' : '1200px'};
    transition: all ease-in-out .5s;
    padding: 0 60px;
`;

export const Head = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: ${props => props.$justify ? 'space-between' : 'center'};
    align-items: center;
    width: 100%;
  `;

export const BackBtn = styled.button`
    width: 10%;
    color: white;
    background-color: ${colorData.tertiary};
    border: none;
    font-size: 1.5em;
    position: relative;
    z-index: 999;
`;

export const Title = styled.h1`
    color: #afc5db;

    font-size: 1.5em;
    font-weight: bold;
    font-family: Arial, sans-serif;

    margin-top: 20px;
`;

export const Label = styled.p`
    color: #afc5db;
    font-size: 1.2em;
    font-weight: bold;
    font-family: Arial, sans-serif;

    position: relative;
    width: 100%;
`;

export const DivInput = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: ${props => props.width ? props.width : '100%'};
    height: fit-content;
`;

export const StyledInput = styled.input`
    background-color: ${colorData.tertiary};
    color: #b7c3cf;

    border: solid 1px;
    border-radius: 10px;
    border-color: ${props => props.$bordercolor};

    padding: 7px 10px;

    width: 100%;
    height: 40px;

    font-size: 20px;

    &:placeholder-shown{
        font-size: 15px;
    }

    &:focus {
        outline: none;
        background-color: ${colorData.secondary};
        color: white;
        border: solid 1px ${props => props.$bordercolorfocus};
    }

    &:hover {
      border: solid 1px ${props => props.$bordercolorfocus};
    }
`;

export const NextBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${props => props.$nextable ? 'green' : `${colorData.secondary}`};
    color: white;

    border: solid 1px ${colorData.secondary};
    border-radius: 10px;

    padding: ${props => props.$loading ? '10px' : '10px 20px'};
    margin: 20px 0;

    width: ${props => props.$loading ? '60px' : '200px'};

    transition: padding 0.3s ease, margin 0.3s ease, width 0.3s ease;

    cursor: ${props => props.$nextable ? 'pointer' : 'default'};

    &:hover {
        border: ${props => props.$nextable ? 'solid 1px white' : `solid 1px ${colorData.secondary}`};
    }

    & > * {
        transition: ${props => props.$nextable ? 'transform 0.3s ease' : 'none'};
    }

    &:hover > * {
        transform: ${props => props.$nextable && !props.$loading ? 'translateX(10px)' : 'none'};
    }
`;

const BirthdateContainer = styled.div`
    width: 140%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: row;
`;

const TextArea = styled.textarea`
    width: 100%;
    height: 200px;

    background-color: ${colorData.tertiary};

    border: solid 1px ${colorData.secondary};
    border-radius: 10px;

    padding: 10px;

    resize: none;

    &:hover {
        border: solid 1px white;
    }

    &:focus {
        outline: none;
        border: solid 1px white;
        background-color: ${colorData.secondary};
    }
`;

const ProfileInfos = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: fit-content;
`;

const ProfilePicPreview = styled(InputLabel)`
    display: flex;
    right: 110px;

    padding: 40px;

    align-items: center;
    justify-content: center;

    border: solid 1px ${colorData.secondary};
    border-radius: 10px;
    position: relative;
    height: 130px;
    width: 130px;
    &:hover {
        border: solid 1px white;
        background-color: ${colorData.secondary};
    }
`;

const RedirectLink = styled(Link)`
      height: 70px;
      position: absolute;
      bottom: 0;
`;

export default Register
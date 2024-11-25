import styled from "styled-components";

import { PostContainer, PostHeader, ProfilePic, PostInfo, PostUsername, PostDate, PostContent, ReadButton, PostText, PostImage, PostFooter, Button, LikeIcon, LikedIcon, LikeIconContainer, PostFeedContainer } from '../post/items.jsx';
import { colorData } from "../color.data.js";

export const ModalBackground = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Title = styled.h1`
    position: relative;
    text-align: center;

    font-size: 1.5em;

    color: ${colorData.quaternary};
`;

export const BtnContainer = styled.div`
    position: relative;
   
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    width: 80%;
    left: 10%;
    top: 10%;

`;

export const selectStyle = {
    singleValue: (provided) => ({
        ...provided,
        color: `${colorData.quinary}`,
    }),

    control: (provided, state) => ({
        ...provided,
        backgroundColor: `${colorData.primary}`,
        borderColor: state.isFocused ? 'white' : `${colorData.secondary}`,
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all ease-in-out .2s',
        width: '130%',
        fontSize: '0.9em',
        top: '25%',
        '&:hover': {
            backgroundColor: `${colorData.quaternary}`,
            color: `${colorData.quinary}`,
            borderColor: 'white',
        },
    }),

    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? `${colorData.quinary}` : `${colorData.primary}`,
        color: 'white',
        cursor: 'pointer',
        transition: 'all ease-in-out .2s',
        fontSize: '0.9em',
        '&:hover': {
            backgroundColor: `${colorData.quaternary}`,
            color: 'white',
        },
    }),

    menu: (provided) => ({
        ...provided,
        backgroundColor: `${colorData.primary}`,
        color: 'white',
        borderRadius: '5px',
        border: `1px solid ${colorData.secondary}`,
        cursor: 'pointer',
        transition: 'all ease-in-out .2s',
        width: '130%',
        '&:hover': {
            backgroundColor: `${colorData.quaternary}`,
            color: 'white',
        },
    }),
};

export const PostButton = styled.button`
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    width:10%;
    height: 6%;

    align-items: center;
    justify-content: center;

    background: ${props => props.$clickable ? colorData.quinary : colorData.quaternary};
    color: white;
    
    border: none;
    border-radius: 5px;
    
    display: flex;
    cursor: ${props => props.$clickable ? 'pointer' : 'default'};
    
    padding: 5px 15px;

    &:hover {
        background: ${props => props.$clickable ? colorData.senary : colorData.quaternary};
    }
`;

export const TextArea = styled.textarea`
    position: relative;
    width: 90%;
    height: 50%;
    display: flex;
    resize: none;
    padding: 10px;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    background: #121418;
    color: white;
    border: 1px solid ${colorData.secondary};
    font-size: 1em;
    margin: 10px 0;

    transition: all ease-in-out .2s;
    &:focus {
        outline: none;
        border-color: ${colorData.quinary};
        color: white;
    }
`;

export const Img = styled.img`
    position: relative;
    display: flex;
`;


export const ModalContent = styled.div`
    background: #121418;
    width: ${props => props.width};
    height: ${props => props.height ? props.height : '80%'};
    max-height: ${props => props.height == '92%' ? '92%' : '80%'};
    padding: ${props => props.height == '92%' ? '0' : '20px'};
    border: 1px solid ${colorData.secondary};
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    /* overflow-y: scroll; */
`;

export const ModalBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const CloseButton = styled.button`
    position: absolute;
    color: ${colorData.quaternary};
    border: none;
    border-radius: 100%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    top: 5px;
    right: 10px;
    z-index: 1000;

    transition: all ease-in-out .2s;
    &:hover {
        color: white;
    }
`;

export const InputLabel = styled.label`
    position: relative;
    color: ${colorData.quaternary};

    cursor: pointer;

    transition: all ease-in-out .2s;
    &:hover {
        color: white;
    }
`;

export const ContentContainer = styled.div`
    width: 100%;
    max-height: 100%;
    /* padding: 0 15px 15px 15px; */

    /* display: grid;
    grid-template-columns: 1fr; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    transform: translate3d(0,0,0);
    overflow-y: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
`;

export const CommentsModalContainer = styled(PostContainer)`
    position: relative;
    height: 100%;
    background: #121418;
    border: none;
`;

export const CommentsModalHeader = styled(PostHeader)`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    height: 5vh;
    padding: 10px;
    box-sizing: border-box;
    border-bottom: solid 1px ${colorData.secondary};
`;

export const CommentsModalContent = styled(PostContent)`
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    width: 100%;
    margin-top: 40px;
    padding: 10px 20px;
    border: none;
    border-left: none;
    border-right: none;
    box-sizing: border-box;
    position: relative;
    /* top: -45px; */
`;

export const CommentsModalFooter = styled(PostFooter)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 10px;
    position: fixed;
    bottom: 0;
    left: 0;
    /* height: 10vh; */
    transition: .2s;
    height: ${props => props.$writeComment ? '10vh' : '5vh'};
    padding: 10px;
    box-sizing: border-box;
    border-top: solid 1px ${colorData.secondary};
    background-color: #121418;
`;

export const CommentsModalText = styled(PostText)`
    margin-top: 30px;
    font-size: 16px;
    letter-spacing: 1.2px;
    overflow: hidden;
    word-wrap: break-word;
    transition: .2s;
    overflow-y: ${props => props.$readMore ? 'scroll' : 'hidden'};
    max-height: ${props => props.$readMore ? '32vh' : '13vh'};
`;

export const CommentsModalImage = styled(PostImage)`
    margin-top: 10px;
`;

export const CommentsModalDate = styled(PostDate)`
    margin-top: 10px;
    font-size: 0.8em;
`;

export const CommentsModalReadButton = styled(ReadButton)`
    box-shadow: ${props => props.$readMore ? 'none' : '0 -10px 23px #121418'};
`;

export const CommentsModalContentContainer = styled(CommentsModalContent)`
    height: ${props => `${props.$scrollState}%`};
    overflow: ${props => props.$scrollState == 0 ? 'hidden' : 'visible'};
    transition: all .2s;
    margin-top: 0;
    padding: 0;
    border: none;
    flex: 0;
`;

export const ModalSectionContainer = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    left: ${props => props.$sectionId == props.$section ? '0' : props.$section > props.$sectionId ? '-1200px' : '1200px'};
    transition: all ease-in-out .5s;
`;

export const SelectFollowersPrivacyContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    height: 69%;
    margin-top: 30px;
    /* padding: 10px; */
`;

export const PostModalContainer = styled.div`
    height: 100%;
    width: 100%;
    overflow: hidden;
`;


// debut component pour follower ///////

export const ListFollow = styled.div`
  width: 100%;
  height: 40px;
  background-color: ${colorData.primary};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid ${colorData.quaternary};
  border-radius: 5px;
  margin: 12px 0;
`;

export const PhotoProfileFollow = styled.div`
  width: 30px;
  height: 40px;
  color: ${colorData.quaternary};
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const NameFollow = styled.div`
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 10px;
`;

/// component pour EVENTS//////////////////
////////////////////////////////////////////
export const EventContainer = styled.div`
display : flex;
flex-direction: column;
margin: 10px;
border: 1px solid ${colorData.secondary};
    border-radius: 5px;

`
///// HEADER EVENT ////////
//////////////////////////
export const EventBannerBtn = styled.button`
    border: 1px solid ${colorData.secondary};
    border-radius: 5px;
    color: ${colorData.quaternary};
    margin-right: 10px;
    font-size: ${props => props.$isScrolled ? '15px' : '20px'};
    padding: ${props => props.$isScrolled ? '2px' : '5px'};
    &:hover {
        background-color: ${colorData.quinary};
        color: white;
    }
    margin-left: 15px;
`;
export const EventHeader = styled.div`
    display: flex;
    flex-direction: row;
    height: 2%;
    color: ${colorData.quaternary};
    border-bottom: 1px solid ${colorData.secondary};
    
`;
export const EventHeaderLeft = styled.div`

    display: flex;
    flex-direction: row;
    width: 50%;
    padding-left: 5px;
`;
export const EventHeaderLeftText = styled.p`
    padding-left: 10px;
    padding-top: 2px;
    font-size: 20px;
    color: ${colorData.quaternary};
`;

//
export const EventHeaderRight = styled.div`
    justify-content: left;
    align-items: left;
    display: flex;
    flex-direction: row;
    width: 50%;
    padding-right: 5px;
    justify-content: space-between;
`;

export const EventHeaderRightText = styled.div`
    justify-content: right;
    align-items: right;
    padding-left: 10px;
    padding-top: 2px;
    font-size: 20px;
    color: ${colorData.quaternary};
`;


//// BODY EVENT ////////
///////////////////////
export const EventBody = styled.div`
    display : flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height : 100%;
    width : 100%;
    background-color: ${colorData.primary};
    padding: 10px;
`

export const EventLeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: left;
    align-items: left;
    padding-top: 10px;
    width : 50%;
    color : ${colorData.quaternary};    
`
export const EventLeftContainerText = styled.p`
display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: left;
    padding-top: 10px;
    width : 100%;
    color:white;
    
`
// container pour placer l'image de l'event/////
export const EventRightContainerImg = styled.img`
    
    width : 50%;
`
//// FOTTER EVENT///////
///////////////////////
export const EventFooter = styled.div`
border-top: 1px solid ${colorData.secondary};
    justify-content: space-between;
    display: flex;
    flex-direction: row;
    padding-top: 6px;
    padding-left: 6px;
    padding-right: 10px;
    width: 100%;
    height: 50px;
`;
export const EventFooterlefttext = styled.p`
    margin-right: 100px;
    padding-left: 6 px;
    font-size: 15px;
    color: ${colorData.quaternary};
`;

export const EventFottercontainerButton = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
`;
export const EventFotterMid = styled.button`
    color: green;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

export const EventFotterRight = styled.button`
    color: red;
    margin-left: 50px;
    display: flex;
    flex-direction: row;    
    justify-content: flex-end;
`;

export const EventsModalImage = styled.div`
    position: relative !important;
    width: 50%;
    height: 200px;
`;

// component groups /////

export const ListGroup = styled.div`
  width: 80%;
  height: 40px;
  background-color: ${colorData.primary};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid ${colorData.quaternary};
  border-radius: 5px;
  margin-top: 15px;
`;

export const PhotoProfileGroup = styled.div`
  width: 30px;
  height: 40px;
  color: ${colorData.quinary};
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const NameGroup = styled.div`
  height: 50px;
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 17px;
`;

export const GroupCreateGroup = styled.button`
    color: green;
    display: flex;
    margin-top: 7px;
    margin-left: 14px;   
`;

/////// CREATE NEW GROUP //////////
//////////////////////////////////

export const ModalTitle = styled.h2`
    color:${colorData.quaternary};
    font-size: 24px;
    text-align: center;
    margin-bottom: 20px;
`;

export const ModalBody1 = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
`;

export const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    width: 100%;
`;

export const InputLabel1 = styled.label`
    color : ${colorData.quaternary};
    font-size: 16px;
    margin-bottom: 5px;
`;

export const TextInputName = styled.input`
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #ccc;
`;
export const TextInputDesciption1 = styled.textarea`
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid ${colorData.quaternary};
    resize: none; // permet à l'utilisateur de redimensionner le champ de texte verticalement
    overflow: auto; // ajoute une barre de défilement si le contenu dépasse la hauteur du champ de texte
    height: 150px;
    background-color: ${colorData.tertiary};
    &:focus {
        border: solid 1px green;
        outline: none;
    }
`;

export const ImageInput = styled.input`
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #ccc;
`;

export const SubmitButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 4px;
    border: none;
    background-color: ${colorData.quinary};
    color: white;
    cursor: pointer;
    &:hover {
        background-color: ${colorData.senary};
    }
`;
export const GroupButtonBack = styled.button`
    color: green;
    display: flex;
    position: relative;
    margin-top: 7px;

`;

///////////////////
// component pour les bouton des different modal

export const DivModalClick = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: 15px;
    
`;
export const ScrollableContainer = styled.div`
    overflow: auto;
    max-height: 75vh; // ou une autre valeur qui convient à votre mise en page
`;
//date lieu description titre image 
//(button pour ajouter des participant)

export const Follower = styled.div`
    width: 90%;
    height: 40px;

    cursor: pointer;
`;

export const SelectedFollower = styled.div`
    display: flex;
    align-items: center;
    width: fit-content;
    height: auto;
    border: 1px solid ${colorData.quaternary};
    border-radius: 5px;
    font-size: 20px;
    text-transform: capitalize;
    margin: 5px;
    padding: 0 5px;

    cursor: pointer;
`;

export const SelectedViewersContainer = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;
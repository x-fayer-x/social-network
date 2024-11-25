import React, { useRef, useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import styled from "styled-components";
import InputEmoji from "react-input-emoji";

import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";

import {
    Container,
    RadioLabel,
    Switcher,
    Friend,
    NameContainer,
    Status,
} from "./items";
import { colorData } from "../color.data";
import MsgComponent from "./messages/message.jsx";

import useGroupChatWebSocket from "../../custom/ws-group-chat";
import usePrivateChatWebSocket from "../../custom/ws-private-chat";

import { useUser } from "../../contexts/user.js";

export default function FriendsContainer() {
    const [selected, setSelected] = useState("friends");
    const [msgIsOpen, setMsgIsOpen] = useState(false);

    useEffect(() => {
        setMsgIsOpen(false);
    }, []);

    return (
        <Container $border-width={"0px 0px 0px 1px;"} $msgMode={msgIsOpen}>
            <Switch
                selected={selected}
                setSelected={setSelected}
                value1="friends"
                value2="groups"
                name="FollowersContainer_switch"
            />
            {selected === "friends" ? (
                <FriendsSection msgIsOpen={msgIsOpen} setMsgIsOpen={setMsgIsOpen} />
            ) : (
                <GroupsSection msgIsOpen={msgIsOpen} setMsgIsOpen={setMsgIsOpen} />
            )}
        </Container>
    );
}

export function Switch({ selected, setSelected, value1, value2, name }) {
    return (
        <Switcher>
            <input
                id={value1}
                name={name}
                type="radio"
                style={{ display: "none" }}
                checked={selected === value1}
                onChange={() => setSelected(value1)}
            />
            <RadioLabel
                onClick={() => setSelected(value1)}
                selected={selected === value1}
            >
                {value1}
            </RadioLabel>

            <input
                id={value2}
                name={name}
                type="radio"
                style={{ display: "none" }}
                checked={selected === value2}
                onChange={() => setSelected(value2)}
            />
            <RadioLabel
                onClick={() => setSelected(value2)}
                selected={selected === value2}
            >
                {value2}
            </RadioLabel>
        </Switcher>
    );
}

function FriendsSection({ msgIsOpen, setMsgIsOpen }) {
    const [selectedChat, setSelectedChat] = useState("");
    const [followerData, setFollowerData] = useState([]);

    const [allMessages, setAllMessages] = useState([]);

    const privateChatSocket = usePrivateChatWebSocket();

    const { user } = useUser();
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (user) {
            fetch(`https://localhost:8080/api/follows/${user.uuid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Session-Token": Cookies.get("Token"),
                },
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setFollowerData(data);
                })
                .catch((error) => {
                    console.error("Error while fetching followers: ", error);
                });
        }
    }, [privateChatSocket, user]);

    return (
        <ChatSection>
            {followerData ? (
                followerData.map((friend) => {
                    return (
                        <ChatComponent
                            key={friend.uuid}
                            msgIsOpen={msgIsOpen}
                            setMsgIsOpen={setMsgIsOpen}
                            selectedChat={selectedChat}
                            setSelectedChat={setSelectedChat}
                            friend={friend}
                            messages={allMessages}
                            setMessages={setAllMessages}
                            option={"user"}
                        >
                            <PermIdentityOutlinedIcon style={{ fontSize: "31px" }} />
                        </ChatComponent>
                    );
                })
            ) : (
                <p>No friends found.</p>
            )}
        </ChatSection>
    );
}

const ChatComponent = React.memo(
    ({
        msgIsOpen,
        setMsgIsOpen,
        selectedChat,
        setSelectedChat,
        friend,
        messages,
        setMessages,
        option,
        children,
    }) => {
        const [chat, setChat] = useState(false); // chat open or closed
        // Remove unused variables
        // const [msgContent, setMsgContent] = useState([]);
        const [text, setText] = useState("");
        const [colorFocus, setColorFocus] = useState(`${colorData.quaternary}`);

        const { user } = useUser();

        const toSetMessage = (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        };

        const groupChatSocket = useGroupChatWebSocket(toSetMessage);
        const privateChatSocket = usePrivateChatWebSocket(toSetMessage);

        const inputRef = useRef(null);
        const chatBodyRef = useRef(null);

        const handleChatClick = useCallback(() => {
            if (msgIsOpen && selectedChat === friend.Name) {
                setMsgIsOpen(false);
            } else {
                setMsgIsOpen(true);
                inputRef.current.focus();
            }
            setChat(!chat);
            setSelectedChat(friend.Name); // modify container width
        });

        useEffect(() => {
            if (selectedChat !== friend.Name) {
                setChat(false);
            }
        }, [selectedChat, friend.Name]);

        // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
        useEffect(() => {
            if (!chat) {
                return;
            }

            const entity = option === "group" ? friend.id : friend.uuid;
            fetch(`https://localhost:8080/api/${option}/messages/${entity}`, {
                //TODO: Adapter pour groups et privés -> cause de l'erreur
                // actuellement que pour les groupes
                method: "GET", //map undefined car définie que dans groupes et pas privés
                headers: {
                    //Erreur vient de privés du coup
                    "Content-Type": "application/json",
                    "Session-Token": Cookies.get("Token"),
                },
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data !== null) {
                        setMessages((prev) => [...prev, ...data]);
                    }
                });
        }, [chat]);

        // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
        useEffect(() => {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }, [messages]);

        const generateMessages = (msgList) => {
            if (msgList) {
                return msgList.map((msg, index) => {
                    if (msg.target_id === friend.id || msg.target_id === friend.uuid) {
                        let msgType = 0;
                        if (msg.sender_uuid === user.uuid) {
                            msgType = 1;
                        }
                        return (
                            <MsgComponent key={`${msg.id}-${index}`} msgType={msgType}>
                                {msg.message_content}
                            </MsgComponent>
                        );
                    }
                });
            }
        };

        const sendMsg = () => {
            switch (option) {
                case "group": {
                    const groupMsg = {
                        type: "msg",
                        message_content: text,
                        sender_uuid: Cookies.get("Token"),
                        target_id: friend.id,
                    };
                    groupChatSocket.send(JSON.stringify(groupMsg));
                    break;
                }
                case "user": {
                    const privateMsg = {
                        type: "msg",
                        message_content: text,
                        sender_uuid: Cookies.get("Token"),
                        target_uuid: friend.uuid,
                    };
                    privateChatSocket.send(JSON.stringify(privateMsg));
                    break;
                }
            }
        };

        return (
            <ChatContainer $chat={chat}>
                <Friend
                    $chat={chat}
                    $msgIsOpen={msgIsOpen}
                    onClick={() => handleChatClick()}
                >
                    {children}
                    <NameContainer>{friend.Name}</NameContainer>
                    <Status />
                </Friend>
                <ChatBody ref={chatBodyRef} $chat={chat}>
                    {chat && messages && generateMessages(messages)}
                </ChatBody>
                <ChatFooter $chat={chat}>
                    <InputEmoji
                        background={`${colorData.nonary}`}
                        width={"85%"}
                        borderRadius={"10px"}
                        color={`${colorData.septenary}`}
                        onFocus={() => setColorFocus(`${colorData.quinary}`)}
                        onBlur={() => setColorFocus(`${colorData.quaternary}`)}
                        borderColor={colorFocus}
                        ref={inputRef}
                        value={text}
                        onChange={(e) => {
                            setText(e);
                        }}
                        cleanOnEnter
                        onEnter={() => {
                            if (text !== undefined && text !== "") {
                                sendMsg();
                            }
                        }}
                        placeholder="Aa"
                    />
                </ChatFooter>
            </ChatContainer>
        );
    }
);

function GroupsSection({ msgIsOpen, setMsgIsOpen }) {
    const [selectedChat, setSelectedChat] = useState("");
    const [GroupData, setGroupData] = useState([]);
    const groupIdTab = [];

    const toSetMessage = (msg) => {
        setAllMessages((prevMessages) => [...prevMessages, msg]);
    };

    const groupChatSocket = useGroupChatWebSocket(toSetMessage);

    const [allMessages, setAllMessages] = useState([]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const uuid = Cookies.get("Token");
        fetch(`https://localhost:8080/api/grouplist/${uuid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Session-Token": Cookies.get("Token"),
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.length === 0) {
                    return;
                }

                setGroupData(data);

                data.forEach((group) => {
                    groupIdTab.push(group.id);
                });

                if (groupChatSocket === null) {
                    return;
                }
                const initWsObject = {
                    type: "init",
                    GroupList: groupIdTab,
                    uuid: uuid,
                };

                groupChatSocket.send(JSON.stringify(initWsObject));


                groupChatSocket.onmessage = (event) => {
                    console.log("data : ", data);
                    toSetMessage(JSON.parse(event.data));
                };
            })
            .catch((error) => {
                console.error("Error while fetching group list: ", error);
            });
    }, [groupChatSocket]);

    return (
        <ChatSection>
            {GroupData && GroupData.length > 0 ? (
                GroupData.map((group) => (
                    <ChatComponent
                        key={group.id}
                        msgIsOpen={msgIsOpen}
                        setMsgIsOpen={setMsgIsOpen}
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                        friend={{ Name: group.title, id: group.id }}
                        messages={allMessages}
                        setMessages={setAllMessages}
                        option={"group"}
                    >
                        <Groups2OutlinedIcon style={{ fontSize: "31px" }} />
                    </ChatComponent>
                ))
            ) : (
                <p>No groups found.</p>
            )}
        </ChatSection>
    );
}

// =============  CONTAINERS  =============
export const ChatContainer = styled.div`
  width: 86%;
  height: fit-content;
  margin-top: 3%;
  margin-bottom: 3%;
  margin-left: 7%;
  border-radius: 5px;
  border: 1px solid ${colorData.secondary};

  &:hover {
    background-color: ${(props) =>
        props.$chat ? "transparent" : `${colorData.nonary}`};
  }
`;

export const ChatSection = styled.div`
  width: 100%;
  height: 94%;
  overflow-y: auto;
  overflow-x: hidden;
`;

// =============  BODY  =============

export const ChatBody = styled.div`
  width: 100%;
  height: ${(props) => (props.$chat ? "50vh" : "0")};
  transition: all ease-in-out 0.2s;
  overflow-y: scroll;
  scrollbar-width: none;
`;

// =============  FOOTER  =============

export const ChatInput = styled.div`
  width: 85%;
  height: fit-content;
  max-height: 18vh;

  border: 1px solid ${colorData.secondary};
  outline: none;
  resize: none;

  border-radius: 5px;

  background-color: ${colorData.nonary};

  padding: 5px;

  white-space: pre-wrap;
  word-wrap: break-word;

  overflow-y: auto;

  z-index: 100;

  &:focus {
    border-color: ${colorData.quinary};
  }
`;

export const PlaceholderContainer = styled.div`
  position: absolute;
  width: 80%;
  /* height: 100%; */
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const Placeholder = styled.div`
  color: ${colorData.quaternary};
  font-size: 20px;
  right: 12%;
`;

export const ChatFooter = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  border-top: ${(props) =>
        props.$chat ? `1px solid ${colorData.secondary}` : "none"};
  min-height: ${(props) => (props.$chat ? "6vh" : "0")};
  height: ${(props) => (props.$chat ? "auto" : "0")};
  transition: all ease-in-out 0.2s;
  padding: ${(props) => (props.$chat ? "5px" : "0")};
  padding-left: 0;
  overflow: ${(props) => (props.$chat ? "none" : "hidden")};

  background-color: ${colorData.nonary};
`;

export const EmoteBtnContainer = styled.div`
  width: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
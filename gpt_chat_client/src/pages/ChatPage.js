import React, { useContext, useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { mobile } from "../responsive";
import CollapseButton from "../components/CollapseButton";
import ChatBubble from "../components/ChatBubble";
import PopUp from "../components/PopUp";
import TextareaAutosize from "react-textarea-autosize";
import { Tooltip } from "react-tooltip";
import { SiOpenai } from "react-icons/si";
import { CgAttachment } from "react-icons/cg";
import { FaMicrophone } from "react-icons/fa6";
import { BsArrowUpSquareFill } from "react-icons/bs";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import DragDropFiles from "../components/DragDropFiles";
import { useDropzone } from "react-dropzone";
import FilePreview from "../components/FilePreview";
import Dropdown from "../components/Dropdown";
import { PiSparkle } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import InputField from "../components/InputField";
import ChatPreview from "../components/ChatPreview";
import PromptPreview from "../components/PromptPreview";
import axios from "axios";
import { UserContext } from "../context/userContext";
import PopUp_CreatePrompt from "../components/PopUp_CreatePrompt";
import { Bounce } from "react-activity";
import "react-activity/dist/library.css";
import { IoIosExit } from "react-icons/io";
import { FaUserTie } from "react-icons/fa6";
import PopUp_AdminPanel from "../components/PopUp_AdminPanel";

export default function ChatPage({ setPage }) {
  const [toggleLeft, setToggleLeft] = useState(true);
  const [toggleRight, setToggleRight] = useState(true);
  const [speechToText, setSpeechToText] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [message, setMessage] = useState("");
  const [chatBubbles, setChatBubbles] = useState([]);
  const [chats, setChats] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const [promptSearch, setPromptSearch] = useState("");
  const [togglePromptEditor, setTogglePromptEditor] = useState(false);
  const [toggleAdminPanel, setToggleAdminPanel] = useState(false);

  const { user, host, config, setUser } = useContext(UserContext);

  const form = useRef(null);
  const messagesEndRef = useRef(null);

  const dropdownOptions = [{ value: "chatgpt", label: "Chat GPT" }];

  const { open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    },
  });
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    if (
      !browserSupportsSpeechRecognition &&
      browserSupportsContinuousListening
    ) {
      alert("Tarayıcı ses kaydına izin vermiyor!");
    }

    getAllChats();
    getAllPrompts();
  }, []);
  useEffect(() => {
    if (listening) {
      setMessage(transcript);
    }
  }, [listening, transcript]);
  useEffect(() => {
    if (files.length > 8) {
      const trimmedFiles = files.slice(0, 8);
      trimmedFiles.map((a) =>
        Object.assign(a, {
          preview: a.preview === undefined ? URL.createObjectURL(a) : a.preview,
          id: Math.random(),
        })
      );

      setFiles(trimmedFiles);
      alert("Maximum 8 dosya yüklenebilir!");
    } else {
      const b = files;

      if (b) {
        b.map((a) =>
          Object.assign(a, {
            preview:
              a.preview === undefined ? URL.createObjectURL(a) : a.preview,
            id: Math.random(),
          })
        );
        setFiles(b);
      }
    }
  }, [files]);
  useEffect(() => {
    if (!currentChat) return;
    getAllMessagesOfChat();
  }, [currentChat]);
  useEffect(() => {
    scrollToBottom();
  }, [chatBubbles]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (waitForResponse) return;

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    if (formJson.message) {
      if (currentChat) {
        sendMessage(formJson);
      } else {
        handleNewChat(true, (chat) => sendMessage(formJson, chat));
      }
    }
  };
  const sendMessage = (msg, toChat) => {
    const chatObject = {
      chatId: currentChat ? currentChat._id : toChat._id,
      sender: "client",
      message: msg.message,
      type: "message",
      // files: [],
    };
    // chatObject.files.push(...files);
    chatObject.type = files.length > 0 ? "hasDocument" : "message";
    axios
      .put(host + "msg/create", chatObject, config)
      .then((result) => {
        if (result.status === 200) {
          getAIMessage(msg.message, currentChat ? currentChat._id : toChat._id);
          setFiles([]);
          setMessage("");
          resetTranscript();
          setChatBubbles((prev) => [...prev, chatObject]);
          setWaitForResponse(true);
        } else {
          alert("Mesaj gönderme başarısız!");
        }
      })
      .catch(() => alert("Mesaj gönderme başarısız!"));
  };
  const onEnterPress = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      form.current.requestSubmit();
    }
  };

  const getAIMessage = (msg, toChat) => {
    const chatObject = {
      chatId: toChat,
      sender: "client",
      message: msg.message,
      type: "message",
      // files: [],
    };

    axios
      .put(host + "msg/getai", chatObject, config)
      .then((result) => {
        if (result.status === 200) {
          setChatBubbles((prev) => [...prev, result.data]);
          setWaitForResponse(false);
        } else {
          alert("AI mesaj gönderme başarısız!");
        }
      })
      .catch(() => alert("AI mesaj gönderme başarısız!"));
  };

  const handleNewChat = (bypass, onSuccess) => {
    if (!bypass && chatBubbles.length === 0) return;

    axios
      .put(
        host + "chat/create",
        {
          userId: user._id,
          title: "New Chat",
        },
        config
      )
      .then((result) => {
        if (result.status === 200) {
          setCurrentChat(result.data);
          setChats((prev) => [...prev, result.data]);
          setWaitForResponse(false);

          if (onSuccess) {
            onSuccess(result.data);
          }
        } else {
          alert("Yeni konuşma oluşturma başarısız!");
        }
      })
      .catch(() => alert("Yeni konuşma oluşturma başarısız!"));
  };
  const handleDeleteChat = (id) => {
    axios
      .delete(host + `msg/deleteall/${id}`, config)
      .then((result) => {
        if (result.status === 200) {
          if (currentChat._id === id) {
            setChatBubbles([]);
          }
        } else {
          alert("Konuşma silme başarısız!");
        }
      })
      .catch(() => alert("Konuşma silme başarısız!"));
    axios
      .delete(`http://localhost:5000/api/chat/delete/${id}`, config)
      .then((result) => {
        if (result.status === 200) {
          if (currentChat._id === id) {
            setChatBubbles([]);
            setCurrentChat(chats[chats.indexOf(currentChat) - 1]);
          }
          setChats(chats.filter((item) => item._id !== id));
        } else {
          alert("Konuşma silme başarısız!");
        }
      })
      .catch(() => alert("Konuşma silme başarısız!"));
  };

  const getAllChats = () => {
    axios
      .get(host + `chat/getall/${user._id}`, config)
      .then((result) => {
        if (result.status === 200) {
          setCurrentChat(result.data[0]);
          setChats(result.data);
        } else {
          alert("Konuşmalar alınırken problem yaşandı!");
        }
      })
      .catch(() => alert("Konuşmalar alınırken problem yaşandı!"));
  };
  const getAllPrompts = () => {
    axios
      .get(host + `prompt/get/${user._id}`, config)
      .then((result) => {
        if (result.status === 200) {
          setPrompts(result.data);
        } else {
          alert("Promptlar alınırken problem yaşandı!");
        }
      })
      .catch(() => alert("Promptlar alınırken problem yaşandı!"));
  };
  const getAllMessagesOfChat = () => {
    setChatBubbles([]);
    axios
      .get(host + `msg/get/${currentChat._id}`, config)
      .then((result) => {
        if (result.status === 200) {
          setChatBubbles(result.data);
        } else {
          alert("Yeni konuşma oluşturma başarısız!");
        }
      })
      .catch(() => alert("Yeni konuşma oluşturma başarısız!"));
  };

  const handleChatSearch = (e) => {
    setChatSearch(e);
  };
  const handlePromptSearch = (e) => {
    setPromptSearch(e);
  };

  const handleLogOut = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    setPage("LOGIN");
  };

  const handleDelete = (id) => {
    axios
      .delete(host + `prompt/delete/${id}`, config)
      .then((result) => {
        if (result.status === 200) {
          setPrompts(prompts.filter((a) => a._id !== id));
        }
      })
      .catch(() => {
        alert("Prompt silme başarısız!");
      });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Main>
      <PopUp
        toggle={togglePromptEditor}
        view={
          <PopUp_CreatePrompt
            setToggle={setTogglePromptEditor}
            getAllPrompts={getAllPrompts}
          />
        }
        setToggle={setTogglePromptEditor}
      />
      <PopUp
        toggle={toggleAdminPanel}
        view={
          <PopUp_AdminPanel
            setToggle={setToggleAdminPanel}
            getAllPrompts={getAllPrompts}
          />
        }
        setToggle={setToggleAdminPanel}
      />
      {dragging && (
        <DragDropFiles
          onDrop={() => {
            setDragging(false);
          }}
          setFiles={setFiles}
          file={files}
        />
      )}
      <LeftSidebar toggle={toggleLeft}>
        <ToggleLeftButton toggle={toggleLeft}>
          <CollapseButton
            side={toggleLeft ? "left" : "right"}
            onClick={() => {
              setToggleLeft(!toggleLeft);
            }}
          ></CollapseButton>
        </ToggleLeftButton>
        <NewChatButton
          onClick={() => {
            handleNewChat(false);
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              backgroundColor: "whitesmoke",
              borderRadius: "500px",
            }}
          >
            <PiSparkle size={22} />
          </div>
          <NewChatLabel>Yeni konuşma</NewChatLabel>
          <FiEdit size={18} color="whitesmoke" />
        </NewChatButton>
        <InputField placeholder={"Konuşma ara"} onChange={handleChatSearch} />
        <NewChatPreviewContainer>
          {chats.map((e) => (
            <ChatPreview
              chat={e}
              handleDeleteChat={handleDeleteChat}
              key={e._id}
              selected={e._id === currentChat?._id}
              setCurrentChat={setCurrentChat}
            />
          ))}
        </NewChatPreviewContainer>
        <LogOutContainer onClick={handleLogOut}>
          <body
            style={{
              color: "whitesmoke",
              fontWeight: "100",
              fontSize: 10,
              paddingTop: 10,
            }}
          >
            {user.email}
          </body>
          <div style={{ display: "flex", alignItems: "center" }}>
            <LogOutLabel>ÇIKIŞ</LogOutLabel>
            <IoIosExit size={25} color="whitesmoke" />
          </div>
        </LogOutContainer>
      </LeftSidebar>
      <Chat
        toggleLeft={toggleLeft}
        toggleRight={toggleRight}
        onDragEnter={() => {
          setDragging(true);
        }}
      >
        <TopMenu>
          <Dropdown options={dropdownOptions} />
          <TopButton
            title="Yeni konuşma"
            onClick={() => {
              handleNewChat(false);
            }}
          >
            <FiEdit size={15} color="whitesmoke" />
          </TopButton>
          {user.isAdmin && (
            <TopButton
              style={{ marginLeft: "11.8rem" }}
              title="Admin Panel"
              onClick={() => {
                setToggleAdminPanel(true);
              }}
            >
              <FaUserTie size={15} color="whitesmoke" />
            </TopButton>
          )}
        </TopMenu>
        <Middle>
          {chatBubbles.length === 0 && (
            <IntroContainer>
              <Image>
                <SiOpenai size={42} color={"#171717"} />
              </Image>
              <IntroLabel>Bugün size nasıl yardımcı olabilirim?</IntroLabel>
            </IntroContainer>
          )}

          <ChatScroll>
            <ChatContainer>
              {chatBubbles.map((item) => (
                <ChatBubble key={item.id} message={item} />
              ))}
              <div ref={messagesEndRef} />
            </ChatContainer>
          </ChatScroll>
        </Middle>
        <InputContainer
          onSubmit={handleSubmit}
          focused={inputFocused}
          ref={form}
        >
          <FilePreviewContainer enabled={files.length !== 0}>
            {files.length !== 0 &&
              files.map((i) => {
                return (
                  <FilePreview
                    key={i.id}
                    file={i}
                    setFiles={setFiles}
                    deletable={true}
                  />
                );
              })}
          </FilePreviewContainer>
          <InputfieldContainer>
            <AttachmentButton
              data-tooltip-id="attachment_tooltip"
              data-tooltip-content={"Dosya ekle"}
              data-tooltip-place={"top"}
              onClick={open}
            >
              <CgAttachment size={22} color={"whitesmoke"} />
            </AttachmentButton>
            <TextareaAutosize
              onKeyDown={onEnterPress}
              value={message}
              spellCheck={false}
              onFocus={() => {
                setInputFocused(false);
              }}
              onBlur={() => {
                setInputFocused(true);
              }}
              onChange={(ev) => setMessage(ev.target.value)}
              style={{
                resize: "none",
                width: "100%",
                marginLeft: "1rem",
                marginRight: "2.5rem",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "15px",
                fontWeight: "400",
                color: "whitesmoke",
                outline: "none",
              }}
              maxLength="1500"
              name="message"
              placeholder="Mesaj ChatGPT"
              id="message"
            />
            <VoiceToTextButton
              enabled={
                browserSupportsContinuousListening &&
                browserSupportsSpeechRecognition
              }
              onClick={() => {
                if (
                  !speechToText &&
                  browserSupportsContinuousListening &&
                  browserSupportsSpeechRecognition
                ) {
                  SpeechRecognition.startListening({
                    continuous: true,
                    language: "tr",
                  });
                } else SpeechRecognition.stopListening();
                setSpeechToText(!speechToText);
              }}
              data-tooltip-id="send_tooltip"
              data-tooltip-content={
                browserSupportsContinuousListening &&
                browserSupportsSpeechRecognition
                  ? speechToText
                    ? "Mikrofonu kapat"
                    : "Mikrofonu aç"
                  : ""
              }
              data-tooltip-place={"top"}
            >
              <FaMicrophone
                size={22}
                color={speechToText ? "#ea0028" : "whitesmoke"}
              />
            </VoiceToTextButton>
            <SendButton
              enabled={message.length !== 0}
              data-tooltip-id="send_tooltip"
              data-tooltip-content={
                waitForResponse
                  ? "Cevap bekleniyor"
                  : message.length !== 0
                  ? "Mesaj gönder"
                  : "Mesaj yazın"
              }
              data-tooltip-place={"top"}
              type="submit"
            >
              {waitForResponse ? (
                <div
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Bounce color="white" size={10} />
                </div>
              ) : (
                <BsArrowUpSquareFill
                  size={28}
                  color={"whitesmoke"}
                  opacity={message.length !== 0 ? "1" : "0.2"}
                />
              )}
            </SendButton>
          </InputfieldContainer>

          <div style={{ userSelect: "none" }}>
            <Tooltip
              id="send_tooltip"
              style={{
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "500",
                backgroundColor: "#171717",
              }}
            />
            <Tooltip
              id="speechtotext_tooltip"
              style={{
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "500",
                backgroundColor: "#171717",
              }}
            />
            <Tooltip
              id="attachment_tooltip"
              style={{
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "500",
                backgroundColor: "#171717",
              }}
            />
          </div>
        </InputContainer>
        <Footer>
          <FooterLabel>
            GPTchat v0.1 -{" "}
            <a
              rel="noreferrer"
              target="_blank"
              href="https://github.com/semihtuncer/GPTWrapper"
              style={{ color: "whitesmoke" }}
            >
              by ST
            </a>
          </FooterLabel>
        </Footer>
      </Chat>
      <RightSidebar toggle={toggleRight}>
        <ToggleRightButton toggle={toggleRight}>
          <CollapseButton
            side={toggleRight ? "right" : "left"}
            onClick={() => {
              setToggleRight(!toggleRight);
            }}
          ></CollapseButton>
        </ToggleRightButton>
        <InputField placeholder={"Prompt ara"} onChange={handlePromptSearch} />
        <NewPromptButton onClick={() => setTogglePromptEditor(true)}>
          <NewPromptLabel>PROMPT OLUŞTUR</NewPromptLabel>
        </NewPromptButton>
        <PromptPreviewContainer>
          {prompts.map((p) => (
            <PromptPreview
              prompt={p}
              setMessage={setMessage}
              handleDelete={handleDelete}
            />
          ))}
        </PromptPreviewContainer>
      </RightSidebar>
    </Main>
  );
}

const FadeInAnim = keyframes`
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`;
const SendButtonBounce = keyframes`
    0% {
      transform: translateY(0px);
    }
    50%{
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0px);
    }
`;
const Main = styled.div`
  width: 100vw;
  display: flex;
  animation: ${FadeInAnim} 1s ease;
  background-color: #212121;
  overflow: hidden;
`;
const LeftSidebar = styled.div`
  width: ${(props) => (props.toggle ? "25rem" : "0")};
  background-color: #171717;
  height: 100vh;
  transition: all 0.3s ease;
  border-radius: 0px 25px 25px 0px;
  overflow-x: hidden;
  overflow-y: hidden;
  z-index: 99;
  position: relative;
`;
const RightSidebar = styled.div`
  width: ${(props) => (props.toggle ? "25rem" : "0")};
  background-color: #171717;
  height: 100vh;
  transition: all 0.3s ease;
  border-radius: 25px 0px 0px 25px;
  overflow-x: hidden;
  overflow-y: hidden;
  z-index: 99;
`;
const Chat = styled.div`
  height: 100vh;
  transition: all 0.3s ease;
  flex: ${(props) => (props.toggleLeft === props.toggleRight ? "5" : "7")};
  background-color: #212121;
  display: flex;
  flex-direction: column;
`;
const ToggleLeftButton = styled.div`
  position: fixed;
  transform: translateY(45vh);
  z-index: 999;
  transition: all 0.3s ease;
  margin-left: ${(props) => (props.toggle ? "25rem" : "0")};
  ${mobile({ display: "none" })}
`;
const ToggleRightButton = styled.div`
  position: fixed;
  transform: translateY(45vh);
  margin-left: -30px;
  z-index: 999;
  ${mobile({ display: "none" })}
`;
const TopMenu = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
`;
const Middle = styled.div`
  flex: 12;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const InputContainer = styled.form`
  flex: 0.8;
  margin-left: 3rem;
  margin-right: 3rem;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
  border: 1px solid
    ${(props) =>
      props.focused ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.5)"};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const AttachmentButton = styled.div`
  width: 30px;
  height: 30px;
  margin-left: 15px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    opacity: 0.6;
  }
`;
const VoiceToTextButton = styled.div`
  width: 30px;
  height: 30px;
  margin-right: 15px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.enabled ? "pointer" : "cursor")};

  &:hover {
    transform: ${(props) => props.enabled && "scale(1.1)"};
    opacity: ${(props) => props.enabled && "0.6"};
  }
`;
const SendButton = styled.button`
  width: 30px;
  height: 30px;
  margin-right: 15px;
  cursor: ${(props) =>
    props.enabled && !props.waitForResponse ? "pointer" : "cursor"};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  padding: 0;
  justify-content: center;
  animation: ${(props) =>
      props.enabled && props.waitForResponse ? SendButtonBounce : ""}
    0.5s cubic-bezier(0.075, 0.82, 0.165, 1) forwards;

  &:hover {
    transform: ${(props) =>
      props.enabled && props.waitForResponse && "scale(1.1)"};
    opacity: ${(props) => props.enabled && props.waitForResponse && "0.6"};
  }
`;
const Footer = styled.div`
  flex: 0.02;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const FooterLabel = styled.body`
  color: whitesmoke;
  font-size: 12px;
  transition: all 0.2s;
  margin-bottom: 10px;
  opacity: 0.6;
  &:hover {
    letter-spacing: 2px;
    ${mobile({ letterSpacing: "0px" })}
  }
`;
const IntroContainer = styled.div`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  margin-bottom: 22vh;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 50;
`;
const Image = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  transition: all 1s;
  background-color: whitesmoke;
  border-radius: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: rotate(180deg) scale(1.2);
  }
`;
const IntroLabel = styled.h3`
  text-align: center;
  margin-top: 25px;
  font-size: 20px;
  color: whitesmoke;
  transition: all 0.3s;

  &:hover {
    letter-spacing: 5px;
    ${mobile({ letterSpacing: "0px" })}
  }
`;
const ChatContainer = styled.div`
  display: flex;
  margin-left: 1.5rem;
  margin-right: 2.5rem;
  justify-content: center;
  flex-direction: column;
  padding-bottom: 5rem;
  margin-top: 8rem;
`;
const ChatScroll = styled.div`
  display: flex;
  height: 95vh;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  width: 52vw;
  ${mobile({ width: "100vw" })}
  mask-image: linear-gradient(to bottom, black calc(100% - 48px), transparent 100%);
`;
const InputfieldContainer = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
  margin-top: 10px;
`;
const FilePreviewContainer = styled.div`
  display: ${(props) => (props.enabled ? "flex" : "none")};
  box-sizing: border-box;
  width: 100%;
  padding-top: 15px;
  padding-bottom: 20px;
  padding-right: 15px;
  padding-left: 15px;
  column-gap: 25px;
`;
const NewChatButton = styled.div`
  position: relative;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 1rem;
  user-select: none;
  box-sizing: border-box;
  border-radius: 25px;
  display: flex;
  border: solid 1px;
  align-items: center;
  justify-content: space-between;
  border-color: #2f2f2f;
  transition: all 0.2s;
  cursor: pointer;
  &:hover {
    background-color: #2f2f2f;
  }
`;
const NewChatLabel = styled.body`
  font-weight: 600;
  font-size: 15px;
  color: whitesmoke;
  text-align: left;
  margin-right: 150px;
`;
const TopButton = styled.div`
  padding: 0.5rem;
  align-items: center;
  justify-content: center;
  top: 0;
  margin-top: 1.5rem;
  margin-left: 9rem;
  border-radius: 8px;
  border: solid 1px;
  position: absolute;
  display: flex;
  border-color: #2f2f2f;
  transition: all 0.2s;
  cursor: pointer;
  &:hover {
    background-color: #2f2f2f;
  }
`;
const NewChatPreviewContainer = styled.div`
  margin-top: 1rem;
  overflow-y: auto;
  max-height: 50rem;
  flex-direction: column;
  overflow-x: hidden;
`;
const PromptPreviewContainer = styled.div`
  margin-top: 1rem;
  overflow-y: auto;
  max-height: 50rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  row-gap: 15px;
  overflow-x: hidden;
`;
const NewPromptLabel = styled.div`
  color: #2f2f2f;
  transition: all 0.2s ease;
  font-size: 13px;
`;
const NewPromptButton = styled.div`
  margin-top: 0.5rem;
  margin-left: 3rem;
  margin-right: 3rem;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px #2f2f2f;
  transition: all 0.2s;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: #2f2f2f;
  }
  &:hover ${NewPromptLabel} {
    color: whitesmoke;
  }
`;
const LogOutContainer = styled.div`
  user-select: none;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  border: solid 1px;
  position: absolute;
  bottom: 0;
  align-items: center;
  justify-content: space-evenly;
  padding-left: 30px;
  padding-right: 30px;
  margin-left: 114px;
  margin-bottom: 30px;
  border-color: #2f2f2f;
  transition: all 0.2s;
  cursor: pointer;
  z-index: 200;
  &:hover {
    background-color: #2f2f2f;
  }
`;
const LogOutLabel = styled.p`
  color: whitesmoke;
  margin-right: 10px;
  font-weight: 500;
  font-size: 12px;
`;

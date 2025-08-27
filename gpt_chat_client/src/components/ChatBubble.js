import React, { useContext, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { SiOpenai } from "react-icons/si";
import { LuCopy } from "react-icons/lu";
import { LuCopyCheck } from "react-icons/lu";
import { IoVolumeMediumOutline } from "react-icons/io5";
import { IoVolumeMuteOutline } from "react-icons/io5";
import FilePreview from "./FilePreview";

import { useSpeech } from "react-text-to-speech";
import { UserContext } from "../context/userContext";

export default function ChatBubble({ message }) {
  const [copy, setCopy] = useState(false);
  const { speechStatus, start, stop } = useSpeech({
    text: message.message,
    lang: "tr-TR",
  });

  const { user, userColor } = useContext(UserContext);

  const onCopy = () => {
    navigator.clipboard.writeText(message.message);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 1500);
  };

  return (
    <Main direction={message.sender}>
      <Icon color={message.sender === "client" && userColor}>
        {message.sender !== "client" && <SiOpenai size={18} color="#171717" />}
      </Icon>
      <Username>
        {message.sender !== "client" ? "ChatGPT" : user.email}
      </Username>
      {message.type === "hasDocument" && (
        <DocumentHolder>
          {message.file &&
            message.files.map((i) => {
              return <FilePreview key={i.id} file={i} />;
            })}
        </DocumentHolder>
      )}
      <Message isError={message.type === "error"}>{message.message}</Message>
      <SettingsHolder>
        <CopyButton copy={copy} onClick={onCopy} title="Kopyala">
          {!copy ? (
            <LuCopy color="whitesmoke" size={15} />
          ) : (
            <LuCopyCheck color={copy ? "green" : "whitesmoke"} size={15} />
          )}
        </CopyButton>
        <ReadButton
          title={speechStatus === "started" ? "Durdur" : "Oku"}
          onClick={() => {
            if (speechStatus !== "started") {
              start();
            } else {
              stop();
            }
          }}
        >
          {speechStatus === "started" ? (
            <IoVolumeMuteOutline color={"red"} size={21} />
          ) : (
            <IoVolumeMediumOutline color={"lime"} size={21} />
          )}
        </ReadButton>
      </SettingsHolder>
    </Main>
  );
}

const FadeInAnim = keyframes`
    0% {
        opacity: 0;
        transform: scale(5);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
`;
const DocumentHolder = styled.div`
  width: 4rem;
  height: 5rem;
  display: flex;
  align-items: center;
  column-gap: 15px;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 5px;
  margin-top: 5px;
  overflow-x: auto;
  overflow-y: hidden;
`;
const CopyButton = styled.div`
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.copy ? "1" : "0.3")};
  transition: all 0.2s;
  transform: ${(props) => props.copy && "scale(1.3)"};

  &:hover {
    transform: scale(1.2);
    transform: ${(props) => props.copy && "scale(1.3)"};
    opacity: 1;
  }
`;
const ReadButton = styled.div`
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
  transition: all 0.2s;
  margin-left: 5px;

  &:hover {
    transform: scale(1.2);
    opacity: 1;
  }
`;
const SettingsHolder = styled.div`
  margin-top: 3px;
  display: flex;
  transition: all 0.2s;
  opacity: 0;
`;

const Main = styled.div`
  position: relative;
  right: 0;
  padding-left: 45px;
  padding-right: 20px;
  padding-top: 5px;
  border-radius: 25px;
  transition: all 0.1s ease;
  animation: ${FadeInAnim} 0.2s normal;
  border: solid 0px;
  z-index: 25;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.3) 4px 12px;
    transform: translateY(-12px);
    perspective: 300;
    padding-bottom: 15px;
    border-top-width: 1px;
    border-left-width: 1px;
    border-right-width: 1px;
    border-color: rgba(0, 0, 0, 0.3);
  }
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.3) 4px 12px;
    transform: translateY(-12px);
    perspective: 300;
    padding-bottom: 15px;
  }
  &:hover ${SettingsHolder} {
    opacity: 1;
  }
`;
const Message = styled.div`
  color: whitesmoke;
  font-size: 14px;
  margin-top: 5px;
  font-weight: 300;
  overflow-wrap: break-word;
  margin-left: 6px;
  border: ${(props) => (props.isError ? "solid 1px #ef4444" : "")};
  border-radius: 5px;
  background-color: ${(props) => (props.isError ? "#362525" : "")};
  padding: ${(props) => (props.isError ? "10px" : "")};
`;
const Username = styled.div`
  color: whitesmoke;
  font-size: 1rem;
  font-weight: 800;
  margin-left: 6px;
  user-select: none;
`;
const Icon = styled.div`
  position: absolute;
  width: 25px;
  height: 25px;
  margin-left: -30px;
  margin-top: 7px;
  border-radius: 5000px;
  user-select: none;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${(props) => props.color};
`;

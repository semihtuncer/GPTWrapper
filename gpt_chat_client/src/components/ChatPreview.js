import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { MdDelete } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

export default function ChatPreview({
  chat,
  handleDeleteChat,
  selected,
  setCurrentChat,
}) {
  const [del, setDel] = useState(false);
  return (
    <Main selected={selected} onClick={() => setCurrentChat(chat)}>
      <Label>{chat.title}</Label>
      <IconHolder
        onClick={() => {
          if (del) {
            handleDeleteChat(chat._id);
          } else {
            setDel(true);
          }
        }}
        title={del ? "Onayla ?" : "Kaldır"}
      >
        <Icon>
          {!del ? (
            <MdDelete color="whitesmoke" size={22} />
          ) : (
            <MdDeleteForever color="red" size={22} />
          )}
        </Icon>
      </IconHolder>
    </Main>
  );
}
const FadeInAnim = keyframes`
    0% {
        opacity: 0;
        transform: translateX(-200px);
    }
    100% {
        opacity: 1;
        transform: translateX(0px);
    }
`;
const Icon = styled.div`
  transition: all 0.2s;
  opacity: 0.6;
  width: max-content;
  display: flex;
  align-items: center;
`;
const IconHolder = styled.div`
  opacity: 0;
  transition: all 0.2s;
  cursor: pointer;
  &:hover ${Icon} {
    opacity: 1;
  }
`;
const Main = styled.div`
  background-color: transparent;
  margin-left: 2rem;
  margin-right: 2rem;
  border-radius: 12px;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  cursor: pointer;
  animation: ${FadeInAnim} 0.2s normal;
  background-color: ${(props) => (props.selected ? "#2f2f2f" : "none")};
  &:hover {
    background-color: #2f2f2f;
  }
  &:hover ${IconHolder} {
    opacity: 1;
  }
`;
const Label = styled.body`
  color: whitesmoke;
  font-weight: 400;
`;

import React, { useContext, useState } from "react";
import styled from "styled-components";
import { FaLightbulb } from "react-icons/fa";
import { MdOutlineExpandMore } from "react-icons/md";
import { MdOutlineExpandLess } from "react-icons/md";
import { MdDelete } from "react-icons/md";

export default function PromptPreview({ prompt, setMessage, handleDelete }) {
  const [expand, setExpand] = useState(false);
  const maxCharCount = 75;

  return (
    <Main>
      <CloseButton
        onClick={() => {
          handleDelete(prompt._id);
        }}
      >
        <MdDelete size={20} color={"red"} />
      </CloseButton>
      <Icon>
        <FaLightbulb color="lime" size={20} />
        <AccessLabel>
          {prompt.access === "GLOBAL" ? "GLOBAL" : "LOKAL"}
        </AccessLabel>
      </Icon>
      <PromptText
        mask={prompt.text.length > maxCharCount}
        expand={expand}
        onClick={() => setMessage(prompt.text)}
      >
        {prompt.text}
      </PromptText>
      {prompt.text.length > maxCharCount && (
        <ExpandButton onClick={() => setExpand(!expand)} expand={expand}>
          {!expand ? (
            <MdOutlineExpandMore color="whitesmoke" size={23} />
          ) : (
            <MdOutlineExpandLess color="whitesmoke" size={23} />
          )}
          <Label>{expand ? "Kapat" : "Genişlet"}</Label>
        </ExpandButton>
      )}
    </Main>
  );
}
const CloseButton = styled.div`
  transition: all 0.6s ease;
  cursor: pointer;
  position: absolute;
  right: 0;
  opacity: 0;
  margin-right: 30px;
  margin-top: -15px;
  &:hover {
    transform: translateY(-4px) scale(1.1);
  }
`;
const ExpandButton = styled.div`
  opacity: 0.6;
  bottom: 0;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: -33px;
  margin-top: ${(props) => (props.expand ? "-15px" : "-33px")};
  user-select: none;
  z-index: 200;
  &:hover {
    transform: translateY(3px);
    opacity: 1;
  }
`;
const Label = styled.body`
  color: whitesmoke;
  font-size: 13px;
`;
const Icon = styled.div`
  display: flex;
  align-items: center;
  transition: all 0.2s;
  margin-top: 0.5rem;
  justify-content: space-between;
  &:hover {
    transform: translateY(-5px);
  }
`;
const AccessLabel = styled.body`
  color: #4c4c4c;
  border: solid 1px #4c4c4c;
  font-size: 12px;
  font-weight: 500;
  padding-left: 0.6rem;
  padding-right: 0.6rem;
  border-radius: 6px;
`;
const PromptText = styled.p`
  max-height: ${(props) => (props.expand ? "" : "5rem")};
  overflow-wrap: break-word;
  color: whitesmoke;
  opacity: ${(props) => (props.mask ? (props.expand ? "1" : "0.5") : null)};
  margin-top: 0.5rem;
  overflow: hidden;
  transition: all 0.2s;
  mask-image: ${(props) =>
    props.mask
      ? props.expand
        ? ""
        : "linear-gradient(to bottom,black calc(100% - 48px),transparent 100%);"
      : null};
`;
const Main = styled.div`
  background-color: transparent;
  margin-left: 2rem;
  margin-right: 2rem;
  border-radius: 15px;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  border: solid 1px;
  border-color: #2f2f2f;
  cursor: pointer;
  width: 18rem;
  &:hover {
    background-color: #2f2f2f;
  }

  &:hover ${CloseButton} {
    opacity: 1;
  }
`;

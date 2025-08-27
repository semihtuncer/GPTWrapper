import React, { useContext, useState } from "react";
import styled from "styled-components";
import { AiOutlineGlobal } from "react-icons/ai";
import { AiFillLock } from "react-icons/ai";
import { Tooltip } from "react-tooltip";
import { UserContext } from "../context/userContext";
import axios from "axios";

const IconItem = () => {
  return <IconItemMain></IconItemMain>;
};

export default function PopUp_CreatePrompt({ setToggle, getAllPrompts }) {
  const [promptText, setPromptText] = useState("");
  const [access, setAccess] = useState("GLOBAL");
  const [disableButton, setDisableButton] = useState(false);
  const { user, host, config } = useContext(UserContext);

  const handleNewPrompt = () => {
    const newPrompt = {
      iconId: 0,
      text: promptText,
      access: access,
      userId: access === "LOCAL" ? user._id : "",
    };
    axios
      .put(host + "prompt/create", newPrompt, config)
      .then((result) => {
        if (result.status === 200) {
          setToggle(false);
          getAllPrompts();
          setPromptText("");
          setAccess("GLOBAL");
        } else {
          alert("Yeni prompt oluşturma başarısız!");
        }
      })
      .catch(() => alert("Yeni prompt oluşturma başarısız!"));
  };

  return (
    <Main>
      <Top>
        <Title>PROMPT OLUŞTUR</Title>
      </Top>
      <Middle>
        <Left>
          <Label>Ikon</Label>
          <Grid>
            <IconItem />
            <IconItem />
            <IconItem />
            <IconItem />
            <IconItem />
            <IconItem />
            <IconItem />
            <IconItem />
            <IconItem />
          </Grid>
          <AccessHolder>
            <Label>Erişim</Label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <AccessButton
                data-tooltip-id="global"
                data-tooltip-content="Global"
                data-tooltip-place={"bottom"}
                onClick={() => setAccess("GLOBAL")}
                selected={access === "GLOBAL"}
              >
                <AiOutlineGlobal size={25} color="whitesmoke" />
              </AccessButton>
              <AccessButton
                data-tooltip-id="local"
                data-tooltip-content="Lokal"
                data-tooltip-place={"bottom"}
                onClick={() => setAccess("LOCAL")}
                selected={access === "LOCAL"}
              >
                <AiFillLock size={25} color="whitesmoke" />
              </AccessButton>
            </div>
          </AccessHolder>
        </Left>
        <Right>
          <InputFieldContainer>
            <Label>Prompt</Label>
            <TextArea
              placeholder="Prompt'u giriniz"
              maxLength="1500"
              onChange={(a) => setPromptText(a.target.value)}
              value={promptText}
            />
          </InputFieldContainer>
        </Right>
      </Middle>
      <Bottom>
        <CreatePromptButton
          onClick={handleNewPrompt}
          disableButton={disableButton}
        >
          <CreatePromptLabel>Oluştur</CreatePromptLabel>
        </CreatePromptButton>
      </Bottom>
      <Tooltip
        id="global"
        style={{
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "500",
          backgroundColor: "#171717",
        }}
      />
      <Tooltip
        id="local"
        style={{
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "500",
          backgroundColor: "#171717",
        }}
      />
    </Main>
  );
}
const AccessHolder = styled.div`
  height: 4rem;
`;
const AccessButton = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  height: 1.5rem;
  background-color: ${(props) => (props.selected ? "#171717" : "#212121")};
  border: ${(props) => (props.selected ? "solid 2px whitesmoke" : "none")};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #171717;
  }
`;
const IconItemMain = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background-color: #212121;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background-color: #171717;
  }
`;
const Main = styled.div`
  z-index: 506;
  width: 40rem;
  height: 28rem;
  background-color: #2f2f2f;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  border: solid 3px #212121;
  overflow: hidden;
`;
const Grid = styled.div`
  width: 13rem;
  height: 13rem;
  display: grid;
  justify-content: space-between;
  grid-template-columns: auto auto auto;
  margin-left: 35px;
`;
const Top = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;
const Middle = styled.div`
  flex: 5;
  display: flex;
`;
const Left = styled.div`
  flex: 1;
  display: flex;
  padding-left: 40px;
  flex-direction: column;
  justify-content: center;
`;
const Right = styled.div`
  padding-right: 30px;
  flex: 1;
`;
const Bottom = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const Title = styled.h2`
  margin-left: 1.5rem;
  margin-top: 1rem;
  font-size: 1rem;
  color: whitesmoke;
  text-align: center;
`;
const InputFieldContainer = styled.div`
  display: flex;
`;
const TextArea = styled.textarea`
  display: flex;
  margin: 10px;
  resize: none;
  border: none;
  background-color: #212121;
  font-size: 15px;
  font-weight: 400;
  padding: 12px;
  color: whitesmoke;
  border-radius: 15px;
  height: 16rem;
  width: 13rem;
  outline: none;
`;
const Label = styled.label`
  color: whitesmoke;
  font-size: 12px;
  margin-top: 15px;
`;
const CreatePromptButton = styled.div`
  background-color: #599e39;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 10px;
  transition: all 0.2s ease;
  margin-right: 25px;
  margin-bottom: 20px;
  user-select: none;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
    transform: translateY(-8px);
  }
`;
const CreatePromptLabel = styled.label`
  color: whitesmoke;
  font-size: 12px;
  cursor: pointer;
  font-weight: 600;
`;

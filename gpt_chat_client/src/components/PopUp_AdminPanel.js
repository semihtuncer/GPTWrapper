import React, { useContext, useState } from "react";
import styled from "styled-components";
import { AiOutlineGlobal } from "react-icons/ai";
import { AiFillLock } from "react-icons/ai";
import { Tooltip } from "react-tooltip";
import { UserContext } from "../context/userContext";
import axios from "axios";

export default function PopUp_AdminPanel({ setToggle }) {
  return <Main></Main>;
}
const Main = styled.div`
  width: 50rem;
  height: 35rem;
  background-color: #2f2f2f;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  border: solid 3px #212121;
  overflow: hidden;
  z-index: 506;
`;

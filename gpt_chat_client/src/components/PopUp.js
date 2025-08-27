import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { IoIosCloseCircle } from "react-icons/io";

export default function PopUp({ view, toggle, setToggle }) {
  const [blurToggle, setBlurToggle] = useState(false);
  useEffect(() => {
    if (toggle) setBlurToggle(true);
    else
      setTimeout(() => {
        setBlurToggle(false);
      }, 200);
  }, [toggle]);

  return (
    <Blur toggle={blurToggle}>
      <Main toggle={toggle}>
        {view}
        <CancelButton
          onClick={() => {
            setToggle(false);
          }}
        >
          <IoIosCloseCircle size={23} color={"whitesmoke"} />
        </CancelButton>
      </Main>
    </Blur>
  );
}

const FadeIn = keyframes`
    0%{
        transform: scale(0);
        opacity: 0;
    }
    100%{
        transform: scale(1);
        opacity: 1;
    }
`;
const FadeOut = keyframes`
    0%{
        transform: scale(1);
        opacity: 1;
    }
    100%{
        transform: scale(0);
        opacity: 0;
    }
`;
const Main = styled.div`
  z-index: 505;
  animation: ${(props) => (props.toggle ? FadeIn : FadeOut)} 0.2s ease forwards;
  margin-bottom: 10rem;
`;
const Blur = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 500;
  display: ${(props) => (props.toggle ? "flex" : "none")};
`;
const CancelButton = styled.div`
  position: absolute;
  right: -20px;
  top: -20px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`;

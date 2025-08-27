import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Tooltip } from "react-tooltip";

export default function CollapseButton({ side, onClick }) {
  const [toggle, setToggle] = useState(false);
  const [clicked, setClicked] = useState(false);

  const onMouseEnter = () => {
    setToggle(true);
  };
  const onMouseLeave = () => {
    setToggle(false);
  };

  return (
    <Container
      onClick={() => {
        onClick();
        setClicked(!clicked);
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-tooltip-id="tooltip"
      data-tooltip-content={clicked ? "Paneli Aç" : "Paneli Kapat"}
      data-tooltip-place={
        (side === "left" && "right") || (side === "right" && "left")
      }
    >
      <Line bottom={false} toggle={toggle} side={side} className="line"></Line>
      <Line bottom={true} toggle={toggle} side={side} className="line"></Line>
      <Tooltip
        id="tooltip"
        style={{
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "500",
          backgroundColor: "#171717",
        }}
      />
    </Container>
  );
}

const TiltTop = keyframes`
    0%{
        transform: rotate(0deg);
    }
    100%{
        transform: rotate(30deg);
    }
`;
const TiltTopReverse = keyframes`
    0%{
        transform: rotate(30deg);
    }
    100%{
        transform: rotate(0deg);
    }
`;
const TiltBottom = keyframes`
    0%{
        transform: rotate(0deg);
    }
    100%{
        transform: rotate(-30deg);
    }
`;
const TiltBottomReverse = keyframes`
    0%{
        transform: rotate(-30deg);
    }
    100%{
        transform: rotate(0deg);
    }
`;
const Container = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .line {
    background-color: #878787;
  }

  &:hover .line {
    background-color: white;
    transition: background-color 0.2s;
  }
`;
const Line = styled.div`
  width: 4px;
  height: 15px;
  border-radius: 50px;

  margin-top: ${(props) => (props.bottom ? "-5px" : "0px")};
  animation: ${(props) =>
      props.side === "left"
        ? props.toggle
          ? props.bottom
            ? TiltBottom
            : TiltTop
          : props.bottom
          ? TiltBottomReverse
          : TiltTopReverse
        : props.toggle
        ? props.bottom
          ? TiltTop
          : TiltBottom
        : props.bottom
        ? TiltTopReverse
        : TiltBottomReverse}
    0.3s forwards;
`;

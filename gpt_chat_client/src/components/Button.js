import React from "react";
import styled from "styled-components";

export default function Button({ color, label, icon, margin }) {
  return (
    <Main color={color} margin={margin}>
      {icon}
      <Label hasIcon={icon}>{label}</Label>
    </Main>
  );
}

const Main = styled.div`
  margin: ${(props) => props.margin};
  padding: 16px 120px;
  user-select: none;
  background-color: ${(props) => props.color};
  border-radius: 10px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  box-shadow: none;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
    transform: translateY(-5px);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
`;
const Label = styled.p`
  margin: 0px;
  margin-left: ${(props) => (props.hasIcon ? "12px" : "0px")};
  font-size: 15px;
  color: whitesmoke;
  font-weight: 500;
`;

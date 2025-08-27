import React, { useRef, useState } from "react";
import styled from "styled-components";
import { IoSearchOutline } from "react-icons/io5";

export default function InputField({ placeholder, onChange }) {
  const [focused, setFocused] = useState(false);
  const inp = useRef(null);
  return (
    <Main
      onClick={() => inp.current.focus()}
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
      }}
      focused={focused}
    >
      <IoSearchOutline size={20} color="whitesmoke" />
      <Input
        ref={inp}
        placeholder={placeholder}
        maxLength={200}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        onChange={(a) => onChange(a.target.value)}
      />
    </Main>
  );
}

const Main = styled.div`
  padding: 16px 14px;
  padding: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 1rem;
  box-sizing: border-box;
  position: relative;
  border-radius: 25px;
  user-select: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.focused ? "#2f2f2f" : "transparent")};
  cursor: text;
  &:hover {
    background-color: ${(props) => (!props.focused ? "#2f2f2f" : "")};
  }
`;
const Input = styled.input`
  margin-left: 0.5rem;
  outline: none;
  border: none;
  font-weight: 500;
  font-size: 15px;
  background-color: transparent;
  color: whitesmoke;
  caret-color: whitesmoke;
  transition: all 0.2s;
  width: 20rem;
`;

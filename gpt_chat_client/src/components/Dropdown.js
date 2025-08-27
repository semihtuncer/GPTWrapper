import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

export default function Dropdown({ options }) {
  const [selected, setSelected] = useState({});
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setSelected(options[0]);
  }, []);
  useEffect(() => {
    setToggle(false);
  }, [selected]);

  return (
    <Holder>
      <Main
        tabIndex={0}
        onClick={() => {
          setToggle(!toggle);
        }}
        onBlur={() => setTimeout(() => setToggle(false), 100)}
        toggle={toggle}
      >
        <Label>{selected.label}</Label>
        <IconHolder toggle={toggle}>
          <MdOutlineKeyboardArrowDown
            size={25}
            color="whitesmoke"
            opacity={0.4}
          />
        </IconHolder>
      </Main>
      {toggle && (
        <Container>
          {options.map((e) => {
            return (
              <DropdownItem
                item={e}
                setSelected={setSelected}
                selected={e === selected}
              />
            );
          })}
        </Container>
      )}
    </Holder>
  );
}

function DropdownItem({ item, setSelected, selected }) {
  return (
    <ItemContainer
      onClick={() => {
        setSelected(item);
      }}
      selected={selected}
    >
      <DropdownLabel>{item.label}</DropdownLabel>
    </ItemContainer>
  );
}

const Holder = styled.div`
  top: 0;
  margin-top: 1rem;
  position: absolute;
  height: 50px;
  z-index: 200;
`;
const IconHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  transition: all 0.1s;
  transform: ${(props) => (props.toggle ? "rotate(180deg)" : "rotate(0deg)")};
`;
const Main = styled.div`
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  user-select: none;
  background-color: ${(props) => (props.toggle ? "#2f2f2f" : "transparent")};
  border: solid 1px;
  box-sizing: border-box;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: #2f2f2f;
  transition: all 0.2s;
  &:hover {
    background-color: #2f2f2f;
  }
`;
const Label = styled.body`
  color: whitesmoke;
  font-weight: 600;
  font-size: 16px;
`;
const Container = styled.body`
  border: solid 1px;
  box-sizing: border-box;
  border-radius: 15px;
  border-color: #2f2f2f;
  margin-top: 5px;
  max-height: 300px;
  overflow-y: auto;
`;
const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.7rem;
  padding-bottom: 0.8rem;
  transition: all 0.2s;
  border-radius: 14px;
  border: ${(props) => (props.selected ? "solid 1px whitesmoke" : "none")};
  background-color: #212121;
  &:hover {
    background-color: #2f2f2f;
  }
`;
const DropdownLabel = styled.body`
  color: whitesmoke;
  font-weight: 600;
  opacity: 0.8;
  font-size: 16px;
`;

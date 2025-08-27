import React from "react";
import Dropzone from "react-dropzone";
import styled from "styled-components";
import { BsArrowDownSquareFill } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import { mobile } from "../responsive";

export default function DragDropFiles({ onDrop, setFiles, files }) {
  const handleDrop = (f) => {
    onDrop();
    setFiles((oldFiles) => [...oldFiles, ...f]);
  };

  return (
    <Dropzone
      maxFiles={8}
      onDrop={handleDrop}
      onDragLeave={onDrop}
      onDropRejected={() => {
        alert("Hata!");
      }}
      noClick={true}
    >
      {({ getRootProps, getInputProps }) => (
        <Container {...getRootProps()}>
          <CancelButton onClick={onDrop}>
            <IoIosCloseCircle size={30} color={"whitesmoke"} />
          </CancelButton>
          <input {...getInputProps()} />
          <BsArrowDownSquareFill color="whitesmoke" size={80} />

          <Label>Dosyaları sürükleyip bırakın</Label>
          <Label2>(maksimum 8 dosya)</Label2>
        </Container>
      )}
    </Dropzone>
  );
}

const Container = styled.div`
  position: absolute;
  width: 99vw;
  height: 98vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-radius: 25px;
  border-style: dashed;
  border-color: whitesmoke;
  background-color: #212121;
  outline: none;
  transition: all 0.2s ease;
  z-index: 20000;
  ${mobile({ display: "none" })}
  user-select: none;
`;
const Label = styled.p`
  color: whitesmoke;
  font-size: 25px;
`;
const Label2 = styled.p`
  color: whitesmoke;
  font-size: 12px;
  font-weight: 200;
  margin-top: 0px;
`;
const CancelButton = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`;

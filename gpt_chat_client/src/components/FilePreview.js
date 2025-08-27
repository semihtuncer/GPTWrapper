import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoIosCloseCircle } from "react-icons/io";
import { IoIosDocument } from "react-icons/io";

export default function FilePreview({ file, setFiles, deletable }) {
  const [isImage, setIsImage] = useState(false);

  const handleClick = () => {
    setFiles((l) => l.filter((item) => item.id !== file.id));
  };
  const imageExt = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/bmp",
  ];

  useEffect(() => {
    setIsImage(imageExt.indexOf(file.type) > -1);
  }, [file]);
  return (
    <Main title={file.name}>
      {isImage ? (
        <ImagePreview src={file.preview} />
      ) : (
        <DocumentPreview>
          <IoIosDocument color="whitesmoke" size={25} />
          <DocumentName>
            {file.name.length > 25
              ? file.name.substring(0, 24) + "..."
              : file.name}
          </DocumentName>
        </DocumentPreview>
      )}
      {deletable && (
        <DeleteButton>
          <IconHolder onClick={handleClick}>
            <IoIosCloseCircle size={22} color={"whitesmoke"} />
          </IconHolder>
        </DeleteButton>
      )}
    </Main>
  );
}
const DeleteButton = styled.div`
  transition: all 0.2s ease;
  opacity: 1;
  &:hover {
    opacity: 0.6;
  }
`;
const IconHolder = styled.div`
  transition: all 0.2s ease;
  opacity: 0;
  top: 0;
  right: 0;
  margin-right: -7px;
  margin-top: -7px;
  z-index: 99;
  position: absolute;
  cursor: pointer;
`;
const ImagePreview = styled.img`
  object-fit: initial;
  width: 4rem;
  height: 4rem;
  transition: all 0.2s;
  outline: none;
  border-radius: 15px;
`;
const DocumentPreview = styled.div`
  object-fit: initial;
  height: 4rem;
  padding-left: 0.5rem;
  padding-right: 0.7rem;
  transition: all 0.2s;
  outline: none;
  border-radius: 15px;
  background-color: #171717;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;
const DocumentName = styled.body`
  color: whitesmoke;
  margin-left: 0.3rem;
  max-width: 12rem;
`;
const Main = styled.div`
  user-select: none;
  border-radius: 15px;
  transition: all 0.2s;
  position: relative;
  margin-bottom: -10px;

  &:hover ${IconHolder} {
    opacity: 1;
  }
  &:hover ${ImagePreview} {
    border-radius: 20px;
    transform: translateY(-5px);
  }
  &:hover ${DocumentPreview} {
    border-radius: 25px;
    transform: translateY(-5px);
  }
`;

import React, { useContext, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { mobile } from "../responsive";
import axios from "axios";
import { UserContext } from "../context/userContext";

export default function LogInPage({ setPage }) {
  const [pressed, setPressed] = useState(false);
  const [wait, setWait] = useState(false);
  const [warning, setWarning] = useState(false);
  const { setUser, host, user } = useContext(UserContext);

  useEffect(() => {
    if (user === null) return;
    localStorage.setItem("accessToken", user.accessToken);
  }, [user]);

  useEffect(() => {
    if (!user && localStorage.getItem("accessToken") !== null) {
      const cfg = {
        headers: {
          token: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      axios
        .get(host + "auth/get", cfg)
        .then((result) => {
          if (result.status === 200) {
            setUser(result.data);
            setPage("CHAT");
          }
        })
        .catch(() => {
          alert("Giriş başarısız!");
        });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (wait) return;

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    setWait(true);

    if (formJson.email && formJson.password) {
      axios
        .post(host + "auth/login", formJson)
        .then((result) => {
          if (result.status === 200) {
            setUser(result.data);

            setTimeout(() => {
              setPage("CHAT");
            }, 1000);
            setPressed(true);
            setWarning(false);
            setWait(false);
          } else {
            setPressed(false);
            setWarning(true);
            setWait(false);
            alert("Email ya da şifre yanlış!");
          }
        })
        .catch(() => {
          alert("Email ya da şifre yanlış!");
          setWait(false);
        });
    } else {
      setPressed(false);
      setWarning(true);
      setWait(false);
    }
  };

  useEffect(() => {
    if (warning)
      setTimeout(() => {
        setWarning(false);
      }, 5000);
  }, [warning]);

  return (
    <Main>
      <Left>
        <LogInForm onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Logo src={"/resources/logo.jpg"} />
            <Title>GPT</Title>
            <Subtitle>chat</Subtitle>
          </div>
          <InputField name={"email"} placeholder="Email" type="email" />
          <InputField name={"password"} placeholder="Şifre" type="password" />
          <Warning warning={warning}>Lütfen alanları doldurun!</Warning>
          <Button wait={wait} type="submit">
            Devam Et
          </Button>
          <Expand pressed={pressed}></Expand>
        </LogInForm>
      </Left>
      <Right>
        <ExtendIndicator>{"<"}Aç</ExtendIndicator>
      </Right>
    </Main>
  );
}
const FadeInAnim = keyframes`
    0% {
          opacity: 0;
    }
    100% {
          opacity: 1;
    }
`;
const Wave = keyframes`
      0% {
          transform: translateX(-5px);
      }
      50% {
          transform: translateX(0);
      }
      100% {
          transform: translateX(-5px);
      }
`;
const Main = styled.div`
  display: flex;
  animation: ${FadeInAnim} 1s ease;
  background-color: whitesmoke;
`;
const Left = styled.div`
  flex: 1;
  ${mobile({ width: "100vw", height: "100%" })}
`;
const LogInForm = styled.form`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const Right = styled.div`
  height: 100vh;
  flex: 0.025;
  background-color: #212121;
  border-radius: 50px 0px 0px 50px;
  transition: all 1s;

  ${mobile({ display: "none" })}

  &:hover {
    flex: 5;
    border-radius: 25px 0px 0px 25px;
  }
  &:hover p {
    opacity: 0;
  }
`;
const InputField = styled.input`
  padding: 16px 14px;
  margin-top: 10px;
  font-weight: 500;
  width: 280px;
  border-radius: 10px;
  border-color: #cdcdcd;
  border-width: 1px;
  border-style: solid;
  user-select: none;
  font-size: 12px;
`;
const ExtendIndicator = styled.p`
  user-select: none;
  position: absolute;
  margin-top: 50vh;
  font-size: 20px;
  font-weight: 500;
  margin-left: -50px;
  transition: opacity 1s;
  color: #212121;
  animation: ${Wave} 2s -2s ease infinite;
`;
const Button = styled.button`
  margin-top: 5px;
  padding: 16px 120px;
  user-select: none;
  background-color: #171717;
  border-radius: 10px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  box-shadow: none;
  cursor: ${(props) => (props.wait ? "wait" : "pointer")};
  border: none;
  font-size: 15px;
  color: whitesmoke;
  font-weight: 500;
  opacity: ${(props) => (props.wait ? "0.6" : "1")};
  box-shadow: ${(props) =>
    props.wait ? "rgba(0, 0, 0, 0.5) 0px 3px 8px" : ""};
  transform: ${(props) => (props.wait ? "translateY(-5px)" : "")};

  &:hover {
    opacity: 0.6;
    transform: translateY(-5px);
    box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;
  }
`;
const Title = styled.h1`
  transition: all 0.3s;
  font-size: 45px;
  font-weight: 800;
  color: #212121;
  &:hover {
    transform: translateY(-5px);
  }
`;
const Subtitle = styled.h1`
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;
  color: #212121;
  margin-top: 28px;
  &:hover {
    transform: translateY(-5px);
  }
`;
const Logo = styled.img`
  width: 75px;
  transition: all 0.3s;
  margin-right: 5px;
  margin-bottom: 40px;
  &:hover {
    transform: translateY(-5px);
  }
`;
const Expand = styled.div`
  border-radius: 999px;
  background-color: #171717;
  position: fixed;
  margin-top: 278px;
  transition: all 0.8s;
  z-index: 200;

  width: ${(props) => (props.pressed ? "200vw" : "0px")};
  height: ${(props) => (props.pressed ? "200vh" : "0px")};
`;
const Warning = styled.body`
  margin-top: 20px;
  color: #ea0028;
  font-weight: 400;
  transition: all 0.5s;

  opacity: ${(props) => (props.warning ? "1" : "0")};
`;

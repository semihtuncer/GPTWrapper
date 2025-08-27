import styled from "styled-components";
import LogInPage from "./pages/LogInPage";
import ChatPage from "./pages/ChatPage";
import { useState } from "react";
import { UserContextProvider } from "./context/userContext";

export default function App() {
  const [page, setPage] = useState("LOGIN");

  return (
    <UserContextProvider setPage={setPage}>
      <Main>
        {page === "LOGIN" && <LogInPage setPage={setPage} />}
        {page === "CHAT" && <ChatPage setPage={setPage} />}
      </Main>
    </UserContextProvider>
  );
}

const Main = styled.div`
  background-color: #171717;
`;

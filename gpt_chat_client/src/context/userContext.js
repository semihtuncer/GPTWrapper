import React, { createContext, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children, setPage }) {
  const [user, setUser] = useState(null);
  const host = "http://localhost:5000/api/";
  const config = {
    headers: { token: `Bearer ${user ? user.accessToken : ""}` },
  };
  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const userColor = getRandomColor();

  return (
    <UserContext.Provider value={{ user, setUser, host, config, userColor }}>
      {children}
    </UserContext.Provider>
  );
}

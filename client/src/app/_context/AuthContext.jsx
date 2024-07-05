"use client";

const { useState, createContext, useEffect } = require("react");

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("User")) || null
  );

  const UpdateUser = (data) => {
    setCurrentUser(data);
  }

  useEffect(()=>{
    localStorage.setItem("User", JSON.stringify(currentUser))
  },[currentUser])

  return (
    <AuthContext.Provider value={{ currentUser, UpdateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

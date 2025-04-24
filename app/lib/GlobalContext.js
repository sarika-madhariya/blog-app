"use client";
import React, { createContext, useState } from "react";

export const GlobalContext = createContext(); // Create the context

export const GlobalProvider = ({ children }) => {
    const [globalLoading, setGlobalLoading] = useState(false); // Initialize adding state


    return (
        <GlobalContext.Provider
            value={{
                globalLoading, setGlobalLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

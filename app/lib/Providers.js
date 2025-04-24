"use client";
import { SessionProvider } from "next-auth/react";
import { GlobalProvider } from "./GlobalContext";

export default function Providers({ children }) {
    return <SessionProvider>
        <GlobalProvider>
            {children}
        </GlobalProvider>
    </SessionProvider>;
}
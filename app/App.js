'use client'
import React, { useContext } from "react";
import { GlobalContext } from "./lib/GlobalContext";

function App({ children }) {
    const { globalLoading } = useContext(GlobalContext)
    return (
        <div>
            {globalLoading && (<div className='inset-0 fixed z-50 flex justify-center items-center'>
                <div className='loader'></div>
            </div>)}
            {children}
        </div>
    );
}

export default App;

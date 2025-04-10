import React from "react";
import ThemeSwitch from "./ThemeSwitch";

function Navbar() {
  return (
    <div className=" w-full flex justify-between px-16 py-4 ">
      <span className="text-2xl font-bold text-purple-600">BlogHub</span>
      <ul className="flex gap-10 text-lg">
        <li>Home</li>
        <li>Category</li>
      </ul>
      <div className="flex gap-6">
        <ThemeSwitch/>
        <button className="border-2 px-6 py-2 rounded-md border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all font-semibold cursor-pointer">Login</button>
      </div>
    </div>
  );
}

export default Navbar;

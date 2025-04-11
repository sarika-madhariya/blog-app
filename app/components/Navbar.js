'use client'
import React, { useState } from "react";
import ThemeSwitch from "./ThemeSwitch";
import Image from "next/image";

function Navbar() {
  const [categoryHovered, setCategoryHovered] = useState(false);

  return (
    <nav className="w-full h-32 flex justify-between items-center px-16 relative shadow-lg shadow-purple/10">
      <Image className="" src="/blog-logo.png" alt="logo" width={200} height={150} />

      {/* Navigation Menu */}
      <ul className="flex gap-10 text-2xl text-dark-brown font-semibold transition-all">
        <li className="hover:text-dark-brown/90 cursor-pointer">Home</li>

        {/* Category Hover Area */}
        <div
          className="relative"
          onMouseEnter={() => setCategoryHovered(true)}
          onMouseLeave={() => setCategoryHovered(false)}
        >
          <li className="hover:text-dark-brown/90 cursor-pointer">Category</li>

          {/* Dropdown Menu */}
          <ul
            className={`bg-magnolia px-4 w-fit text-dark-brown rounded-md absolute top-10 left-0 shadow-md font-medium text-lg overflow-hidden transition-all duration-300 z-50 ${categoryHovered ? "max-h-60" : "max-h-0"
              }`}
          >
            <li className="cursor-pointer py-1 text-nowrap">Food</li>
            <li className="cursor-pointer py-1 text-nowrap">Travel</li>
            <li className="cursor-pointer py-1 text-nowrap">Health & Wellness</li>
            <li className="cursor-pointer py-1 text-nowrap">Beauty</li>
            <li className="cursor-pointer py-1 text-nowrap">Home & Lifestyle</li>

          </ul>
        </div>
      </ul>

      {/* Right Side */}
      <div className="flex gap-6">
        {/* <ThemeSwitch /> */}
        <button className="px-6 py-2 rounded-md text-white bg-dark-purple hover:bg-dark-purple/90 transition-all font-semibold cursor-pointer">
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

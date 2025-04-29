'use client'
import React, { useContext, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from 'next-auth/react'
import { useSession } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { GlobalContext } from "../lib/GlobalContext";

function Navbar() {
  const [categoryHovered, setCategoryHovered] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: session } = useSession();
  const { setGlobalLoading } = useContext(GlobalContext);
  const router = useRouter();
  const profileRef = useRef(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();
  const fullPath = qs ? `${pathname}?${qs}` : pathname;

  const letter = session?.user?.firstName?.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const confirmLogout = async () => {
    setGlobalLoading(true);
    try {
      // Sign out and return to the same page
      const data = await signOut({ redirect: false, callbackUrl: fullPath });
      if (data?.url) {
        router.push(data.url);
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <nav className="w-full h-32 flex justify-between items-center px-16 relative shadow-lg shadow-purple/10">
      <Image src="/blog-logo.png" alt="logo" width={200} height={150} />
      {/* Navigation Menu */}
      <ul className="flex gap-10 text-2xl text-dark-brown font-semibold transition-all">
        <li className="hover:text-dark-brown/90 cursor-pointer"><Link href="/">Home</Link></li>
        <div
          className="relative"
          onMouseEnter={() => setCategoryHovered(true)}
          onMouseLeave={() => setCategoryHovered(false)}
        >
          <li className="hover:text-dark-brown/90 cursor-pointer">Category</li>
          <ul
            className={`bg-magnolia flex flex-col gap-2 px-4 w-fit text-dark-brown rounded-md absolute top-10 left-0 shadow-md font-medium text-lg overflow-hidden transition-all duration-300 z-50 ${
              categoryHovered ? "max-h-80 py-2" : "max-h-0"
            }`}
          >
            <CategoryLi label="Food" link="food" />
            <CategoryLi label="Travel" link="travel" />
            <CategoryLi label="Health & Wellness" link="health-and-wellness" />
            <CategoryLi label="Beauty" link="beauty" />
            <CategoryLi label="Fashion" link="fashion" />
            <CategoryLi label="Other" link="other" />
          </ul>
        </div>
        {session && <li className="hover:text-dark-brown/90 cursor-pointer"><Link href="/post-blog">Post Blog</Link></li>}
        {session && <li className="hover:text-dark-brown/90 cursor-pointer"><Link href="/blogs/my-blogs">My Blogs</Link></li>}
      </ul>
      {/* Right Side */}
      <div className="flex gap-6">
        {session ? (
          <div ref={profileRef} className="relative">
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className={`rounded-full font-bold border-2 border-purple hover:bg-dark-purple w-12 h-12 select-none cursor-pointer flex items-center justify-center text-2xl text-white ${
                profileOpen ? "bg-dark-purple" : "bg-purple"
              } transition-all`}
            >
              {letter}
            </div>
            {profileOpen && (
              <div className="absolute -right-5 mt-2 bg-white rounded-md shadow-lg w-40 overflow-hidden z-50">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 hover:bg-purple/40 w-full px-4 py-3 transition-colors"
                >
                  <Image src="/profile.svg" alt="profile" width={20} height={20} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={confirmLogout}
                  className="flex items-center gap-2 hover:bg-purple/40 w-full px-4 py-3 transition-colors"
                >
                  <Image src="/logout.svg" alt="logout" width={20} height={20} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href={`/auth/login?callbackUrl=${encodeURIComponent(fullPath)}`}
            className="px-6 py-2 rounded-md text-white bg-dark-purple hover:bg-dark-purple/90 transition-all font-semibold cursor-pointer"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

function CategoryLi({ label, link }) {
  return (
    <li>
      <Link href={`/category/${link}`} className="py-2 whitespace-nowrap">
        {label}
      </Link>
    </li>
  );
}

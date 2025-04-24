
'use client'
import React, { useState } from 'react'
import Link from 'next/link';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return (

        <div className="bg-[#001F3E] fixed top-0 left-0 w-full shadow-md z-50">
            <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
                
                {/* Left: Logo + Burger Menu */}
                <div className="flex items-center gap-4">
                    {/* Burger Menu */}
                    <button className="lg:hidden text-[#077FAC] hover:text-violet-600" onClick={toggleMenu}>
                        <span className="text-2xl">&#9776;</span>
                    </button>

                    {/* Logo */}
                    <li className="text-[1.75rem] font-bold text-[#077FAC] list-none">
                        <Link href="/">YT Sentiment</Link>
                    </li>
                </div>

                {/* Centered Navbar Menu */}
                <ul className={`lg:flex ${menuOpen ? 'block text-left' : 'hidden'} flex-col lg:flex-row items-center ml-auto lg:ml-0 lg:text-right absolute lg:relative top-12 left-0 lg:top-0 bg-white w-full lg:w-auto shadow-md lg:shadow-none`}>
                    <li className="p-4 lg:px-6 text-[1.25rem] text-black hover:scale-110 cursor-pointer transition">
                        <Link href="/">Home</Link>
                    </li>
                    <li className="p-4 lg:px-6 text-[1.25rem] text-black hover:scale-110 cursor-pointer transition">
                        <Link href="/choice">Analysis</Link>
                    </li>
                    <li className="p-4 lg:px-6 text-[1.25rem] text-black hover:scale-110 cursor-pointer transition">
                        <Link href="/contact">Contact</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

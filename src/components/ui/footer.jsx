"use client"

import * as React from "react"
import { forwardRef } from "react";
import Link from "next/link";

const Footer = forwardRef(({ className, type, ...props }, ref) => {
    return (
        <div>
            <footer className="bg-[#EDEDED] py-12 px-6 border-t border-gray-300 ">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1: Brand/About */}
                <div>
                    <h3 className="text-xl font-bold mb-4 text-[#508C9B]">VideoTruth</h3>
                    <p className="text-sm leading-relaxed">
                    Uncovering the real story behind every video through AI-powered analysis and insights.
                    </p>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h3 className="text-xl font-bold mb-4 text-[#508C9B]">Quick Links</h3>
                    <ul className="space-y-2">
                    <li>
                        <Link 
                        href="/" 
                        className="hover:text-[#508C9B] transition-colors duration-300 text-sm"
                        >
                        Home
                        </Link>
                    </li>
                    <li>
                        <Link 
                        href="/choice" 

                        className=" hover:text-[#508C9B] transition-colors duration-300 text-sm"
                        >
                        Analysis
                        </Link>
                    </li>
                    <li>
                        <Link 
                        href="/contact" 
                        className=" hover:text-[#508C9B] transition-colors duration-300 text-sm"
                        >
                        Contact
                        </Link>
                    </li>
                    </ul>
                </div>

                {/* Column 3: Contact/Support */}
                <div>
                    <h3 className="text-xl font-bold mb-4 text-[#508C9B]">Get in Touch</h3>
                    <ul className="space-y-2 text-sm">
                    <li>Email: abc@gmail.com</li>
                    <li>Phone: +0 000 000 0000</li>
                    <li>
                        <Link 
                        href="/" 
                        className="hover:text-[#508C9B] transition-colors duration-300"
                        >
                        Privacy Policy
                        </Link>
                    </li>
                    <li>
                        <Link 
                        href="/" 
                        className="hover:text-[#508C9B] transition-colors duration-300"
                        >
                        Terms of Service
                        </Link>
                    </li>
                    </ul>
                </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 px-6 border-t border-gray-300 mt-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
                    <p>&copy; {new Date().getFullYear()} VideoTruth. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 space-x-6">
                    <Link href="#" className="hover:text-[#508C9B] transition-colors duration-300">
                        Twitter
                    </Link>
                    <Link href="#" className="hover:text-[#508C9B] transition-colors duration-300">
                        LinkedIn
                    </Link>
                    <Link href="#" className="hover:text-[#508C9B] transition-colors duration-300">
                        GitHub
                    </Link>
                    </div>
                </div>
                </div>
            </footer>
        </div>    
    );
});
  
export default Footer;

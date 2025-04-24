import Navbar from "../../components/Navbar";
import Footer from "../../components/ui/footer"
import Link from 'next/link';
import React from 'react';


export default function Choice() {
  return (
    <div className="min-h-screen pt-30">
      <Navbar />
      <div className="container mx-auto px-4 mb-42">
        <img src="/images/analyze2.jpg" alt="Illustration" className="max-w-lg w-1/2 bg-no-repeat bg-center mx-auto rounded-2xl" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 tracking-wide animate-fadeIn">
          Choose Your Analysis Mode
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
          
          {/* Channel Analyzer Card */}
          <Link href="/channel">
            <div className="bg-white rounded-lg shadow-xl p-8 transform hover:scale-105 transition-transform duration-300 cursor-pointer hover:shadow-2xl animate-slideIn w-100 h-56 flex flex-col justify-between text-centre">
              <div>
                <h2 className="text-2xl font-bold text-center mb-4 text-[#1E639E]">Channel Analyzer</h2>
                <p className="text-black/90 text-center">
                  Analyze and gain deep insights into the sentiment trends of content created by influencers and content creators.
                </p>
              </div>
            </div>
          </Link>

          {/* Video Analyzer Card */}
          <Link href="/analysis">
            <div className="bg-white rounded-lg shadow-xl p-8 transform hover:scale-105 transition-transform duration-300 cursor-pointer hover:shadow-2xl animate-slideIn w-100 h-56 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-[#1E639E] text-center">Video Analyzer</h2>
                <p className="text-black/90 text-center">
                Uncover the emotions behind any YouTube video. Get sentiment analysis to measure audience reactions and content impact.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

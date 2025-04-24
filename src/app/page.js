import Navbar from "../components/Navbar";
import Footer from "../components/ui/footer"
import Link from "next/link";
export default function Home() {
  return (<>
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-[80px] md:pt-[120px]">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Left Side (Text) */}
          <div className="flex flex-col justify-center text-center ">
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-[#001F3E]">Unlock the Hidden Truth Behind Every Video!</h1>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600">
            Curious about what viewers really think? Our AI scans YouTube comments, breaking down opinions with clarity and precision.
            </p>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600" >Uncover the real audience sentiment—raw, unfiltered, and insightful</p>
            <p className="text-xl mb-8 text-gray-800">
              Ready to see beyond the views? Let's dive in!
            </p>
            <button className="mt-6 px-6 py-3 h-14 bg-linear-to-t from-[#03B0C4] to-[#077FAC] text-white rounded-lg transition-all duration-300 hover:shadow-[6px_6px_10px_rgba(0,0,0,0.3)] hover:scale-105"><Link href="/choice">Get Started</Link>
            </button>
          </div>
            
          {/* <!-- Right Side (Image) --> */}
          <div className="pl-4 flex justify-center">
            <img src="/images/top6.jpg" alt="Illustration" className="object-contain w-full h-auto rounded-2xl" />
          </div>
        </div>
      </div>
    
      <div className="container mx-auto px-4 py-12 ">
        <h2 className="text-5xl font-extrabold mb-10 tracking-wide text-center text-[#001F3E]">
          Key Features
        </h2>

        {/* Feature 1 */}
        <div className="flex flex-col md:flex-row items-center bg-white justify-center rounded-lg shadow-md py-8 mb-6">
          {/* Left: Text */}
          <div className="w-full md:w-1/2 text-left pl-18 ">
            <h3 className=" font-semibold mb-6 text-[#0785AF] text-3xl">Web Scraping</h3>
            <p className="text-lg leading-relaxed ">
              Extract data effortlessly from any webpage with our powerful scraping tools.
            </p>
          </div>
          {/* Right: Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img src="/images/kf11.jpg" alt="Web Scraping" className="w-full max-w-xs md:max-w-sm rounded-lg shadow-md" />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center bg-white rounded-lg shadow-md py-8 mb-6 ">
          {/* Right: Text */}
          <div className="w-full md:w-1/2 text-right pr-24">
            <h3 className="text-3xl font-semibold mb-6 text-[#0785AF]">AI Sentiment Analysis</h3>
            <p className="text-lg leading-relaxed ">
              Detect emotions and opinions in text with advanced AI technology.
            </p>
          </div>
          {/* Left: Image */}
          <div className="w-full md:w-1/2 flex justify-center ">
            <img src="/images/kf5.jpg" alt="AI Sentiment Analysis" className="w-full max-w-xs md:max-w-sm rounded-lg shadow-md" />
          </div>
        </div>
        {/* Feature 1 */}
        <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-md py-8 mb-6">
          {/* Left: Text */}
          <div className="w-full md:w-1/2 text-left pl-18">
            <h3 className="text-3xl font-semibold mb-6 text-[#0785AF]">Data Visualization</h3>
            <p className="text-lg leading-relaxed ">
              Transform data into insightful graphs and charts.
            </p>
          </div>
          {/* Right: Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img src="/images/kf6.jpg" alt="Web Scraping" className="w-full max-w-xs md:max-w-sm rounded-lg shadow-md" />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center bg-white rounded-lg shadow-md py-8 mb-6 pr-22">
          {/* Right: Text */}
          <div className="w-full md:w-1/2 text-right ">
            <h3 className="text-3xl font-semibold mb-6 text-[#0785AF]">Trend Detection</h3>
            <p className="text-lg leading-relaxed ">
              Spot emerging trends and patterns in your data.
            </p>
          </div>
          {/* Left: Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img src="/images/kf3.jpg" alt="AI Sentiment Analysis" className="w-full max-w-xs md:max-w-sm rounded-lg shadow-md" />
          </div>
        </div>
        {/* Optional Call to Action */}
        <div className="mt-12 flex justify-center">
          <button className="px-12 py-4 text-lg font-bold text-[#EEEEEE]  bg-[#01A1B9] rounded-full shadow-lg transition-all duration-300 hover:bg-[#077FAC] hover:scale-105">
            <Link href="/choice">Try It Now</Link>
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  </>
  );
}









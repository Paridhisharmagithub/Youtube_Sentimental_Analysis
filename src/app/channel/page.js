"use client";
 import { useState } from "react";
 import axios from "axios";
 import { FaSpinner } from "react-icons/fa";
 import {  Clock} from "lucide-react";
 import Navbar from "../../components/Navbar";
 import Footer from "../../components/ui/footer";
 import SentimentPieChart from "../../components/ui/SentimentPieChart";


 
 export default function ChannelAnalysis() {
   const [channelUrl, setChannelUrl] = useState("");
   const [analysisResult, setAnalysisResult] = useState(null);
   const [history, setHistory] = useState([]);
   const [chatbotSummary, setChatbotSummary] = useState("");
   const [showSidebar, setShowSidebar] = useState(false);
   const [loading, setLoading] = useState(false);

   const handleAnalyzeChannel = async (e) => {
     e.preventDefault();
     if (!channelUrl) return;

      setLoading(true);

      try {
        const response = await axios.post("http://localhost:5000/channel_analysis", { channel_url: channelUrl });
        console.log(response)
        setAnalysisResult(response.data);
        setChatbotSummary(response.data.chatbot_summary);
        setHistory((prev) => [response.data, ...prev]);
        console.log("Analysis successful:", response.data);
      } catch (error) {
        console.error("Analysis failed:", error);
      } finally {
        setLoading(false);
      }
   };

   function htmlToPlainTextWithLineBreaks(html) {
    if (!html || typeof html !== "string") return ""; // 🛡️ Prevent error
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html.replace(/<br\s*\/?>/gi, "\n");
    const text = tempElement.textContent || tempElement.innerText || "";
    return text;
  }
  

  const CommentCard = ({ comment }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleReadMore = () => setIsExpanded(!isExpanded);
  
    const commentText = comment?.text || ""; // 🛡️ Prevent undefined errors
    const plain_comment = htmlToPlainTextWithLineBreaks(commentText);
    const isLong = plain_comment.length > 200;
    const displayText = isExpanded ? commentText : `${commentText.slice(0, 200)}${isLong ? "..." : ""}`;
    const plain_com = htmlToPlainTextWithLineBreaks(displayText);
  
    return (
      <div className="bg-white p-4 rounded-md shadow mb-3 flex flex-row gap-4 items-start hover:bg-gray-50 transition duration-100 ease-in-out">
        {/* Author */}
        <p className="w-[10rem] text-sm font-semibold text-[#0094C6] break-words">
          {comment?.author || "Unknown"}
        </p>
  
        {/* Comment with Read more */}
        <p className="flex-1 text-sm text-gray-800">
          {plain_com}
          {isLong && (
            <span
              onClick={toggleReadMore}
              className="text-[#1E639E] cursor-pointer ml-2"
            >
              {isExpanded ? "Read less" : "Read more"}
            </span>
          )}
        </p>
      </div>
    );
  };
  

   return (
      <div className="min-h-screen pt-2">
        <Navbar/>
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed top-31 left-4 z-20 p-2 rounded-full shadow-md  bg-linear-to-t bg-[#1E639E] text-white  "
        >
          <Clock className="w-6 h-6  z-20 " />
        </button>
        {/* Sidebar */}
        <div
          className={`fixed top-20 left-0 h-full w-72 bg-gray-100 shadow-2xl p-2 z-10 pt-8 transform transition-transform duration-300 ease-in-out ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4 h-[4rem] border-b-1 text-center pt-3.5 bg-[#1E639E] text-white rounded-md">History</h2>
          <div className="overflow-y-auto max-h-[70vh]">
            <ul className="space-y-2 overflow-y-auto">
              {history.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-[#1E639E] cursor-pointer break-all p-2 border-b-2 bg-white border-gray-200 hover:bg-gray-100 hover:border-none rounded-lg"
                  onClick={() => setChannelUrl(item.channel_id || "")}
                >
                  {item.channel_id}
                </li>
              ))}
            </ul>
            </div>
        </div>
       
        <div className="flex flex-col items-center justify-center w-full px-4 mb-50 mt-20">
         {/* Channel Analysis Section */}
         <div className="bg-[#f2f3f3] py-10 my-20 min-h-[8rem] w-[70rem] border-0 border-rounded rounded-3xl flex flex-col justify-center items-center shadow-md">
         {!analysisResult && (
            <div className="w-[50rem] h-[10rem] border-0 border-rounded rounded-3xl p-6">
              <h2 className="text-4xl font-bold mb-5 text-center text-[#1E639E]">Channel Analysis</h2>
              <form onSubmit={handleAnalyzeChannel}>
                <input
                  type="text"
                  placeholder="Enter YouTube channel URL"
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  className="max-w-xl w-full border-1 border-rounded rounded-xl p-2 m-2 mb-4 bg-white border-gray-400"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-t from-[#0a7bc1] to-[#1E639E] text-white rounded-xl w-[8rem] text-center"
                  disabled={loading}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin inline-block text-lg" />
                  ) : (
                    "Analyze"
                  )}
                </button>
              </form>
            </div>
          )}
          {analysisResult && (
            <div className="p-4 rounded-lg w-[68rem]">
              <h3 className="text-5xl font-bold text-center mb-10">Sentiment Analysis</h3>

              <p className="text-2xl py-10 pl-6 "><b className="pr-5">Channel ID :</b>{analysisResult.channel_id}</p>

              <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 ">
                <div className="grid grid-cols-2 text-xl ml-2 w-[32rem]">
                  <p className="bg-white pt-2 text-center drop-shadow-xl h-[8rem] w-[15rem]">
                    <span className="ml-2 font-bold text-3xl leading-loose">
                      {analysisResult.sentiment_analysis.total_comments}
                    </span>
                    <br />
                    Total Comments
                  </p>
                  <p className="bg-white pt-2 text-center h-[8rem] w-[15rem] drop-shadow-xl">
                    <span className="ml-2 font-bold text-3xl leading-loose text-[#61bea2]">
                      {analysisResult.sentiment_analysis.sentiment_counts.positive}
                    </span>
                    <br />
                    Positive
                  </p>
                  <p className="bg-white pt-2 text-center h-[8rem] w-[15rem] drop-shadow-xl">
                    <span className="ml-2 text-3xl leading-loose font-bold text-[#F7BB51]">
                      {analysisResult.sentiment_analysis.sentiment_counts.negative}
                    </span>
                    <br />
                    Negative
                  </p>
                  <p className="bg-white pt-2 text-center h-[8rem] w-[15rem] drop-shadow-xl">
                    <span className="ml-2 text-3xl leading-loose font-bold text-[#2D87BB]">
                      {analysisResult.sentiment_analysis.sentiment_counts.neutral}
                    </span>
                    <br />
                    Neutral
                  </p>
                  <h4 className="bg-white text-center pt-8 w-[31rem] drop-shadow-xl">
                    Key Phrases
                    <p className="text-2xl leading-loose font-bold">
                      {analysisResult.sentiment_analysis.key_phrases.join(", ")}
                    </p>
                  </h4>
                </div>

                <SentimentPieChart
                  positive={analysisResult.sentiment_analysis.sentiment_counts.positive}
                  neutral={analysisResult.sentiment_analysis.sentiment_counts.neutral}
                  negative={analysisResult.sentiment_analysis.sentiment_counts.negative}
                />
              </div>


              <h3 className="text-3xl font-bold text-center mt-10 mb-4 bg-[#1E639E] p-5 text-white">
                Top Positive Comments
              </h3>

              {analysisResult.sentiment_analysis.top_positive_comments.map((text, index) => (
                <CommentCard key={index} comment={{ text }} />
              ))}
              <h3 className="text-3xl font-bold text-center mt-10 mb-4 bg-[#1E639E] p-5 text-white">
                Top Negative Comments
              </h3>
              {analysisResult.sentiment_analysis.top_negative_comments.map((text, index) => (
                <CommentCard key={index} comment={{ text }} />
              ))}

              <h3 className="text-3xl font-bold text-center mt-10 mb-4 bg-[#1E639E] p-5 text-white">
                Summary
              </h3>
              <div className="mt-6 bg-white drop-shadow-xl p-10">
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {htmlToPlainTextWithLineBreaks(analysisResult.summary)}
                </div>
              </div>
            
            </div>
          )}

         </div>
        </div>
        <Footer/>
      </div> 
     
   );
 }
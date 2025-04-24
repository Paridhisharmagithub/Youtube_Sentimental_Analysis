"use client"
import { useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card"; 
import { MessageCircle, Send, X , Clock} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/ui/footer";
import SentimentPieChart from "../../components/ui/SentimentPieChart";

export default function Analysis() {
  const [videoUrl, setVideoUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [chatbotResponse, setChatbotResponse] = useState("");
  const [chatbotSummary, setChatbotSummary] = useState("");
  const [history, setHistory] = useState([]);

  const [showSidebar, setShowSidebar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you analyze YouTube videos?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!videoUrl) return;

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/analysis", { video_url: videoUrl });
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
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html.replace(/<br\s*\/?>/gi, "\n");
    const text = tempElement.textContent || tempElement.innerText || "";
    return text;
  }

  const CommentCard = ({ comment }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleReadMore = () => setIsExpanded(!isExpanded);
  
    const plain_comment = htmlToPlainTextWithLineBreaks(comment.text);
    const isLong = plain_comment.length > 200;
    const displayText = isExpanded ? comment.text : `${comment.text.slice(0, 200)}${isLong ? "..." : ""}`;
    const plain_com = htmlToPlainTextWithLineBreaks(displayText);

    return (
      <div className="bg-white p-4 rounded-md shadow mb-3 flex flex-row gap-4 items-start hover:bg-gray-50 transition duration-100 ease-in-out">
        
        {/* Author */}
        <p className="w-[10rem]  text-sm font-semibold text-[#0094C6] break-words">{comment.author}</p>
        
        {/* Comment with Read more */}
        <p className="flex-1 text-sm text-gray-800 ">
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
  
        {/* Like count */}
        <p className="w-[6rem] font-semibold text-sm text-[#F76394]">Likes: {comment.like_count}</p>
      </div>
    );
  };
  

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setInput("");
      
    try {
      // setMessages((prev) => [...prev, userMessage])
      const response = await axios.post("http://localhost:5000/chatbot", {
        chatbot_summary: chatbotSummary,
        user_input: input,
      });
      const botReply = { role: "assistant", content: response.data.response };
      setMessages((prev) => [...prev, userMessage, botReply]);

      setChatbotResponse(response.data.response); // if you're still using it elsewhere
      setInput("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <Navbar />
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
                onClick={() => setVideoUrl(item.video_url || "")}
              >
                {item.video_url}
              </li>
            ))}
          </ul>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full px-4 mb-50 mt-20">
        {/* Analysis Section */}
        <div className="bg-[#f2f3f3] py-10 my-20 min-h-[8rem] w-[70rem] border-0 border-rounded rounded-3xl flex flex-col justify-center items-center shadow-md">
          
          {/* 👇 Show this part only when no analysisResult yet */}
          {!analysisResult && (
            <div className="w-[50rem] h-[10rem] border-0 border-rounded rounded-3xl p-6">
              <h2 className="text-4xl font-bold mb-5 text-center text-[#1E639E]">Video Analysis</h2>
              <form onSubmit={handleAnalyze}>
                <input
                  type="text"
                  placeholder="Enter YouTube video URL"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
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

          {/* 👇 Show this part only after analysis is done */}
          {analysisResult && (
            <div className="p-4 rounded-lg w-[68rem]">
              <h3 className="text-5xl font-bold text-center mb-10">Sentiment Analysis</h3>

              <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 ">
                <div className="grid grid-cols-2 text-xl ml-2 w-[32rem]">
                  <p className="bg-white pt-2 text-center drop-shadow-xl h-[8rem] w-[15rem]">
                    <span className="ml-2 font-bold text-3xl leading-loose">
                      {analysisResult.summary.total}
                    </span>
                    <br />
                    Total Comments
                  </p>
                  <p className="bg-white pt-2 text-center h-[8rem] w-[15rem] drop-shadow-xl">
                    <span className="ml-2 font-bold text-3xl leading-loose text-[#61bea2]">
                      {analysisResult.summary.positive}
                    </span>
                    <br />
                    Positive
                  </p>
                  <p className="bg-white pt-2 text-center h-[8rem] w-[15rem] drop-shadow-xl">
                    <span className="ml-2 text-3xl leading-loose font-bold text-[#F7BB51]">
                      {analysisResult.summary.negative}
                    </span>
                    <br />
                    Negative
                  </p>
                  <p className="bg-white pt-2 text-center h-[8rem] w-[15rem] drop-shadow-xl">
                    <span className="ml-2 text-3xl leading-loose font-bold text-[#2D87BB]">
                      {analysisResult.summary.neutral}
                    </span>
                    <br />
                    Neutral
                  </p>
                  <h4 className="bg-white text-center pt-8 w-[31rem] drop-shadow-xl">
                    Key Phrases
                    <p className="text-2xl leading-loose font-bold">
                      {analysisResult.key_phrases.join(", ")}
                    </p>
                  </h4>
                </div>

                <SentimentPieChart
                  positive={analysisResult.summary.positive}
                  neutral={analysisResult.summary.neutral}
                  negative={analysisResult.summary.negative}
                />
              </div>

              <h3 className="text-3xl font-bold text-center mt-10 mb-4 bg-[#1E639E] p-5 text-white">
                Top Comments
              </h3>

              {analysisResult.top_comments.map((comment, index) => (
                <CommentCard key={index} comment={comment} />
              ))}

              <h3 className="text-3xl font-bold text-center mt-10 mb-4 bg-[#1E639E] p-5 text-white">
                Summary
              </h3>
              <div className="mt-6 bg-white drop-shadow-xl p-10">
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {htmlToPlainTextWithLineBreaks(analysisResult.chatbot_summary)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      
      {/* Chatbot Section */}
      <div className="fixed bottom-6 right-6 z-50 font-sans">
        {isOpen && (
        <Card className="bg-white shadow-xl rounded-2xl w-90 h-[360px] flex flex-col mb-4 ">
          <div className="flex justify-between items-center border-b rounded-t-2xl pb-2 mb-2 bg-[#077FAC] text-white p-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 ">Chat Assistant</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="w-8 h-8 text-white " />
            </Button>
          </div>
        
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ml-3 p-2 rounded-2xl text-sm ${
                  message.role === 'user'
                    ? ' bg-[#077FAC] text-white self-end ml-auto '
                    : 'bg-gray-100 self-start text-left'
                }`}
                style={{
                  maxWidth: '70%',
                  width: message.role === 'user' ? 'fit-content' : 'auto',
                }}
              >
                {message.role === "assistant" && message.content.startsWith("<") ? (
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {htmlToPlainTextWithLineBreaks(message.content)}
                  </div>
                ) : (
                  message.content
                )}
              </div>
            ))}
          </div>
        
          <form onSubmit={handleSendMessage} className="flex items-center m-2 border-t pt-2">
            <Input
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' }
              className="flex-1 text-sm px-3 py-2 border rounded-xl outline-none mr-2"
            />
            <Button type="submit" size="icon" className={"bg-[#077FAC] rounded-full  hover:shadow-2xl transition duration-200 ease-in-out"}>
              <Send className="h-8 w-8 text-white" />
            </Button>
          </form>
        </Card>
        )}
        <Button onClick={() => setIsOpen(!isOpen)} className="rounded-full h-12 w-12 shadow-xl bg-linear-to-t from-[#03B0C4] to-[#077FAC] text-white  ">
          <MessageCircle />
        </Button>
      </div>
      <Footer/>
    </div>

  );
}





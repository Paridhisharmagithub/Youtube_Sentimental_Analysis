import { useState } from 'react';

export default function HistorySection({ history }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Burger Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#201E43] text-[#EEEEEE] p-3 shadow-lg focus:outline-none hover:bg-[#508C9B] transition-colors duration-300 flex items-center justify-between w-full md:w-64 "
      >
        <span className="text-lg font-bold">Analysis History</span>
        <span className="ml-2">
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </span>
      </button>

      {/* History Section - Collapsible */}
      <section
        id="history"
        className={`${
          isOpen ? 'block' : 'hidden'
        } bg-white rounded-lg shadow-lg p-6 mt-2 absolute w-full md:w-96 z-10`}
      >
        <h2 className="text-2xl font-bold mb-4 text-[#508C9B]">Analysis History</h2>
        {history.length === 0 ? (
          <p className="text-gray-600">No analysis history available yet.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {history.map((item, index) => (
              <li
                key={index}
                className="border p-4 rounded hover:shadow-md transition-shadow duration-200 bg-[#EEEEEE]/20"
              >
                <p className="text-[#201E43]">
                  <b>Channel ID:</b> {item.channel_id}
                </p>
                <div className="mt-2">
                  <h4 className="font-bold text-[#201E43]">Analysis Summary:</h4>
                  <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: item.analysis }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
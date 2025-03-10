"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { SunIcon, MoonIcon } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("");
  const [adContent, setAdContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("professional");
  const [audience, setAudience] = useState("young-professionals");
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from user preference or localStorage on mount
  useEffect(() => {
    // Check localStorage first
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
    } else {
      // Otherwise check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Update localStorage and apply class to body when darkMode changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    document.body.classList.toggle("dark", darkMode);
    // Set background color on the document body
    document.body.style.backgroundColor = darkMode ? "#111827" : "#ffffff"; // Using Tailwind's bg-gray-900 color for dark mode
  }, [darkMode]);

  const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "humorous", label: "Humorous" },
    { value: "inspirational", label: "Inspirational" },
    { value: "minimalist", label: "Minimalist" },
  ];

  const audienceOptions = [
    { value: "gen-z", label: "Gen Z" },
    { value: "millennials", label: "Millennials" },
    { value: "young-professionals", label: "Young Professionals" },
    { value: "boomers", label: "Boomers" },
  ];

  // Create a mapping of tone + audience combinations to ad "feel" descriptions
  const getAdFeel = (tone, audience) => {
    const feelMap = {
      "professional_gen-z": "Authoritative but authentic",
      "professional_millennials": "Polished and established",
      "professional_young-professionals": "Premium and solution-focused",
      "professional_boomers": "Trusted and time-tested",
      
      "casual_gen-z": "Chill and relatable",
      "casual_millennials": "Friendly and accessible",
      "casual_young-professionals": "Approachable but competent",
      "casual_boomers": "Straightforward and honest",
      
      "humorous_gen-z": "Meme-worthy and quirky",
      "humorous_millennials": "Witty and nostalgic",
      "humorous_young-professionals": "Cleverly entertaining",
      "humorous_boomers": "Lighthearted and warm",
      
      "inspirational_gen-z": "Empowering and impactful",
      "inspirational_millennials": "Meaningful and purposeful",
      "inspirational_young-professionals": "Ambitious and motivating",
      "inspirational_boomers": "Uplifting and valuable",
      
      "minimalist_gen-z": "Clean and essential",
      "minimalist_millennials": "Simple but significant",
      "minimalist_young-professionals": "Efficient and effective",
      "minimalist_boomers": "Clear and dependable",
    };
    
    const key = `${tone}_${audience}`;
    return feelMap[key] || "Tailored and effective";
  };

  const handleGenerate = async () => {
    if (!input) return;
    setLoading(true);
    try {
      // Send POST request to server for ad generation
      const { data } = await axios.post("/api/generate-ad", {
        userInput: input,
        tone: tone,
        audience: audience,
      });
      setAdContent(data.adContent);
    } catch (error) {
      console.error("Error fetching response:", error);
      setAdContent({
        headline: "Error",
        tagline: "Failed to generate ad content",
        description: "Please try again later.",
        callToAction: "Retry",
      });
    }
    setLoading(false);
  };

  return (
    // Removed background color from this div to let body color show through
    // Keep the max-width constraint for the content
    <div className={`min-h-screen p-8 max-w-4xl mx-auto font-sans transition-colors duration-300 ${darkMode ? "text-white" : "text-black"}`}>
      <div className="flex justify-between items-center mb-8">
        <div className="text-center mt-12 flex-1">
          <h1 className={`text-5xl font-bold mb-4 tracking-tight ${darkMode ? "text-white" : "text-black"}`}>
            Dynamic Ad Generator
          </h1>
          <p className={`max-w-2xl mx-auto ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Create a targeted, tone-specific ad copy in seconds
          </p>
        </div>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full ${darkMode ? "bg-gray-800 text-yellow-300 hover:bg-gray-700" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </button>
      </div>

      <div className={`p-8 rounded-xl mb-12 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border border-gray-100"}`}>
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Product or Service Description
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your product or service..."
            className={`w-full p-4 rounded-lg focus:ring-2 focus:outline-none ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "border border-gray-300 text-gray-800 focus:ring-black focus:border-transparent"
            }`}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={`w-full p-4 rounded-lg focus:ring-2 focus:outline-none ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                  : "border border-gray-300 text-gray-800 focus:ring-black focus:border-transparent bg-white"
              }`}
            >
              {toneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Target Audience
            </label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className={`w-full p-4 rounded-lg focus:ring-2 focus:outline-none ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                  : "border border-gray-300 text-gray-800 focus:ring-black focus:border-transparent bg-white"
              }`}
            >
              {audienceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className={`w-full py-4 rounded-lg transition-all duration-300 shadow-sm font-medium text-lg ${
            darkMode
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-black text-white hover:bg-gray-900"
          }`}
        >
          Generate Ad
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className={`w-16 h-16 border-4 rounded-full animate-spin mb-4 ${
            darkMode 
              ? "border-t-blue-500 border-gray-700" 
              : "border-t-black border-gray-200"
          }`}></div>
          <p className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-800"}`}>Crafting your ad...</p>
        </div>
      ) : (
        adContent && (
          <div className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
            darkMode 
              ? "bg-gray-800 border border-gray-700" 
              : "bg-white border border-gray-200"
          }`}>
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className={`mb-2 inline-block px-3 py-1 rounded-full ${
                    darkMode ? "bg-blue-600 text-white" : "bg-gray-900 text-white"
                  }`}>
                    <span className="text-xs uppercase tracking-wider font-medium">
                      {getAdFeel(tone, audience)}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setAdContent(null)} 
                  className={`${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"}`}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              
              <h2 className={`text-3xl font-bold tracking-tight mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                {adContent.headline}
              </h2>
              
              <div className={`mb-6 inline-block px-4 py-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}>
                <h3 className={`text-sm font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}>
                  {adContent.tagline}
                </h3>
              </div>
              
              <p className={`mb-8 leading-relaxed text-lg ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                {adContent.description}
              </p>
              
              <button className={`px-8 py-3 font-medium rounded-lg transition-all duration-300 shadow-sm transform hover:translate-y-px ${
                darkMode 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "bg-black text-white hover:bg-gray-800"
              }`}>
                {adContent.callToAction}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
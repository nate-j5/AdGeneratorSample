"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  SunIcon,
  MoonIcon,
  SparklesIcon,
  TargetIcon,
  PenToolIcon,
  ZapIcon,
  UsersIcon,
  XIcon,
  MegaphoneIcon,
  CircleIcon,
  QrCode,
} from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("");
  const [adContent, setAdContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("professional");
  const [audience, setAudience] = useState("young-professionals");
  const [darkMode, setDarkMode] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);

  // Initialize dark mode from user preference or localStorage on mount
  useEffect(() => {
    // Check localStorage first
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
    } else {
      // Otherwise check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Update localStorage and apply class to body when darkMode changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    document.body.classList.toggle("dark", darkMode);
    // Set background color on the document body
    document.body.style.backgroundColor = darkMode ? "#313538" : "#ffffff";
  }, [darkMode]); // Add darkMode as a dependency here

  // Show ad modal when adContent is available
  useEffect(() => {
    if (adContent) {
      setShowAdModal(true);
    }
  }, [adContent]);

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

  // Mapping of tone + audience combinations to ad "feel" descriptions
  const getAdFeel = (tone, audience) => {
    const feelMap = {
      "professional_gen-z": "Authoritative but authentic",
      professional_millennials: "Polished and established",
      "professional_young-professionals": "Premium and solution-focused",
      professional_boomers: "Trusted and time-tested",

      "casual_gen-z": "Chill and relatable",
      casual_millennials: "Friendly and accessible",
      "casual_young-professionals": "Approachable but competent",
      casual_boomers: "Straightforward and honest",

      "humorous_gen-z": "Meme-worthy and quirky",
      humorous_millennials: "Witty and nostalgic",
      "humorous_young-professionals": "Cleverly entertaining",
      humorous_boomers: "Lighthearted and warm",

      "inspirational_gen-z": "Empowering and impactful",
      inspirational_millennials: "Meaningful and purposeful",
      "inspirational_young-professionals": "Ambitious and motivating",
      inspirational_boomers: "Uplifting and valuable",

      "minimalist_gen-z": "Clean and essential",
      minimalist_millennials: "Simple but significant",
      "minimalist_young-professionals": "Efficient and effective",
      minimalist_boomers: "Clear and dependable",
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

  const closeAdModal = () => {
    setShowAdModal(false);
    setTimeout(() => {
      setAdContent(null);
    }, 300); // Match this with the modal transition duration
  };

  return (
    <div
      className={`min-h-screen p-8 max-w-4xl mx-auto font-sans transition-colors duration-300 ${
        darkMode ? "text-white" : "text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="text-center mt-12 flex-1">
          <div className="flex items-center justify-center mb-6">
            <SparklesIcon
              className={`h-12 w-12 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              } mr-3`}
            />
            <h1
              className={`text-5xl font-bold tracking-tight ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Dynamic Ad Generator
            </h1>
          </div>
          <p
            className={`max-w-2xl mx-auto ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Create a targeted, tone-specific ad copy in seconds
          </p>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full ${
            darkMode
              ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </button>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div
          className={`p-6 rounded-lg ${
            darkMode ? "bg-gray-700/50" : "bg-gray-50"
          } flex flex-col items-center text-center`}
        >
          <div
            className={`p-3 rounded-full mb-3 ${
              darkMode
                ? "bg-blue-500/20 text-blue-300"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            <ZapIcon size={24} />
          </div>
          <h3
            className={`font-medium text-lg mb-2 ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Instant Generation
          </h3>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            From concept to compelling ad in seconds
          </p>
        </div>
        <div
          className={`p-6 rounded-lg ${
            darkMode ? "bg-gray-700/50" : "bg-gray-50"
          } flex flex-col items-center text-center`}
        >
          <div
            className={`p-3 rounded-full mb-3 ${
              darkMode
                ? "bg-purple-500/20 text-purple-300"
                : "bg-purple-100 text-purple-600"
            }`}
          >
            <TargetIcon size={24} />
          </div>
          <h3
            className={`font-medium text-lg mb-2 ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Audience Targeting
          </h3>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Tailored content for your specific audience
          </p>
        </div>
        <div
          className={`p-6 rounded-lg ${
            darkMode ? "bg-gray-700/50" : "bg-gray-50"
          } flex flex-col items-center text-center`}
        >
          <div
            className={`p-3 rounded-full mb-3 ${
              darkMode
                ? "bg-green-500/20 text-green-300"
                : "bg-green-100 text-green-600"
            }`}
          >
            <PenToolIcon size={24} />
          </div>
          <h3
            className={`font-medium text-lg mb-2 ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Tone Control
          </h3>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Match your brand voice perfectly
          </p>
        </div>
      </div>

      <div
        className={`p-8 rounded-xl mb-12 shadow-sm ${
          darkMode ? "bg-gray-700/70" : "bg-gray-50 border border-gray-100"
        }`}
      >
        <div className="mb-6">
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Product or Service Description
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your product or service..."
            className={`w-full p-4 rounded-lg focus:ring-2 focus:outline-none ${
              darkMode
                ? "bg-gray-600 border-gray-500 text-white focus:ring-blue-500 placeholder-gray-400"
                : "border border-gray-300 text-gray-800 focus:ring-black focus:border-transparent"
            }`}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <PenToolIcon size={16} className="mr-2" />
                Tone
              </div>
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={`w-full p-4 rounded-lg focus:ring-2 focus:outline-none ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white focus:ring-blue-500"
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
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <UsersIcon size={16} className="mr-2" />
                Target Audience
              </div>
            </label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className={`w-full p-4 rounded-lg focus:ring-2 focus:outline-none ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white focus:ring-blue-500"
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

        <div className="relative">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-4 rounded-lg transition-all duration-300 shadow-sm font-medium text-lg ${
              darkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-black text-white hover:bg-gray-900"
            } flex items-center justify-center cursor-pointer ${
              loading ? "opacity-90" : ""
            }`}
          >
            {!loading && <SparklesIcon size={20} className="mr-2" />}
            {loading ? "Creating your perfect ad..." : "Generate Ad"}
          </button>
        </div>
      </div>

      {/* Modal Ad Display */}
      {showAdModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent backdrop */}
          <div
            className="absolute inset-0 bg-gray bg-opacity-30 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeAdModal}
          ></div>

          {/* Modal content */}
          <div
            className={`relative max-w-xl w-full mx-auto transition-all duration-300 transform ${
              showAdModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
            } rounded-xl shadow-2xl overflow-hidden`}
          >
            {adContent && (
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl`}
              >
                <div
                  className={`p-4 flex items-center justify-between border-b ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  {/* <XIcon size={18} /> */}
                  {/* <Star  size={18}  /> */}
                  <h2
                    className={`font-light text-sm ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    AI-Powered Advertisement
                  </h2>
                  <button
                    onClick={closeAdModal}
                    className={`p-2 rounded-full ${
                      darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    aria-label="Close modal"
                  >
                    <XIcon size={18} />
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <div
                      className={`mb-2 inline-block px-3 py-1 rounded-full ${
                        darkMode
                          ? "bg-blue-600 text-white"
                          : "bg-gray-900 text-white"
                      }`}
                    >
                      <span className="text-xs uppercase tracking-wider font-medium">
                        {getAdFeel(tone, audience)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className={`flex-shrink-0 mr-3`}>
                      <QrCode
                        size={36}
                        className={`fill-current ${
                          darkMode ? "text-blue-500" : "text-blue-500"
                        }`}
                        fill="currentColor"
                      />
                    </div>
                    <div className="flex-1">
                      <h2
                        className={`text-3xl font-bold tracking-tight ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {adContent.headline}
                      </h2>
                    </div>
                  </div>

                  <div
                    className={`mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <MegaphoneIcon
                      className={`w-5 h-5 ${
                        darkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    />
                    <h3
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {adContent.tagline}
                    </h3>
                  </div>

                  <p
                    className={`mb-8 leading-relaxed text-lg ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {adContent.description}
                  </p>

                  <button
                    className={`w-full px-8 py-3 font-medium rounded-lg transition-all duration-300 shadow-sm transform hover:translate-y-px flex items-center justify-center cursor-pointer ${
                      darkMode
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    <ZapIcon size={18} className="mr-2" />
                    {adContent.callToAction}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

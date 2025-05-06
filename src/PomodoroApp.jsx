import { useState, useEffect } from "react";
import { Shuffle, SkipBack, SkipForward, Repeat, Play, Pause } from "lucide-react";

export default function PomodoroApp() {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [isCoffeeBreak, setIsCoffeeBreak] = useState(false);
  const [history, setHistory] = useState([]);
  const [musicEmbedUrl, setMusicEmbedUrl] = useState(() => {
    const urls = [
      "https://www.youtube.com/embed/5qap5aO4i9A",
      "https://www.youtube.com/embed/jfKfPfyJRdk",
      "https://www.youtube.com/embed/DWcJFNfaw9c",
      "https://www.youtube.com/embed/7NOSDKb0HlU",
      "https://www.youtube.com/embed/hHW1oY26kxQ"
    ];
    return urls[Math.floor(Math.random() * urls.length)];
  });
  const [musicPlaying, setMusicPlaying] = useState(true);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0) {
      new Audio("/bell.mp3").play();
      const sessionType = isCoffeeBreak ? "Pause Café" : isWorkSession ? "Travail" : "Pause";
      setHistory((prev) => [...prev, { type: sessionType, timestamp: new Date().toLocaleTimeString() }]);
      setIsRunning(false);
      if (!isCoffeeBreak) {
        setIsWorkSession(!isWorkSession);
        setTime((!isWorkSession ? workDuration : breakDuration) * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, time, isWorkSession, workDuration, breakDuration, isCoffeeBreak]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const toggleCoffeeBreak = () => {
    setIsCoffeeBreak(!isCoffeeBreak);
    setIsRunning(false);
    if (!isCoffeeBreak) {
      setTime(5 * 60);
    } else {
      setTime(workDuration * 60);
    }
  };

  const changeMusic = () => {
    const urls = [
      "https://www.youtube.com/embed/5qap5aO4i9A",
      "https://www.youtube.com/embed/jfKfPfyJRdk",
      "https://www.youtube.com/embed/DWcJFNfaw9c",
      "https://www.youtube.com/embed/7NOSDKb0HlU",
      "https://www.youtube.com/embed/hHW1oY26kxQ"
    ];
    let newUrl;
    do {
      newUrl = urls[Math.floor(Math.random() * urls.length)];
    } while (newUrl === musicEmbedUrl);
    setMusicEmbedUrl(newUrl);
  };

  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-screen bg-[#2B2D31] text-white font-sans p-4 transition-colors duration-700">
      <div className="bg-[#1E1F22] px-10 py-6 rounded-3xl shadow-lg mb-8 w-full max-w-xs">
        <div className="text-7xl font-extrabold mt-4 mb-4">{formatTime(time)}</div>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-8 py-3 bg-[#4CAF50] hover:bg-[#43A047] text-white text-lg rounded-full shadow transition-all"
        >
          {isRunning ? "Pause" : "Démarrer"}
        </button>

        <button
          onClick={toggleCoffeeBreak}
          className={`px-6 py-2 ${isCoffeeBreak ? "bg-[#2196F3] hover:bg-[#1E88E5]" : "bg-[#FFC107] hover:bg-[#FFB300]"} text-white text-sm rounded-full shadow transition-all duration-300`}
        >
          {isCoffeeBreak ? "🧠 Retour au travail" : "☕ Pause Café (5 min)"}
        </button>
      </div>

      <div className="absolute bottom-6 right-6">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-2xl bg-[#1E1F22] hover:bg-[#2B2D31] rounded-full p-2"
        >
          ⚙️
        </button>
      </div>

      {showSettings && (
        <div className="absolute bottom-20 right-6 bg-[#1E1F22] p-4 rounded-xl shadow-md">
          <div className="mb-2">
            <label className="block text-sm mb-1">Durée travail (min)</label>
            <input
              type="number"
              value={workDuration}
              onChange={(e) => setWorkDuration(Number(e.target.value))}
              className="w-full bg-[#2B2D31] text-white p-1 rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Durée pause (min)</label>
            <input
              type="number"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Number(e.target.value))}
              className="w-full bg-[#2B2D31] text-white p-1 rounded"
            />
          </div>
        </div>
      )}

      <div className="mt-6 w-full max-w-md bg-[#1E1F22] p-4 rounded-xl shadow-md overflow-y-auto max-h-60">
        <h2 className="text-lg font-semibold mb-2">Historique</h2>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400">Aucune session enregistrée.</p>
        ) : (
          <ul className="text-sm space-y-1">
            {history.map((entry, index) => (
              <li key={index} className="text-gray-300">
                {entry.timestamp} – {entry.type}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 w-full max-w-md">
        <div className="aspect-video mb-4 rounded-xl overflow-hidden">
          <iframe
            className="w-full h-full"
            src={musicEmbedUrl + `?autoplay=1&mute=${musicPlaying ? 0 : 1}`}
            title="Lofi music"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>

        <div className="w-full flex justify-center">
          <div className="flex items-center justify-center gap-6 mb-2">
            <Shuffle className="text-white opacity-70 hover:opacity-100 transition cursor-pointer" size={20} />
            <SkipBack className="text-white opacity-70 hover:opacity-100 transition cursor-pointer" size={24} />
            <button
              onClick={toggleMusic}
              className="w-14 h-14 bg-white text-black rounded-full shadow flex items-center justify-center transition hover:scale-105"
            >
              {musicPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <SkipForward
              onClick={changeMusic}
              className="text-white opacity-70 hover:opacity-100 transition cursor-pointer"
              size={24}
            />
            <Repeat className="text-white opacity-70 hover:opacity-100 transition cursor-pointer" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

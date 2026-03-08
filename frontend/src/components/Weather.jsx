import { useState, useEffect } from "react";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const response = await fetch(
                  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=celsius&timezone=auto`,
                );
                const data = await response.json();
                if (data && data.current) {
                  setWeather({
                    ...data.current,
                    timezone: data.timezone,
                  });
                  setError(null);
                } else {
                  throw new Error("Invalid weather data");
                }
              } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to fetch weather");
                fetchDefaultWeather(23.8103, 90.2289);
              } finally {
                setLoading(false);
              }
            },
            (err) => {
              console.error("Geolocation error:", err);
              fetchDefaultWeather(23.8103, 90.2289);
            },
          );
        } else {
          fetchDefaultWeather(23.8103, 90.2289);
        }
      } catch (err) {
        console.error("Setup error:", err);
        setError("Weather service unavailable");
        setLoading(false);
      }
    };

    const fetchDefaultWeather = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=celsius&timezone=auto`,
        );
        const data = await response.json();
        if (data && data.current) {
          setWeather({
            ...data.current,
            timezone: data.timezone,
          });
          setError(null);
        } else {
          throw new Error("Invalid weather data");
        }
      } catch (err) {
        console.error("Default weather error:", err);
        setError("Failed to fetch weather");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (code) => {
    if (!code) return "🌤️";
    if (code === 0) return "☀️";
    if (code === 1 || code === 2) return "🌤️";
    if (code === 3) return "☁️";
    if (code === 45 || code === 48) return "🌫️";
    if (code >= 51 && code <= 67) return "🌧️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 80 && code <= 82) return "🌧️";
    if (code >= 85 && code <= 86) return "🌨️";
    if (code >= 80 && code <= 99) return "⛈️";
    return "🌤️";
  };

  const getWeatherDescription = (code) => {
    if (!code) return "Unknown";
    if (code === 0) return "Clear";
    if (code === 1 || code === 2) return "Mostly Clear";
    if (code === 3) return "Overcast";
    if (code === 45 || code === 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code === 80 || code === 81 || code === 82) return "Showers";
    if (code >= 85 && code <= 86) return "Snow Showers";
    if (code >= 80 && code <= 99) return "Thunderstorm";
    return "Variable";
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-white/90 backdrop-blur-md p-4 shadow-2xl animate-pulse border-l-4 border-[#e50914] h-48">
        <div className="h-6 bg-gradient-to-r from-[#e50914]/30 to-[#b00020]/30 rounded w-3/4 mb-2"></div>
        <div className="space-y-2">
          <div className="h-5 bg-gradient-to-r from-[#e50914]/20 to-[#b00020]/20 rounded"></div>
          <div className="h-5 bg-gradient-to-r from-[#e50914]/20 to-[#b00020]/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="rounded-xl bg-white/90 backdrop-blur-md p-4 shadow-2xl border-l-4 border-[#e50914] border-2">
        <p className="text-xs text-gray-700 font-medium">
          {error || "Unable to load weather"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-white/92 to-white/88 backdrop-blur-md shadow-2xl border-l-4 border-[#e50914] overflow-hidden transition-all duration-300 hover:shadow-[0_25px_60px_rgba(229,9,20,0.3)] hover:-translate-y-1 border-2 border-white/30">
      {/* Header - Compact and Interactive */}
      <div
        className="bg-gradient-to-r from-[#e50914] via-[#b00020] to-[#8b0018] p-4 cursor-pointer transition-all duration-300 group hover:from-[#b00020] hover:via-[#8b0018] hover:to-[#6a0010] active:scale-95"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-1">
            <div className="text-4xl group-hover:scale-125 group-active:scale-95 transition-transform duration-300 origin-left">
              {getWeatherIcon(weather.weather_code)}
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/70 font-medium">Weather</p>
              <p className="text-2xl font-bold text-white leading-tight">
                {Math.round(weather.temperature_2m)}°
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <svg
              className={`w-5 h-5 text-white transition-transform duration-300 font-bold ${expanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <span className="text-xs text-white/60 font-bold">Tap</span>
          </div>
        </div>
      </div>

      {/* Content - Collapsible */}
      <div
        className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-96" : "max-h-0"}`}
      >
        <div className="p-3 space-y-2 bg-gradient-to-b from-white/50 to-white/30">
          {/* Condition */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/40 hover:bg-white/60 transition-all duration-200 cursor-pointer group active:scale-95 transform">
            <div className="flex items-center gap-2">
              <span className="text-[#b00020] font-bold text-xs">●</span>
              <span className="text-gray-700 font-semibold text-xs">
                Status
              </span>
            </div>
            <span className="text-gray-900 font-bold text-xs group-hover:text-[#b00020] transition-colors px-2 py-0.5 rounded bg-white/80 group-hover:bg-[#e50914]/10">
              {getWeatherDescription(weather.weather_code)}
            </span>
          </div>

          {/* Feels Like */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/40 hover:bg-white/60 transition-all duration-200 cursor-pointer group active:scale-95 transform">
            <div className="flex items-center gap-2">
              <span className="text-[#b00020] font-bold text-xs">●</span>
              <span className="text-gray-700 font-semibold text-xs">Feels</span>
            </div>
            <span className="text-gray-900 font-bold text-xs group-hover:text-[#b00020] transition-colors px-2 py-0.5 rounded bg-white/80 group-hover:bg-[#e50914]/10">
              {Math.round(weather.apparent_temperature)}°
            </span>
          </div>

          {/* Humidity with Visual */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/40 hover:bg-white/60 transition-all duration-200 group cursor-pointer active:scale-95 transform">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-[#e50914]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M7 16.5V5m0 0a1.5 1.5 0 0 1 3 0M7 5a1.5 1.5 0 0 0 3 0"
                />
              </svg>
              <span className="text-gray-700 font-semibold text-xs">
                Humidity
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-10 h-1.5 bg-gray-300 rounded-full overflow-hidden border border-[#e50914]/20">
                <div
                  className="h-full bg-gradient-to-r from-[#e50914] to-[#b00020] transition-all duration-500 group-hover:from-[#b00020] group-hover:to-[#8b0018]"
                  style={{ width: `${weather.relative_humidity_2m}%` }}
                />
              </div>
              <span className="text-gray-900 font-bold text-xs w-6 text-right px-1 py-0.5 rounded bg-white/80">
                {weather.relative_humidity_2m}%
              </span>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/40 hover:bg-white/60 transition-all duration-200 cursor-pointer group active:scale-95 transform">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-[#e50914] group-hover:rotate-45 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-gray-700 font-semibold text-xs">Wind</span>
            </div>
            <span className="text-gray-900 font-bold text-xs group-hover:text-[#b00020] transition-colors px-2 py-0.5 rounded bg-white/80 group-hover:bg-[#e50914]/10">
              {Math.round(weather.wind_speed_10m)} km/h
            </span>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-gray-500 text-center pt-1 pb-1 border-t border-white/30 mt-2">
            Updated:{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

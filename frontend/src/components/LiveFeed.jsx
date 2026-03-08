import { useState, useEffect, useCallback, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

const POLL_INTERVAL = 15000; // 15 seconds

const TYPE_META = {
    marketplace: {
        label: "Marketplace",
        color: "bg-[#e50914]",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        ),
    },
    pre_order: {
        label: "Pre-Order",
        color: "bg-orange-500",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
    },
    event: {
        label: "Event",
        color: "bg-blue-500",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    society: {
        label: "Society",
        color: "bg-purple-500",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    lost_found: {
        label: "Lost & Found",
        color: "bg-yellow-500",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
    },
    roommate: {
        label: "Roommate",
        color: "bg-green-500",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    feedback: {
        label: "Feedback",
        color: "bg-gray-500",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        ),
    },
};

function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

// Skeleton loader for individual notification items
function NotificationSkeleton() {
    return (
        <div className="px-4 py-3 border-b border-gray-100 animate-pulse">
            <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-2.5 bg-gray-200 rounded w-full" />
                    <div className="h-2 bg-gray-200 rounded w-1/3" />
                </div>
            </div>
        </div>
    );
}

export default function LiveFeed() {
    const { User } = AuthContext();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Track which notification IDs are read locally so UI updates instantly
    const readIdsRef = useRef(new Set());

    const fetchNotifications = useCallback(async () => {
        const token = sessionStorage.getItem("authToken");
        if (!token || !User) return;

        try {
            const res = await fetch("http://localhost:4000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();

            if (data.success) {
                // Apply local read state so already-read items don't flicker back
                const merged = data.notifications.map((n) =>
                    readIdsRef.current.has(n._id) ? { ...n, isRead: true } : n
                );
                setNotifications(merged);
                setUnreadCount(merged.filter((n) => !n.isRead).length);
                setError(null);
            }
        } catch (err) {
            setError("Could not load notifications");
        } finally {
            setLoading(false);
        }
    }, [User]);

    // Initial fetch + short polling
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id) => {
        // Optimistic UI update
        readIdsRef.current.add(id);
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));

        const token = sessionStorage.getItem("authToken");
        try {
            await fetch(`http://localhost:4000/api/notifications/${id}/read`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch {
            /* silent – state already updated locally */
        }
    };

    const handleMarkAllRead = async () => {
        const token = sessionStorage.getItem("authToken");
        // Optimistic update
        notifications.forEach((n) => readIdsRef.current.add(n._id));
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);

        try {
            await fetch("http://localhost:4000/api/notifications/read-all", {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch {
            /* silent */
        }
    };

    return (
        <div className="rounded-lg bg-white/90 shadow-lg overflow-hidden border-l-4 border-[#e50914] transition-all duration-300 hover:shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#e50914]/10 to-[#b00020]/10 px-4 py-3 border-b border-[#e50914]/20 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e50914] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e50914]" />
                    </span>
                    Live Feed
                    {unreadCount > 0 && (
                        <span className="ml-1 inline-flex items-center justify-center rounded-full bg-[#e50914] text-white text-[10px] font-bold w-5 h-5 flex-shrink-0">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </h3>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-[#b00020] hover:text-[#e50914] font-semibold transition-colors"
                    >
                        Mark all read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <>
                        <NotificationSkeleton />
                        <NotificationSkeleton />
                        <NotificationSkeleton />
                    </>
                ) : error ? (
                    <div className="px-4 py-6 text-center">
                        <p className="text-xs text-red-500">{error}</p>
                        <button
                            onClick={fetchNotifications}
                            className="mt-2 text-xs text-[#b00020] underline"
                        >
                            Retry
                        </button>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                        <svg
                            className="w-8 h-8 text-gray-300 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                        <p className="text-xs text-gray-400">No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((n) => {
                        const meta = TYPE_META[n.type] || TYPE_META.marketplace;
                        return (
                            <div
                                key={n._id}
                                onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group ${n.isRead ? "opacity-60" : ""
                                    }`}
                            >
                                <div className="flex gap-3">
                                    {/* Type icon */}
                                    <div
                                        className={`w-7 h-7 rounded-full ${meta.color} text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}
                                    >
                                        {meta.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-1">
                                            <p className="text-xs font-semibold text-gray-900 group-hover:text-[#b00020] transition-colors leading-tight">
                                                {n.title}
                                            </p>
                                            {!n.isRead && (
                                                <span className="w-2 h-2 rounded-full bg-[#e50914] flex-shrink-0 mt-0.5 animate-pulse" />
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-600 mt-0.5 leading-snug line-clamp-2">
                                            {n.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-gray-400">
                                                {timeAgo(n.createdAt)}
                                            </span>
                                            <span
                                                className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full text-white ${meta.color}`}
                                            >
                                                {meta.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">
                    Refreshes every 15s
                </span>
                <button
                    onClick={fetchNotifications}
                    className="text-xs font-semibold text-[#b00020] hover:text-[#e50914] transition-colors"
                >
                    Refresh now
                </button>
            </div>
        </div>
    );
}

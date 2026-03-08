import { useState, useEffect, useCallback, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

const POLL_INTERVAL = 15000;

const TYPE_META = {
    marketplace: { label: "Marketplace", color: "bg-red-500" },
    pre_order: { label: "Pre-Order", color: "bg-orange-500" },
    event: { label: "Event", color: "bg-blue-500" },
    society: { label: "Society", color: "bg-purple-500" },
    lost_found: { label: "Lost & Found", color: "bg-yellow-500" },
    roommate: { label: "Roommate", color: "bg-green-500" },
    feedback: { label: "Feedback", color: "bg-gray-500" },
};

function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationSkeleton() {
    return (
        <div className="px-4 py-3 border-b border-gray-100 animate-pulse">
            <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-2.5 bg-gray-200 rounded w-full" />
                    <div className="h-2 bg-gray-200 rounded w-1/4" />
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

    const readIdsRef = useRef(new Set());

    const fetchNotifications = useCallback(async () => {

        const token = sessionStorage.getItem("authToken");
        if (!token || !User) return;

        try {

            const res = await fetch("http://localhost:4000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Fetch failed");

            const data = await res.json();

            if (data.success) {

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

    useEffect(() => {

        fetchNotifications();
        const interval = setInterval(fetchNotifications, POLL_INTERVAL);

        return () => clearInterval(interval);

    }, [fetchNotifications]);

    const handleMarkAsRead = async (id) => {

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

        } catch { }

    };

    const handleMarkAllRead = async () => {

        const token = sessionStorage.getItem("authToken");

        notifications.forEach((n) => readIdsRef.current.add(n._id));

        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);

        try {

            await fetch("http://localhost:4000/api/notifications/read-all", {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });

        } catch { }

    };

    return (

        <div className="rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">

            {/* Header */}

            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">

                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">

                    <span className="relative flex h-3 w-3">

                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />

                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />

                    </span>

                    Live Feed

                    {unreadCount > 0 && (
                        <span className="ml-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold w-5 h-5">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}

                </h3>

                {unreadCount > 0 && (

                    <button
                        onClick={handleMarkAllRead}
                        className="text-xs font-semibold text-red-500 hover:text-red-600"
                    >
                        Mark all read
                    </button>

                )}

            </div>

            {/* Notifications */}

            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

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
                            className="mt-2 text-xs text-red-500 underline"
                        >
                            Retry
                        </button>

                    </div>

                ) : notifications.length === 0 ? (

                    <div className="px-4 py-8 text-center text-gray-400 text-xs">
                        No notifications yet
                    </div>

                ) : (

                    notifications.map((n) => {

                        const meta = TYPE_META[n.type] || TYPE_META.marketplace;

                        return (

                            <div
                                key={n._id}
                                onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                                className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:scale-[1.01] ${!n.isRead ? "border-l-4 border-red-500 bg-red-50/30" : "opacity-70"
                                    }`}
                            >

                                <div className="flex gap-3">

                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${meta.color}`}
                                    >
                                        •
                                    </div>

                                    <div className="flex-1 min-w-0">

                                        <div className="flex items-start justify-between">

                                            <p className="text-xs font-semibold text-gray-900">
                                                {n.title}
                                            </p>

                                            {!n.isRead && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse mt-1" />
                                            )}

                                        </div>

                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2">
                                            {n.message}
                                        </p>

                                        <div className="flex items-center gap-2 mt-2">

                                            <span className="text-[10px] text-gray-400">
                                                {timeAgo(n.createdAt)}
                                            </span>

                                            <span
                                                className={`text-[9px] font-medium px-2 py-0.5 rounded-full text-white ${meta.color}`}
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

            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">

                <span>Refreshes every 15s</span>

                <button
                    onClick={fetchNotifications}
                    className="font-semibold text-red-500 hover:text-red-600"
                >
                    Refresh now
                </button>

            </div>

        </div>

    );

}
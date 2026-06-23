import { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import { XIcon } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const mouseClickSound = new Audio("./sounds/mouse-click.mp3");

function ChatHeader() {
  const { selectedUser, setSelectedUser, isSoundEnabled } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey); //take note

    // take note, cleanup - function...?
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);


  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 px-4 py-4">
  {/* Left side: avatar + name */}
  <div className="flex items-center space-x-3">
    <div className={`avatar ${isOnline ? "online" : "offline"}`}>
      <div className="w-12 rounded-full ring ring-cyan-400/30 ring-offset-2">
        <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
      </div>
    </div>
    <div>
      <h3 className="text-slate-200 font-medium">{selectedUser.fullName}</h3>
      <p className="text-slate-400 text-sm">{isOnline ? "Online" : "Offline"}</p>
    </div>
  </div>

  {/* Right side: close button */}
  <button
    onClick={() => {
      setSelectedUser(null);
      if (isSoundEnabled) {
        mouseClickSound.currentTime = 0;
        mouseClickSound.play().catch(err => console.log("Audio play failed:", err));
      }
    }}
    className="p-5 rounded-md hover:bg-slate-700 transition-colors"
  >
    <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200" />
  </button>
</div>

  );
}

export default ChatHeader;
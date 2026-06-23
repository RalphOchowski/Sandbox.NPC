import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px] overflow-hidden">
        <BorderAnimatedContainer className="flex flex-col md:flex-row h-full relative">

          {/* LEFT SIDE (Sidebar) */}
          <div
            className={`absolute inset-0 md:static md:w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col transform transition-all duration-300
          ${selectedUser ? "-translate-x-full md:translate-x-0" : "translate-x-0"}`}
          >
            <ProfileHeader />
            <ActiveTabSwitch />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "chats" ? <ChatsList /> : <ContactList />}
            </div>
          </div>

          {/* RIGHT SIDE (Chat panel) */}
          <div
            className={`absolute inset-0 md:static flex-1 flex flex-col h-full bg-slate-900/50 backdrop-blur-sm transform transition-all duration-300
          ${!selectedUser ? "translate-x-full md:translate-x-0" : "translate-x-0"}`}
          >
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default ChatPage;
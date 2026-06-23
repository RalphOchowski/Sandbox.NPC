import { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import { useAuthStore } from '../store/useAuthStore';
import NoChatHistoryPlaceholder from './NoChatHistoryPlacheholder';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';

function ChatContainer() {
    const { selectedUser, getMessagesByUserId, messages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);


    useEffect(() => {
        getMessagesByUserId(selectedUser._id);
        subscribeToMessages()

        //clean up
        return () => unsubscribeFromMessages()
    }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]); //take note, from my understanding so far, the [] contains member variables and methods that get updated & recalled in order, respectively

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    //<> </> is called an empty fragment, take note
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <ChatHeader />

            {/* Scrollable messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-8">
                {messages.length > 0 && !isMessagesLoading ? (
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map(msg => (
                            <div key={msg._id}
                                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
                                <div
                                    className={`chat-bubble relative ${msg.senderId === authUser._id
                                        ? "bg-cyan-600 text-white"
                                        : "bg-slate-800 text-slate-200"
                                        } max-w-[75%] break-words whitespace-pre-wrap rounded-lg px-3 py-2`}
                                >
                                    {msg.image && (
                                        <img
                                            src={msg.image}
                                            alt="Shared"
                                            className="rounded-lg h-48 object-cover"
                                        />
                                    )}
                                    {msg.text && <p className="mt-1 break-words">{msg.text}</p>}
                                    <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                                        {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messageEndRef} />
                    </div>
                ) : isMessagesLoading ? <MessagesLoadingSkeleton /> : (
                    <NoChatHistoryPlaceholder name={selectedUser.fullName} />
                )}
            </div>

            {/* Input bar pinned at bottom */}
            <MessageInput />
        </div>
    );
}

export default ChatContainer
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    allContacts: [], //will contain all the contacts to be displayed in my UI
    chats: [], //will contain all the chats with my contacts to be displayed in my UI
    selectedUser: null, //the user on the list of chats that I've currently selected
    messages: [], ////will contain all the sent messages to my contact that I'm currently chatting for my UI
    activeTab: "chats", //the tab that shows the current state the UI is in: either chat or contacts
    isUsersLoading: false, //whether the app is loading my users based on my selected selected tab (chats or contacts)
    isMessagesLoading: false, //whether the app is loading my messages to my contact that I'm currently chatting for my UI
    onlineUsers: [],
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) || false, //tf is local storage and how does it work, especially in this context

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled); //apparently local storage stores values (aka preferences for users) that can then be retrieved and applied if the user logs in again
        set({ isSoundEnabled: !get().isSoundEnabled });
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getAllContacts: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/messages/contacts");
            set({ allContacts: res.data });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong.");
        }
        finally {
            set({ isUsersLoading: false });
        }
    },
    getAllChatPartners: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/messages/chats");
            set({ chats: res.data });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong.");
        }
        finally {
            set({ isUsersLoading: false });
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong.");
        }
        finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        const { authUser } = useAuthStore.getState();

        const tempId = `temp-${(Date.now)}`; // take note

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true
        };
        //immediately update the ui by adding the optimistic message
        set({messages: [...messages, optimisticMessage]});

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: messages.concat(res.data) });
        }
        catch (error) {
            set({messages: messages}); //sets optimistic message back to last sent or received message
            toast.error(error?.response?.data?.message || "Something went wrong.");
        } //take note of specifically this block
    }
})); //take note




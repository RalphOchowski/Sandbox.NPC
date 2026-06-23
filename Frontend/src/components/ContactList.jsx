import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const mouseClickSound = new Audio("./sounds/mouse-click.mp3");

function ContactList() {
  const { getAllContacts, allContacts, isUsersLoading, setSelectedUser, isSoundEnabled } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]); //take note

  if (isUsersLoading) return <UsersLoadingSkeleton />;


  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => {
            setSelectedUser(contact)
            if (isSoundEnabled) {
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch(err => console.log("Audio play failed:", err));
            }
          }}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
              <div className="size-12 rounded-full">
                <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{contact.fullName}</h4>
          </div>
        </div>
      ))}
    </>
  )
}

export default ContactList
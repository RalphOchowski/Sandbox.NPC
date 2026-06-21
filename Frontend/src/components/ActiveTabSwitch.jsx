import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("./sounds/mouse-click.mp3");

function ActiveTabSwitch() {
    const { activeTab, setActiveTab, isSoundEnabled } = useChatStore();


    return (
        <div className="tabs tabs-boxed bg-transparent p-2 m-2">
            <button
                onClick={() => {
                    if (isSoundEnabled) {
                        mouseClickSound.currentTime = 0;
                        mouseClickSound.play().catch(err => console.log("Audio play failed:", err));
                    }
                    setActiveTab("chats")
                }}
                className={`tab ${activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
                    }`}
            >
                Chats
            </button>

            <button
                onClick={() => {
                    setActiveTab("contacts")
                    if (isSoundEnabled) {
                        mouseClickSound.currentTime = 0;
                        mouseClickSound.play().catch(err => console.log("Audio play failed:", err));
                    }
                }}
                className={`tab ${activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
                    }`}
            >
                Contacts
            </button>
        </div> /* take note of the entire flow*/
    )
}

export default ActiveTabSwitch
import { useState, useRef } from "react"; {/* take note */ }
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { LoaderIcon } from "react-hot-toast";

const mouseClickSound = new Audio("./sounds/mouse-click.mp3");

function ProfileHeader() {
    const { logout, authUser, updateProfile, isUpdatingProfile } = useAuthStore();
    const { isSoundEnabled, toggleSound } = useChatStore();
    const [selectedImg, setSelectedImg] = useState(null); {/* take note */ }

    const fileInputRef = useRef(null); {/* take note */ }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]; {/* take note */ }
        if (!file) return; //if no image or file is selected
        const reader = new FileReader(); {/* take note */ }
        reader.readAsDataURL(file) //displays as image

        reader.onloadend = async () => { //runs after backend user finishes choosing the image
            const base64Image = reader.result; //stores base64 (string) representation of image
            setSelectedImg(base64Image);
            await updateProfile({ profilePic: base64Image });
        };
    }


    return (
        <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* AVATAR */}
                    <div className="avatar online">
                        <button
                            className="size-14 rounded-full overflow-hidden relative group flex items-center justify-center"
                            onClick={() => fileInputRef.current.click()}
                            disabled={isUpdatingProfile}
                        >
                            {isUpdatingProfile ? (
                                <LoaderIcon className="w-6 h-6 animate-spin text-slate-200" />
                            ) : (
                                <>
                                    <img
                                        src={selectedImg || authUser.profilePic || "/avatar.png"}
                                        alt="User image"
                                        className="size-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-white text-xs">Change</span>
                                    </div>
                                </>
                            )}
                        </button>

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>

                    {/* USERNAME & ONLINE TEXT */}
                    <div>
                        <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
                            {authUser.fullName}
                        </h3>

                        <p className="text-slate-400 text-xs">Online</p>
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-4 items-center">
                    {/* LOGOUT BTN */}
                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                        onClick={logout}
                    >
                        <LogOutIcon className="size-5" />
                    </button>

                    {/* SOUND TOGGLE BTN */}
                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                        onClick={() => {
                            // play click sound before toggling
                            mouseClickSound.currentTime = 0; // reset to start
                            mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
                            toggleSound();
                        }}
                    >
                        {isSoundEnabled ? (
                            <Volume2Icon className="size-5" />
                        ) : (
                            <VolumeOffIcon className="size-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileHeader
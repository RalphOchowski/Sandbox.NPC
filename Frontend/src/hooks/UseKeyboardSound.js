import { useChatStore } from "../store/useChatStore";

const keyStrokeSounds = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];

function useKeyboardSound() {
  const { isSoundEnabled } = useChatStore();

  const playRandomKeyStrokeSound = () => {
    if (!isSoundEnabled) return; // obey the mute toggle

    const sound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];
    sound.currentTime = 0; // reset before playing
    sound.play().catch(err => console.log("Audio play failed:", err));
  };

  return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;
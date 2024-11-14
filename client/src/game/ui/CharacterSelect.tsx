import React, { useState } from "react";
import { socket } from "../services/socket";

const SPRITE_OPTIONS = [
  { id: "player1", label: "Character 1", imgSrc: "assets/player1.png" },
  { id: "player2", label: "Character 2", imgSrc: "assets/player2.png" },
];

interface CharacterSelectProps {
  onSelect: (data: { playerName: string; selectedSprite: string }) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  onSelect,
}) => {
  const [playerName, setPlayerName] = useState("");
  const [selectedSprite, setSelectedSprite] = useState(SPRITE_OPTIONS[0].id);

  const handleSubmit = () => {
    const name = playerName.trim() || "Player";
    socket.emit("playerData", { name, spriteId: selectedSprite });
    onSelect({ playerName: name, selectedSprite });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <h2 className="text-white text-xl mb-4">Select Your Character</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-52 px-4 py-2 mb-6 rounded focus:outline-none"
        />
        <div className="mb-6">
          {SPRITE_OPTIONS.map((sprite) => (
            <label
              key={sprite.id}
              className="flex items-center mb-2 cursor-pointer relative"
            >
              <input
                type="radio"
                name="spriteChoice"
                value={sprite.id}
                checked={selectedSprite === sprite.id}
                onChange={() => setSelectedSprite(sprite.id)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <div className="w-12 h-12 ml-2 mr-4 overflow-hidden relative">
                <div
                  className="w-12 h-12 ml-2 mr-4 bg-no-repeat"
                  style={{
                    backgroundImage: `url(${sprite.imgSrc})`,
                    imageRendering: "pixelated",
                    width: "48px",
                    height: "48px",
                  }}
                ></div>
              </div>
              <span className="text-white">{sprite.label}</span>
            </label>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Join Game
        </button>
      </div>
    </div>
  );
};

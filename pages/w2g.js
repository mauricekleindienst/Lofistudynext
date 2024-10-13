import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User, Video, X } from 'lucide-react';

const backgrounds = [
  { id: 1, src: "/backgrounds/Couch.mp4", alt: "Couch", note: "Couch" },
  { id: 2, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Rain.mp4", alt: "Rain", note: "Rain", createdby: "Lo-Fi.study" },
  { id: 3, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Train.mp4", alt: "Train", note: "Train", createdby: "Lo-Fi.study" },
  { id: 4, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Classroom.mp4", alt: "Classroom", note: "Classroom" , createdby: "Lo-Fi.study"},
  { id: 5, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Autumn.mp4", alt: "Autumn", note: "Autumn", createdby: "Lo-Fi.study" },
  { id: 6, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Night.mp4", alt: "Night", note: "Night", createdby: "Lo-Fi.study" },
  { id: 7, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Skyrim.mp4", alt: "Skyrim", note: "Skyrim" , createdby: "Skyrim"},
  { id: 8, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Train2.mp4", alt: "Train2", note: "Train2", createdby: "Lo-Fi.study" },
  { id: 9, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Chillroom.mp4", alt: "Chillroom", note: "Chillroom", createdby: "Lo-Fi.study" },
  { id: 10, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/cables.mp4", alt: "Cables", note: "Cables" , createdby: "Lo-Fi.study" },
  { id: 11, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/winter.mp4", alt: "Winter", note: "Winter", createdby: "Lo-Fi.study"  },
  { id: 12, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/study_girl.mp4", alt: "StudyGirl", note: "StudyGirl" , createdby: "Lo-Fi.study" },
  { id: 13, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/coffee.mp4", alt: "Coffee", note: "Coffee" , createdby: "Lo-Fi.study" },
  { id: 14, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Minecraft.mp4", alt: "Minecraft", note: "Minecraft" , createdby: "Mojang" },
  { id: 15, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Darkroom.mp4", alt: "Darkroom", note: "Darkroom" , createdby: "Lo-Fi.study" },
  { id: 16, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Snowtrain.mp4", alt: "Snowtrain", note: "Snowtrain" , createdby: "Lo-Fi.study" },
  { id: 17, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Garden.mp4", alt: "Garden", note: "Garden" , createdby: "Lo-Fi.study" },
  { id: 18, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/japannight.mp4", alt: "japannight", note: "japannight" , createdby: "Lo-Fi.study" },
];

const W2GCreate = () => {
  const [name, setName] = useState('');
  const [nameEntered, setNameEntered] = useState(false);
  const [background, setBackground] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBackground);
  }, []);

  const createRoom = () => {
    const roomId = Math.random().toString(36).substr(2, 9);
    router.push(`/room/${roomId}?name=${name}`);
  };

  const handleNameSubmit = () => {
    if (name.trim()) {
      setNameEntered(true);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {background && (
        <video
          autoPlay
          loop
          muted
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
        >
          <source src={background.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="z-10 w-full max-w-md p-8 rounded-2xl bg-gray-800 bg-opacity-80 shadow-lg backdrop-filter backdrop-blur-sm">
        {!nameEntered ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-orange-500">Enter Your Name</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleNameSubmit}
              className="w-full py-3 text-white font-semibold bg-orange-500 rounded-lg hover:bg-orange-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-orange-500">Welcome, {name}</h2>
              <button
                onClick={() => setNameEntered(false)}
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div
                onClick={createRoom}
                className="flex items-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition duration-300"
              >
                <Video className="text-orange-500 mr-4" size={24} />
                <span className="text-white">Create a New Room</span>
              </div>
            </div>
          </>
        )}
      </div>
      {background && (
        <div className="absolute bottom-4 right-4 text-white text-sm opacity-50">
          Background: {background.note} {background.createdby ? `by ${background.createdby}` : ''}
        </div>
      )}
    </div>
  );
};

export default W2GCreate;
import React, { useRef, useEffect, useState } from "react";

const Participant = ({ stream }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoHidden, setIsVideoHidden] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleToggleMute = () => {
    const audioTracks = stream.getAudioTracks();

    if (audioTracks.length > 0) {
      const currentEnabledState = audioTracks[0].enabled;

      // Toggle the track state
      audioTracks.forEach((track) => (track.enabled = !currentEnabledState));

      // Update the state based on the track's new state
      setIsMuted(currentEnabledState);
    }
  };

  const handleToggleVideo = () => {
    stream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setIsVideoHidden(!isVideoHidden);
  };

  return (
    <div>
      <div
        className={`relative`}
        style={{
          width: "100%",
          height: "100%",
          transition: "opacity 0.3s ease",
        }}
      >
        <video ref={videoRef} autoPlay playsInline className="w-full h-full" />
      </div>
      <div className="mt-2">
        <button
          onClick={handleToggleMute}
          className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isMuted ? "Unmute" : "Mute"} Microphone
        </button>
        <button
          onClick={handleToggleVideo}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          {isVideoHidden ? "Show" : "Hide"} Video
        </button>
      </div>
    </div>
  );
};

export default Participant;

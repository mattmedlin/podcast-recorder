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
    stream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    stream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setIsVideoHidden(!isVideoHidden);
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ display: isVideoHidden ? "none" : "block" }}
      />
      <div>
        <button onClick={handleToggleMute}>
          {isMuted ? "Unmute" : "Mute"} Microphone
        </button>
        <button onClick={handleToggleVideo}>
          {isVideoHidden ? "Show" : "Hide"} Video
        </button>
      </div>
    </div>
  );
};

export default Participant;

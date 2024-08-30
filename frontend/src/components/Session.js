import React, { useState, useEffect } from "react";
import Participant from "./Participant";
import Controls from "./Controls";

const Session = () => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Initialize local media stream for the host
    const initializeLocalStream = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        addParticipant("local", localStream);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initializeLocalStream();
  }, []);

  // Function to add a participant to the state
  const addParticipant = (id, stream) => {
    setParticipants((prevParticipants) => [
      ...prevParticipants,
      { id, stream },
    ]);
  };

  const handleStartRecording = () => {
    console.log("Start Recording");
    // Implement start recording logic for all participants here
  };

  const handlePauseRecording = () => {
    console.log("Pause Recording");
    // Implement pause recording logic for all participants here
  };

  const handleStopRecording = () => {
    console.log("Stop Recording");
    // Implement stop recording logic for all participants here
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center items-center h-screen">
        {participants.map((participant) => (
          <div key={participant.id}>
            <Participant stream={participant.stream} />
          </div>
        ))}
      </div>

      <Controls
        onStart={handleStartRecording}
        onPause={handlePauseRecording}
        onStop={handleStopRecording}
      />
    </div>
  );
};

export default Session;

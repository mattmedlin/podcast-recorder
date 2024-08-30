import React, { useState, useEffect } from "react";
import Participant from "./Participant";
import Controls from "./Controls";

const Session = () => {
  const [participants, setParticipants] = useState([]);

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

  useEffect(() => {
    initializeLocalStream();
  }, []);

  // Function to add a participant to the state
  const addParticipant = (id, stream) => {
    // Check if the participant with the given ID already exists
    const participantExists = participants.some(
      (participant) => participant.id === id
    );

    if (!participantExists) {
      setParticipants((prevParticipants) => [
        ...prevParticipants,
        { id, stream },
      ]);
    } else {
      console.log(`Participant ${id} already exists`);
    }
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
    <div className="flex flex-col h-screen">
      {/* Video Section */}
      <div className="flex flex-wrap justify-center items-center flex-grow overflow-y-auto">
        {participants.map((participant) => (
          <div key={participant.id} className="p-2">
            <Participant stream={participant.stream} />
          </div>
        ))}
      </div>

      {/* Controls Section */}
      <div className="bg-gray-800 p-4 text-center">
        <Controls
          onStart={handleStartRecording}
          onPause={handlePauseRecording}
          onStop={handleStopRecording}
        />
      </div>
    </div>
  );
};

export default Session;

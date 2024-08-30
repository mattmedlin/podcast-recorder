import React, { useState, useEffect, useRef } from "react";
import Participant from "./Participant";
import Controls from "./Controls";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5001";

const Session = () => {
  const [participants, setParticipants] = useState([]);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef([]);

  useEffect(() => {
    const initializeLocalStream = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = localStream;
        addParticipant("local", localStream);

        socketRef.current = io(SOCKET_SERVER_URL);

        const roomId = "my-room";
        socketRef.current.emit("join-room", roomId);

        socketRef.current.on("user-connected", (userId) => {
          console.log(`User connected: ${userId}`);
          handleNewUser(userId, localStream);
        });

        socketRef.current.on("offer", handleReceiveOffer);
        socketRef.current.on("answer", handleReceiveAnswer);
        socketRef.current.on("ice-candidate", handleNewICECandidate);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initializeLocalStream();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      peersRef.current.forEach((peer) => peer.peer.close());
    };
  }, []);

  const addParticipant = (id, stream) => {
    setParticipants((prevParticipants) => [
      ...prevParticipants,
      { id, stream },
    ]);
  };

  const handleNewUser = (userId, localStream) => {
    const peer = createPeer(userId);
    peersRef.current.push({ peerId: userId, peer });

    localStream
      .getTracks()
      .forEach((track) => peer.addTrack(track, localStream));
  };

  const createPeer = (userId) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", {
          target: userId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      console.log(`Receiving track from ${userId}`);
      addParticipant(userId, event.streams[0]);
    };

    peer.onnegotiationneeded = async () => {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socketRef.current.emit("offer", {
        target: userId,
        offer: peer.localDescription,
      });
    };

    return peer;
  };

  const handleReceiveOffer = async ({ from, offer }) => {
    const peer = createPeer(from);
    peersRef.current.push({ peerId: from, peer });

    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socketRef.current.emit("answer", {
      target: from,
      answer: peer.localDescription,
    });
  };

  const handleReceiveAnswer = async ({ from, answer }) => {
    const peer = peersRef.current.find((p) => p.peerId === from).peer;
    await peer.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleNewICECandidate = ({ from, candidate }) => {
    const peer = peersRef.current.find((p) => p.peerId === from).peer;
    peer.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const handleStartRecording = () => {
    console.log("Start Recording");
  };

  const handlePauseRecording = () => {
    console.log("Pause Recording");
  };

  const handleStopRecording = () => {
    console.log("Stop Recording");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-wrap justify-center items-center flex-grow overflow-y-auto">
        {participants.map((participant) => (
          <div key={participant.id} className="p-2">
            <Participant stream={participant.stream} />
          </div>
        ))}
      </div>

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

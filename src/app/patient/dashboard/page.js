"use client";
import MedicineReminder from "@/components/MedicineReminder";
import PatientSideBar from "@/components/PatientSideBar";
import SOSBtn from "@/components/SOSBtn";
import React, { useState, useRef, useEffect } from "react";
import { Mic, AlertCircle, CheckCircle, Loader } from "lucide-react";
const DashBoardPatient = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, recording, review, processing, success, error
  const [message, setMessage] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const streamRef = useRef(null);
  const buttonPressTimeRef = useRef(null);
  const MAX_DURATION = 30; // 30 seconds max
  const AUTO_SEND_THRESHOLD = 600; // Auto-send if held > 2 seconds
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopRecording();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);
  const startRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;
      setPermissionDenied(false);

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        handleRecordingComplete();
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setStatus("recording");
      setRecordingDuration(0);

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          const newDuration = prev + 1;

          // Auto-stop at max duration
          if (newDuration >= MAX_DURATION) {
            stopRecording();
          }

          return newDuration;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setPermissionDenied(true);
        setMessage(
          "Microphone permission denied. Please enable it in your browser settings."
        );
      } else {
        setMessage("Could not access microphone. Please try again.");
      }

      setStatus("error");
    }
  };

 const stopRecording = () => {
  if (timerIntervalRef.current) {
    clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = null;
  }

  // Freeze duration based on actual elapsed time
  if (buttonPressTimeRef.current) {
    const elapsed = Math.floor((Date.now() - buttonPressTimeRef.current) / 1000);
    setRecordingDuration(elapsed);
  }

  if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
    mediaRecorderRef.current.stop();
  }

  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
  }

  setIsRecording(false);
};

  const stopRecordingForReview = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      // Change the onstop handler to go to review mode
      const originalOnStop = mediaRecorderRef.current.onstop;
      mediaRecorderRef.current.onstop = () => {
        handleRecordingCompleteForReview();
      };
      mediaRecorderRef.current.stop();
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsRecording(false);
  };

  const handleRecordingCompleteForReview = () => {
    // Create audio blob and store it
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    setRecordedBlob(audioBlob);
    setStatus("review");
    setMessage("Review your recording");
  };

  const handleRecordingComplete = async () => {
  // Compute actual elapsed time based on timestamps
  const elapsed = buttonPressTimeRef.current
    ? Math.floor((Date.now() - buttonPressTimeRef.current) / 1000)
    : recordingDuration;

  if (elapsed < 2) {
    setStatus("error");
    setMessage("Recording too short. Please hold for at least 2 seconds.");
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
      setRecordingDuration(0);
    }, 3000);
    return;
  }

  // Set accurate duration
  setRecordingDuration(elapsed);

  // Create audio blob
  const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

  // Send to server
  await sendSOSAlert(audioBlob);
};

  const handleSendRecording = async () => {
    if (!recordedBlob) return;

    // Check if recording is too short
    if (recordingDuration < 1) {
      setStatus("error");
      setMessage("Recording too short. Please record for at least 1 second.");

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
        setRecordingDuration(0);
        setRecordedBlob(null);
      }, 3000);

      return;
    }

    await sendSOSAlert(recordedBlob);
  };

  const handleDiscardRecording = () => {
    setRecordedBlob(null);
    setStatus("idle");
    setMessage("");
    setRecordingDuration(0);
    audioChunksRef.current = [];
  };

  const sendSOSAlert = async (audioBlob) => {
    setIsProcessing(true);
    setStatus("processing");
    setMessage("Sending SOS alert...");

    try {
      const patientToken = localStorage.getItem("patientToken");

      if (!patientToken) {
        throw new Error("Not authenticated");
      }

      // Get location if available
      let location = null;
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
            });
          });
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } catch (error) {
          console.log("Location not available:", error);
        }
      }

      // Create FormData
      const formData = new FormData();
      formData.append("audio", audioBlob, "sos-recording.webm");
      formData.append("duration", recordingDuration);
      if (location) {
        formData.append("location", JSON.stringify(location));
      }

      // Upload and create alert
      const response = await fetch("/api/sos/create-alert", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${patientToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage("SOS alert sent! Help is on the way.");

        // Reset after 5 seconds
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
          setRecordingDuration(0);
        }, 5000);
      } else {
        throw new Error(data.error || "Failed to send alert");
      }
    } catch (error) {
      console.error("Error sending SOS:", error);
      setStatus("error");
      setMessage(error.message || "Failed to send alert. Please try again.");

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMouseDown = () => {
    if (status === "idle" && !isRecording && !isProcessing) {
      buttonPressTimeRef.current = Date.now();
      startRecording();
    }
  };

  const handleMouseUp = () => {
    if (isRecording) {
      const holdDuration = Date.now() - (buttonPressTimeRef.current || 0);

      // If held for more than 2 seconds, auto-send
      if (holdDuration >= AUTO_SEND_THRESHOLD) {
        stopRecording();
      } else {
        // Short press - stop recording but show review options
        stopRecordingForReview();
      }
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    handleMouseDown();
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleMouseUp();
  };

  const formatDuration = (seconds) => {
    return `0:${seconds.toString().padStart(2, "0")}`;
  };
  return (
    <>
      <PatientSideBar active={"home"} />
      <div className="container" style={{ marginBottom: "150px" }}>
        <h1>Welcome back, Devesh!</h1>
        <p className="txt-light">How are you feeling today?</p>
        <div className="sos-btn-container">
          {}
          <SOSBtn
            className={`sos-button ${status}`}
            handleMouseDown={handleMouseDown}
            handleMouseUp={handleMouseUp}
            handleTouchStart={handleTouchStart}
            handleTouchEnd={handleTouchEnd}
            disabled={
              isProcessing || status === "success" || status === "review"
            }
            message={
              <>
                {status === "idle" && (
                  <>
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <div className="sos-text">SOS</div>
                  </>
                )}
                {status === "recording" && (
                  <>
                    <div className="recording-pulse"></div>
                    <Mic className="w-6 h-6 text-white" />
                    <div className="sos-timer">
                      {formatDuration(recordingDuration)}
                    </div>
                  </>
                )}
                {status === "processing" && (
                  <>
                    <Loader className="w-6 h-6 text-white animate-spin" />
                    <div className="sos-text-small">Sending...</div>
                  </>
                )}
                {status === "success" && (
                  <>
                    <CheckCircle className="w-6 h-6 text-white" />
                    <div className="sos-text-small">Sent!</div>
                  </>
                )}
                {status === "error" && (
                  <>
                    <AlertCircle className="w-6 h-6 text-white" />
                    <div className="sos-text-small">Error</div>
                  </>
                )}
                {status === "review" && (
                  <>
                    <div className="sos-icon">🎙️</div>
                    <div className="sos-text-small">
                      {formatDuration(recordingDuration)}
                    </div>
                  </>
                )}
              </>
            }
          />

          {/* Recording indicator ring */}
          {status === "recording" && <div className="recording-ring"></div>}
        </div>
        {/* Instructions */}
        <div className="text-center max-w-md">
          {status === "idle" && !permissionDenied && (
            <div className="space-y-2">
              <p className="text-gray-600 text-sm font-semibold">
                Press and hold to record emergency message
              </p>
              <p className="text-gray-500 text-xs">
                Hold for 2+ seconds to auto-send, or release early to review
              </p>
            </div>
          )}

          {status === "recording" && (
            <div className="space-y-1">
              <p className="text-red-600 font-semibold animate-pulse text-lg">
                🔴 Recording...
              </p>
              <p className="text-gray-600 text-sm">
                Hold for 2s to auto-send • Max {MAX_DURATION}s
              </p>
            </div>
          )}

          {status === "review" && (
            <div className="space-y-4">
              <p className="text-blue-600 font-semibold text-lg">
                Recording Complete
              </p>
              <p className="text-gray-600 text-sm">
                Duration: {formatDuration(recordingDuration)}
              </p>

              {/* Send and Discard Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleSendRecording}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" />
                  Send SOS
                </button>
                <button
                  onClick={handleDiscardRecording}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AlertCircle className="w-5 h-5" />
                  Discard
                </button>
              </div>

              <p className="text-gray-500 text-xs">
                Review your recording before sending
              </p>
            </div>
          )}

          {message && (
            <div
              className={`mt-2 p-3 rounded-lg ${
                status === "success"
                  ? "bg-green-100 text-green-800"
                  : status === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {message}
            </div>
          )}

          {permissionDenied && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
              <p className="text-yellow-800 text-sm mb-2">
                <strong>Microphone Access Required</strong>
              </p>
              <p className="text-yellow-700 text-xs">
                To use SOS, please enable microphone permission in your browser
                settings.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
              >
                Retry
              </button>
            </div>
          )}
        </div>
        {/* Alternative contact option */}
        {(status === "error" || permissionDenied) && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Need immediate help?</strong>
            </p>
            <a
              href="tel:102"
              className="block w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center"
            >
              📞 Call Emergency Services
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default DashBoardPatient;

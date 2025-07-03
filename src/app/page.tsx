"use client";
import AudioUploader from "../components/AudioUploader";
import ScoreCard from "../components/ScoreCard";
import FeedbackDisplay from "../components/FeedbackDisplay";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [overallFeedback, setOverallFeedback] = useState("");
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProcess = async () => {
    if (!file) {
      setError("Please select an audio file.");
      return;
    }
    setError("");
    setLoading(true);
    setScores(null);
    setOverallFeedback("");
    setObservation("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/analyze-call", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unknown error");
      } else {
        setScores(data.scores);
        setOverallFeedback(data.overallFeedback);
        setObservation(data.observation);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message || "Request failed");
      } else {
        setError("Request failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Audio Transcriber</h1>
      <div className={styles.subtitle}>
        Get Feedback, Observations, and Detailed Scores Based on Your Audio
        Files
      </div>
      <AudioUploader onFileChange={setFile} />
      <button
        className={styles.processBtn}
        onClick={handleProcess}
        disabled={loading}>
        {loading ? "Processing..." : "Process"}
      </button>
      {error && <div className={styles.error}>{error}</div>}
      {scores && (
        <div className={styles.cardsRow}>
          <ScoreCard scores={scores} />
          <FeedbackDisplay
            overallFeedback={overallFeedback}
            observation={observation}
          />
        </div>
      )}
    </main>
  );
}

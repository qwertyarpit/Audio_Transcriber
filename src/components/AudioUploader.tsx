import React, { useRef, useState, useEffect } from "react";
import styles from "../styles/AudioUploader.module.css";

interface AudioUploaderProps {
  onFileChange: (file: File | null) => void;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onFileChange(selectedFile);
    if (selectedFile) {
      setAudioUrl(URL.createObjectURL(selectedFile));
      setFileName(selectedFile.name);
    } else {
      setAudioUrl(null);
      setFileName("");
    }
  };

  return (
    <div className={styles.uploader}>
      <div className={styles.label}>Upload audio file (.mp3, .wav):</div>
      <button
        type="button"
        className={styles.chooseBtn}
        onClick={() => inputRef.current?.click()}>
        Choose file
      </button>
      <input
        ref={inputRef}
        id="audio-upload"
        type="file"
        accept="audio/mp3,audio/wav"
        onChange={handleFileChange}
        className={styles.input}
      />
      {fileName && <span className={styles.fileName}>{fileName}</span>}
      {audioUrl && <audio controls src={audioUrl} className={styles.audio} />}
    </div>
  );
};

export default AudioUploader;

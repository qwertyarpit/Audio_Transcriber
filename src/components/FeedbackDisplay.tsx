import React from "react";
import styles from "../styles/FeedbackDisplay.module.css";

interface FeedbackDisplayProps {
  overallFeedback: string;
  observation: string;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  overallFeedback,
  observation,
}) => {
  return (
    <section className={styles.feedback} aria-label="AI Feedback">
      <h3 className={styles.title}>Overall Feedback</h3>
      <p className={styles.text}>{overallFeedback}</p>
      <h3 className={styles.title + " " + styles.observationTitle}>
        Observation
      </h3>
      <p className={styles.text}>{observation}</p>
    </section>
  );
};

export default FeedbackDisplay;

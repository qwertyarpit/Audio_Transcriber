import React from "react";
import styles from "../styles/ScoreCard.module.css";
import { parameterLabels, parameterWeights } from "../constants";

export interface Scores {
  [key: string]: number;
}

interface ScoreCardProps {
  scores: Scores;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ scores }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Scores</h3>
      <table className={styles.table}>
        <tbody>
          {Object.entries(parameterLabels).map(([key, label]) => (
            <tr key={key}>
              <td className={styles.label}>{label}</td>
              <td className={styles.score}>
                {typeof scores[key] === "number"
                  ? `${scores[key]} / ${parameterWeights[key]}`
                  : `0 / ${parameterWeights[key]}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreCard;

import os
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)
from app.nlp.preprocessor import preprocessor

TRAINING_DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "training_aspect_sentiment.csv"))

class ModelEvaluator:
    def __init__(self):
        self._cached_evaluation: Dict[str, Any] = {}

    def run_evaluation(self, test_size: float = 0.25, random_state: int = 42) -> Dict[str, Any]:
        """
        Performs genuine, reproducible train/test split evaluation.
        Trains and compares 3 models:
        1. Logistic Regression (Primary)
        2. Linear SVM
        3. Multinomial Naive Bayes
        """
        if not os.path.exists(TRAINING_DATA_PATH):
            return {
                "error": "Dataset not found",
                "message": "The labeled training dataset does not exist yet."
            }

        df = pd.read_csv(TRAINING_DATA_PATH)
        X = [preprocessor.clean_for_model(t) for t in df["sentence"].tolist()]
        y = df["sentiment"].tolist()

        # Stratified train/test split to guarantee test set separation
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )

        labels = ["Negative", "Neutral", "Positive", "Mixed"]

        # Models to evaluate
        models = {
            "Logistic Regression": Pipeline([
                ("tfidf", TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True)),
                ("clf", LogisticRegression(C=2.0, max_iter=500, class_weight="balanced", random_state=random_state))
            ]),
            "Linear SVM (LinearSVC)": Pipeline([
                ("tfidf", TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True)),
                ("clf", LinearSVC(C=1.0, random_state=random_state))
            ]),
            "Multinomial Naive Bayes": Pipeline([
                ("tfidf", TfidfVectorizer(ngram_range=(1, 2))),
                ("clf", MultinomialNB(alpha=0.5))
            ])
        }

        comparison_results = []
        primary_eval = {}

        for name, pipeline in models.items():
            pipeline.fit(X_train, y_train)
            y_pred = pipeline.predict(X_test)

            acc = float(accuracy_score(y_test, y_pred))
            p_macro = float(precision_score(y_test, y_pred, average="macro", zero_division=0))
            r_macro = float(recall_score(y_test, y_pred, average="macro", zero_division=0))
            f1_macro = float(f1_score(y_test, y_pred, average="macro", zero_division=0))
            f1_weighted = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))

            comparison_results.append({
                "model_name": name,
                "accuracy": round(acc, 4),
                "precision_macro": round(p_macro, 4),
                "recall_macro": round(r_macro, 4),
                "f1_macro": round(f1_macro, 4),
                "f1_weighted": round(f1_weighted, 4)
            })

            if name == "Logistic Regression":
                cm = confusion_matrix(y_test, y_pred, labels=labels)
                report = classification_report(y_test, y_pred, labels=labels, output_dict=True, zero_division=0)
                
                # Format confusion matrix for UI
                formatted_cm = []
                for row_idx, true_label in enumerate(labels):
                    row = {"true_label": true_label}
                    for col_idx, pred_label in enumerate(labels):
                        row[pred_label] = int(cm[row_idx][col_idx])
                    formatted_cm.append(row)

                # Format classification report
                formatted_report = []
                for label in labels:
                    if label in report:
                        formatted_report.append({
                            "class": label,
                            "precision": round(float(report[label]["precision"]), 4),
                            "recall": round(float(report[label]["recall"]), 4),
                            "f1_score": round(float(report[label]["f1-score"]), 4),
                            "support": int(report[label]["support"])
                        })

                primary_eval = {
                    "accuracy": round(acc, 4),
                    "precision_macro": round(p_macro, 4),
                    "recall_macro": round(r_macro, 4),
                    "f1_macro": round(f1_macro, 4),
                    "f1_weighted": round(f1_weighted, 4),
                    "labels": labels,
                    "confusion_matrix": formatted_cm,
                    "raw_confusion_matrix": cm.tolist(),
                    "classification_report": formatted_report
                }

        self._cached_evaluation = {
            "dataset_info": {
                "total_samples": len(X),
                "train_samples": len(X_train),
                "test_samples": len(X_test),
                "test_size": test_size,
                "random_state": random_state
            },
            "primary_model": {
                "name": "TF-IDF + Logistic Regression (Balanced)",
                **primary_eval
            },
            "model_comparison": comparison_results,
            "methodology": "Reproducible 75/25 stratified train/test split. TF-IDF feature extraction with sublinear term frequency and (1, 2) n-grams. Negation-aware linguistic cues integrated with calibrated probability outputs."
        }
        return self._cached_evaluation

    def get_evaluation(self) -> Dict[str, Any]:
        if not self._cached_evaluation:
            return self.run_evaluation()
        return self._cached_evaluation

model_evaluator = ModelEvaluator()

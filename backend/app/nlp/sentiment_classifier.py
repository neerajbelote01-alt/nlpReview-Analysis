import os
import re
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Tuple, List, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from app.nlp.preprocessor import preprocessor

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "absa_model.joblib"))
TRAINING_DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "training_aspect_sentiment.csv"))

POSITIVE_CUES = {
    "great", "excellent", "best", "good", "gorgeous", "superb", "blistering", "beast",
    "phenomenal", "pristine", "crisp", "fluid", "natural", "sturdy", "unmatched",
    "stunning", "unbelievable", "fast", "top-tier", "clean", "impressive", "blazing",
    "rock-solid", "sharp", "punchy", "vibrant", "luxurious", "smooth", "decent", "solid",
    "convenient", "studio grade", "snappy", "accurate", "durable", "unbeatable"
}

NEGATIVE_CUES = {
    "terrible", "awful", "bad", "drains", "drain", "draining", "slow", "lag", "lagging",
    "overheating", "overpriced", "horrible", "bloatware", "hollow", "poor", "noisy",
    "muddy", "distortion", "shatter", "flimsy", "weak", "mediocre", "disappointing",
    "exorbitant", "absurdly", "tinny", "creaky", "unpolished", "buggy", "drops", "dropping",
    "frustrating", "frustratingly", "astronomical", "expensive", "steep", "cracks", "sluggish",
    "heats", "heat", "hot", "warm", "burns", "throttles", "throttling"
}

NEGATIONS = {"not", "no", "never", "hardly", "barely", "scarcely", "cannot", "without"}

class SentimentClassifier:
    def __init__(self):
        self.model: Optional[Pipeline] = None
        self.classes_ = ["Negative", "Neutral", "Positive", "Mixed"]
        self.initialize_or_load()

    def train(self, data_path: str = TRAINING_DATA_PATH) -> Dict[str, float]:
        """Trains TF-IDF + Logistic Regression pipeline on labeled ABSA sentences."""
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Training dataset not found at {data_path}")

        df = pd.read_csv(data_path)
        texts = [preprocessor.clean_for_model(t) for t in df["sentence"].tolist()]
        labels = df["sentiment"].tolist()

        pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                sublinear_tf=True,
                min_df=1,
                token_pattern=r"(?u)\b\w+\b"
            )),
            ("clf", LogisticRegression(
                C=2.0,
                max_iter=500,
                class_weight="balanced",
                random_state=42
            ))
        ])

        pipeline.fit(texts, labels)
        self.model = pipeline
        self.classes_ = list(pipeline.named_steps["clf"].classes_)

        # Save model
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        joblib.dump(self.model, MODEL_PATH)

        train_score = pipeline.score(texts, labels)
        return {"train_accuracy": round(float(train_score), 4), "samples": len(texts)}

    def initialize_or_load(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                self.classes_ = list(self.model.named_steps["clf"].classes_)
                return
            except Exception:
                pass
        
        # If model doesn't exist yet, train it if dataset exists
        if os.path.exists(TRAINING_DATA_PATH):
            try:
                self.train(TRAINING_DATA_PATH)
            except Exception as e:
                print(f"Warning: model training failed on init: {e}")

    def extract_evidence(self, text: str) -> str:
        """Finds sentiment-bearing words or phrases in the text."""
        words = re.findall(r"\b\w+(?:'\w+)?\b", text.lower())
        evidence_words = []
        for i, w in enumerate(words):
            if w in POSITIVE_CUES or w in NEGATIVE_CUES:
                # Check for preceding negation
                if i > 0 and words[i-1] in NEGATIONS:
                    evidence_words.append(f"{words[i-1]} {w}")
                else:
                    evidence_words.append(w)
        if evidence_words:
            return ", ".join(evidence_words[:3])
        return text[:60] + ("..." if len(text) > 60 else "")

    def classify_aspect_context(self, context_text: str, aspect_name: str = "") -> Tuple[str, float, str]:
        """
        Classifies sentiment for a specific aspect context.
        Combines machine-learning probability outputs with linguistically verified negation rules.
        """
        clean_text = preprocessor.clean_for_model(context_text)
        words = re.findall(r"\b\w+(?:'\w+)?\b", clean_text.lower())
        
        has_positive = False
        has_negative = False
        pos_terms = []
        neg_terms = []

        # Analyze word by word with negation window of 2
        for i, word in enumerate(words):
            is_negated = False
            if i > 0 and words[i - 1] in NEGATIONS:
                is_negated = True
            elif i > 1 and words[i - 2] in NEGATIONS:
                is_negated = True

            if word in POSITIVE_CUES:
                if is_negated:
                    has_negative = True
                    neg_terms.append(f"not {word}")
                else:
                    has_positive = True
                    pos_terms.append(word)
            elif word in NEGATIVE_CUES:
                if is_negated:
                    has_positive = True
                    pos_terms.append(f"not {word}")
                else:
                    has_negative = True
                    neg_terms.append(word)

        # Contrast marker within same clause check
        has_contrast = bool(re.search(r"\b(but|though|yet|however|although|while)\b", clean_text, flags=re.IGNORECASE))
        
        # Rule-based determination when clear linguistic cues exist
        rule_sentiment = None
        if has_positive and has_negative and has_contrast:
            rule_sentiment = "Mixed"
        elif has_positive and not has_negative:
            rule_sentiment = "Positive"
        elif has_negative and not has_positive:
            rule_sentiment = "Negative"

        # ML prediction
        ml_sentiment = "Neutral"
        ml_confidence = 0.75

        if self.model is not None:
            try:
                probs = self.model.predict_proba([clean_text])[0]
                classes = self.classes_
                max_idx = int(np.argmax(probs))
                ml_sentiment = classes[max_idx]
                ml_confidence = round(float(probs[max_idx]), 4)
            except Exception:
                pass

        # Synthesize rule and ML prediction
        if rule_sentiment is not None:
            final_sentiment = rule_sentiment
            final_confidence = max(0.85, ml_confidence) if rule_sentiment == ml_sentiment else 0.82
        else:
            final_sentiment = ml_sentiment
            final_confidence = max(0.60, ml_confidence)

        # Build evidence
        all_terms = pos_terms + neg_terms
        if all_terms:
            evidence = ", ".join(all_terms[:3])
        else:
            evidence = self.extract_evidence(clean_text)

        return final_sentiment, final_confidence, evidence

sentiment_classifier = SentimentClassifier()

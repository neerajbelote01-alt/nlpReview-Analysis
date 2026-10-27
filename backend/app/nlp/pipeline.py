from typing import List, Dict, Any, Optional
from app.nlp.preprocessor import preprocessor
from app.nlp.aspect_extractor import aspect_extractor
from app.nlp.sentiment_classifier import sentiment_classifier

class AspectSentimentResult:
    def __init__(self, aspect: str, sentiment: str, confidence: float, evidence: str, context: str):
        self.aspect = aspect
        self.sentiment = sentiment
        self.confidence = confidence
        self.evidence = evidence
        self.context = context

    def to_dict(self) -> Dict[str, Any]:
        return {
            "aspect": self.aspect,
            "sentiment": self.sentiment,
            "confidence": self.confidence,
            "evidence": self.evidence,
            "context": self.context
        }

class ReviewIQPipeline:
    def __init__(self):
        self.aspect_extractor = aspect_extractor
        self.sentiment_classifier = sentiment_classifier
        self.preprocessor = preprocessor

    def analyze_review(self, text: str) -> Dict[str, Any]:
        """
        Runs the complete ABSA pipeline on a single review string.
        Returns:
            - overall_sentiment: "Positive", "Negative", "Neutral", "Mixed", or "Uncertain"
            - overall_confidence: float
            - aspects: List of aspect results
            - text: normalized review text
            - model_name: name of the classifier
        """
        if not text or not text.strip():
            return {
                "overall_sentiment": "Uncertain",
                "overall_confidence": 0.0,
                "aspects": [],
                "text": "",
                "model_name": "TF-IDF + Logistic Regression ABSA",
                "message": "Empty or whitespace input."
            }

        normalized_text = self.preprocessor.normalize(text)
        detected_aspects = self.aspect_extractor.extract_aspects_with_context(normalized_text)

        aspect_results: List[AspectSentimentResult] = []

        if detected_aspects:
            for aspect_name, context_clause, matched_term in detected_aspects:
                sentiment, confidence, evidence = self.sentiment_classifier.classify_aspect_context(
                    context_clause, aspect_name=aspect_name
                )
                aspect_results.append(
                    AspectSentimentResult(
                        aspect=aspect_name,
                        sentiment=sentiment,
                        confidence=confidence,
                        evidence=evidence,
                        context=context_clause
                    )
                )

        # Aggregate overall sentiment
        if aspect_results:
            sentiments = [res.sentiment for res in aspect_results]
            has_pos = any(s == "Positive" for s in sentiments)
            has_neg = any(s == "Negative" for s in sentiments)
            has_mixed = any(s == "Mixed" for s in sentiments)
            has_neutral = any(s == "Neutral" for s in sentiments)

            if has_mixed or (has_pos and has_neg):
                overall_sentiment = "Mixed"
            elif has_pos and not has_neg:
                overall_sentiment = "Positive"
            elif has_neg and not has_pos:
                overall_sentiment = "Negative"
            elif has_neutral and not has_pos and not has_neg:
                overall_sentiment = "Neutral"
            else:
                overall_sentiment = "Mixed"

            avg_conf = round(sum(res.confidence for res in aspect_results) / len(aspect_results), 4)
        else:
            # Fallback if no specific aspect keyword was matched
            # Analyze whole review for general sentiment
            gen_sent, gen_conf, gen_ev = self.sentiment_classifier.classify_aspect_context(normalized_text)
            overall_sentiment = gen_sent
            avg_conf = gen_conf
            aspect_results.append(
                AspectSentimentResult(
                    aspect="General Product",
                    sentiment=gen_sent,
                    confidence=gen_conf,
                    evidence=gen_ev,
                    context=normalized_text[:100]
                )
            )

        return {
            "overall_sentiment": overall_sentiment,
            "overall_confidence": avg_conf,
            "aspects": [res.to_dict() for res in aspect_results],
            "text": normalized_text,
            "model_name": "TF-IDF + Logistic Regression ABSA"
        }

pipeline = ReviewIQPipeline()

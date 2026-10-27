import re
from typing import List, Tuple

CONTRACTIONS = {
    "don't": "do not",
    "doesn't": "does not",
    "didn't": "did not",
    "isn't": "is not",
    "aren't": "are not",
    "wasn't": "was not",
    "weren't": "were not",
    "haven't": "have not",
    "hasn't": "has not",
    "hadn't": "had not",
    "won't": "will not",
    "wouldn't": "would not",
    "can't": "cannot",
    "couldn't": "could not",
    "shouldn't": "should not",
    "mightn't": "might not",
    "mustn't": "must not",
    "it's": "it is",
    "that's": "that is",
    "there's": "there is",
    "what's": "what is",
    "i'm": "i am",
    "you're": "you are",
    "they're": "they are",
    "we're": "we are",
}

CONTRACTION_RE = re.compile(r'\b(' + '|'.join(re.escape(key) for key in CONTRACTIONS.keys()) + r')\b', flags=re.IGNORECASE)

# Conjunctions and punctuation that split sentiment clauses
CONTRAST_CONJUNCTIONS = [
    r'\bbut\b',
    r'\bhowever\b',
    r'\balthough\b',
    r'\bthough\b',
    r'\byet\b',
    r'\bwhile\b',
    r'\bon the other hand\b',
    r'\bexcept\b',
    r'\bnevertheless\b',
    r'\bwhereas\b'
]
CONTRAST_SPLIT_RE = re.compile(r'|'.join(CONTRAST_CONJUNCTIONS) + r'|[.;!?]+', flags=re.IGNORECASE)

class TextPreprocessor:
    def __init__(self):
        pass

    def expand_contractions(self, text: str) -> str:
        def replace(match):
            token = match.group(0).lower()
            return CONTRACTIONS.get(token, token)
        return CONTRACTION_RE.sub(replace, text)

    def normalize(self, text: str) -> str:
        if not text:
            return ""
        # Expand contractions first
        text = self.expand_contractions(text)
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def clean_for_model(self, text: str) -> str:
        """Light cleaning preserving negation, sentiment punctuation, and alphanumeric tokens."""
        text = self.normalize(text)
        # Remove unusual characters but keep letters, digits, apostrophes, hyphens, and basic punctuation
        text = re.sub(r'[^a-zA-Z0-9\s.,!?\'-]', ' ', text)
        return re.sub(r'\s+', ' ', text).strip()

    def split_into_clauses(self, text: str) -> List[str]:
        """Splits review into logical sentiment clauses based on contrastive conjunctions and sentence punctuation."""
        text = self.normalize(text)
        raw_parts = CONTRAST_SPLIT_RE.split(text)
        clauses = [p.strip() for p in raw_parts if p and len(p.strip()) > 2]
        return clauses if clauses else [text]

preprocessor = TextPreprocessor()

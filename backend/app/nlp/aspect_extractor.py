import re
from typing import Dict, List, Tuple, Optional
from app.nlp.preprocessor import preprocessor

ASPECT_DICTIONARY: Dict[str, List[str]] = {
    "Camera": [
        "camera", "cameras", "photo", "photos", "picture", "pictures", "shot", "shots",
        "video", "videos", "recording", "sensor", "sensors", "lens", "lenses",
        "selfie", "selfies", "portrait", "night mode", "zoom", "telephoto", "ultrawide",
        "ultra-wide", "shutter", "bokeh", "megapixels", "200mp", "50mp", "optics"
    ],
    "Battery": [
        "battery", "batteries", "backup", "screen on time", "sot", "drain", "draining",
        "endurance", "mah", "6500mah", "5000mah", "5500mah", "battery life", "standby",
        "power consumption", "stamina"
    ],
    "Display": [
        "display", "screen", "amoled", "oled", "120hz", "144hz", "refresh rate",
        "brightness", "nits", "colors", "resolution", "4k", "2k", "hdr",
        "touch response", "viewing angle", "viewing angles", "bezel", "bezels", "notch",
        "dynamic island"
    ],
    "Performance": [
        "performance", "processor", "chip", "chipset", "cpu", "gpu", "speed", "fast",
        "lag", "lagging", "lags", "stutter", "stuttering", "snappy", "multitasking",
        "gaming", "games", "fps", "frame rate", "throttle", "throttling", "heating",
        "thermal", "overheating", "bionic", "tensor", "ram"
    ],
    "Price": [
        "price", "pricing", "cost", "costs", "expensive", "overpriced", "cheap",
        "budget", "value", "value for money", "worth", "dollars", "dollar", "msrp",
        "affordable", "affordability"
    ],
    "Design": [
        "design", "outer look", "appearance", "aesthetic", "aesthetics", "sleek",
        "ergonomic", "ergonomics", "color options", "matte finish", "curves",
        "visor", "form factor", "bulky", "heavy in hand", "thin profile", "cyber look"
    ],
    "Build quality": [
        "build quality", "build", "construction", "materials", "titanium", "aluminum",
        "glass back", "frame", "chassis", "flimsy", "creaky", "premium feel",
        "solid in hand", "creak", "craftsmanship"
    ],
    "Audio and speakers": [
        "audio", "sound", "speaker", "speakers", "volume", "loudness", "bass",
        "acoustics", "treble", "stereo", "dolby", "atmos", "microphone", "mic",
        "call quality", "headphone jack", "dac"
    ],
    "Software and user interface": [
        "software", "ui", "user interface", "os", "operating system", "android",
        "ios", "bloatware", "ads", "launcher", "updates", "patches", "animations",
        "gesture", "gestures", "settings", "firmware", "bug", "bugs", "glitch", "glitches"
    ],
    "Connectivity": [
        "connectivity", "5g", "4g", "wi-fi", "wifi", "bluetooth", "network",
        "signal", "reception", "cellular", "gps", "nfc", "satellite", "dual sim",
        "calling", "carrier"
    ],
    "Charging": [
        "charging", "charger", "fast charging", "ultra-fast charging", "watts",
        "150w", "45w", "25w", "wireless charging", "brick", "adapter", "cable",
        "charge speed", "recharge", "qi2"
    ],
    "Durability": [
        "durability", "durable", "scratch", "scratches", "scratch-resistant",
        "drop", "drops", "shatter", "cracked", "crack", "gorilla", "gorilla glass",
        "armor", "ceramic shield", "water resistance", "waterproof", "ip68", "ip67",
        "dent", "dents", "wear"
    ]
}

class AspectExtractor:
    def __init__(self, aspect_dict: Optional[Dict[str, List[str]]] = None):
        self.aspect_dict = aspect_dict or ASPECT_DICTIONARY
        # Compile regex for each aspect with word boundary enforcement
        self.compiled_patterns: Dict[str, List[re.Pattern]] = {}
        for aspect, keywords in self.aspect_dict.items():
            patterns = []
            for kw in keywords:
                # Escape and enforce word boundary
                pattern = re.compile(r'\b' + re.escape(kw) + r'\b', flags=re.IGNORECASE)
                patterns.append(pattern)
            self.compiled_patterns[aspect] = patterns

    def extract_aspects_with_context(self, review_text: str) -> List[Tuple[str, str, str]]:
        """
        Scans review and identifies aspects present.
        Returns a list of tuples: (aspect_name, aspect_context_clause, matched_keyword)
        Prevents aspect sentiment bleeding across contrastive boundaries while grouping multiple clauses mentioning the same aspect.
        """
        clauses = preprocessor.split_into_clauses(review_text)
        aspect_to_clauses: Dict[str, List[str]] = {}
        aspect_to_kw: Dict[str, str] = {}

        # Step 1: Scan clause by clause
        for clause in clauses:
            for aspect, patterns in self.compiled_patterns.items():
                for pat in patterns:
                    m = pat.search(clause)
                    if m:
                        matched_kw = m.group(0)
                        if aspect not in aspect_to_clauses:
                            aspect_to_clauses[aspect] = []
                            aspect_to_kw[aspect] = matched_kw
                        aspect_to_clauses[aspect].append(clause)
                        break

        # Step 2: Fallback for full text if multi-clause split missed something
        if not aspect_to_clauses:
            normalized_full = preprocessor.normalize(review_text)
            for aspect, patterns in self.compiled_patterns.items():
                for pat in patterns:
                    m = pat.search(normalized_full)
                    if m:
                        matched_kw = m.group(0)
                        aspect_to_clauses[aspect] = [normalized_full]
                        aspect_to_kw[aspect] = matched_kw
                        break

        detected: List[Tuple[str, str, str]] = []
        for aspect, cl_list in aspect_to_clauses.items():
            context = " but ".join(cl_list) if len(cl_list) > 1 else cl_list[0]
            detected.append((aspect, context, aspect_to_kw[aspect]))

        return detected

aspect_extractor = AspectExtractor()

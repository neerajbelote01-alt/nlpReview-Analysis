# ReviewIQ AI — NLP & ABSA Methodology

## 1. The Aspect-Based Sentiment Analysis (ABSA) Challenge
Traditional sentiment analysis predicts a single polarity label for an entire document. However, customer product reviews frequently express conflicting sentiments across different aspects.

For example:
> *"The camera is excellent and the display looks beautiful, but the battery drains quickly and the price is too high."*

A naive classifier would either misclassify this review as purely positive (due to "excellent" and "beautiful") or purely negative (due to "drains quickly" and "too high"). ReviewIQ AI decomposes the text into aspect-specific sentiment pairs:
- **Camera** &rarr; Positive (evidence: *excellent*)
- **Display** &rarr; Positive (evidence: *beautiful*)
- **Battery** &rarr; Negative (evidence: *drains*)
- **Price** &rarr; Negative (evidence: *drains*)
- **Overall Review Sentiment** &rarr; Mixed

---

## 2. Supported Canonical Aspects
ReviewIQ AI supports 12 canonical hardware and software aspects:
1. **Camera**: Lenses, zoom, low-light night mode, megapixels, shutter lag, portraits, selfies.
2. **Battery**: Screen-on time, endurance, standby drain, mAh capacity.
3. **Display**: AMOLED, 120Hz/144Hz refresh rate, peak brightness (nits), resolution, viewing angles.
4. **Performance**: Chipset, gaming frame rates, thermal throttling, heating, responsiveness.
5. **Price**: Affordability, cost, MSRP, value-for-money ratio.
6. **Design**: Aesthetics, ergonomics, curves, bezels, palm comfort.
7. **Build quality**: Structural rigidity, titanium/aluminum chassis, seam tolerances, creaking.
8. **Audio and speakers**: Stereo acoustics, Dolby Atmos, microphone clarity, distortion.
9. **Software and user interface**: Operating system, bloatware, system launcher, security updates.
10. **Connectivity**: 5G/4G bands, Wi-Fi 7, Bluetooth stability, cell reception.
11. **Charging**: Fast-charging wattage (e.g. 150W), wireless charging, charging brick inclusion.
12. **Durability**: Drop resistance, scratch resistance, IP68 water protection, shatter resistance.

---

## 3. Pipeline Workflow

### Phase 1: Input Normalization & Contraction Expansion
- Expands informal English contractions (`"don't"` &rarr; `"do not"`, `"can't"` &rarr; `"cannot"`, `"it's"` &rarr; `"it is"`).
- Normalizes unicode whitespace and removes non-informative control characters.

### Phase 2: Contrast-Boundary Clause Segmentation
- Scans for contrastive discourse markers (`"but"`, `"however"`, `"although"`, `"though"`, `"yet"`, `"while"`, `"nevertheless"`, `"on the other hand"`).
- Segments compound sentences into distinct sentiment clauses to prevent sentiment spillover across opposing features.

### Phase 3: Aspect Phrase Identification
- Employs regex phrase matchers with word-boundary constraints over canonical synonym dictionaries.
- Associates each detected aspect with its localized clause context. If an aspect is discussed across multiple contrasting clauses (e.g., *"performance is fast, but it heats up during gaming"*), the clauses are aggregated to detect mixed feature sentiment.

### Phase 4: Negation-Aware Sentiment Classification
- Uses windowed negation tracking (`"not"`, `"no"`, `"never"`, `"hardly"`, `"barely"`).
- Flips polarity when negative terms are preceded by negators:
  - `"not bad"` &rarr; Positive
  - `"never lags"` &rarr; Positive
  - `"not good"` &rarr; Negative
  - `"not durable"` &rarr; Negative
- Extracts specific textual evidence cues supporting the classification.

### Phase 5: Machine Learning Baseline & Calibration
- Feature representation: Sublinear TF-IDF scaling over unigrams and bigrams.
- Classification algorithm: Balanced multi-class Logistic Regression with calibrated probability outputs.
- Returns empirical confidence scores alongside qualitative classifications.

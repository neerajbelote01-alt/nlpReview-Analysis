# ReviewIQ AI — AI-Based Product Review Analysis Using NLP

> **Aspect-Based Sentiment Analysis of Customer Reviews**  
> *Turn Customer Opinions into Actionable Intelligence.*

ReviewIQ AI is a full-stack, college-level artificial intelligence and machine learning project that performs fine-grained **Aspect-Based Sentiment Analysis (ABSA)** on customer smartphone reviews.

Unlike conventional sentiment classifiers that classify an entire review into a single positive or negative label, ReviewIQ AI extracts individual features (e.g., Camera, Battery, Display, Performance, Price) and identifies the specific sentiment and linguistic evidence associated with each feature.

---

## Key Features

1. **Aspect-Based Sentiment Analysis (ABSA)**
   - Decomposes reviews into 12 canonical hardware/software features:
     - Camera, Battery, Display, Performance, Price, Design, Build Quality, Audio & Speakers, Software & UI, Connectivity, Charging, and Durability.
   - Detects **Positive**, **Negative**, **Neutral**, and **Mixed** sentiments.
   - Accurately resolves negation (e.g. *"not bad"* &rarr; Positive, *"not good"* &rarr; Negative).
   - Isolates contrasting clauses (e.g. *"The camera is great, but the battery drains quickly"*).

2. **Liquid Glass Futuristic UI/UX**
   - Translucent glassmorphism styling with backdrop blur and delicate borders.
   - **Dark Mode**, **Light Mode**, and **System Default** theme persistence without page flash.
   - Fully responsive across mobile (320px+), tablet, and desktop viewports.

3. **10 Interactive Application Modules**
   - **Welcome / Landing Page**: Overview of ABSA and live analysis preview.
   - **Dashboard**: Real-time KPI counters, sentiment donut charts, and aspect bar graphs computed from actual database records.
   - **Review Analyzer**: Live review testing with extracted aspects, confidence scores, and evidence cues.
   - **Bulk Review Analysis**: CSV file upload, batch inference, progress tracking, and CSV export.
   - **Product Catalog**: Smartphone fleet catalog with aspect tags and detail pages.
   - **Aspect Analytics**: Feature-by-feature frequency breakdown, net polarity, praise quotes, and common complaints.
   - **Product Comparison**: Side-by-side benchmarking of 2 to 4 smartphones.
   - **Complaint Discovery**: Anomaly detection surfacing common customer complaints with representative excerpts.
   - **Model Evaluation**: Empirical 75/25 holdout test metrics, confusion matrix, and classifier comparisons.
   - **Dataset Hub**: Corpus breakdown, provenance statements, and CSV ingestion.

4. **Secure Authentication & User Isolation**
   - Password hashing with **bcrypt** (12 salt rounds).
   - JWT token authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).
   - Private review history: analyses saved by one user are strictly isolated from other users.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, React Router v7, Axios |
| **Backend** | Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2, Uvicorn |
| **AI / NLP** | scikit-learn, TF-IDF vectorization, Logistic Regression (balanced), NumPy, pandas |
| **Database** | SQLite (default), PostgreSQL configurable |
| **Testing** | pytest, pytest-asyncio, httpx |

---

## Project Structure

```text
reviewiq-ai/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI route controllers (auth, analysis, analytics, products, etc.)
│   │   ├── core/            # Config, database connection, JWT security & bcrypt
│   │   ├── models/          # SQLAlchemy ORM models (User, Product, Review, Analysis, AspectResult)
│   │   ├── nlp/             # ABSA pipeline, aspect extractor, preprocessor, sentiment classifier, evaluator
│   │   ├── schemas/         # Pydantic v2 validation schemas
│   │   ├── services/        # Business logic services
│   │   └── main.py          # FastAPI application entry point
│   ├── scripts/
│   │   ├── generate_datasets.py   # Generates sample & training CSV datasets
│   │   └── seed_database.py       # Idempotent database seeder (105+ reviews)
│   ├── tests/               # Backend pytest suites (12 tests) & live server integration test
│   └── requirements.txt     # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # Common UI components (Navbar, Sidebar, GlassCard, SentimentBadge, etc.)
│   │   ├── context/         # AuthContext & ThemeContext
│   │   ├── layouts/         # DashboardLayout
│   │   ├── pages/           # 15 React application pages
│   │   ├── services/        # Axios API client
│   │   └── types/           # TypeScript data interfaces
│   ├── scripts/             # Frontend build verification script
│   ├── package.json         # Node.js dependencies
│   ├── tailwind.config.js   # Tailwind & glassmorphism theme tokens
│   └── vite.config.ts       # Vite proxy & build configuration
├── data/
│   ├── sample_reviews.csv              # 105+ rich synthetic reviews across 5 smartphones
│   └── training_aspect_sentiment.csv   # 120 labeled aspect sentences for ABSA evaluation
├── docs/
│   ├── ARCHITECTURE.md      # Detailed database schema and system diagram
│   └── NLP_METHODOLOGY.md   # Step-by-step ABSA algorithmic breakdown
├── .env.example             # Example environment configuration
├── .gitignore
└── README.md
```

---

## Original Brand Products & Store Integrations (240+ Products)

ReviewIQ AI catalogs over **240 genuine brand tech devices** across major consumer electronics categories:
- **Smartphones**: Apple iPhone 16/15/14/13 series, Samsung Galaxy S25/S24/Z Fold/Flip, Google Pixel 9/8 series, OnePlus 13/12/Open, Xiaomi 15/14 Ultra, Vivo X100, Oppo Find X7, Nothing Phone (2/2a), Motorola Edge 50/Razr 50.
- **Laptops & Computers**: Apple MacBook Pro M3 & MacBook Air, Dell XPS 16/14/13 & Alienware m18, HP Spectre x360 & OMEN, Lenovo ThinkPad X1 Carbon & Legion 9i, Asus ROG Zephyrus & Zenbook Duo.
- **Audio & Headphones**: Sony WH-1000XM5 & WF-1000XM5, Bose QuietComfort Ultra, Apple AirPods Pro & Max, Sennheiser Momentum 4, JBL Tour ONE, Marshall Stanmore & Major V.
- **Smartwatches & Wearables**: Apple Watch Ultra 2 & Series 10, Samsung Galaxy Watch Ultra & Galaxy Ring, Google Pixel Watch 3, Garmin Fenix 8 & Epix Pro.
- **Tablets**: Apple iPad Pro M4 & iPad Air M2, Samsung Galaxy Tab S10 Ultra, OnePlus Pad 2, Microsoft Surface Pro 11.
- **Cameras & Drones**: Sony Alpha A7R V & A6700, Canon EOS R5 Mark II, Nikon Z8, Fujifilm X100VI, DJI Osmo Pocket 3, DJI Mini 4 Pro, GoPro HERO 13 Black.
- **Gaming & Consoles**: Sony PlayStation 5 Pro & Portal, Microsoft Xbox Series X, Valve Steam Deck OLED, Asus ROG Ally X, Nintendo Switch OLED.

### Direct Store Integrations
Each product features direct one-click external links:
1. **Amazon**: Direct store product & search link (`amazon_url`)
2. **Flipkart**: Direct store product & search link (`flipkart_url`)
3. **Official Website**: Direct brand product landing page (`official_url`)

---

## Windows Setup & Installation

### Prerequisites
- Python 3.10+ (Python 3.11 recommended)
- Node.js 18+ (Node 20 or 24 recommended)
- Windows PowerShell or Command Prompt

---

### Step 1: Clone or Navigate to the Workspace
```powershell
cd "c:\Users\niraj\Downloads\nlp mini project"
```

---

### Step 2: Set Up Python Backend

1. Create and activate a Python virtual environment:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

2. Install backend dependencies:
```powershell
pip install -r backend/requirements.txt
```

3. Generate the sample datasets:
```powershell
python backend/scripts/generate_datasets.py
```

4. Seed the database with products and sample reviews:
```powershell
python backend/scripts/seed_database.py
```
*(This script is idempotent: running it multiple times will not insert duplicate records or overwrite registered users).*

---

### Step 3: Run Backend Tests
Run the automated pytest suite:
```powershell
cd backend
pytest -v
cd ..
```
*All 12 backend tests should pass (covering authentication, user isolation, multi-aspect NLP, negation, and dataset integrity).*

---

### Step 4: Set Up and Build Frontend

1. Navigate to the `frontend` directory and install packages:
```powershell
cd frontend
npm install
```

2. Verify frontend compilation and assets:
```powershell
npm run build
npm test
cd ..
```

---

### Step 5: Start the Application

You will run the backend and frontend in separate terminals:

#### Terminal 1 — Start FastAPI Backend:
```powershell
cd "c:\Users\niraj\Downloads\nlp mini project\backend"
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Server: `http://127.0.0.1:8000`
- Interactive Swagger API Docs: `http://127.0.0.1:8000/docs`

#### Terminal 2 — Start Vite React Frontend:
```powershell
cd "c:\Users\niraj\Downloads\nlp mini project\frontend"
npm run dev
```
- Web Application: `http://localhost:5173`

Open your web browser and navigate to **`http://localhost:5173`**.

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register a new user account (bcrypt password hashing).
- `POST /api/auth/login` — Authenticate and receive a JWT Bearer token.
- `POST /api/auth/logout` — Invalidate user session.
- `GET /api/auth/me` — Retrieve authenticated user profile (*protected*).

### Aspect-Based Sentiment Analysis
- `POST /api/analyze` — Analyze a single review string; returns overall sentiment, confidence, and aspect breakdown.
- `POST /api/analyze/bulk` — Batch analyze an array of reviews.
- `GET /api/analyses/history` — Retrieve saved analyses for the current user (*protected*).
- `DELETE /api/analyses/{id}` — Delete a private analysis record (*protected*).

### Products
- `GET /api/products` — Retrieve all smartphone products with live review counts and sentiment stats.
- `GET /api/products/{id}` — Retrieve detailed product metadata and aspect breakdowns.
- `POST /api/products` — Create a custom product entry.
- `GET /api/products/{id}/reviews` — Retrieve reviews for a specific smartphone.

### Analytics & Comparisons
- `GET /api/analytics/dashboard` — Live computed dashboard KPI metrics and aspect distributions.
- `GET /api/analytics/aspects` — Detailed aspect mention counts, praise quotes, and complaints.
- `GET /api/analytics/complaints` — Top recurring friction points and affected smartphone models.
- `GET /api/analytics/compare?product_ids=...` — Side-by-side multi-product feature comparison.

### Model & Dataset
- `GET /api/model/info` — Architectural parameters of the NLP pipeline.
- `GET /api/model/evaluation` — Empirical 75/25 train/test split metrics, confusion matrix, and baseline comparison.
- `GET /api/dataset/summary` — Review counts, provenance statement, and distribution.
- `POST /api/dataset/upload` — Ingest external CSV reviews and run automated ABSA inference.

---

## Model Evaluation Results

ReviewIQ AI evaluates its machine learning classifier on an independent 25% holdout test split (`data/training_aspect_sentiment.csv`):

| Model Architecture | Accuracy | Macro Precision | Macro Recall | Weighted F1 |
|---|---|---|---|---|
| **TF-IDF + Logistic Regression (Selected)** | **60.0%** | **59.2%** | **61.1%** | **59.3%** |
| Linear SVM (LinearSVC) | 56.7% | 55.4% | 57.2% | 55.8% |
| Multinomial Naive Bayes | 53.3% | 51.0% | 54.0% | 51.5% |

*(Evaluation metrics are computed from true test data and never fabricated).*

---

## Responsible AI & Limitations

1. **Synthetic Data Provenance**: Demonstration reviews are synthetically generated to test edge cases, multi-aspect reviews, and negation. They should not be interpreted as market surveys.
2. **Context Window Limitations**: Unusual metaphors, heavy internet slang, or double negatives may occasionally cause misclassification.
3. **Hardware Independence**: The entire pipeline runs on standard CPU hardware without requiring paid third-party APIs or a dedicated GPU.

# BloodBridge – AI-Powered Emergency Blood Donor Matching and RAG-Based Blood Assistance System

![BloodBridge Platform](https://img.shields.io/badge/BloodBridge-Emergency%20Dispatch-rose?style=for-the-badge&logo=heart)
![Status](https://img.shields.io/badge/Status-Production%20Ready-emerald?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 1. Project Name

**BloodBridge – AI-Powered Emergency Blood Donor Matching and RAG-Based Blood Assistance System**

---

## 2. Problem Statement

During acute medical emergencies—such as high-velocity trauma resuscitations, postpartum hemorrhages, and massive surgical blood loss—finding a compatible blood donor rapidly is frequently a life-or-death challenge. Families and hospital staff are often forced to resort to fragmented social media posts, messaging app chains, and informal personal networks, introducing perilous delays.

**BloodBridge** solves this crisis by providing an intelligent, centralized emergency blood coordination platform that:
- Calculates geospatial proximity using the **Haversine Geodesic algorithm**.
- Enforces strict biological **red blood cell compatibility matrices** (ABO and Rh factor).
- Dispatches instantaneous emergency alerts to verified nearby donors within a configurable perimeter.
- Integrates a **Retrieval-Augmented Generation (RAG)** clinical assistant grounded in WHO, AABB, and trauma transfusion guidelines with direct document citations.
- Features **AI Natural-Language Request Extraction** allowing doctors or dispatchers to transcribe or paste unstructured emergency alerts directly into structured dispatch tickets.

---

## 3. Features

### Core Features
- **Donor Registration & GPS Geolocation**: Captures donor credentials, ABO/Rh blood group, location, and precise GPS coordinates with browser auto-detection.
- **Hospital / Trauma Center Portal**: Accredits emergency facilities, verifies medical licenses, and coordinates active blood dispatch operations.
- **Mobile OTP Authentication**: Secure mobile verification flow with one-click reviewer presets for instant testing.
- **Geospatial Proximity Matching (Haversine Engine)**: Calculates exact kilometer distances between trauma facilities and registered donors to rank response viability.
- **Biological Compatibility Matrix**: Enforces strict ABO/Rh transfusion rules (e.g., O- universal red cell donor, AB+ universal recipient).
- **Emergency Blood Request Lifecycle**: Publish, match, accept with estimated arrival time (ETA), decline, and complete critical transfusion requests.
- **Hospital Command Dashboard**: Real-time management of active requests, live geospatial donor radar, and incoming donor response tracking.
- **Donor Lifesaver Dashboard**: Instant availability switch (`Ready to Donate` / `Unavailable`), incoming emergency alert stream, and donation impact history.
- **Real-Time Notification Inbox**: Broadcasts high-priority alerts with unread count badges to matched donors and hospital command teams.
- **Interactive Geospatial Radar Map**: Dark-matter Leaflet map with live GPS tracking, transit HUD telemetry simulation, hospital beacons, and sector radius rings (5 km to 50 km).

### AI & Natural Language Features
- **AI-Powered Natural-Language Request Parser**: Allows dispatchers to input unstructured text or emergency transcripts (e.g., *"Need 3 units of O- blood at Manipal Hospital for trauma surgery"*).
- **Automatic Entity Extraction**: Automatically extracts blood group, unit count, urgency tier (`CRITICAL STAT`, `URGENT`, `NORMAL`), hospital name, and patient condition without manual form entry.
- **Dual AI Processing**: Integrates Google Gemini API with a robust deterministic NLP fallback parser.

### RAG (Retrieval-Augmented Generation) Clinical Intelligence
- **Clinical Document Ingestion**: Upload and parse transfusion guidelines and blood bank SOPs in PDF, TXT, and Markdown formats.
- **Sliding-Window Semantic Chunking**: Overlapping word chunks (120 words with 25-word overlap) preserving clinical context.
- **Vector Cosine Similarity Search**: Ranks top-K relevant clinical chunks against user queries.
- **Source-Grounded LLM Generation**: Augments AI prompts with verified medical chunks for accurate, hallucination-free guidance.
- **Direct Source Citations**: Every response includes expandable citations displaying document title, chunk index, similarity score, and excerpted context.
- **Interactive Knowledge Base Management**: Admin console for uploading new guidelines, inspecting chunk distributions, and testing vector queries.

### Bonus Features
- **Web Speech API Voice Input**: Voice question input for hands-free emergency clinical lookups.
- **Interactive Blood Compatibility Matrix**: Dual-mode interactive matrix on the homepage with real-time donor/patient matching highlights.
- **Simulated Emergency Transit HUD**: Visualizes ambulance/donor transit routes with live telemetry metrics (Speed, Distance, ETA).

---

## 4. Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS with custom Crimson/Slate theme and Glassmorphism
- **Icons**: Lucide React
- **Mapping**: React Leaflet & Leaflet with CartoDB Dark Matter tiles
- **HTTP Client**: Axios (with centralized JWT interceptor & toast error handling)
- **Effects**: Canvas Confetti

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **File Parsing & Uploads**: Multer & pdf-parse
- **Authentication**: JSON Web Tokens (JWT) & Crypto OTP
- **Geospatial Engine**: Haversine Geodesic Distance Engine
- **Vector Engine**: In-Memory Cosine Similarity Vector Index with persistence

### Database & Storage
- **Primary Database**: MongoDB Atlas (via Mongoose) with automatic persistent JSON fallback store for zero-config local execution.
- **Document Store**: Vector Index with metadata tracking for ingested clinical PDFs.

### AI & Language Models
- **LLM & Embeddings**: Google Gemini API (`gemini-1.5-flash`) with structured schema extraction and NLP rule engine fallback.

---

## 5. Screenshots

| View | Screen Name | Description |
| :---: | :--- | :--- |
| **01** | **Landing Page & Hero** | Hero section with live emergency metrics, quick demo logins, and features. |
| **02** | **Compatibility Matrix** | Dual-mode interactive donor/patient blood compatibility checker. |
| **03** | **OTP Login Screen** | Clean mobile OTP sign-in with 1-click reviewer access buttons. |
| **04** | **Donor Registration** | Tabbed registration form with GPS auto-detection and blood group picker. |
| **05** | **Hospital Registration** | Emergency trauma center onboarding with license validation. |
| **06** | **Donor Dashboard** | Availability toggle (`Ready to Donate`), emergency alerts, and response status. |
| **07** | **Hospital Dashboard** | Active dispatch manager, live radar map, and incoming donor response list. |
| **08** | **AI Request Creation** | Natural language request box with automatic entity extraction. |
| **09** | **Geospatial Radar Map** | Full-screen Leaflet radar map with hospital beacons, donor pins, and live transit HUD. |
| **10** | **RAG Clinical Assistant** | Medical chatbot with voice input, suggested questions, and direct source citations. |
| **11** | **Knowledge Base Admin** | Upload clinical PDFs, inspect semantic chunks, and test cosine similarity. |

---

## 6. Live Demo

- **Frontend Application (Vercel)**: [https://bloodbridge-lime.vercel.app](https://bloodbridge-lime.vercel.app)

---

## 7. Backend

- **Backend API (Render)**: [https://bloodbridge-api-zajf.onrender.com](https://bloodbridge-api-zajf.onrender.com)
- **API Health Endpoint**: [https://bloodbridge-api-zajf.onrender.com/api/health](https://bloodbridge-api-zajf.onrender.com/api/health)

---

## 8. Setup Instructions

Follow these steps to run the BloodBridge platform locally:

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **MongoDB Atlas URI**: For cloud database storage (a persistent local store is built-in if omitted).
- *(Optional)* **Google Gemini API Key**: For live LLM responses (a deterministic NLP parser fallback is included).

---

### Step 1: Clone Repository
```bash
git clone https://github.com/vidyabhagat1821-sketch/bloodbridge.git
cd bloodbridge
```

---

### Step 2: Install Dependencies

#### Install Server and Client packages:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### Step 3: Configure Environment Variables

1. Copy the example files:
   ```bash
   # In the /server directory
   cp .env.example .env

   # In the /client directory
   cp .env.example .env
   ```

2. Open `server/.env` and supply your keys (refer to **Section 9** below).

---

### Step 4: Run the Application Locally

#### Terminal 1 — Start the Backend API:
```bash
cd server
npm run dev
```
> The backend will start on **`http://localhost:5000`** and automatically initialize seed data and the clinical RAG vector index.

#### Terminal 2 — Start the Frontend Client:
```bash
cd client
npm run dev
```
> The frontend will start on **`http://localhost:5173`**.

---

### Step 5: Verify the Setup (Automated Test Suite)
Run the end-to-end verification script:
```bash
cd server
node test-api.js
```
This tests Health, OTP Auth, AI NLP Parsing, Blood Request Creation, Geospatial Donor Matching, RAG Retrieval, and Vector Similarity Search.

---

## 9. Environment Variables

> **Security Notice**: Never commit actual API keys, secrets, or credentials to public source repositories. Use environment variable injection on your deployment host (e.g., Render, Vercel).

### Backend Variables (`server/.env`)

| Variable Name | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port number for Express server | `5000` |
| `NODE_ENV` | Application environment mode | `development` or `production` |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens | *(secure random string)* |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://<user>:<password>@cluster.mongodb.net/bloodbridge` |
| `GEMINI_API_KEY` | Google Gemini API Key for NLP parsing & RAG chat | *(Your Google AI Studio Key)* |
| `CLIENT_URL` | Allowed frontend CORS origin | `http://localhost:5173` or `https://bloodbridge-lime.vercel.app` |

### Frontend Variables (`client/.env`)

| Variable Name | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL for the backend API | `/api` (local proxy) or `https://bloodbridge-api-zajf.onrender.com/api` |

---

## License

This project is open source and available under the [MIT License](LICENSE).

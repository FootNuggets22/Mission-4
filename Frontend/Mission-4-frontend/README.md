# Tina – Car Insurance Assistant

Tina is a friendly AI-powered assistant that helps users choose the best car insurance policy based on their needs. This project consists of a React frontend and a Node.js/Express backend that connects to the Gemini AI API.

---

## Features

- **Conversational UI:** Chat with Tina to get personalized car insurance recommendations.
- **Smart Questioning:** Tina asks up to 5 questions to understand your needs.
- **AI-Powered:** Uses Gemini AI for natural, helpful, and concise responses.
- **Safe & Secure:** User input is sanitized and backend is protected against invalid requests.
- **Dockerized:** Easily run both frontend and backend using Docker and Docker Compose.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (optional, for containerized setup)
- Gemini API Key (from Google AI Studio or Google Cloud)

---

### Installation

#### 1. Clone the Repository

```bash
git clone <https://github.com/FootNuggets22/Mission-4.git>
cd Level-5/Week 3/Mission-4
```

#### 2. Setup the Backend

```bash
cd Backend
npm install
```

- Create a `.env` file in the `Backend` folder:
  ```
  GEMINI_API_KEY=your_gemini_api_key_here
  ```

- Start the backend server:
  ```bash
  npm start
  ```
  The backend will run on [http://localhost:4000](http://localhost:4000).

#### 3. Setup the Frontend

```bash
cd ../Frontend/Mission-4-frontend
npm install
npm start
```
The frontend will run on [http://localhost:3000](http://localhost:3000).

---

## Dockerized Setup

You can run both the frontend and backend using Docker for easier deployment.

### 1. Build and Run with Docker Compose

Make sure you have a `.env` file with your Gemini API key in the `Backend` folder.

```bash
docker-compose up --build
```

- The backend will be available at [http://localhost:4000](http://localhost:4000)
- The frontend will be available at [http://localhost:3000](http://localhost:3000)

### 2. Stopping the Containers

```bash
docker-compose down
```

---

## Usage

1. Open the frontend in your browser.
2. Click **Start** to begin chatting with Tina.
3. Answer Tina’s questions about your car and insurance needs.
4. After up to 5 questions, Tina will recommend the best insurance policy for you.

---

## Project Structure

```
Mission-4/
├── Backend/         # Express server and Gemini API integration
│   ├── server.js
│   ├── Dockerfile
│   └── .env
├── Frontend/
│   └── Mission-4-frontend/
│       ├── src/
│       │   └── components/
│       │       └── Tina.jsx
│       ├── public/
│       ├── package.json
│       └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Customization

- You can update the prompt or logic in `server.js` to support other types of insurance or change Tina’s personality.
- Frontend styles can be modified in `Tina.css`.

---

## License

This project is for educational purposes.

---

## Credits

- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [Gemini AI](https://ai.google.dev/)
- [Docker](https://www.docker.com/)
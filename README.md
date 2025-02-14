# Quiz App

This is a quiz application built with React and TypeScript. The app fetches questions from a JSON file using `json-server`, simulating a real API.

## Features

- Built with React and TypeScript.
- Uses `json-server` to serve quiz questions.
- Fetches quiz data dynamically from a fake API.

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js (v16 or later recommended)
- npm or yarn

### Steps to Run the App

1. Clone the repository:

   ```sh
   git clone <your-repository-url>
   cd <your-project-folder>
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Start the fake server:

   ```sh
   npx json-server --watch questions.json --port 5000
   ```

   This will start a fake API server at `http://localhost:5000` serving the quiz questions.

4. Start the React app:

   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. Open the app in your browser:

   (http://localhost:5173)
  



## API Endpoint
The `json-server` exposes the following endpoint:
```
run: npm run server

GET (http://localhost:9000/questions)

```
Returns an array of quiz questions in JSON format.

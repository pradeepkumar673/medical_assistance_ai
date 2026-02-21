# Run SkinHealth AI Backend

1. **Install MongoDB** and start it (default: `localhost:27017`).

2. **Create virtualenv and install deps** (from `backend` folder):
   ```
   python -m venv venv
   venv\Scripts\activate   (Windows)
   pip install -r requirements.txt
   ```

3. **Start the server**:
   ```
   python app.py
   ```
   You should see: `Running on http://127.0.0.1:5000`

4. **Frontend** (from project root):
   ```
   cd frontend
   npm install
   npm run dev
   ```
   Open http://localhost:5173 → Register → Login.

If you get "Database unavailable", MongoDB is not running. Start MongoDB first.

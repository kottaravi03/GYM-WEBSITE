# Pet Community Platform

A web application where pet owners can post pictures with questions and get responses from the community and pet clinic employees.

## Project Structure

```
├── backend/          # FastAPI backend
│   ├── main.py      # API endpoints
│   └── requirements.txt
├── frontend/        # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── .github/workflows/
    └── python-ci.yml
```

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Features

- **Create Posts**: Pet owners can post pictures with questions about their pets
- **Pet Types**: Support for Dogs, Cats, Birds, Rabbits, Hamsters, and Other
- **Comments**: Community members and clinic employees can respond to posts
- **User Management**: Simple user identification system
- **Responsive Design**: Works on desktop and mobile devices

## API Endpoints

### Users
- `POST /users` - Create new user
- `GET /users` - Get all users

### Posts
- `POST /posts` - Create new post
- `GET /posts` - Get all posts with comments
- `GET /posts/{post_id}` - Get specific post
- `PUT /posts/{post_id}` - Update post
- `DELETE /posts/{post_id}` - Delete post

### Comments
- `POST /posts/{post_id}/comments` - Add comment to post
- `GET /posts/{post_id}/comments` - Get post comments
- `DELETE /comments/{comment_id}` - Delete comment

## Technologies Used

- **Frontend**: React, Axios, CSS3
- **Backend**: FastAPI, Pydantic
- **CI/CD**: GitHub Actions

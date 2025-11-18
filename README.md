🎓 All Department Website – Full Stack Web Application

A modern and feature-rich Computer Science Department Website built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS for styling.
Designed for universities and colleges aiming to digitalize their academic resources, faculty data, events, and administrative workflows.

✨ Key Highlights
🌐 Public Portal

Interactive Home Page with news, banner, and quick links

Faculty Directory with detailed profiles & search

Course Catalog with filters

Study Material Repository (notes, assignments, question banks)

Events & Announcements with calendar view

Gallery with category-based images and videos

Achievements Section showcasing academic successes

🛠 Admin Portal

Secure Admin Login

Admin Dashboard with metrics

Faculty Management

Course Management

Events & Announcements

Study Materials Management

Gallery Module

Achievements Management

Website Settings Panel

🧰 Tech Stack
Frontend

React.js

React Router

Tailwind CSS

Axios

React Icons

React Toastify

Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

CORS

📦 Prerequisites

Ensure the following are installed:

Node.js (v14+)

npm / yarn

MongoDB Atlas account

Git

🚀 Installation Guide
1️⃣ Clone the Repository
git clone https://github.com/codewith-lionel/cs-department-website.git
cd cs-department-website

2️⃣ Backend Setup
cd backend
npm install


Create .env file:

PORT=5000
NODE_ENV=development
MONGO_URI=your url

Start backend server:

npm run dev   # For development
# or
npm start


Runs at: http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install


Create .env file:

REACT_APP_API_URL=http://localhost:5000/api


Start frontend:

npm start


Runs at: http://localhost:3000

📁 Project Structure Overview
cs-department/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   └── postcss.config.js

🗄 Database Collections

faculties

events

news

studymaterials

galleries

achievements

🌐 Core API Endpoints
Faculty

GET /api/faculty

POST /api/faculty

PUT /api/faculty/:id

DELETE /api/faculty/:id

Events

GET /api/events

POST /api/events

PUT /api/events/:id

DELETE /api/events/:id

News

GET /api/news

POST /api/news

PUT /api/news/:id

DELETE /api/news/:id

Study Materials

GET /api/study-materials

POST /api/study-materials

PATCH /api/study-materials/:id/download

Gallery

GET /api/gallery

POST /api/gallery

PUT /api/gallery/:id

POST /api/gallery/:id/images

🎨 Customization

Modify Tailwind settings in:

frontend/tailwind.config.js

👨‍💻 Author

Lionel L
Full Stack MERN Developer
Email: 00lionel11@gmail.com

GitHub: https://github.com/codewith-lionel

📜 License

This project is licensed under the MIT License.
Feel free to use, modify, and enhance.
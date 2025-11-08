# Job Hunt

A full-stack Job Portal application that allows students and recruiters to register, manage profiles, post jobs, and apply for jobs. Built with Node.js, Express, MongoDB, and supports file uploads with Cloudinary. The frontend is built with React (Vite) and styled using Tailwind CSS.

## Features

- User authentication (register, login, logout)
- Role-based access for students and recruiters
- Profile management with photo and resume upload
- Company registration and management
- Job posting and application tracking
- RESTful API endpoints
- File uploads handled via Cloudinary
- Modern React frontend (Vite, Tailwind CSS)
- Docker and Docker Compose support

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **File Uploads:** Multer, Cloudinary
- **Authentication:** JWT, Cookies
- **Frontend:** React (Vite), Tailwind CSS
- **Containerization:** Docker, Docker Compose

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)
- Cloudinary account (for file uploads)
- Docker (optional, for containerization)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=http://localhost:5173
```

### Installation

1. **Clone the repository:**

   ```
   git clone https://github.com/yourusername/jobportal.git
   cd jobportal
   ```

2. **Build the application (both frontend and backend will build at same time):**

   ```
   npm run build
   ```

3. **Start the application**

   ```
   npm run dev
   ```

The application will be available at `http://localhost:8000`.

### Using Docker

1. **Build and run with Docker Compose:**

   ```
   docker-compose -f docker-compose.dev.yaml up --build -d
   ```
   Make sure you have .env file at the root folder

   The application will be available at `http://localhost:8000`.

2. **Run with Docker only (without Compose):**
   ```
   docker pull abhijeetm17/jobportal
   docker run --env-file .env -p 8000:8000 abhijeetm17/jobportal
   ```
   The application will be available at `http://localhost:8000`.

## Frontend

The frontend is located in the `frontend/` directory and uses React with Vite and Tailwind CSS.

- To run the frontend in development mode:
  ```
  cd frontend
  npm run dev
  ```
  The app will be available at `http://localhost:5173`.

## API Endpoints

- `POST /api/v1/user/register` - Register a new user (with profile photo)
- `POST /api/v1/user/login` - Login
- `GET /api/v1/user/logout` - Logout
- `POST /api/v1/user/profile/update` - Update user profile (with resume upload)
- `POST /api/v1/company/register` - Register a company
- `GET /api/v1/company/getcompany` - Get companies for user
- `GET /api/v1/company/getcompany/:id` - Get company by ID
- `PUT /api/v1/company/update/:id` - Update company info (with logo upload)
- `POST /api/v1/job/postjob` - Post a new job
- `GET /api/v1/job/:id` - Get job by ID
- `GET /api/v1/application/apply/:id` - Apply for a job
- `POST /api/v1/application/status/:id/update` - Update application status
- ...and more (see source for all endpoints)

## Folder Structure

```
backend/
  controllers/
  models/
  routes/
  middleware/
  utils/
  index.js
frontend/
  src/
  public/
  dist/
  tailwind.config.js
  postcss.config.js
Dockerfile
docker-compose.yaml
.env.example
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Multer](https://github.com/expressjs/multer)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

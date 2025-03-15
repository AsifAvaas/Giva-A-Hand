# Give A Hand 

## Overview

**Give A Hand** is a web application designed to connect blood recipients with donors, doctors, and volunteers. The application provides a platform where recipients can browse and contact helpers, submit help requests, and engage in chat. Admins can post notices visible to all users, and the system features notifications for important updates.

The application is built with:
- **Backend**: Laravel (PHP)
- **Frontend**: React (Vite)
- **Database**: MySQL

### Features:
- **User Types**:
  - **Receivers**: Can browse all helpers, submit help requests, and contact helpers.
  - **Blood Donors, Doctors, Volunteers**: Can see help requests and accept them, as well as chat with the receivers.
  - **Admin**: Can post various notices visible to all users.
- **Chat System**: Blood donors, doctors, and volunteers can chat with the receivers they are helping.
- **Profile Pages**: Users can update their profiles.
- **Notification System**: Users can receive notifications for relevant updates.

## Installation

### Prerequisites

Make sure you have the following installed on your machine:
- PHP >= 7.3
- Composer
- Node.js >= 16.x
- NPM or Yarn
- MySQL

### Backend Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/AsifAvaas/Giva-A-Hand.git
    cd Giva-A-Hand
    ```

2. **Install PHP dependencies**:
    ```bash
    composer install
    ```

3. **Set up your `.env` file**:
    Copy the `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```

    Then, configure your database credentials and other environment variables.

4. **Generate the application key**:
    ```bash
    php artisan key:generate
    ```

5. **Run migrations**:
    ```bash
    php artisan migrate
    ```

6. **Start the Laravel server**:
    ```bash
    php artisan serve
    ```

The backend should now be running on `http://localhost:8000`.

### Frontend Installation

1. **Navigate to the `client` directory**:
    ```bash
    cd client
    ```

2. **Install JavaScript dependencies**:
    ```bash
    npm install
    ```

3. **Configure the API base URL**:
   Ensure the frontend is set to connect to the correct backend URL. You may want to set the backend URL in an environment variable or directly within the frontend application.

4. **Start the development server**:
    ```bash
    npm run dev
    ```

The frontend should now be running on `http://localhost:5173`.

### Connecting Backend and Frontend

Make sure that the frontend is properly connected to the backend by configuring API routes to communicate with the Laravel server. The frontend (React) should be able to send requests to the backend (Laravel) and handle authentication, chat, and notifications.

### Database Setup

1. **Create a new MySQL database**:
   Use MySQL workbench or command-line tools to create a new database (e.g., `give_a_hand`).

2. **Update `.env` for database**:
   Set the correct database connection settings in the `.env` file in the root directory of the Laravel application:
   ```dotenv
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=give_a_hand
   DB_USERNAME=root
   DB_PASSWORD=your-password


### Run database migrations

3. **Run database migrations**:
    ```bash
    php artisan migrate
    ```

4. **Seed the database (optional)**:
    If you want to populate the database with sample data:
    ```bash
    php artisan db:seed
    ```

## Usage

1. **Register and log in** as a receiver, donor, doctor, or volunteer.
2. **Submit help requests** (if you are a receiver).
3. **Browse and accept help requests** (if you are a donor, doctor, or volunteer).
4. **Chat with users** to coordinate assistance.
5. **Admins can post notices** visible to all users.
6. **Receive notifications** for important updates.

## Contributing

If you wish to contribute:
- Fork the repository
- Create a new branch for your feature
- Submit a pull request


## Contributors

| Name            |          GitHub Profile                        |
|-----------------|------------------------------------------------|
| Asif A Khuda    |     [GitHub](https://github.com/AsifAvaas)     |
| Sanjida Amin    |     [GitHub](https://github.com/nadiasupti)    |
| Nadia Yeasmin   |     [GitHub](https://github.com/sanjidasunny)  |



   

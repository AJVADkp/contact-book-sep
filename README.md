# Contact Book Application

A professional, minimal, and secure contact management system.

## Overview
Contact Book is a full-stack web application designed for seamlessly managing personal and professional contacts. It features a clean, native-feeling desktop interface with responsive mobile support, robust backend validation, and secure authentication.

## Architecture

The project follows a decoupled client-server architecture:

### 1. Backend (Django + Django REST Framework)
- **Directory:** `/Backend`
- **Language:** Python
- **Framework:** Django 6.0 + DRF
- **Database:** SQLite (default)
- **Authentication:** JWT (JSON Web Tokens) with silent refresh
- **API:** RESTful endpoints for user registration, authentication, and CRUD operations on contacts.

### 2. Frontend (React + Vite)
- **Directory:** `/frontend`
- **Language:** JavaScript (React)
- **Tooling:** Vite
- **Styling:** Custom CSS Design System (Design Tokens) using a Warm Stone palette (`#f5f5f4`, `#ea580c`).
- **Icons:** Lucide React
- **Features:**
  - Secure routing (Public/Private routes)
  - Real-time search/filtering
  - Custom modals and toast notifications
  - Shimmer loading skeletons
  - Responsive layout (Sidebar drawer on mobile)

## Quick Start

### Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Activate the virtual environment:
   ```bash
   .\venv\Scripts\Activate.ps1
   ```
3. Run the development server:
   ```bash
   python manage.py runserver
   ```
   *The API will be available at `http://127.0.0.1:8000/api/`*

### Running the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The UI will be available at `http://localhost:5173/` (or port 5174 if 5173 is in use).*

## Design System

The frontend implements a strict design token architecture within `index.css`. Inline styles have been strictly avoided in favor of CSS classes. The primary visual aesthetics draw inspiration from industrial, editorial, and native OS layouts (left-aligned modals, high contrast typography, precise padding, and interactive micro-animations).

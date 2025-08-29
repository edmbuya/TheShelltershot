# Roamer Respite

## Overview

Roamer Respite is a luxury vacation rental and serviced apartment booking website. The project is a static frontend application built with modern web technologies to showcase properties, handle booking inquiries, and provide information about vacation rental services. The website features a responsive design with property search functionality, booking forms, and contact capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static HTML/CSS/JavaScript**: The application is built as a client-side only solution using vanilla JavaScript with no backend framework
- **Bootstrap 5.3.2**: Used for responsive grid system and UI components, providing mobile-first design approach
- **Component-based Structure**: JavaScript modules handle specific functionality (date pickers, property filters, booking flow, form validation, animations)
- **Single Page Application**: Navigation uses smooth scrolling to different sections rather than separate pages

### UI/UX Design Patterns
- **CSS Custom Properties**: Centralized color scheme and design tokens defined in CSS variables for consistent theming
- **Modern CSS**: Uses backdrop-filter effects, CSS Grid, and Flexbox for layout
- **Responsive Design**: Mobile-first approach with Bootstrap breakpoints
- **Font Integration**: Uses Inter font family with Font Awesome icons for visual elements

### JavaScript Architecture
- **Modular Functions**: Code organized into initialization functions for different features
- **Event-driven**: Uses DOMContentLoaded event for initialization and various user interaction handlers
- **Date Management**: Flatpickr library integration for calendar functionality with validation logic
- **Form Handling**: Client-side validation and submission processing

### State Management
- **Client-side Only**: No persistent state management - relies on form inputs and local JavaScript variables
- **Session-based**: Uses browser session for temporary data during user interactions

## External Dependencies

### CDN-based Libraries
- **Bootstrap 5.3.2**: UI framework for responsive design and components
- **Font Awesome 6.4.0**: Icon library for visual elements
- **Flatpickr**: Date picker component for check-in/check-out selection
- **EmailJS**: Email service integration for contact forms and booking submissions

### Third-party Services
- **EmailJS**: Handles form submissions by sending emails directly from the frontend without requiring a backend server
- **Environment Configuration**: Uses process.env for EmailJS configuration (public key management)

### Browser APIs
- **DOM Manipulation**: Standard browser APIs for element selection and event handling
- **Local Storage**: Potential usage for temporary data persistence (referenced in architecture)

### Development Dependencies
- **No Build Process**: Direct file serving without compilation or bundling
- **Static Hosting Ready**: Designed for deployment on static hosting platforms
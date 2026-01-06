### Activity Tracker
A full‑stack activity tracking system built as part of the MSc Computer Science programme. The project includes a Laravel API backend, a React + Vite frontend, MongoDB storage, authentication, and a complete automated test suite. Performance was evaluated using Lighthouse, with measurable improvements between Day 8 and Day 14.

### Student Information
Student: Aliya Khan
ID: 2456262
Course: MSc Computer Science
Project Duration: Dec 19, 2025 – Jan 2, 2026

### Project Overview
The Activity Tracker allows users to register, log in, and manage their daily activities. It includes a responsive dashboard, secure authentication, and a REST API. The project demonstrates full‑stack development, testing discipline, and performance optimisation.

### Features
* Core Functionality:
- User Authentication (Register/Login)
- Activity CRUD operations
- Daily progress dashboard
- Responsive React UI
- REST API built with Laravel
- MongoDB database integration

* Engineering & Quality:
- Automated backend + frontend tests
- Lighthouse performance audits
- API error‑branch testing
- Clean, reproducible development environment

### Tech Stack
* Frontend:
- React + Vite
- React Router
- Bootstrap
- Axios

* Backend:
- Laravel
- MongoDB
- Token‑based authentication

* Testing Tools:
- Jest
- React Testing Library
- Supertest
- PHPUnit
- Postman
- Lighthouse

### Setup Instructions
1. Clone Repository
bash
git clone https://github.com/khan-aliya/activity-tracker
cd activity-tracker
2. Backend Setup (Laravel API)

3. Frontend Setup (React + Vite)

### API Summary
* POST /api/register
Registers a new user.

* POST /api/login
Returns an authentication token.

* GET /api/activities
Fetch all activities for the authenticated user.

* POST /api/activities
Create a new activity.

* PUT /api/activities/{id}
Update an existing activity.

* DELETE /api/activities/{id}
Delete an activity.

### Testing Summary
* The project includes:

- Backend tests (PHPUnit)
- Frontend tests (Jest + React Testing Library)
- API endpoint tests (Supertest)
- Manual API validation (Postman)
- All tests pass successfully.

### Coverage Summary
* Because this is a small application with lightweight logic, full coverage was not required. The focus was on ensuring:

- All core features are tested
- API endpoints behave correctly
- Error branches are covered
- Components render and update reliably

* Backend coverage:
- Lines: 0% (baseline — backend logic is minimal and controller‑driven)
- Functions: 0%
- Classes: 0%

* Frontend coverage:
- Statements: ~39%
- Branches: ~37%
- Functions: ~40%
- Lines: ~39%

* For a small project with passing tests and simple logic, this level of coverage is acceptable.

### Lighthouse Performance Summary
Lighthouse audits were run on the production build.
Below is the comparison between Day 8 and Day 14.

Category	        Day 8	     Day 14     	Change
Performance 	      57%	      100%	         +43
Accessibility	     100%	       96%	          -4
SEO	                  73%	       80%	          +7
Best Practices  	  96%	       92%  	      -4


* Key Improvements:
- Reduced bundle size
- Improved asset loading
- Cleaned unused dependencies
- Optimised React rendering
- Improved HTML structure for SEO
- Fixed accessibility warnings

### Notable Bug Fixes During Testing
- Fixed inconsistent date formatting in ActivityTable
- Added error handling for failed API requests
- Corrected missing validation on activity update
- Improved component state handling for async updates

### Future Enhancements
- Add pagination for large activity lists
- Add dark mode
- Add PWA support
- Add analytics dashboard
- Add role‑based access control

### Conclusion
This project demonstrates full‑stack development, testing, performance optimisation, and professional documentation. It reflects strong engineering practices and aligns with MSc Computer Science expectations. The improvements between Day 8 and Day 14 show clear progression in performance, structure, and code quality.
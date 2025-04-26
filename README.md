# Nomad

## Remote Workspace Discovery Web Application

A web platform that matches remote workers with optimal workspaces based on their preferences and location.

## Team Members
- **Hiba Mubeen** - Project Manager
- **Sneha Maram** - Designer
- **Arnav Roy** - Frontend Developer
- **Jason Lukose** - Backend Developer
- **Ahan Saripalli** - Full Stack Developer

## Introduction

### Project Overview
Nomad is a remote workspace finder web application that matches users with optimal workspaces based on their preferences and location. The application collects user input regarding their remote working preferences and desired location, then provides recommendations for suitable workspaces.

### Purpose
The purpose of this application is to help remote workers, digital nomads, students, and professionals find ideal workspaces tailored to their specific needs. Post-COVID, there was a massive increase in remote work, and homes are not always the ideal place for productivity. Each individual may look for unique, specific things in their work environment. By streamlining the discovery process, Nomad aims to enhance productivity and satisfaction for remote workers by connecting them with environments that support their work style.

### Target Users
- Remote workers seeking optimal work environments
- Digital nomads looking for workspace options in new locations
- Students needing study spaces
- Professionals requiring temporary workspaces
- Travelers wanting productive environments while on the road

## Features

### Core Features (MVP)
1. **User Preference Input Form**
   - Location input
   - Basic preferences (noise level, wifi, price range, food available)
   - Hours needed (mornings, afternoon, evening)
   - Duration of stay
   - Saved responses

2. **Search Results**
   - List view of matching workspaces from algorithmic preference matching

3. **Workspace Detail View**
   - Card/modal that opens on click
   - Address and map location
   - Opening hours
   - Available amenities
   - Price information
   - Brief description

4. **User Profile**
   - Log in, log out
   - User's email
   - General location
   - Saved workspace preferences
   - Saved workspaces

5. **Basic UX**
   - Simple navigation between search, results, and profile
   - Visual indicators

### Future Enhancements
- AI-powered suggestions rather than algorithmic approach
- Additional map view of matching workspaces
- Enhanced filtering options
- Simple sorting (distance, rating, price)

## Technology Stack

### Frontend
- React.js
- HTML/CSS

### Backend
- Node.js
- Google Places API

### Database
- Firebase (authentication, database storage)

### Infrastructure
- Vercel (hosting)

## System Architecture

- **Login and User Profile**: Contains user's email, general location, and saved workspace preferences
- **Input Processing**: Location, noise level, wifi, price range, food available, hours needed, and duration of stay saved to Firebase
- **Search Flow**: User enters location (geocoded), Python scrapes nearby workspaces and returns results via Node.js backend
- **Authentication**: Firebase Auth handles login, and Firestore stores each user's favorites under their UID
- **Hosting**: Heroku selected for compatibility with non-static websites and Firebase integration

## Non-functional Requirements

### Performance
- Load time < 2 second, ideally <1 second
- Search results returned in <1 second
- Supporting at least 100 users simultaneously

### Usability
- Accessible, follows WCAG 2.1 Level AA
- Intuitive UI requiring no training
- Form completion should be quick, < 1 minute

### Reliability
- System uptime of 99.5% or higher

## Implementation Plan

1. **Phase 1: Design Document**
   - Define purpose & features
   - Conduct user research
   - Create Figma prototype

2. **Phase 2: Environment Setup**
   - Configure Github
   - Download necessary packages
   - Training and learning resources

3. **Phase 3: Coding**
   - Frontend development based on Figma designs
   - Parallel backend development
   - API integration

4. **Phase 4: Merging and Testing**
   - Integrate frontend and backend components
   - Resolve merge conflicts
   - Ensure application works as expected
   - Conduct user testing
   - Gather feedback and input

5. **Phase 5: Deployment/Hosting**
   - Final testing
   - Deploy to production

## Project Management

The project follows a waterfall methodology due to time constraints. This approach ensures careful planning before moving to subsequent phases to avoid time-consuming mistakes.

## User Research Summary

Discovery interviews with various potential users revealed common preferences:
- Quiet to medium noise levels
- Access to food
- WiFi requirements
- Proximity (10-15 minute travel time)
- Printer access (for students)
- Different preferences based on work type (focused vs. collaborative)

---

*This README is part of a case study project for Nomad, a remote workspace discovery web application.*

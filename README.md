# SkillHub - IISERB Student Document Management System

## Overview

SkillHub is a modern, responsive web application designed specifically for students of IISER Bhopal. It serves as a centralized platform to upload, organize, and manage all college-related documents, from academic notes and assignments to skill proofs and certificates. The application features an intuitive user interface with light and dark modes, advanced filtering capabilities, and an integrated AI-powered chatbot to assist users with up-to-date information.

## ✨ Key Features

- **Centralized Document Storage**: A single, organized place for all your academic and skill-related documents.
- **Intuitive Organization**:
    - **Dashboard**: Get a quick overview of all your uploaded files.
    - **Categorized Sections**: Separate views for Skills, Certificates, and Curriculum documents.
    - **Custom Tagging**: Add custom tags to documents for granular organization (e.g., `Physics`, `Midterm`, `Lab Report`).
- **Advanced Search & Filtering**: Quickly find documents by name, or filter them by one or more tags.
- **Smart Sorting**: Sort your documents by upload date or name in ascending or descending order.
- **AI-Powered Chatbot**:
    - Powered by the **Google Gemini API** (`gemini-2.5-flash`).
    - Utilizes **Google Search grounding** to provide answers with up-to-date information from the web.
    - Cites sources for its answers, allowing you to verify information.
- **User Profile Management**: View and update your personal and academic details.
- **Modern UI/UX**:
    - **Responsive Design**: Looks and works great on desktops, tablets, and mobile phones.
    - **Dark Mode**: A beautiful, eye-friendly dark theme for nighttime browsing.
    - **Interactive Modals**: Seamless dialogs for uploading files and viewing document details.
    - **Toast Notifications**: Get instant feedback for actions like deleting a document.
- **Easy Document Upload**:
    - Supports various file types (`pdf`, `docx`, `png`, `jpg`, `txt`).
    - Convenient **drag-and-drop** functionality.
    - File size validation to ensure smooth uploads.

## 🚀 How to Use

1.  **Navigate**: Use the collapsible sidebar on the left to switch between the Dashboard, Skills Earned, Certificates, and Curriculum pages.
2.  **Upload Documents**: Click the "Upload Document" button (the card with a `+` icon) on any document grid to open the upload dialog. You can either click to select a file or drag and drop it into the designated area.
3.  **Add Tags**: While uploading, you can add custom tags to help you organize and find your document later. Simply type a tag and press `Enter`.
4.  **Find Your Files**: Use the search bar to look for a document by its name. Use the tag buttons to filter the view and show only the documents that match the selected tags.
5.  **View & Manage**: Click on any document card to open the File Viewer. From there, you can view, download, or delete the document.
6.  **Ask the AI Assistant**: Click the chat icon in the bottom-right corner to open the SkillHub Assistant. Ask it any question, and it will use its knowledge and Google Search to give you an informed answer.
7.  **Switch Themes**: Use the sun/moon icon in the header to instantly toggle between light and dark modes.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI & Grounding**: Google Gemini API
- **File Handling**: (Demonstration) File uploads are simulated and handled locally using browser APIs (`URL.createObjectURL`) for this version.

### A Note on the Development Environment

This project utilizes the **Tailwind CSS Play CDN** for rapid development and styling. This approach is excellent for prototyping within this environment as it requires no build step.

#### Production Recommendation
For a production-ready application, it is highly recommended to install Tailwind CSS as a PostCSS plugin or use the Tailwind CLI. This enables crucial build-time optimizations, such as purging unused CSS, which significantly reduces the final stylesheet size and improves load performance for end-users. You can find more details in the [official Tailwind CSS documentation](https://tailwindcss.com/docs/installation).
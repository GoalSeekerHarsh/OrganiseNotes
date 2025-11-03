import { mockDocuments } from '../data/mockData';
import type { UserProfile, Document } from '../types';

// This is our simulated User type for the "database"
interface User {
  profile: UserProfile;
  password: string; // Storing plaintext password for this simulation. In a real app, this would be a hash.
  documents: Document[];
}

const DB_KEY = 'skillhub_users';

// Helper to get all users from localStorage
function getUsers(): Record<string, User> {
  try {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Could not parse user data from localStorage", error);
    return {};
  }
}

// Helper to save all users to localStorage
function saveUsers(users: Record<string, User>): void {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Could not save user data to localStorage", error);
  }
}

/**
 * Simulates user login and registration.
 * If the user exists, it validates the password.
 * If the user does not exist, it creates a new account (registration) with the provided credentials
 * and populates it with initial mock data.
 * @returns The full User object on success, or null on failure (e.g., wrong password).
 */
export function loginOrRegisterUser(email: string, password: string): User | null {
  const users = getUsers();
  const lowerCaseEmail = email.toLowerCase();

  if (users[lowerCaseEmail]) {
    // User exists, so this is a login attempt
    if (users[lowerCaseEmail].password === password) {
      return users[lowerCaseEmail]; // Password matches, successful login
    } else {
      return null; // Incorrect password
    }
  } else {
    // User does not exist, so this is a registration
    const rollNumber = lowerCaseEmail.split('@')[0];
    const newUser: User = {
      profile: {
        name: `Student ${rollNumber}`,
        rollNumber: rollNumber,
        email: lowerCaseEmail,
        major: 'Not set',
        yearOfStudy: 'Not set',
        contact: 'Not set',
        avatarUrl: 'S',
      },
      password: password,
      documents: mockDocuments, // Give new users the mock documents to start with
    };
    users[lowerCaseEmail] = newUser;
    saveUsers(users);
    return newUser;
  }
}

/**
 * Retrieves a user's data from storage.
 */
export function getUser(email: string): User | null {
    const users = getUsers();
    const lowerCaseEmail = email.toLowerCase();
    return users[lowerCaseEmail] || null;
}

/**
 * Updates a user's documents in storage.
 */
export function updateUserDocuments(email: string, documents: Document[]): void {
  const users = getUsers();
  const lowerCaseEmail = email.toLowerCase();
  if (users[lowerCaseEmail]) {
    users[lowerCaseEmail].documents = documents;
    saveUsers(users);
  }
}

/**
 * Updates a user's profile in storage.
 */
export function updateUserProfile(email: string, profile: UserProfile): void {
  const users = getUsers();
  const lowerCaseEmail = email.toLowerCase();
  if (users[lowerCaseEmail]) {
    users[lowerCaseEmail].profile = profile;
    saveUsers(users);
  }
}

/**
 * Mock User Database Service
 * Simulates secure user storage with encryption at rest
 */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email?: string;
  role: 'VOTER';
  createdAt: string;
}

// In-memory storage (in production, this would be encrypted in a secure database)
const users: User[] = [];

/**
 * Simple mock encryption (in production, use proper encryption)
 * This is a mock implementation for demonstration only
 */
function encryptData(data: string): string {
  // Mock encryption - simple encoding for demonstration
  // In production, use proper encryption libraries like react-native-encrypted-storage
  // or expo-crypto for React Native
  const encoded = data.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  return `ENC_${encoded}`;
}

function decryptData(encrypted: string): string {
  // Mock decryption
  if (!encrypted.startsWith('ENC_')) {
    return encrypted; // Fallback for backwards compatibility
  }
  const hexString = encrypted.substring(4);
  const decoded = hexString.match(/.{2}/g)?.map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
  return decoded || '';
}

/**
 * Create a new voter account
 */
export async function createVoterAccount(data: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email?: string;
}): Promise<{ success: boolean; userId?: string; error?: string }> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if user already exists (by phone or email)
  const existingUser = users.find(
    u => u.phoneNumber === data.phoneNumber || (data.email && u.email === data.email)
  );

  if (existingUser) {
    return {
      success: false,
      error: 'An account with this phone number or email already exists.',
    };
  }

  // Create new user
  const userId = `USER${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const newUser: User = {
    id: userId,
    firstName: encryptData(data.firstName), // Encrypt at rest
    lastName: encryptData(data.lastName),
    dateOfBirth: encryptData(data.dateOfBirth),
    phoneNumber: encryptData(data.phoneNumber),
    email: data.email ? encryptData(data.email) : undefined,
    role: 'VOTER',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  return {
    success: true,
    userId,
  };
}

/**
 * Get user by phone or email (for login verification)
 */
export async function getUserByPhoneOrEmail(
  phoneOrEmail: string
): Promise<User | null> {
  // In production, this would query encrypted database
  const user = users.find(
    u =>
      decryptData(u.phoneNumber) === phoneOrEmail ||
      (u.email && decryptData(u.email) === phoneOrEmail)
  );

  return user || null;
}

/**
 * Get decrypted user data (for display purposes)
 */
export function getDecryptedUserData(user: User): Omit<User, 'id' | 'createdAt' | 'role'> & {
  id: string;
  createdAt: string;
  role: string;
} {
  return {
    id: user.id,
    firstName: decryptData(user.firstName),
    lastName: decryptData(user.lastName),
    dateOfBirth: decryptData(user.dateOfBirth),
    phoneNumber: decryptData(user.phoneNumber),
    email: user.email ? decryptData(user.email) : undefined,
    role: user.role,
    createdAt: user.createdAt,
  };
}


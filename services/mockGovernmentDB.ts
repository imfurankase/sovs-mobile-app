/**
 * Mock Government Database Service
 * Simulates querying official government database
 */

export interface GovernmentData {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string
  phoneNumber: string;
  email?: string;
}

/**
 * Mock government database
 * In production, this would query actual government API
 */
const mockDatabase: Record<string, GovernmentData> = {
  // Pre-populated mock records for testing
  'NID1234567890': {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-05-15',
    phoneNumber: '+1234567890',
    email: 'john.doe@example.com',
  },
  'NID0987654321': {
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1985-03-22',
    phoneNumber: '+1987654321',
    email: undefined,
  },
  'NID5555555555': {
    firstName: 'Alice',
    lastName: 'Johnson',
    dateOfBirth: '1992-11-08',
    phoneNumber: '+1555555555',
    email: 'alice.j@example.com',
  },
};

/**
 * Query government database by National ID Number
 */
export async function fetchGovernmentData(
  nationalIdNumber: string
): Promise<GovernmentData | null> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Check if record exists
  if (mockDatabase[nationalIdNumber]) {
    return { ...mockDatabase[nationalIdNumber] };
  }

  // For other IDs, generate random data (simulating successful lookup)
  // In production, return null if not found
  const generateRandom = Math.random() > 0.3; // 70% chance of finding data

  if (generateRandom) {
    const firstNames = ['Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa'];
    const lastNames = ['Brown', 'Davis', 'Wilson', 'Moore', 'Taylor', 'Anderson'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return {
      firstName,
      lastName,
      dateOfBirth: `${1970 + Math.floor(Math.random() * 30)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      phoneNumber: `+1${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`,
      email: Math.random() > 0.5 ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com` : undefined,
    };
  }

  return null; // User not found
}


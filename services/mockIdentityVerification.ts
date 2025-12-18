/**
 * Mock Identity Verification Service
 * Simulates third-party identity verification SDK
 */

export interface IdentityVerificationRequest {
  selfieImage: string; // base64 or URI
  idImage: string; // base64 or URI
}

export interface IdentityVerificationResponse {
  success: boolean;
  nationalIdNumber?: string;
  error?: string;
}

/**
 * Mock identity verification
 * In production, this would call a third-party SDK
 */
export async function verifyIdentity(
  request: IdentityVerificationRequest
): Promise<IdentityVerificationResponse> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock: 80% success rate for demonstration
  const isSuccess = Math.random() > 0.2;

  if (isSuccess) {
    // Generate a mock national ID number
    const nationalIdNumber = `NID${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`;
    return {
      success: true,
      nationalIdNumber,
    };
  } else {
    return {
      success: false,
      error: 'Verification failed. Please ensure your ID is valid and your photo is clear.',
    };
  }
}


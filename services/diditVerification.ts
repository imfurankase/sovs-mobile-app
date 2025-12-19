/**
 * Didit Identity Verification Service
 * Calls the Didit API via edge function to verify identity documents
 */

export interface DiditVerificationRequest {
  frontImage: string; // URI or base64
  backImage?: string; // URI or base64 (optional)
  performDocumentLiveness?: boolean;
  vendorData?: string; // User ID or identifier
}

export interface DiditVerificationResponse {
  success: boolean;
  request_id?: string;
  status?: string;
  data?: {
    document_type?: string | null;
    document_number?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
    date_of_birth?: string | null;
    age?: number | null;
    expiration_date?: string | null;
    date_of_issue?: string | null;
    gender?: string | null;
    address?: string | null;
    place_of_birth?: string | null;
    nationality?: string | null;
    issuing_state?: string | null;
    issuing_state_name?: string | null;
    portrait_image?: string | null;
  };
  warnings?: any[];
  critical_warnings?: boolean;
  has_critical_data?: boolean;
  error?: string | null;
}

/**
 * Convert image URI to File object for FormData
 */
async function uriToFile(uri: string, name: string): Promise<File> {
  try {
    // If it's a data URI (base64), convert it
    if (uri.startsWith('data:')) {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new File([blob], name, { type: blob.type });
    }
    
    // If it's a file URI, fetch it
    const response = await fetch(uri);
    const blob = await response.blob();
    return new File([blob], name, { type: blob.type || 'image/jpeg' });
  } catch (error) {
    throw new Error(`Failed to convert image URI to File: ${error}`);
  }
}

/**
 * Verify identity using Didit API via edge function
 */
export async function verifyIdentityWithDidit(
  request: DiditVerificationRequest
): Promise<DiditVerificationResponse> {
  try {
    const { FUNCTIONS_BASE_URL } = await import('./supabase');
    
    // Convert image URIs to Files
    const frontFile = await uriToFile(request.frontImage, 'front_image.jpg');
    const formData = new FormData();
    formData.append('front_image', frontFile);
    
    if (request.backImage) {
      const backFile = await uriToFile(request.backImage, 'back_image.jpg');
      formData.append('back_image', backFile);
    }
    
    if (request.performDocumentLiveness !== undefined) {
      formData.append('perform_document_liveness', request.performDocumentLiveness.toString());
    }
    
    if (request.vendorData) {
      formData.append('vendor_data', request.vendorData);
    }

    // Call edge function
    const response = await fetch(`${FUNCTIONS_BASE_URL}/didit-verify`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Verification failed',
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to verify identity',
    };
  }
}

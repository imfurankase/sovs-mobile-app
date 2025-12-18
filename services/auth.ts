import { supabase, FUNCTIONS_BASE_URL } from './supabase';
import { usersAPI } from './api';

/**
 * Register a new user with Supabase Auth and add to users table
 */
export async function registerUser(data: {
  phoneNumber: string;
  email?: string;
  name: string;
  surname: string;
  dateOfBirth: string;
  password?: string;
}): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    // Step 1: Add user to users table via cloud function first
    // This creates the user record in our database
    let userId: string | undefined;
    
    try {
      const userResponse = await usersAPI.create({
        phone_number: data.phoneNumber,
        email: data.email,
        name: data.name,
        surname: data.surname,
        date_of_birth: data.dateOfBirth,
        status: 'pending',
      });
      
      userId = userResponse.user_id;
    } catch (err: any) {
      // Check if user already exists
      if (err.message && err.message.includes('duplicate') || err.message.includes('unique')) {
        // User already exists, try to get their ID
        const existingUser = await usersAPI.getByPhoneOrEmail(data.phoneNumber);
        if (existingUser) {
          userId = existingUser.user_id;
        } else {
          return { success: false, error: 'User already exists but could not retrieve user ID' };
        }
      } else {
        return { success: false, error: err.message || 'Failed to create user record' };
      }
    }

    // Step 2: Create user in Supabase Auth for authentication
    // Generate a temporary password if not provided
    const password = data.password || `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Use email if available, otherwise create a placeholder email for phone-based auth
    const authEmail = data.email || `${data.phoneNumber.replace(/[^0-9]/g, '')}@sovs.local`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: authEmail,
      password: password,
      options: {
        data: {
          name: `${data.name} ${data.surname}`,
          phone_number: data.phoneNumber,
          user_id: userId, // Link to our users table
        },
      },
    });

    if (authError) {
      // If auth user already exists, that's okay - we still have the user in our table
      if (authError.message.includes('already registered')) {
        console.log('Auth user already exists, but user record created successfully');
        return { success: true, userId };
      }
      
      // For other errors, log but don't fail since user is in our table
      console.error('Auth signup error (non-critical):', authError.message);
    }

    return { success: true, userId };
  } catch (error: any) {
    return { success: false, error: error.message || 'Registration failed' };
  }
}

/**
 * Send OTP for phone/email login
 */
export async function sendOTP(phoneOrEmail: string): Promise<{ success: boolean; error?: string }> {
  try {
    const isEmail = phoneOrEmail.includes('@');
    
    if (isEmail) {
      // Send magic link for email
      const { error } = await supabase.auth.signInWithOtp({
        email: phoneOrEmail,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } else {
      // Send OTP for phone
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneOrEmail,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to send OTP' };
  }
}

/**
 * Verify OTP and sign in
 */
export async function verifyOTP(
  phoneOrEmail: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const isEmail = phoneOrEmail.includes('@');
    
    if (isEmail) {
      // For email, token is the OTP code
      const { data, error } = await supabase.auth.verifyOtp({
        email: phoneOrEmail,
        token: token,
        type: 'email',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } else {
      // For phone, token is the OTP code
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneOrEmail,
        token: token,
        type: 'sms',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'OTP verification failed' };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Sign out failed' };
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}


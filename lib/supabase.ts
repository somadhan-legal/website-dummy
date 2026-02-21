// Supabase Client Configuration
// Project: somadhan-waitlist
// Region: ap-southeast-1

const SUPABASE_URL = 'https://jlltjzwukpsuykfdixlx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbHRqend1a3BzdXlrZmRpeGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTMwNDIsImV4cCI6MjA4MzE4OTA0Mn0.-HEQ8V4qElOtP4VzuAOS24Oqc9P7wZUvmE7lUoO7HYo';

// Types for waitlist submissions
export interface WaitlistSubmission {
  full_name: string;
  email: string;
  phone?: string;
  profession: string;
  services: string[];
  heard_from?: string;
  feedback?: string;
}

export interface WaitlistResponse {
  success: boolean;
  error?: string;
  data?: any;
}

// Submit waitlist form data to Supabase
export async function submitWaitlist(data: WaitlistSubmission): Promise<WaitlistResponse> {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
        profession: data.profession,
        services: data.services,
        heard_from: data.heard_from || null,
        feedback: data.feedback || null
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle duplicate email error
      if (response.status === 409 || errorData?.code === '23505') {
        return { success: false, error: 'email_exists' };
      }

      return { success: false, error: errorData?.message || 'submission_failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Waitlist submission error:', error);
    return { success: false, error: 'network_error' };
  }
}

// Check if an email is already registered
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_submissions?email=eq.${encodeURIComponent(email)}&select=email`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      return false; // Fail open - if we can't check, let them try to submit
    }

    const data = await response.json();
    return data && data.length > 0;
  } catch (error) {
    console.error('Email check error:', error);
    return false;
  }
}

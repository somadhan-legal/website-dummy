// Vercel Cron Job: Pings Supabase daily to prevent free-tier auto-pause
// Scheduled via vercel.json crons config

const SUPABASE_URL = 'https://jlltjzwukpsuykfdixlx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbHRqend1a3BzdXlrZmRpeGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTMwNDIsImV4cCI6MjA4MzE4OTA0Mn0.-HEQ8V4qElOtP4VzuAOS24Oqc9P7wZUvmE7lUoO7HYo';

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simple SELECT to keep the database active
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/waitlist_submissions?select=id&limit=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(500).json({
        status: 'error',
        message: 'Supabase ping failed',
        details: errorData,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Supabase keep-alive ping successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}

const { createClient } =
require('@supabase/supabase-js')

const supabase = createClient(
    'https://xewuseromhjoeirdvogw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhld3VzZXJvbWhqb2VpcmR2b2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2OTUxNjgsImV4cCI6MjA5MTI3MTE2OH0.FlGWhJtHmNxcANmYp_WzMm-eRxm0IqvEeajWDjlt-Bw'
)

module.exports = supabase
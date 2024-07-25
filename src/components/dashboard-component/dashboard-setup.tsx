import { Subscription } from '@/lib/supabase/supabase.types';
import { AuthUser } from '@supabase/supabase-js';
import React from 'react'
interface DashboardSetupProps {
    user: AuthUser;
    subscription: Subscription | null;
  }
function DashboardSetup({user,subscription}:DashboardSetupProps) {
  return (
    <div>DashboardSetup</div>
  )
}

export default DashboardSetup
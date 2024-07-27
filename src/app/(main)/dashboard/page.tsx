import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { cookies } from 'next/headers';
import db from '@/lib/supabase/db';
import { redirect } from 'next/navigation';
import DashboardSetup from '@/components/dashboard-component/dashboard-setup';
import { getUserSubscriptionStatus } from '@/lib/supabase/queries';
import { AppStateProvider } from '@/lib/providers/state-provider';

const DashboardPage = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const workspace = await db.query.workspaces.findFirst({
    where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id),
  });

  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  if (subscriptionError) return;

  if (!workspace)
    return (
     <AppStateProvider>
       <div
        className="bg-background
        h-screen
        w-screen
        flex
        justify-center
        items-center
  "
      >
        <DashboardSetup
          user={user}
          subscription={subscription}
        />
      </div>
     </AppStateProvider>
    );

  redirect(`/dashboard/${workspace.id}`);
};

export default DashboardPage;
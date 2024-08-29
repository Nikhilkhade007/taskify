'use client';
import { MAX_FOLDERS_FREE_PLAN } from '@/lib/constants';
import { useAppState } from '@/lib/providers/state-provider';
import { Subscription } from '@/lib/supabase/supabase.types';
import React, { useEffect, useState } from 'react';
import { Progress } from '../ui/progress';
import Diamond from '../../../public/diamond.svg';
import Image from 'next/image';

interface PlanUsageProps {
  foldersLength: number;
  subscription: Subscription | null;
}

const PlanUsage: React.FC<PlanUsageProps> = ({ foldersLength, subscription }) => {
  const { workspaceId, state } = useAppState();
  const [usagePercentage, setUsagePercentage] = useState(
    (foldersLength / MAX_FOLDERS_FREE_PLAN) * 100
  );

  useEffect(() => {
    const stateFoldersLength = state.workspaces.find(
      (workspace) => workspace.id === workspaceId
    )?.folders.length;
    if (stateFoldersLength !== undefined) {
      setUsagePercentage((stateFoldersLength / MAX_FOLDERS_FREE_PLAN) * 100);
    }
  }, [state, workspaceId]);


  const isFreePlan = subscription?.status !== 'active';

  return (
    <article className="mb-4">
      {isFreePlan && (
        <>
          <div className="flex gap-2 text-muted-foreground mb-2 items-center">
            <div className="h-4 w-4">
              <Image src={Diamond} alt='Diamond logo'/>
            </div>
            <div className="flex justify-between w-full items-center">
              <div>Free Plan</div>
              <small>{usagePercentage.toFixed(0)}% / 100%</small>
            </div>
          </div>
          <Progress value={usagePercentage} className="h-1" />
        </>
      )}
    </article>
  );
};

export default PlanUsage;

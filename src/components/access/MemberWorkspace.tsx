import React from 'react';
import { ContingentUserProfile, OperationsPhaseState } from '../../types';
import { PhaseAwareContingentDashboard } from '../dashboard/PhaseAwareContingentDashboard';

interface MemberWorkspaceProps {
  currentUser: ContingentUserProfile;
  phaseState?: OperationsPhaseState;
  onNavigateTab?: (tabId: string) => void;
  onOpenAdminWorkspace?: (tab?: string) => void;
  onOpenChecklistTab?: () => void;
}

export const MemberWorkspace: React.FC<MemberWorkspaceProps> = ({
  currentUser,
  phaseState,
  onNavigateTab,
  onOpenAdminWorkspace,
  onOpenChecklistTab
}) => {
  const fallbackPhase: OperationsPhaseState = phaseState || {
    activePhaseId: 'phase_03'
  };

  const handleNavigate = (tabId: string) => {
    if (tabId === 'checklist' && onOpenChecklistTab) {
      onOpenChecklistTab();
    } else if (onNavigateTab) {
      onNavigateTab(tabId);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <PhaseAwareContingentDashboard
        currentUser={currentUser}
        phaseState={fallbackPhase}
        onNavigateTab={handleNavigate}
        onOpenAdminWorkspace={onOpenAdminWorkspace}
        isCompactModal={true}
      />
    </div>
  );
};

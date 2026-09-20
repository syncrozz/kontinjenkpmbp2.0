export interface EventDetail {
  id: string;
  title: string;
  category: string;
  theme: string;
  participantsCount: string;
  venue: string;
  dateStr: string;
  submissionDeadline?: string;
  description: string;
  rules: string[];
  submissionItems?: string[];
  elementsInfo?: {
    mandatory: string[];
    additionalTitle: string;
    additionalOptions: string[];
  };
  durationInfo?: {
    performanceTime: string;
    setupCleanupTime: string;
    totalTime: string;
    warning: string;
  };
  eventTentative?: {
    date: string;
    items: { time: string; title: string; venue: string }[];
  }[];
  backgroundHistory?: string;
  importantReminder?: {
    deadline: string;
    items: string[];
    competitionDate: string;
    competitionTime: string;
    venue: string;
  };
  advisors?: string[];
  leadAdvisor?: string;
  leadAdvisorPhone?: string;
  leadAdvisorWhatsApp?: string;
  rubric?: {
    component: string;
    percentage: number;
    description: string;
  }[];
  notes?: string;
  iconName: string;
}

export interface ContingentMemberGroup {
  role: string;
  count: number;
  description: string;
  icon: string;
  responsibilities: string[];
}

export interface ScheduleItem {
  id: string;
  day: number;
  date: string;
  time: string;
  title: string;
  venue: string;
  category: 'Teater' | 'Muzik' | 'Tarian' | 'Dakwah' | 'Logistik' | 'Majlis' | 'Semua';
  description: string;
}

export interface ChecklistItem {
  id: string;
  category: 'Logistik' | 'Dokumen' | 'Peralatan' | 'Kebajikan' | 'Teknikal';
  title: string;
  targetRole: 'Pegawai' | 'Pelajar' | 'Pemandu' | 'Semua';
  completed: boolean;
}

export interface RuleGuideline {
  title: string;
  category: string;
  content: string[];
}

export type SoarPhaseId =
  | 'phase_01'
  | 'phase_02'
  | 'phase_03'
  | 'phase_04'
  | 'phase_05'
  | 'phase_06';

export interface SoarPhaseConfig {
  id: SoarPhaseId;
  phaseNumber: string;
  title: string;
  subtitle: string;
  period: string;
  statusBadge: string;
  priorityFocus: string;
  description: string;
  keyObjectives: string[];
  recommendedTab: string;
  ctaText: string;
  ctaTab: string;
  colorScheme: {
    badgeBg: string;
    badgeText: string;
    border: string;
    accent: string;
    glow: string;
    lightBg: string;
  };
}

export interface DashboardModuleVisibility {
  events: boolean;
  contingentOverview: boolean;
  schedule: boolean;
  calculator: boolean;
  checklist: boolean;
  talent: boolean;
  guidelines: boolean;
  deadlines: boolean;
}

export interface OperationsPhaseState {
  activePhaseId: SoarPhaseId;
  announcement?: string;
  visibleModules?: Partial<DashboardModuleVisibility>;
  updatedAt?: string;
  updatedBy?: string;
}

// Contingent Access System Roles (SES v5.0)
export type ContingentUserRole = 'public' | 'member' | 'pic' | 'advisor' | 'admin';

export interface ContingentUserProfile {
  role: ContingentUserRole;
  name: string;
  title: string;
  badge: string;
  email?: string;
  eventAssigned?: string;
  accessGrantedAt?: string;
}

export interface AccessRoleDefinition {
  role: ContingentUserRole;
  label: string;
  title: string;
  category: string;
  passcode: string;
  altCode?: string;
  colorScheme: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
    badgeText: string;
  };
  description: string;
  privileges: string[];
}

// Structured Competition Reference Documents
export type ReferenceCategory = 
  | 'official_organizer_rules' 
  | 'contingent_internal_guidelines' 
  | 'admin_operational_instructions' 
  | 'event_preparation_tasks';

export type ProvenanceSourceType = 'official_organizer_rule' | 'internal_operational_requirement';

export interface TraceableChecklistItem {
  id: string;
  taskText: string;
  sourceType: ProvenanceSourceType;
  sourceDocument: string;
  sourceClause?: string;
  deadline?: string;
  responsibleRole: string;
  mandatory?: boolean;
}

export interface SubmissionDeadlineInfo {
  item: string;
  date: string;
  time?: string;
  submissionChannel: string;
  penaltyIfLate?: string;
}

export interface EventSpecificRequirements {
  quotaRule: string;
  durationLimits?: string;
  technicalSpecifications?: string[];
  stagingOrVenue?: string;
  syariahAttireRule?: string;
  aiPolicyRule?: string;
  disqualificationPenalties?: string[];
}

export interface ReferenceClause {
  id: string;
  clauseNumber?: string;
  heading: string;
  text: string;
  details?: string[];
  mandatory?: boolean;
  penaltyNote?: string;
  deadline?: string;
  venue?: string;
  tags?: string[];
  sourceType?: ProvenanceSourceType;
  sourceDocument?: string;
}

export interface StructuredReferenceItem {
  sectionId: string;
  sectionTitle: string;
  targetEvent?: string;
  targetRole?: string;
  officialDocumentRef: string;
  documentVersion: string;
  publicationDate: string;
  documentStatus: 'Rasmi & Berkuat Kuasa' | 'Pindaan Terkini Disahkan' | 'Operasi Aktif';
  submissionDeadlines?: SubmissionDeadlineInfo[];
  eventRequirements?: EventSpecificRequirements;
  clauses: ReferenceClause[];
  checklistItems?: TraceableChecklistItem[];
}

export interface StructuredReferenceSection {
  id: string;
  category: ReferenceCategory;
  categoryLabel: string;
  categoryEnglish: string;
  authoritySource: string;
  documentRef: string;
  documentVersion: string;
  publicationDate: string;
  documentStatus: 'Rasmi & Berkuat Kuasa' | 'Pindaan Terkini Disahkan' | 'Operasi Aktif';
  description: string;
  badgeColor: string;
  accentColor: string;
  iconName: string;
  items: StructuredReferenceItem[];
}

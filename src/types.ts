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

export interface History {
  id: number;
  userId?: string;
  category: string;
  project: string;
  subject: string;
  description: string;
  historyStartDate: string;
  historyEndDate: string;
  historySkill: string[];
}

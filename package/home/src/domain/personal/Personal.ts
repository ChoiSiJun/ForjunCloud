export interface Personal {
  userId?: string;
  name: string;
  job: string;
  profileImageId: string | null;
  profileImageUrl: string | null;
  education?: string;
  gradePointAverage?: string;
  introduction?: string;
  awards?: PersonalAwards[];
  companies?: PersonalCompany[];
  skills?: PersonalSkill[];
  certificates?: PersonalCertificate[];
}

export interface PersonalCompany {
  companyName: string;
  startDate: string;
  endDate: string;
}

export interface PersonalAwards {
  awardName: string;
}

export interface PersonalSkill {
  skillCategory: string;
  skillName: string;
}

export interface PersonalCertificate {
  certificateName: string;
  certificateAcquisitionOrganization: string;
  certificateAcquisitionDate: string;
}

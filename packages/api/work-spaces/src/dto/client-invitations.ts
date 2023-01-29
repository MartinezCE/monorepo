export interface ClientInvitationDTO {
  companyId: number;
  emails: { email: string; firstName?: string; lastName?: string }[];
}

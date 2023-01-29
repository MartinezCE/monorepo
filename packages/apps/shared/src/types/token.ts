import { JwtPayload } from 'jsonwebtoken';

export type ClientInvitationToken = JwtPayload & {
  invitationId: number;
  email: string;
  companyId: number;
};

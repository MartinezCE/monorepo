export type ClientInvitation = {
  invitations: {
    id: number;
    toEmail: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
  }[];
  alreadyRegisteredUsers: {
    inCompany: string[];
    notInCompany: string[];
  };
};

export type SeatsAvailability = {
  totalSeats: number;
  seatsAvailable: number;
};

export type SelectRoles = {
  label: string;
  value: number;
  description: string;
};

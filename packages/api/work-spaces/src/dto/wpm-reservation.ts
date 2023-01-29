export interface WPMReservationDTO {
  blueprintId: number;
  reservations: {
    seatId: number;
    typeId?: number;
    startAt: Date;
    endAt?: Date;
    userId: number;
  }[];
}

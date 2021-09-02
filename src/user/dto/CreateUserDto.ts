export class CreateUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  firebaseUid: string;
  telegramNotification?: boolean;
  viberNotification?: boolean;
  phoneNotification?: boolean;
}

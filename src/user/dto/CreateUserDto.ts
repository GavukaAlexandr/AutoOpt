export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  telegramNotification?: boolean;
  viberNotification?: boolean;
  phoneNotification?: boolean;
}

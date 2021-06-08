import { User } from "../entities/User";

interface IProfileMapper {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export class ProfileMap {
  static toDTO({
    id,
    name,
    email,
    created_at,
    updated_at,
  }: User): IProfileMapper {
    return {
      id,
      name,
      email,
      created_at,
      updated_at,
    };
  }
}

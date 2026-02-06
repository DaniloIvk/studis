import bcrypt from 'bcrypt';
import Seeder from '../../app/core/database/Seeder';
import { Role } from '../prisma/enums';
import { UserCreateInput } from '../prisma/models';

class UserSeeder extends Seeder {
  public run() {
    const users = [...admins, ...students, ...professors];
    //const password = this.getPassword();

    const data = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(this.getPasswordForRole(user.role!), 12)
    })) as UserCreateInput[];

    return this.database.user.createMany({ data });
  }

   private getPasswordForRole(role: Role): string {
    switch (role) {
      case Role.ADMIN:
        return 'admin123';
      case Role.PROFESSOR:
        return 'prof123';
      case Role.STUDENT:
        return 'student123';
      default:
        return 'password123';
    }
  }

//  private populateUserPasswords(
//    users: Partial<UserCreateInput>[],
//    password: string
//  ): Partial<UserCreateInput>[] {
//    return users.map((user) => ({ ...user, password }));
//  }
//
//  private getPassword(): string {
//    return bcrypt.hashSync('', 12);
//  }
//}
}
const admins: Partial<UserCreateInput>[] = [
  {
    role: Role.ADMIN,
    firstName: 'Admin',
    email: 'admin@example.com',
    emailVerifiedAt: new Date(),
  },
];

const professors: Partial<UserCreateInput>[] = [
  {
    role: Role.PROFESSOR,
    firstName: 'Mirko',
    lastName: 'Kosanovic',
    email: 'prof@example.com',
    emailVerifiedAt: new Date(),
  },
];

let students: Partial<UserCreateInput>[] = [
  {
    role: Role.STUDENT,
    index: 'ITS 01/24',
    email: 'its0124@atvssnis.edu.rs',
    firstName: 'Marko',
    lastName: 'Vlasić',
    parentName: 'Živomir',
    address: 'Alekse Pantića 25/4',
    phoneNumber: '067 548 5475',
  },
  {
    role: Role.STUDENT,
    index: 'ITS 12/23',
    email: 'its1223@atvssnis.edu.rs',
    firstName: 'Milica',
    lastName: 'Jovanović',
    parentName: 'Dragan',
    address: 'Bulevar Nemanjića 45',
    phoneNumber: '064 123 4567',
  },
  {
    role: Role.STUDENT,
    index: 'RT 05/22',
    email: 'rt0522@atvssnis.edu.rs',
    firstName: 'Nikola',
    lastName: 'Petrović',
    parentName: 'Zoran',
    address: 'Vožda Karađorđa 12/2',
    phoneNumber: '063 987 6543',
  },
  {
    role: Role.STUDENT,
    index: 'EL 33/24',
    email: 'el3324@atvssnis.edu.rs',
    firstName: 'Jelena',
    lastName: 'Nikolić',
    parentName: 'Goran',
    address: 'Knjaževačka 101',
    phoneNumber: '065 223 3445',
  },
  {
    role: Role.STUDENT,
    index: 'ITS 55/23',
    email: 'its5523@atvssnis.edu.rs',
    firstName: 'Stefan',
    lastName: 'Đorđević',
    parentName: 'Milan',
    address: 'Obrenovićeva 15',
    phoneNumber: '060 555 1122',
  },
  {
    role: Role.STUDENT,
    index: 'RT 18/21',
    email: 'rt1821@atvssnis.edu.rs',
    firstName: 'Ana',
    lastName: 'Ilić',
    parentName: 'Dejan',
    address: 'Vizantijski bulevar 88',
    phoneNumber: '061 444 9988',
  },
  {
    role: Role.STUDENT,
    index: 'ITS 09/24',
    email: 'its0924@atvssnis.edu.rs',
    firstName: 'Luka',
    lastName: 'Stojanović',
    parentName: 'Aleksandar',
    address: 'Dušanova 55/1',
    phoneNumber: '069 888 7766',
  },
  {
    role: Role.STUDENT,
    index: 'EL 99/22',
    email: 'el9922@atvssnis.edu.rs',
    firstName: 'Sofija',
    lastName: 'Pavlović',
    parentName: 'Nenad',
    address: 'Pantelejska 32',
    phoneNumber: '062 111 2233',
  },
  {
    role: Role.STUDENT,
    index: 'RT 41/23',
    email: 'rt4123@atvssnis.edu.rs',
    firstName: 'Filip',
    lastName: 'Kovačević',
    parentName: 'Slobodan',
    address: 'Bulevar Zorana Đinđića 19',
    phoneNumber: '066 333 4455',
  },
  {
    role: Role.STUDENT,
    index: 'ITS 102/24',
    email: 'its10224@atvssnis.edu.rs',
    firstName: 'Katarina',
    lastName: 'Marković',
    parentName: 'Ivan',
    address: 'Somborska 4',
    phoneNumber: '064 999 0011',
  },
  {
    role: Role.STUDENT,
    index: 'EPO 05/24',
    email: 'epo0524@atvssnis.edu.rs',
    firstName: 'Lazar',
    lastName: 'Popović',
    parentName: 'Miodrag',
    address: 'Bulevar 12. februara 33',
    phoneNumber: '063 555 8899',
  },
  {
    role: Role.STUDENT,
    index: 'ITS 77/22',
    email: 'its7722@atvssnis.edu.rs',
    firstName: 'Marija',
    lastName: 'Ristić',
    parentName: 'Vladimir',
    address: 'Sremska 12',
    phoneNumber: '065 111 4477',
  },
  {
    role: Role.STUDENT,
    index: 'RT 02/23',
    email: 'rt0223@atvssnis.edu.rs',
    firstName: 'Miloš',
    lastName: 'Stanković',
    parentName: 'Predrag',
    address: 'Generala Milojka Lešjanina 5',
    phoneNumber: '061 222 3366',
  },
  {
    role: Role.STUDENT,
    index: 'EL 15/21',
    email: 'el1521@atvssnis.edu.rs',
    firstName: 'Dunja',
    lastName: 'Krstić',
    parentName: 'Nebojša',
    address: 'Prijezdina 8/3',
    phoneNumber: '064 777 2255',
  },
  {
    role: Role.STUDENT,
    index: 'ITS 42/24',
    email: 'its4224@atvssnis.edu.rs',
    firstName: 'Nemanja',
    lastName: 'Janković',
    parentName: 'Branislav',
    address: 'Vojvode Mišića 50',
    phoneNumber: '069 333 6699',
  },
  {
    role: Role.STUDENT,
    index: 'EPO 88/23',
    email: 'epo8823@atvssnis.edu.rs',
    firstName: 'Teodora',
    lastName: 'Simić',
    parentName: 'Marko',
    address: 'Cara Dušana 99',
    phoneNumber: '062 888 5522',
  },
  {
    role: Role.STUDENT,
    index: 'RT 50/22',
    email: 'rt5022@atvssnis.edu.rs',
    firstName: 'Vuk',
    lastName: 'Andrejević',
    parentName: 'Dušan',
    address: 'Zetska 21',
    phoneNumber: '060 444 7711',
  },
  {
    role: Role.STUDENT,
    index: 'EL 07/24',
    email: 'el0724@atvssnis.edu.rs',
    firstName: 'Sara',
    lastName: 'Mitrović',
    parentName: 'Darko',
    address: 'Hajduk Veljkova 14/5',
    phoneNumber: '066 999 1144',
  },
  {
    role: Role.STUDENT,
    index: 'ITS 19/23',
    email: 'its1923@atvssnis.edu.rs',
    firstName: 'Aleksandar',
    lastName: 'Cvetković',
    parentName: 'Bojan',
    address: 'Dragiše Cvetkovića 42',
    phoneNumber: '063 123 9876',
  },
  {
    role: Role.STUDENT,
    index: 'RT 95/24',
    email: 'rt9524@atvssnis.edu.rs',
    firstName: 'Iva',
    lastName: 'Živković',
    parentName: 'Slaviša',
    address: 'Rentgenova 2',
    phoneNumber: '064 567 8901',
  },
];

export default UserSeeder;

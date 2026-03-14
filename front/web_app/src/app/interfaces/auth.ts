export interface User {
  id: string;
  username: string;
  ime: string;
  prezime: string;
  email: string;
  idUlogeAplikacija: number;
  status: number;
  passwordHash: string;
  passwordSalt: string;
  imageURL: string | undefined;
  phoneNumber: string;
  specijalizacija: string;
  opis: string;
}

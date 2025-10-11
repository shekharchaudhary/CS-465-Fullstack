export interface Trip {
  code: string;
  name: string;
  length: string;
  start: string | Date;
  resort: string;
  perPerson: string;
  image: string;
  description: string;
  _id?: string;
}


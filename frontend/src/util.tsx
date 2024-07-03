export interface contact {
    id?: string;
    name: string;
    title: string;
    email: string;
    address: string;
    phone: string;
    status: string;
    photoUrl?: string;
}

export interface dataElement {
    totalElements: number;
    totalPages: number;
    content: contact[];
    numberOfElements: number;
  }
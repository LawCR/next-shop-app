export interface IUser {
    _id: string
    name: string;
    lastname: string;
    email: string;
    password?: string;
    role: string;
    
    createdAt?: string;
    updatedAt?: string;
}
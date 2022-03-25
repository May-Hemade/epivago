interface IUser {
    name: string
    avatar: string,
    email: string,
    password: string,
    role: string,
    timestamps:boolean,
    _id:string
}

interface Error {
    status: number,
    errorsList:string
}

interface Request {
    status: number
}

interface Response {
    status: number | string
}


interface IPayload {
    _id:number,
    role:string
}

interface IAccomodation {
    name: string,
    maxGuests: number,
    description: string,
    city: string,
    host: IUser,
}

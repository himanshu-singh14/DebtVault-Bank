class User {
  constructor(
    public name: string,
    public mobileNumber: number,
    public password: any,
    public email: string | null = null,
    public address: string | null = null,
    public dateOfBirth: string | null = null,
    public isLoggedIn: boolean = true,
    public createdAt: string | null = null,
    public updatedAt: string | null = null
  ) {}
}

export default User;
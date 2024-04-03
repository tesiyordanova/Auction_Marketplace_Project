interface UserDTO {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: File;
  }

  export default UserDTO;
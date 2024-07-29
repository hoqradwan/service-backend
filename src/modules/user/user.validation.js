export  const  validateUserInput = (name, email, password) => {
    if (!name || !email || !password) {
      return { isOk: false, message: "Please fill all the fields" };
    }
    if (!password?.length || password.length < 5) {
      return { isOk: false, message: "Password must be at least 5 characters" };
    }
    return null;
  }
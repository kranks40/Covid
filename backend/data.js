import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "Oketo",
      email: "admin@example.com",
      password: bcrypt.hashSync("1234", 8),
    },
    {
      name: "mellia",
      email: "user@example.com",
      password: bcrypt.hashSync("1234", 8),
    },
  ],
};

export default data;

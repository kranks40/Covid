import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      //signin has three parameters, user object, json webtoken secrets,
      //jwt secrets is like a key to encrypt your data and generate a token
      // it's a secure data so don't keep it here to be seen. you need to
      //put it in a .env file and .env package
      //the last parameter is options
    },
    process.env.JWT_SECRET || "something secret",
    {
      expiresIn: "3d",
    }
  );
};

export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
      //the slice function gets rid of the first 6 parts of the token and takes from the 7th digit
      const token = authorization.slice(7, authorization.length);
      //jwt is used to decrypt the token using verify then the second parameter is the JWT secrect.If token doesn't exist then use "somethingsecret"
      jwt.verify(
        token,
        process.env.JWT_SECRET || "something secret",
        (error, decode) => {
          if (error) {
            res.status(401).send({ message: "Invalid Token" });
          } else {
            req.user = decode;
            next();
          }
        }
      );
    } else {
      res.status(401).send({ message: "No Token" });
    }
  };
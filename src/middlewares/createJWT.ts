const jwt = require("jsonwebtoken");

const key = process.env.JWT_KEY_PRIVATE as string;

export const createJWT = (payload: any) => {
  try {
    const token = jwt.sign(payload, key, {
      expiresIn: "2d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

export const createRefreshToken = (payload: any) => {
  try {
    const token = jwt.sign(payload, key, {
      expiresIn: "2d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};


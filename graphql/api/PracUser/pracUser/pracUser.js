import PracUser from "../../../model/PracUser";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import express from "express";
import cookieParser from "cookie-parser";

export default {
  Mutation: {
    getUserForLogin: async (_, args) => {
      const { userId, userPassword } = args;

      try {
        let cipher = crypto.createHash("sha512");

        cipher.update(userPassword);
        const encPassword = cipher.digest("hex");

        const result = await PracUser.findOne({
          userId,
          userPassword: encPassword,
        });

        if (result) {
          const app = express();
          app.use(cookieParser());
          const token = jwt.sign({ result }, process.env.PRIVATE_KEY, {
            expiresIn: "5d",
          });

          const resCookie = app.use("/", (req, res, next) => {
            res.cookie("login", token, { httpOnly: true });
            next();
          });
          return {
            loginResult: true,
            userData: token,
          };
        } else {
          return {
            loginResult: false,
            userData: "",
          };
        }
      } catch (e) {
        console.log(e);
        return {
          loginResult: false,
          userData: {},
        };
      }

      // const { userId, userPassword } = args;

      // try {
      //   let cipher = crypto.createHash("sha512");

      //   cipher.update(userPassword);
      //   const encPassword = cipher.digest("hex");

      //   const result = await PracUser.findOne({
      //     userId,
      //     userPassword: encPassword,
      //   });

      //   console.log(result);

      //   if (result) {
      //     const token = jwt.sign({ result }, process.env.PRIVATE_KEY, {
      //       expiresIn: "7d",
      //     });
      //     return {
      //       loginResult: true,
      //       userData: token,
      //     };
      //   } else {
      //     return {
      //       loginResult: false,
      //       userData: {},
      //     };
      //   }
      // if (result.length === 0) {
      //   return {
      //     loginResult: false,
      //     userData: {},
      //   };
      // }
      // return {
      //   loginResult: true,
      //   userData: result[0],
      // };
      // 암호키 생성
      // arg 같은 매개변수 중 쿠키를 제어 할 수 있는 변수를 찾아 암호키를 넣어준다.
      // } catch (e) {
      //   console.log(e);
      //   return {
      //     loginResult: false,
      //     userData: {},
      //   };
      // }
    },

    createUser: async (_, args) => {
      const {
        userId,
        userPassword,
        name,
        mobile,
        email,
        zoneCode,
        address,
        detailAddress,
      } = args;
      try {
        const prevResult = await PracUser.find({ userId });

        let cipher = crypto.createHash("sha512");

        cipher.update(userPassword);
        const encPassword = cipher.digest("hex");

        if (prevResult.length !== 0) {
          console.log(`Exist User Id`);
        } else {
          const result = await PracUser.create({
            userId,
            userPassword: encPassword,
            name,
            mobile,
            email,
            zoneCode,
            address,
            detailAddress,
          });
          return true;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    },

    updateUser: async (_, args) => {
      const {
        id,
        userId,
        // userPassword,
        name,
        mobile,
        email,
        zoneCode,
        address,
        detailAddress,
      } = args;
      try {
        const result = await PracUser.updateOne(
          {
            _id: id,
          },
          {
            $set: {
              userId,
              //   userPassword,
              name,
              mobile,
              email,
              zoneCode,
              address,
              detailAddress,
            },
          }
        );

        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },

    deleteUser: async (_, args) => {
      const { id } = args;
      try {
        const result = await PracUser.deleteOne({
          _id: id,
        });

        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
  Query: {
    getCookie: async (_, args) => {
      const { cookieToken } = args;
      try {
        const token = await jwt.verify(cookieToken, process.env.PRIVATE_KEY);
        console.log(token);
        return {
          _id: token.result._id,
          userId: token.result.userId,
          userPassword: token.result.userPassword,
        };
      } catch (e) {
        console.log(e);
        return {};
      }
    },

    getAllUsers: async (_, args) => {
      try {
        const result = await PracUser.find();

        return result;
      } catch (e) {
        console.log(e);
        return [];
      }
    },

    getUserDetail: async (_, args) => {
      const { id } = args;
      try {
        const result = await PracUser.findOne({ _id: id });

        return result;
      } catch (e) {
        console.log(e);
        return {};
      }
    },

    getUserByUserId: async (_, args) => {
      const { userId } = args;
      try {
        const prevResult = await PracUser.find({ userId });
        if (prevResult) {
          return false;
        } else {
          return true;
        }
      } catch (e) {
        console.log(e);
        return {};
      }
    },

    getUserForId: async (_, args) => {
      const { id, password } = args;
      try {
        const result = await PracUser.findOne({
          userId: id,
          userPassword: password,
        });

        return result;
      } catch (e) {
        console.log(e);
        return {};
      }
    },
  },
};

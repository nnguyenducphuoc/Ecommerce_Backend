const shopModel = require("../models/shop.model.");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");

const roleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // st1: check email exists??
      // lean tra ve object js thuan, giup query nhanh hon, giam tai size cua object nho hon gan 30 lan
      // neu ko co lean se return ve object cua mongoC (co thong tin ko can thiet nhu thong tin ket noi,..)
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxx",
          message: "Email already exists",
        };
      }
      // hash password 10: bam 10 lan, cang nhieu cang anh huong cpu
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [roleShop.SHOP],
      });

      if (newShop) {
        // created privateKey (ko luu -> sign token) and publicKey (luu -> verify token)
        // dung thuat toan bat doi xung rsa
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });

        console.log({ privateKey, publicKey }); // save collection keystore
        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });
        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "publicKeyString error",
          };
        }
      }
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;

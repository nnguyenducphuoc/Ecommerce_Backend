const shopModel = require("../models/shop.model.");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");

const roleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // try {
    // st1: check email exists??
    // lean tra ve object js thuan, giup query nhanh hon, giam tai size cua object nho hon gan 30 lan
    // neu ko co lean se return ve object cua mongoC (co thong tin ko can thiet nhu thong tin ket noi,..)
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered!!");
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
      // cach1: bao mat cao, dung thuat toan bat doi xung
      // created privateKey (ko luu -> sign token) and publicKey (luu -> verify token)
      // dung thuat toan bat doi xung rsa
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1", // Public key Cryptographic Standards 1
      //     format: "pem", //
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1", // Public key Cryptographic Standards 1
      //     format: "pem", //
      //   },
      // });

      // cach 2:don gian hon
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey, publicKey }); // save collection keystore
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new BadRequestError("Error: publicKeyString error!!");
        // return {
        //   code: "xxxx",
        //   message: "publicKeyString error",
        // };
      }
      // console.log(`publicKeyString::`, publicKeyString);
      // const publicKeyObject = crypto.createPublicKey(publicKeyString);
      // console.log(`publicKeyObject::`, publicKeyObject);
      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log(`created token success:: `, tokens);
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
    // } catch (error) {
    //   return {
    //     code: "xxx",
    //     message: error.message,
    //     status: "error",
    //   };
    // }
  };
}

module.exports = AccessService;

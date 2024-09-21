const { keys } = require("lodash");
const keyTokenModel = require("../models/keytoken.model");
const {
  Types: { ObjectId },
} = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // publicKey sinh ra tu thuat toan rsa, no la buffer, chua dc hash, phai duc ve string roi moi
      // luu vao database de ko bi loi
      // const publicKeyString = publicKey.toString();
      // level 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      // return tokens ? tokens.publicKey : null;

      // level xx
      const filter = {
        user: userId,
      };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = {
        upsert: true,
        new: true,
      };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new ObjectId(userId) }).lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne(new ObjectId(id)).lean();
  };
}

module.exports = KeyTokenService;

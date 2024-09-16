const keyTokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      // publicKey sinh ra tu thuat toan rsa, no la buffer, chua dc hash, phai duc ve string roi moi
      // luu vao database de ko bi loi
      const publicKeyString = publicKey.toString();
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;

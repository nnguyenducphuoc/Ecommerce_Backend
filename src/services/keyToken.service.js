const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      // publicKey sinh ra tu thuat toan rsa, no la buffer, chua dc hash, phai duc ve string roi moi
      // luu vao database de ko bi loi
      const publicKeyString = publicKey.toString();
      const tokens = await keytokenModel.created({
        user: userId,
        publicKey: publicKeyString,
      });

      return tokens ? publicKeyString : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;

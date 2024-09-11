class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::signUp::`, req.body);
      //   200: OK
      //   201: CREATED
      return res.status(200).json({
        code: "20001",
        metadata: { userId: 1 },
      });
    } catch (e) {
      next(e);
    }
  };
}

module.exports = new AccessController();

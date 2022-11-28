const router = require("express").Router();
const User = require("../models/userModel");
const Certification = require("../models/certificationModel");
const jwt = require("jsonwebtoken");

router.get("/getallmy", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400)
      .json({ errorMessage: "אינך מחובר"});

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    const certifications = await Certification.find({ CrewM: userr });
    res.json(certifications);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/getmyCertificate/:id", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400)
      .json({ errorMessage: "אינך מחובר"});

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    const certification = await Certification.findById(req.params.id);

    if(certification.CrewM.toJSON() != userr._id.toJSON())
      return res.status(400)
        .json({ errorMessage: "אינך יכול לצפות בהסמכה זו מכיוון שאינה שלך"});

    let josnres = certification.toJSON();

    res.json(josnres);
  } catch (err) {
    console.log("Error on sending certification: /n"+err)
    res.status(401).send();
  }
});


module.exports = router;

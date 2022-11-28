const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/addnewCrewmByComm", async (req, res) => {
  try {
    const {
      iMA,
      password,
      passwordVerify,
      FirstName,
      LastName,
      NickName,
      CourseNo,
      BirthDate,
      Email,
      MainPhone,
      EmergencyPhone,
      AddressCity,
      AddressLine,
      Rank,
      Unit,
      SoogHatsava,
      Maslool,
      Dereg,
    } = req.body;

    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    if (userr.Role === "DIRECT" || userr.Role === "KAHAD") {
      if (
        !iMA ||
        !password ||
        !passwordVerify ||
        !Dereg ||
        !FirstName ||
        !Unit ||
        !CourseNo ||
        !LastName ||
        !SoogHatsava ||
        !Rank ||
        !Maslool
      )
        return res
          .status(400)
          .json({ errorMessage: "אחד או יותר משדות החובה לא התקבלו" });

      docuser = await User.findOne({ MA: iMA });
      if (docuser != null)
        if (docuser.MA == iMA)
          return res.status(400).json({ errorMessage: "משתמש כבר קיים" });

      if (password.length < 1)
        return res.status(400).json({
          errorMessage: "לא ניתן להשתמש בסיסמה ריקה",
        });

      if (password !== passwordVerify)
        return res.status(400).json({
          errorMessage: "סיסמאות לא תואמות",
        });

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      const Role = "SCREW";
      const MA = iMA;
      const MyComm = userr._id;

      let Deregg;
      if (Dereg === "א'") Deregg = "a";
      if (Dereg === "ב'") Deregg = "b";
      if (Dereg === "ג'") Deregg = "c";
      if (Dereg === "ד'") Deregg = "d";

      let Maslooll;
      if (Maslool === "תעבורה") Maslooll = "taavura";
      if (Maslool === "משימה") Maslooll = "mesima";
      if (Maslool === "ורסטילי") Maslooll = "versatili";
      if (Maslool === "הכשרה") Maslooll = "ha";

      let Hatsavaa;
      if (SoogHatsava === 'הצ"ח') Hatsavaa = "hatsach";
      if (SoogHatsava === "מילואים") Hatsavaa = "miluim";
      if (SoogHatsava === "סדיר") Hatsavaa = "sadir";

      const newUser = new User({
        MA,
        passwordHash,
        Role,
        MyComm,
        FirstName: FirstName,
        LastName: LastName,
        NickName: NickName,
        CourseNo: CourseNo,
        BirthDate: BirthDate,
        Email: Email,
        MainPhone: MainPhone,
        EmergencyPhone: EmergencyPhone,
        AddressCity: AddressCity,
        AddressLine: AddressLine,
        Rank: Rank,
        Unit: Unit,
        SoogHatsava: Hatsavaa,
        Maslool: Maslooll,
        Dereg: Deregg,
      });

      console.log("NM " + newUser.NickName);

      const saveduserr = await newUser.save();
      res.json(saveduserr);
    } else {
      return res.status(401).json({
        errorMessage: "ניסית להוסיף איש צוות תחת פיקודך אך אינך מחובר כמפקד גף",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.put("/takeCrewmbyComm", async (req, res) => {
  try {
    const { iMA } = req.body;

    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    if (userr.Role === "DIRECT") {
      if (!iMA)
        return res.status(400).json({ errorMessage: "מספר אישי לא התקבל" });

      docuser = await User.findOne({ MA: iMA });
      if (docuser == null)
        if (docuser.MA != iMA)
          return res.status(400).json({ errorMessage: "משתמש לא קיים" });

      if (docuser.Role != "CREWM")
        return res
          .status(400)
          .json({ errorMessage: "משתמש לא מוגדר כאיש צוות" });

      docuser.MyComm = userr._id;

      const saveduserr = await userr.save();

      res.json(saveduserr);
    } else {
      return res.status(401).json({
        errorMessage: "ניסית לקחת פיקוד על איש צוות אך אינך מחובר כמפקד גף",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.put("/changemypass", async (req, res) => {
  try {
    const { iMA } = req.body;

    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    const { dereg, pass, pass2 } = req.body;

    if (pass.length < 1)
      return res.status(400).json({
        errorMessage: "לא ניתן להשתמש בסיסמה ריקה",
      });

    if (pass !== pass2)
      return res.status(400).json({
        errorMessage: "סיסמאות לא תואמות",
      });

    const salt = await bcrypt.genSalt();
    const ph = await bcrypt.hash(pass, salt);

    userr.passwordHash = ph;

    if (dereg) userr.Dereg = dereg;

    const saveduserr = await userr.save();

    res.json({ SUC: "YES" });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.put("/takeCommbyAuth", async (req, res) => {
  try {
    const { iMA } = req.body;

    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    if (userr.Role === "AUTHCO") {
      if (!iMA)
        return res.status(400).json({ errorMessage: "מספר אישי לא התקבל" });

      docuser = await User.findOne({ MA: iMA });
      if (docuser == null)
        if (docuser.MA != iMA)
          return res.status(400).json({ errorMessage: "משתמש לא קיים" });

      if (docuser.Role != "DIRECT")
        return res.status(400).json({ errorMessage: "משתמש לא מוגדר מפקד גף" });

      docuser.MyAuth = userr._id;

      const saveduserr = await userr.save();

      res.json(saveduserr);
    } else {
      return res.status(401).json({
        errorMessage:
          "ניסית לקחת פיקוד מפקד מקצועי שוטף אך אינך מחובר כמפקד יחידה",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/addnewCommByAuth", async (req, res) => {
  try {
    const { iMA, password, passwordVerify } = req.body;

    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    if (userr.Role === "AUTHCO") {
      if (!iMA || !password || !passwordVerify)
        return res
          .status(400)
          .json({ errorMessage: "מספר אישי או שתי סיסמאות לא התקבלו" });

      docuser = await User.findOne({ MA: iMA });
      if (docuser != null)
        if (docuser.MA == iMA)
          return res.status(400).json({ errorMessage: "משתמש כבר קיים" });

      if (password.length < 1)
        return res.status(400).json({
          errorMessage: "לא ניתן להשתמש בסיסמה ריקה",
        });

      if (password !== passwordVerify)
        return res.status(400).json({
          errorMessage: "סיסמאות לא תואמות",
        });

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      const Role = "DIRECT";
      const MA = iMA;
      const MyAuth = user._id;

      const newUser = new User({ MA, passwordHash, Role, MyAuth });

      const saveduserr = await newUser.save();

      res.json(saveduserr);
    } else {
      return res.status(401).json({
        errorMessage:
          "ניסית להוסיף מפקד גף תחת פיקודך אך אינך מחובר כמפקד מאשר",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.put("/makeAnyCommByAuth", async (req, res) => {
  try {
    const { iMA } = req.body;

    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    if (userr.Role === "AUTHCO") {
      if (!iMA)
        return res.status(400).json({ errorMessage: "מספר אישי לא התקבל" });

      docuser = await User.findOne({ MA: iMA });
      if (docuser == null)
        if (docuser.MA != iMA)
          return res.status(400).json({ errorMessage: "משתמש לא קיים" });

      docuser.Role = "DIRECT";
      docuser.MyComm = undefined;
      docuser.MyAuth = userr._id;

      const saveduserr = await userr.save();

      res.json(saveduserr);
    } else {
      return res.status(401).json({
        errorMessage:
          "ניסית למנות משתמש כלשהו למפקד גף תחת פיקודך אך אינך מחובר כמפקד מאשר",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.put("/makeAnyAuthByAuth", async (req, res) => {
  try {
    const { iMA } = req.body;

    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    if (userr.Role === "AUTHCO") {
      if (!iMA)
        return res.status(400).json({ errorMessage: "מספר אישי לא התקבל" });

      docuser = await User.findOne({ MA: iMA });
      if (docuser == null)
        if (docuser.MA != iMA)
          return res.status(400).json({ errorMessage: "משתמש לא קיים" });

      docuser.Role = "AUTHCO";
      docuser.MyComm = undefined;
      docuser.MyAuth = undefined;

      const saveduserr = await userr.save();

      res.json(saveduserr);
    } else {
      return res.status(401).json({
        errorMessage:
          "ניסית למנות משתמש כלשהו להיות מפקד מאשר כמוך אך אינך בעצמך",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/getmypeople", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    if (userr.Role === "DIRECT") {
      allusers = await User.find();
      for (let i = 0; i < allusers.length; i++) {
        if (!allusers[i].MyComm || allusers[i].MyComm.toString() != userr._id) {
          allusers.splice(i, 1);
          i--;
        }
      }
      res.json(allusers);
    } else {
      return res.status(401).json({
        errorMessage: "ניסיתי לבדוק מי הם אנשיך כמפקד גף אך אינך מפקד גף",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/getmypeopleM", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    if (
      userr.Role === "DIRECT" ||
      userr.Role === "SCHOOL" ||
      userr.Role === "S420" ||
      userr.Role === "AUTHCO"
    ) {
      allusers = await User.find();
      for (let i = 0; i < allusers.length; i++) {
        if (userr.Role === "DIRECT")
          if (
            !allusers[i].MyComm ||
            allusers[i].MyComm.toString() != userr._id
          ) {
            allusers.splice(i, 1);
            i--;
          }
        if (userr.Role === "AUTCO")
          if (
            !allusers[i].MyAuth ||
            allusers[i].MyAuth.toString() != userr._id
          ) {
            allusers.splice(i, 1);
            i--;
          }
        if (userr.Role === "SCHOOL")
          if (
            !allusers[i].MyTutor ||
            allusers[i].MyTutor.toString() != userr._id
          ) {
            allusers.splice(i, 1);
            i--;
          }
        if (userr.Role === "S420")
          if (false) {
            allusers.splice(i, 1);
            i--;
          }
      }
      allusers.unshift(userr);
      res.json(allusers);
    } else {
      return res.status(401).json({
        errorMessage: "ניסיתי לבדוק מי הם אנשיך כמפקד גף אך אינך מפקד גף",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/getmypeopleba", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    if (userr.Role === "AUTHCO") {
      allusers = await User.find();
      for (let i = 0; i < allusers.length; i++) {
        if (!allusers[i].MyAuth || allusers[i].MyAuth.toString() != userr._id) {
          allusers.splice(i, 1);
          i--;
        }
      }
      res.json(allusers);
    } else {
      return res.status(401).json({
        errorMessage: "ניסיתי לבדוק מי הם אנשיך כמפקד יחידה אך אינך מפקד יחידה",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/gethistfud/:id", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    if (userr.Role === "DIRECT") {
      const crewmm = await User.findById(req.params.id);
      //if (crewmm.MyComm.toString() === userr._id.toString())
      res.json(crewmm);
      /*  else
        return res.status(401).json({
          errorMessage: "ניסיתי לקבל פרטים של פקוד בגף אך אינך מפקד גף שלו",
        }); */ ///   נותן למפקדי גפים מידע על מפקדי יחידות וכו'
    } else {
      return res.status(401).json({
        errorMessage: "ניסיתי לקבל פרטים של פקוד בגף אך אינך מפקד בכללי",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  try {
    const { MA, password } = req.body;

    if (!MA || !password)
      return res
        .status(400)
        .json({ errorMessage: "מספר אישי או סיסמה לא התקבלו" });

    const existingUser = await User.findOne({ MA });
    if (!existingUser)
      return res.status(401).json({ errorMessage: "משתמש לא קיים" });

    if (!existingUser.passwordHash)
      return res
        .status(401)
        .json({ errorMessage: "סיסמתך שגויה כי אינה קיימת" });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!passwordCorrect)
      return res.status(401).json({ errorMessage: "סיסמתך שגויה" });

    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWTSECRET
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite:
          process.env.NODE_ENV === "development"
            ? "lax"
            : process.env.NODE_ENV === "production" && "none",
        secure:
          process.env.NODE_ENV === "development"
            ? false
            : process.env.NODE_ENV === "production" && true,
      })
      .send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      sameSite:
        process.env.NODE_ENV === "development"
          ? "lax"
          : process.env.NODE_ENV === "production" && "none",
      secure:
        process.env.NODE_ENV === "development"
          ? false
          : process.env.NODE_ENV === "production" && true,
      expires: new Date(0),
    })
    .send();
});

router.get("/loggedIn", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    res.json(userr);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ errorMessage: "אינך מחובר" });
  }
});

router.get("/getFullDetails", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    res.json(userr);
  } catch (err) {
    res.status(401).send();
  }
});

router.get("/getFullDetailsE/:ma", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findOne({ MA: req.params.ma });

    res.json(userr);
  } catch (err) {
    res.status(401).send();
  }
});

router.get("/getnn/:id", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findOne({ _id: req.params.id });

    res.json({ nn: userr.NickName });
  } catch (err) {
    res.status(401).send();
  }
});

router.get("/getNachsal", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    if (!validatedUser)
      return res.status(400).json({ errorMessage: "תפקידך לא מוגדר" });

    const resa = await User.find({ MA: { $exists: true } });

    for (let i = 0; i < resa.length; i++) {
      delete resa[i]["_id"];
      delete resa[i]["fitnesses"];
      delete resa[i]["Role"];
      delete resa[i]["Certifications"];
      delete resa[i]["__v"];
      delete resa[i]["passwordHash"];
    }

    res.json(resa);
  } catch (err) {
    console.log(err);
    res.status(401).send();
  }
});

router.put("/updateFullDetails", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      nickname,
      courseno,
      birthdate,
      email,
      mainphone,
      emergencyphone,
      addresscity,
      addressline,
      rank,
      unit,
      soogHatsava,
      maslool,
    } = req.body;

    if (!firstname)
      return res.status(400).json({ errorMessage: "נא למלא שם פרטי" });

    if (!lastname)
      return res.status(400).json({ errorMessage: "נא למלא שם משפחה" });

    if (!courseno)
      return res.status(400).json({ errorMessage: "נא למלא מספר קורס" });

    if (!birthdate)
      return res.status(400).json({ errorMessage: "נא למלא תאריך לידה" });

    if (!email)
      return res
        .status(400)
        .json({ errorMessage: "נא למלא כתובת דואר אלקטרוני" });

    if (!mainphone)
      return res.status(400).json({ errorMessage: "נא למלא מספר טלפון" });

    if (!addresscity)
      return res.status(400).json({ errorMessage: "עיר מגורים" });
    addressline;

    if (!addressline)
      return res.status(400).json({ errorMessage: "נא למלא כתובת מגורים" });

    if (!rank) return res.status(400).json({ errorMessage: "נא למלא דרגה" });

    if (!unit) return res.status(400).json({ errorMessage: "נא לבחור יחידה" });

    if (!soogHatsava)
      return res.status(400).json({ errorMessage: "נא לבחור סוג הצבה" });

    if (!maslool)
      return res.status(400).json({ errorMessage: "נא לבחור מסלול" });

    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    userr.FirstName = firstname;
    userr.LastName = lastname;
    userr.NickName = nickname;
    userr.CourseNo = courseno;
    userr.BirthDate = birthdate;
    userr.Email = email;
    userr.MainPhone = mainphone;
    userr.EmergencyPhone = emergencyphone;
    userr.AddressCity = addresscity;
    userr.AddressLine = addressline;
    userr.Rank = rank;
    userr.Unit = unit;
    userr.SoogHatsava = soogHatsava;
    userr.Maslool = maslool;

    const saveduserr = await userr.save();

    res.json(saveduserr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "נתונים לא תקינים" });
  }
});

router.put("/updateFullDetails2/:ma", async (req, res) => {
  try {
    const {
      Isb,
      Isk,
      authx,
      commx,
      schlx,
      rolex,
      firstname,
      lastname,
      nickname,
      courseno,
      birthdate,
      email,
      mainphone,
      emergencyphone,
      addresscity,
      addressline,
      rank,
      unit,
      soogHatsava,
      maslool,
      dereg,
    } = req.body;

    if (!firstname)
      return res.status(400).json({ errorMessage: "נא למלא שם פרטי" });

    if (!lastname)
      return res.status(400).json({ errorMessage: "נא למלא שם משפחה" });

    if (!courseno)
      return res.status(400).json({ errorMessage: "נא למלא מספר קורס" });

    if (!birthdate)
      return res.status(400).json({ errorMessage: "נא למלא תאריך לידה" });

    if (!email)
      return res
        .status(400)
        .json({ errorMessage: "נא למלא כתובת דואר אלקטרוני" });

    if (!mainphone)
      return res.status(400).json({ errorMessage: "נא למלא מספר טלפון" });

    if (!addresscity)
      return res.status(400).json({ errorMessage: "עיר מגורים" });
    addressline;

    if (!addressline)
      return res.status(400).json({ errorMessage: "נא למלא כתובת מגורים" });

    if (!rank) return res.status(400).json({ errorMessage: "נא למלא דרגה" });

    if (!unit) return res.status(400).json({ errorMessage: "נא לבחור יחידה" });

    if (!soogHatsava)
      return res.status(400).json({ errorMessage: "נא לבחור סוג הצבה" });

    if (!maslool)
      return res.status(400).json({ errorMessage: "נא לבחור מסלול" });

    if (!dereg)
      return res.status(400).json({ errorMessage: "נא לבחור דרג מקצועי" });

    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    let caneditextra = false;

    if (
      (authx || commx || schlx || rolex) &&
      (userr.Role === "DIRECT" || userr.Role === "AUTHCO")
    )
      caneditextra = true;

    if (
      userr.Role === "KAHAD" ||
      userr.Role === "DIRECT" ||
      userr.Role === "AUTHCO"
    ) {
      const userrr = await User.findOne({ MA: req.params.ma });

      userrr.Isb = Isb;
      userrr.Isk = Isk;
      userrr.FirstName = firstname;
      userrr.LastName = lastname;
      userrr.NickName = nickname;
      userrr.CourseNo = courseno;
      userrr.BirthDate = birthdate;
      userrr.Email = email;
      userrr.MainPhone = mainphone;
      userrr.EmergencyPhone = emergencyphone;
      userrr.AddressCity = addresscity;
      userrr.AddressLine = addressline;
      userrr.Rank = rank;
      userrr.Unit = unit;
      userrr.SoogHatsava = soogHatsava;
      userrr.Maslool = maslool;
      userrr.Dereg = dereg;

      if (caneditextra) {
        userrr.MyAuth = await getid(authx /* .split("").reverse().join("") */);
        userrr.MyComm = await getid(commx /* .split("").reverse().join("") */);
        userrr.MyTutor = await getid(schlx /* .split("").reverse().join("") */);

        if (rolex === "איש צוות") userrr.Role = "SCREW";
        if (rolex === "מפקד גף") userrr.Role = "DIRECT";
        if (rolex === "מפקד יחידה") userrr.Role = "AUTHCO";
        if (rolex === "מנהל כח אדם") userrr.Role = "KAHAD";
        if (rolex === "מבצעים") userrr.Role = "PAKMATS";
        if (rolex === "מפקד הכשרה") userrr.Role = "SCHOOL";
        if (rolex === "מפקד הכשרה 420") userrr.Role = "S420";
      }

      async function getid(nn) {
        try {
          if (nn !== "ללא") {
            const res = await User.find({ NickName: nn });

            let s = res[0]._id.toString();

            return s;
          } else return null;
        } catch (e) {
          return null;
        }
      }

      const saveduserr = await userrr.save();

      res.json(saveduserr);
    } else
      return res
        .status(400)
        .json({ errorMessage: "אינך מנהל כח אדם או מפקד גף/יחידה" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "נתונים לא תקינים" });
  }
});

router.get("/getauths", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    if (userr.Role === "DIRECT" || userr.Role === "AUTHCO") {
      allusers = await User.find();
      for (let i = 0; i < allusers.length; i++) {
        if (allusers[i].Role !== "AUTHCO") {
          allusers.splice(i, 1);
          i--;
        }
      }
      res.json(allusers);
    } else {
      return res.status(401).json({
        errorMessage: "אינך מפקד גף או יחידה",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/getdirects", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    if (userr.Role === "DIRECT" || userr.Role === "AUTHCO") {
      allusers = await User.find();
      for (let i = 0; i < allusers.length; i++) {
        if (allusers[i].Role !== "DIRECT") {
          allusers.splice(i, 1);
          i--;
        }
      }
      res.json(allusers);
    } else {
      return res.status(401).json({
        errorMessage: "אינך מפקד גף או יחידה",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/getschlls", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET);

    const userr = await User.findById(validatedUser.user);

    if (userr.Role === "DIRECT" || userr.Role === "AUTHCO") {
      allusers = await User.find();
      for (let i = 0; i < allusers.length; i++) {
        if (allusers[i].Role !== "SCHOOL") {
          allusers.splice(i, 1);
          i--;
        }
      }
      res.json(allusers);
    } else {
      return res.status(401).json({
        errorMessage: "אינך מפקד גף או יחידה",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
module.exports = router;

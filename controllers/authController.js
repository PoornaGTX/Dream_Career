import User from "../models/User.js";

const register = async (req, res) => {
  const { firstName, lastName, email, password, type } = req.body;

  if (!firstName || !lastName || !email || !password || !type) {
    return res.status(400).json({ error: "Please provide all values" });
  }

  const userAlreadyExsisits = await User.findOne({ email });

  if (userAlreadyExsisits) {
    return res.status(401).json({ error: "userAlreadyExsisits" });
  }

  const user = await User.create({
    firstName,
    email,
    password,
    lastName,
    type,
  });

  res.status(201).json({
    user: {
      email: user.email,
      type: user.type,
      lastName: user.lastName,
      location: user.location,
      firstName: user.firstName,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide all values" });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ error: "invalid Credentials" });
  }

  const userEnteredHashedpassword = crypto
    .createHash("sha1")
    .update(password)
    .digest("hex");

  const isPasswordCorrect = userEnteredHashedpassword === user.password;

  if (!isPasswordCorrect) {
    return res.status(401).json({ error: "invalid Credentials" });
  }

  const token = user.createJWT();
  user.password = undefined;

  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

const updateUser = async (req, res) => {
  const { email, firstName, lastName, location } = req.body;
  if (!email || !firstName || !lastName || !location) {
    return res.status(400).json({ error: "Please provide all values" });
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  res.status(200).json({ user, location: user.location });
};

export { register, login, updateUser };

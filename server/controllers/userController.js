const subscription = require("../models/subscription");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const GetClients = async (req, res) => {
  try {
    const users = await User.find({ isCoach: false });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const GetCoaches = async (req, res) => {
  try {
    const users = await User.find({ isCoach: true });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const ApproveCoach = async (req, res) => {
  const coachId = req.params.id;

  try {
    await User.findByIdAndUpdate(coachId, { Approved: true });

    res.status(200).json({ message: "Coach has been approved!" });
  } catch (err) {
    res.status(500).json({ error: "Failed To Approve Coach" });
  }
};

const AssignCoach = async (req, res) => {
  const clientId = req.body.clientId;
  const coachId = req.body.coachId;

  try {
    await User.findByIdAndUpdate(clientId, { assignedCoachId: coachId });

    const coach = await User.findById(coachId);

    await User.findByIdAndUpdate(coachId, {
      numOfClients: coach.numOfClients + 1,
    });

    await subscription.findOneAndUpdate(
      { clientId: clientId },
      { coachId: coachId }
    );

    res.status(200).json({ message: "Coach has been assigned successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed To Assign Coach" });
  }
};

const GetUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (id.length < 24 || id.length > 24) {
      return res.status(404).json({ message: "user not found!" });
    }

    const result = await User.findById(id);

    if (!result) {
      return res.status(404).json({ message: "user not found!" });
    }

    const { password, ...otherInfo } = result._doc;

    res.status(200).json(otherInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const EditUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.body;

    if (user.password) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }

    await User.findByIdAndUpdate(id, user);

    res
      .status(200)
      .json({ message: "User Data Has Been Updated Successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed To Ubdate User Data" });
  }
};

const DeleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Get User Data
    const UserData = await User.findById(id);

    if (UserData.isCoach) {
      // if user is coach: delete relations with clients and subscriptions.
      await User.updateMany({ assignedCoachId: id }, { assignedCoachId: "" });
      await subscription.updateMany({ coachId: id }, { coachId: "" });
    } else {
      // if user is normal client: delete subscription history.
      await subscription.deleteMany({ clientId: id });
    }

    // finally delete user is account
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User Has Been Deleted Successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed To Delete User" });
  }
};

module.exports = {
  GetClients,
  GetCoaches,
  ApproveCoach,
  AssignCoach,
  GetUser,
  EditUser,
  DeleteUser,
};

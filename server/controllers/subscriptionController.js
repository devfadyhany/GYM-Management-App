const subscription = require("../models/subscription");
const User = require("../models/user");

const GetAllSubscriptions = async (req, res) => {
  try {
    const result = await subscription.find();

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const GetUserSubscription = async (req, res) => {
  try {
    const subscriptionId = req.params.subId;

    const result = await subscription.findById(subscriptionId);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const CancelSubscription = async (req, res) => {
  try {
    const subscriptionId = req.params.subId;

    await User.updateMany(
      { activeSubscription: subscriptionId },
      { activeSubscription: "" }
    );

    await subscription.findByIdAndDelete(subscriptionId);

    return res
      .status(200)
      .json({ message: "Subscription Has Been Cancelled Successfully!" });
  } catch (err) {
    return res.status(500).json({ error: "Failed To Cancel Subscription." });
  }
};

module.exports = {
  GetAllSubscriptions,
  GetUserSubscription,
  CancelSubscription,
};

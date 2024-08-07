const mongoose = require("mongoose");
const Day = require("./day");

const initialSchedule = [
  {
    title: "Sunday",
    body: "",
  },
  {
    title: "Monday",
    body: "",
  },
  {
    title: "Tuesday",
    body: "",
  },
  {
    title: "Wednesday",
    body: "",
  },
  {
    title: "Thursday",
    body: "",
  },
  {
    title: "Friday",
    body: "",
  },
  {
    title: "Saturday",
    body: "",
  },
];

const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: [true, "User Already Exists"],
  },
  password: {
    type: String,
    required: true,
  },
  /* 
  Not the best usecase for roles:
    - Should have turn it into a single string variable 'role'
    - Used an ENUM in the controller to define its types.
  */
  isCoach: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  assignedCoachId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  activeSubscription: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Subscription",
  },
  numOfClients: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  schedule: {
    type: [Day.schema],
    default: initialSchedule,
  },
  Approved: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);

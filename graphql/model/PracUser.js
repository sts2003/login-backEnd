import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PracUser = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    userPassword: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    zoneCode: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    detailAddress: {
      type: String,
      required: true,
      default: "-",
    },

    secretCode: {
      type: String,
      required: true,
      default: "-",
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model(`PracUser`, PracUser, `PracUser`);

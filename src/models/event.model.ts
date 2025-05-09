import mongoose, { ObjectId } from "mongoose";
import * as yup from "yup";

const Schema = mongoose.Schema;

export const eventDAO = yup.object({
  name: yup.string().required(),
  startDate: yup.string().required(),
  endDate: yup.string().required(),
  description: yup.string().required(),
  banner: yup.string().required(),
  isFeatured: yup.boolean().required(),
  isOnline: yup.boolean().required(),
  isPublish: yup.boolean(),
  category: yup.string().required(),
  slug: yup.string(),
  createdBy: yup.string().required(),
  createdAt: yup.string(),
  updatedAt: yup.string(),
  location: yup.object().required(),
});

export type TEvent = yup.InferType<typeof eventDAO>;
export interface Event extends Omit<TEvent, "category" | "createdBy"> {
  category: ObjectId;
  createdBy: ObjectId;
}

const EventSchema = new Schema<Event>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    startDate: {
      type: Schema.Types.String,
      required: true,
    },
    endDate: {
      type: Schema.Types.String,
      required: true,
    },
    banner: {
      type: Schema.Types.String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    isFeatured: {
      type: Schema.Types.Boolean,
      required: true,
    },
    isOnline: {
      type: Schema.Types.Boolean,
      required: true,
    },
    isPublish: {
      type: Schema.Types.Boolean,
      default: false,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    slug: {
      type: Schema.Types.String,
      unique: true,
    },
    location: {
      type: {
        region: {
          type: Schema.Types.Number,
        },
        coordinates: {
          type: [Schema.Types.Number],
          default: [0, 0],
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.pre("save", function () {
  if (!this.slug) {
    const slug = this.name.split(" ").join("-").toLowerCase();
    this.slug = `${slug}`;
  }
});

const EventModel = mongoose.model("Event", EventSchema);

export default EventModel;

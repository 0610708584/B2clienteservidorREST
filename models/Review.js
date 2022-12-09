import {Schema, model, models} from "mongoose"

const reviewSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId, ref: "User",
		required : [true, "User is required."]
	},
	score: {
		type: Number,
		required : [true, "Score is required"],
	},
	title: {
		type: String,
		trim: true,
		required : [true, "Title is required."]
	},
	description: {
		type: String,
		trim: true,
		required : [true, "Description is required."]
	},
	housing: {
		type: Schema.Types.ObjectId, ref: "Housing",
		required : [true, "Housing is required."]
	}
}, {
	timestamps: true,
	versionKey: false
})

export default models.Review || model("Review", reviewSchema)

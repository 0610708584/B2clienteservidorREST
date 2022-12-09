import {Schema, model, models} from "mongoose"

const commentSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId, ref: "User",
		required : [true, "User is required."]
	},
	description: {
		type: String,
		trim: true,
		required : [true, "Description is required."]
	},
	review: {
		type: Schema.Types.ObjectId, ref: "Review",
		required : [true, "Review is required."]
	}
}, {
	timestamps: true,
	versionKey: false
})

export default models.Comment || model("Comment", commentSchema)

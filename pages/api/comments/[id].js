import connectMongoDB from "../../../utils/mongoose"
import Comment from "../../../models/Comment"

connectMongoDB()

export default async (req, res) => {
	const {
		method,
		body,
		query: {id},
	} = req;

	switch(method) {		
		case "GET":
			try {
				const comment = await Comment.findById(id)
				if(!comment) return res.status(404).json({msg: "Comment not found."})

				return res.status(200).json(comment)
			} catch(error) {
				return res.status(400).json({msg: error.message})
			}

		case "PUT":
			try {
				const comment = await Comment.findByIdAndUpdate(id, body, {new: true})
				if (!comment) return res.status(404).json({msg: "Comment not found."})

				return res.status(202).json(comment)
			} catch(error) {
				return res.status(500).json({msg: "This method is not supported."})
			}

		case "DELETE":
			try {
				const comment = await Comment.findByIdAndDelete(id)
				if (!comment) return res.status(404).json({msg: "Comment not found."})

				return res.status(202).json()
			} catch(error) {
				return res.status(400).json({msg: error.message})
			}

		default:
			return res.status(400).json({msg: "This method is not supported."})
	}
}

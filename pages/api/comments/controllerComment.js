import Comment from "../../../models/Comment"

export async function getComment(req, res) {
	try {
		const comment = await Comment.find().sort({createdAt: 1})
	 	return res.status(200).json(comment)
	} catch(error) {
		return res.status(400).json({error: error.message})
	}
}

export async function postComment(req, res) {
	try {
		const comment = new Comment(req.body)
		const savedComment = await comment.save()

		return res.status(201).json(savedComment)
	} catch(error) {
		return res.status(400).json({error: error.message})
	}
}

import connectMongoDB from "../../../../utils/mongoose"
import Comment from "../../../../models/Comment"

connectMongoDB()

export default async (req, res) => {
	const {
		method,
		query: {id},
	} = req;

	switch(method) {		
		case 'GET':
			try {
				const comments = await Comment.find()

				var commentsReview = []
				for(let i = 0; i < comments.length; i++) {
					if((comments[i].review).equals(id)) {
						commentsReview.push(comments[i])
					}
				}
				return res.status(200).json(commentsReview)
			}catch(error){
				return res.status(400).json({msg: error.message})
			}

		default:
			return res.status(400).json({msg: "This method is not supported."})
	}
}


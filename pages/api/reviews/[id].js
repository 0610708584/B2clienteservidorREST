import connectMongoDB from "../../../utils/mongoose"
import Review from "../../../models/Review"

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
				const review = await Review.findById(id)
				if(!review) return res.status(404).json({msg: "Review not found."})

				return res.status(200).json(review)
			} catch(error) {
				return res.status(400).json({msg: error.message})
			}

		case "PUT":
			try {
				const review = await Review.findByIdAndUpdate(id, body, {new: true})
				if (!review) return res.status(404).json({msg: "Review not found."})

				return res.status(202).json(review)
			} catch(error) {
				return res.status(500).json({msg: "This method is not supported."})
			}

		case "DELETE":
			try {
				const review = await Review.findByIdAndDelete(id)
				if (!review) return res.status(404).json({msg: "Review not found."})

				return res.status(202).json()
			} catch(error) {
				return res.status(400).json({msg: error.message})
			}

		default:
			return res.status(400).json({msg: "This method is not supported."})
	}
}

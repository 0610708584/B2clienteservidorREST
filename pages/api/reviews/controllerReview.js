import Review from "../../../models/Review"

export async function getReviews(req, res) {
	try {
		const reviews = await Review.find().sort({createdAt: 1})
	 	return res.status(200).json(reviews)
	} catch(error) {
		return res.status(400).json({error: error.message})
	}
}

export async function postReview(req, res) {
	try {
		const review = new Review(req.body)
		const savedReview = await review.save()

		return res.status(201).json(savedReview)
	} catch(error) {
		return res.status(400).json({error: error.message})
	}
}

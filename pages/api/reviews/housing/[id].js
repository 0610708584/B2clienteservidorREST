import connectMongoDB from "../../../../utils/mongoose"
import Review from "../../../../models/Review"

connectMongoDB()

export default async (req, res) => {
	const {
		method,
		query: {id},
	} = req;

	switch(method) {		
		case 'GET':
			try {
				const reviews = await Review.find()

				var reviewsHousing = []
				for(let i = 0; i < reviews.length; i++) {
					if((reviews[i].housing).equals(id)) {
						reviewsHousing.push(reviews[i])
					}
				}
				return res.status(200).json(reviewsHousing)
			}catch(error){
				return res.status(400).json({msg: error.message})
			}

		default:
			return res.status(400).json({msg: "This method is not supported."})
	}
}


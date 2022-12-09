import connectMongoDB from "../../../utils/mongoose"
import { getReviews, postReview } from "./controllerReview"


export default async function handler(req, res) {
	connectMongoDB().catch(() => res.status(405).json({error:"Error in the connection."}))

	const {method} = req
	
	switch(method){
		case 'GET':
			return getReviews(req, res)

		case 'POST':
			return postReview(req, res)

		default:
			return res.status(400).json({msg: "This method is not supported."})
	}
 
}
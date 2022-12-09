import connectMongoDB from "../../../utils/mongoose"
import { getComment, postComment } from "./controllerComment"


export default async function handler(req, res) {
	connectMongoDB().catch(() => res.status(405).json({error:"Error in the connection."}))

	const {method} = req
	
	switch(method){
		case 'GET':
			return getComment(req, res)

		case 'POST':
			return postComment(req, res)

		default:
			return res.status(400).json({msg: "This method is not supported."})
	}
 
}
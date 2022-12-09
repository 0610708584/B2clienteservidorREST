import connectMongoDB from "../../../../utils/mongoose"
import User from "../../../../models/User"

connectMongoDB()

export default async (req, res) => {
	const {
		method,
		query: {email},
	} = req;

	switch(method){		
		case 'GET':
			try{
        const user = await User.find({email: email})
				if(!user.length) return res.status(200).json([])
				return res.status(200).json([user[0]])

			}catch(error){
				return res.status(400).json({msg: error.message})
			}

		default:
			return res.status(400).json({msg: "This method is not supported"})
	}
}


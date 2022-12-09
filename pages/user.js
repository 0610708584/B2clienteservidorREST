import { useSession } from "next-auth/react"
import { Avatar, Button } from "flowbite-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import NavbarItem from "../components/navbar"
import { AdvancedImage } from "@cloudinary/react"
import {Cloudinary} from "@cloudinary/url-gen";
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";

const UserProfile = ({user}) => {
	const { data: session } = useSession()

	const router = useRouter()
	const [propertiesList, setProperties] = useState([])

	useEffect(() => {
		const getHousings = async() => {

			const housingList = await fetch(`https://${process.env.URL}/api/housings/owner/${user.username}`)
				.then(response => response.json())

			setProperties(housingList)
		}

		getHousings()
	}, [])

	const deleteUser = async() => {
		await fetch(
			`https://${process.env.URL}/api/users/${user._id}`,{
				method: 'DELETE'
			})
			.then(router.push('/users'))
	}

	function property(house) {
		const cld = new Cloudinary({
			cloud: {
				cloudName: process.env.CLOUDINARY_URL
			}
		});
		const myImage = cld.image(house.public_id)
		myImage.resize(thumbnail().width(400).height(250)).roundCorners(byRadius(10));
		return(
			<Link href={`/housing?id=${house._id}`} passHref>
				<div className='flex-none cursor-pointer'>
					<div className='flex flex-col w-auto h-103 space-y-4'>
						<AdvancedImage cldImg={myImage} />
						<div className='flex flex-col items-start space-y-4'>
							<div className='flex flex-col items-start space-y-0'>
								<p className='text-2xl font-semibold'>{house.title}</p>
								<div className='flex flex-row justify-start space-x-1.5'>
									<p className='text-sm text-gray-400'>{house.address}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Link>
		)
	}

	const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.CLOUDINARY_URL
    }
  });
	const myImage = cld.image(user.public_id)
	myImage.resize(thumbnail().width(150).height(150).gravity(focusOn(FocusOn.face()))).roundCorners(byRadius(100))
	return (
		<div className="flex flex-col">
			<NavbarItem />
			<div className="flex flex-col w-full h-full items-center justify-center space-y-4 py-10">
				<div className="flex flex-col w-full items-center space-y-2">
					<AdvancedImage cldImg={myImage} />
					<div className="flex flex-col items-center">
							<p className="text-3xl font-medium text-gray-700">{user.name} {user.surname}</p>
							<p className="text-base">{user.username}</p>
							<p className="text-base pb-4">{user.email}</p>
							<p className="text-base text-gray-400">{user._id}</p>
							<div className="flex flex-row justifiy-center space-x-2">
								<p className="text-base text-gray-400">{user.age} años</p>
								<p className="text-base text-gray-400">·</p>
								<p className="text-base text-gray-400">{propertiesList.length} viviendas</p>
							</div>
					</div>
					<div className="flex flex-row justify-between space-x-2">
						{(session) ? (
							(((session.user).email) === (user.email)) ? (
								<Button>
									<Link href={`edit-user/?id=${user._id}`} passHref>Editar perfil</Link>
								</Button>
							) : (null)
						) : ([
							<Button>
								<Link href={`edit-user/?id=${user._id}`} passHref>Editar perfil</Link>
							</Button>,
							<Button onClick={deleteUser} className="bg-orange-500 hover:bg-orange-700">Borrar perfil</Button>
						])}
					</div>
				</div>

				<div className='flex flex-col w-full space-y-4'>
					<div className='flex flex-row justify-start space-x-4 p-6 md:pl-48'>
						<p className='text-2xl font-medium'>Alojamientos en propiedad</p>
						<p className='text-2xl text-gray-400'>{propertiesList.length}</p>
					</div>
					<div className='overflow-auto hover:overflow-x-scroll flex flex-row justify-start space-x-2 px-6 md:pl-48 pb-4'>
						{(propertiesList.length > 0) && propertiesList.map((house, i) => {
							return (	
								property(house)
							)
						})}
						{(propertiesList.length === 0) && <p className='flex flex-col text-lg text-center text-gray-400 bg-gray-50 w-full justify-center items-center py-4 px-6 md:mr-48 rounded-lg'>
							Aquí aparecerán los alojamientos creados por este usuario.
						</p>}
					</div>
				</div>
			</div>	
		</div>
	)
}

export async function getServerSideProps(ctx){
	const {id} = ctx.query

	const user = await fetch(`https://${process.env.URL}/api/users/${id}`)
		.then(response => response.json())

	return{
		props:{
			user
		}
	}
}

export default UserProfile

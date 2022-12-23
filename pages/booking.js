import { useSession } from "next-auth/react"
import { Avatar, Button } from "flowbite-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import NavbarItem from "../components/navbar"
import MapItem from "../components/map"

const BookingProfile = ({
	booking,
	housing,
	user
}) => {
	const { data: session } = useSession()

	const router = useRouter()


	const deleteBooking = async() => {
		await fetch(
			`http://${process.env.URL}/api/bookings/${booking._id}`,{
				method: 'DELETE'
			})
			.then(router.push('/bookings'))
	}
	
	const containerStyle = {
		position: 'relative',
		width: '400px',
		height: '700px'
	}

	const center = {
		lat: housing.lat,
		lng: housing.lng
	}


	return (
		<div className="flex flex-col">
			<NavbarItem />
			<div className="flex flex-col w-full h-full items-center justify-center space-y-4 py-10">
				<div className="flex flex-col w-full items-center space-y-2">
					<div className="flex flex-col pb-4 items-left">
						<p className="text-3xl font-light text-gray-600">Reserva de <span className="text-3xl font-normal text-gray-700">{user.name} {user.surname}</span> en <span className="text-3xl font-normal text-gray-700">{housing.address}</span></p>
						<p className="text-normal font-medium">Desde <span className="text-normal font-light text-gray-700">{(booking.startDate).split('T')[0]}</span> hasta <span className="text-normal font-light text-gray-700">{(booking.endDate).split('T')[0]}</span></p>
						<p className="text-base font-light">Para {booking.guests} personas</p>
					</div>
					<div className="flex flex-row justify-between space-x-2">
						{(session) ? null : ([
							<Button className="bg-blue-600 hover:bg-blue-800">
								<Link href={`edit-booking/?id=${booking._id}`} passHref>Editar reserva</Link>
							</Button>,
							<Button onClick={deleteBooking} className="bg-amber-600 hover:bg-amber-800">Borrar reserva</Button>
						])}
					</div>
				</div>
				<div className="w-196">
					<MapItem
						containerStyle={containerStyle}
						center={center}
						zoom={9}
					/>
				</div>
			</div>	
		</div>
	)
}

export async function getServerSideProps(ctx){
	const {id} = ctx.query

	const booking = await fetch(`http://${process.env.URL}/api/bookings/${id}`)
		.then(response => response.json())

	const housing = await fetch(`http://${process.env.URL}/api/housings/${booking.housing}`)
		.then(response => response.json())

	const user = await fetch(`http://${process.env.URL}/api/users/${booking.user}`)
		.then(response => response.json())

	return{
		props:{
			booking,
			housing,
			user
		}
	}
}

export default BookingProfile
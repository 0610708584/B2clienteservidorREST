import NavbarItem from "../components/navbar"
import { useState } from "react"
import { useRouter } from "next/router"
import { Button, TextInput } from "flowbite-react"


const EditBooking = ({
	booking
}) => {

	const router = useRouter()

	const [startDateValue, setStartDate] = useState(booking.startDate)
	const [endDateValue, setEndDate] = useState(booking.endDate)
	const [userValue, setUser] = useState(booking.user)
	const [housingValue, setHousing] = useState(booking.housing)
	const [guestsValue, setGuests] = useState(booking.guests)


	
	const handleSubmit = async event => {
		event.preventDefault()

		const res = await fetch(
			`http://${process.env.URL}/api/bookings/${booking._id}`,{
				body: JSON.stringify({
					startDate: event.target.startDate.value,
					endDate: event.target.endDate.value,
					user: event.target.user.value,
					housing: event.target.housing.value,
					guests: event.target.guests.value
				}),
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'PUT'
			}).then(response => {
				router.push(`/booking?id=${booking._id}`)
			})
	}

	return (
		<>

			<NavbarItem />

			<div className="flex-col flex w-full h-screen space-y-4 mt-10 items-center" >

				<h1 className="text-2xl font-normal ">Editar reserva</h1>
				<form onSubmit={handleSubmit}>
					<div className="pb-2 w-96">
						<div>
							<label className="text-gray-800"htmlFor="startDate"> Fecha de inicio </label>
						</div>
						<TextInput id="startDate" 
							name="startDate" 
							value={startDateValue.split('T')[0]}
							type="date"
							onChange={ (event) => setStartDate(event.target.value)}
						/>
					</div>
					<div className="pb-2">
						<div>
							<label className="text-gray-800"htmlFor="endDate"> Fecha de fin </label>
						</div>
						<TextInput id="endDate" 
							name="endDate" 
							value={endDateValue.split('T')[0]}
							type="date"
							onChange={ (event) => setEndDate(event.target.value)}
						/>
					</div>
					<div className="pb-2">
						<div>
							<label className="text-gray-800"htmlFor="user"> Identificador de usuario </label>
						</div>
						<TextInput id="user" 
							name="user" 
							value={userValue}
							onChange={ (event) => setUser(event.target.value)}/>
					</div>
					<div className="pb-2">
						<div>
							<label className="text-gray-800"htmlFor="housing"> Identificador de alojamiento </label>
						</div>
						<TextInput id="housing" 
							name="housing" 
							value={housingValue}
							onChange={ (event) => setHousing(event.target.value)}
						/>
					</div>
					<div className="pb-2">
						<div>
							<label className="text-gray-800"htmlFor="guests">Número de huéspedes</label>
						</div>
						<TextInput id="laguestst" 
							name="guests" 
							value={guestsValue}
							onChange={ (event) => setGuests(event.target.value)}
						/>
					</div>
					<div className="flex-col flex items-center">
						<Button type="submit">
							Modificar
						</Button>
					</div>
				</form>

			</div>
		</>
	)
}

export async function getServerSideProps(ctx){

	const {id} = ctx.query 

	const booking = await fetch(`http://${process.env.URL}/api/bookings/${id}`)
		.then(response => response.json())


	return{
		props:{
			booking
		}
	}
}

export default EditBooking
import NavbarItem from "../components/navbar"
import { useRef } from "react"
import { useRouter } from "next/router"
import { useSession, getSession } from "next-auth/react"
import { useState } from "react"
import { Button, TextInput } from "flowbite-react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { env } from "../next.config"

const CreateBooking = ({loggedUser}) => {
	const { data: session } = useSession()
	const router = useRouter()

	const startDate = useRef()
	const endDate = useRef()
	const user = useRef()
	const housing = useRef()
	const lat = useRef()
	const lng = useRef()

	const handleSubmit = async() => {
		await fetch(
			`http://${process.env.URL}/api/bookings`,{
				body: JSON.stringify({
					startDate: startDate.current.value,
					endDate: endDate.current.value,
					user: document.getElementById("user").value,
					housing: housing.current.value,
					lat: (session ? (0.00000) : lat.current.value),
					lng: (session ? (0.00000) : lng.current.value)
				}),
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST'
			})	
	}

	return (
		<>
			<NavbarItem />

			<div className="flex-col flex w-full h-screen space-y-4 mt-10 items-center" >

				<h1 className="text-2xl font-normal ">Crear reserva</h1>
				<div >
					<form onSubmit={handleSubmit} action={`http://${process.env.URL}/bookings`}>
						<div className="pb-2 w-96">
							<div>
								<label className="text-gray-800"htmlFor="startDate"> Fecha de inicio </label>
							</div>
							<TextInput required={true} type="date" id="startDate" name="_startDate" placeholder="Fecha de inicio" ref={startDate}/>
						</div>
						<div className="pb-2">
							<div>
								<label className="text-gray-800"htmlFor="endDate"> Fecha de fin </label>
							</div>
							<TextInput required={true} type="date" id="endDate" name="_endDate" placeholder="Fecha de fin" ref={endDate}/>
						</div>
						{session ? ([
							<div className="pb-2" key={loggedUser}>
								<div>
									<label className="text-gray-800"htmlFor="user"> Identificador de usuario </label>
								</div>
								<TextInput required={true} id="user" name="_user" placeholder="Identificador de usuario" value={loggedUser._id} disabled={true}/>
							</div>,
							<div className="pb-4" key={loggedUser}>
								<div>
									<label className="text-gray-800"htmlFor="housing"> Identificador de alojamiento </label>
								</div>
								<TextInput required={true} id="housing" name="_housing" placeholder="Identificador de alojamiento" ref={housing}/>
							</div>
						]) : ([
							<div className="pb-2" key={loggedUser}>
								<div>
									<label className="text-gray-800"htmlFor="user"> Identificador de usuario </label>
								</div>
								<TextInput required={true} id="user" name="_user" placeholder="Identificador de usuario" ref={user}/>
							</div>,
							<div className="pb-2" key={loggedUser}>
								<div>
									<label className="text-gray-800"htmlFor="housing"> Identificador de alojamiento </label>
								</div>
								<TextInput required={true} id="housing" name="_housing" placeholder="Identificador de alojamiento" ref={housing}/>
							</div>,
							<div className="pb-2" key={loggedUser}>
								<div>
									<label className="text-gray-800"htmlFor="lat"> Latitud para recogida</label>
								</div>
								<TextInput required={true} id="lat" name="_lat" placeholder="Latitud para recogida" ref={lat}/>
							</div>,
							<div className="pb-4" key={loggedUser}>
								<div>
									<label className="text-gray-800"htmlFor="lng"> Longitud para recogida</label>
								</div>
								<TextInput required={true} id="lng" name="_lng" placeholder="Longitud para recogida" ref={lng}/>
							</div>
						])}

						<div className="flex flex-col pb-4 items-center ">
							<Button type="submit" id="createBooking">
								Crear sin pagar
							</Button>
						</div>
							
						<PayPalScriptProvider options={{ "client-id": process.env.PAYPAL_ID }}>
							<PayPalButtons
								createOrder={(data, actions) => {
									return actions.order.create({
										purchase_units: [{
											amount: {
												currency_code: "USD",
												value: "100",
											},
										}],
									})
								}}
								onApprove={(data, actions) => {
									return actions.order.capture().then((details) => {
											//alert(`Transacción realizada con éxito.`)
											document.getElementById("createBooking").click()
									});
								}}
							style={{ layout: "horizontal", color: "blue" }} />
						</PayPalScriptProvider>	


					</form>
				</div>

			</div>
		</>
	)
}

export async function getServerSideProps(ctx){
	const session = await getSession(ctx)

	if(session) {
		const loggedUser = await fetch(`http://${process.env.URL}/api/users/email/${(session.user).email}`).then(response => response.json())

		if(!loggedUser.length) {
			return {
				redirect: {
					destination: '/users'
				},
			}
		}

		return{
			props:{
				loggedUser: loggedUser[0]
			}
		}
	}

	return{
		props:{
			loggedUser: null
		}
	}
}

export default CreateBooking
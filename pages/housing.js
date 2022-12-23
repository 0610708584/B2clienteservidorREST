import { Avatar, Button, TextInput, Textarea } from "flowbite-react"
import emailjs from '@emailjs/browser';
import { useSession, getSession } from "next-auth/react"
import { useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import NavbarItem from "../components/navbar"
import MapItem from "../components/map"
import { AdvancedImage } from "@cloudinary/react"
import {Cloudinary} from "@cloudinary/url-gen";
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {TwitterShareButton, TwitterIcon} from "react-share";
import {fill} from "@cloudinary/url-gen/actions/resize";
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


const House = ({
	house,
	owner,
	reviews,
	loggedUser
}) => {
	const { data: session } = useSession()
	const router = useRouter()

	const cld = new Cloudinary({
		cloud: {
		  cloudName: process.env.CLOUDINARY_URL
		}
	});

	const myImage = cld.image(house.public_id)
	myImage.resize(fill().width(1000).height(700)).roundCorners(byRadius(10))

	const myImage2 = cld.image(owner.public_id)
	myImage2.resize(thumbnail().width(60).height(60).gravity(focusOn(FocusOn.face()))).roundCorners(byRadius(100))

	/** Variables para las reseñas */
	const userReview = useRef()
	const scoreReview = useRef()
	const titleReview = useRef()
	const descriptionReview = useRef()
	const housingReview = useRef()

	/** Variables para la reserva */
	const startDateBooking = useRef()
	const endDateBooking = useRef()
	const userBooking = useRef()
	const housingBooking = useRef()
	const guestsBooking = useRef()

	/** Variables para los comentarios */
	const userComment = useRef()
	const descriptionComment = useRef()
	const reviewComment = useRef()


	const submitComment = async() => {
		await fetch(
			`http://${process.env.URL}/api/comments`,{
				body: JSON.stringify({
					user: userComment.current.value,
					description: descriptionComment.current.value,
					review: reviewComment.current.value
				}),
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST'
			})	
	}

	const submitBooking = async() => {
		await fetch(
			`http://${process.env.URL}/api/bookings`,{
				body: JSON.stringify({
					startDate: startDateBooking.current.value,
					endDate: endDateBooking.current.value,
					user: document.getElementById("userBooking").value,
					housing: housingBooking.current.value,
					guests: guestsBooking.current.value
				}),
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST'
			})	
	}

	const submitReview = async() => {
		await fetch(
			`http://${process.env.URL}/api/reviews`,{
				body: JSON.stringify({
					user: userReview.current.value,
					score: scoreReview.current.value,
					title: titleReview.current.value,
					description: descriptionReview.current.value,
					housing: housingReview.current.value
				}),
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST'
			})
		
		/* Lo comento para no consumir cuota de EmailJS cada vez que se envia una review
		await emailjs.sendForm(process.env.EMAILJS_SERVICE, process.env.EMAILJS_TEMPLATE, document.getElementById("reviewForm"), process.env.EMAILJS_PUBLICKEY)
		.then((result) => {
				console.log(result.text);
		}, (error) => {
				console.log(error.text);
		})*/
	}

	const deleteHousing = async() => {
		await fetch(
			`http://${process.env.URL}/api/housings/${house._id}`,{
				method: 'DELETE'
			})
			.then(router.push('/housings'))
	}

	const deleteComment = async(comentario) => {
		await fetch(
			`http://${process.env.URL}/api/comments/${comentario}`,{
				method: 'DELETE'
			})
			.then(router.push(`/housing?id=${house._id}`))
	}

	const deleteReview = async(review) => {
		await fetch(
			`http://${process.env.URL}/api/reviews/${review}`,{
				method: 'DELETE'
			})
			.then(router.push(`/housing?id=${house._id}`))
	}

	const containerStyle = {
		position: 'relative',
		width: '400px',
		height: '700px'
	}
	
	const center = {
		lat: house.lat,
		lng: house.lng
	}

	function reviewsView(review) {
		const reviewer = cld.image((review.user).public_id)
		reviewer.resize(thumbnail().width(40).height(40).gravity(focusOn(FocusOn.face()))).roundCorners(byRadius(100))
		
		return(
				<div className="w-auto py-4">
					<div className="flex flex-col">

						{/** Reseña */}
						<div className="flex flex-row space-x-2">
							<div>
								<Link href={`user/?id=${(review.user)._id}`}>
									<AdvancedImage cldImg={reviewer} />
								</Link>
							</div>

							<div className="flex flex-col">
								<p className="text-lg font-bold">{(review.user).name + " " + (review.user).surname} </p>
								<p className="text-sm font-normal text-grey-800 ">{review.score + " sobre 10"} </p>
								<div className="flex flex-row space-x-3 items-center">

									<div className="flex flex-col">
										<p className="font-medium text-grey-800">{review.title} </p>	
										<p className="text-sm font-light">{review.description} </p>
									</div>

									{/** Botón de eliminar reseña */}
									<div>
										{session ? (
											(loggedUser._id == (review.user)._id) ? (
												<div className="cursor-pointer">
													<a onClick={()=> deleteReview(review._id)} >
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
															<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
														</svg>
													</a>
												</div>
											) : null
										) : (
											<div className="cursor-pointer">
												<a onClick={()=> deleteReview(review._id)} >
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
														<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
													</svg>
												</a>
											</div>
											
										)}
									</div>
								</div>	
								
							</div>			
						</div>

						{/** Comentarios */}
						<div className="flex flex-col pl-12 space-y-4 pt-4">

							{review.comments && (review.comments).length > 0 ? (
								(review.comments).map((comment) => {
									const responder = cld.image((comment.user).public_id)
									responder.resize(thumbnail().width(35).height(35).gravity(focusOn(FocusOn.face()))).roundCorners(byRadius(100))		
									
									return (
											<div className="w-auto">
													<div className="flex flex-row space-x-2">
														<div>
															<Link href={`user/?id=${(comment.user)._id}`}>
																<AdvancedImage cldImg={responder} />
															</Link>	
														</div>

														<div className="flex flex-col">
															<div className="flex flex-row space-x-2">
																<p className="text-sm font-semibold">{(comment.user).name + " " + (comment.user).surname} </p>		
																
																{/** Botón de eliminar comentario */}
																<div>
																	{session ? (
																		(loggedUser._id == (comment.user)._id) ? (
																			<div className="cursor-pointer">
																				<a onClick={()=> deleteComment(comment._id)}>
																					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
																						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
																					</svg>
																				</a>
																			</div>
																		) : null
																	) : (
																		<div className="cursor-pointer">
																			<a onClick={()=> deleteComment(comment._id)}>
																				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
																					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
																				</svg>
																			</a>
																		</div>
																	)}
																</div>

															</div>
															
															<p className="text-sm font-normal text-gray-700">{comment.description} </p>	
														</div>
											
													</div>
											</div>
									)
								})) : null
							}
							

							{/** Añadir comentario */}
							<div className="w-1/2">
								<form onSubmit={submitComment} action={`http://${process.env.URL}/housing`} className="space-y-2">
									<input type="text" hidden={true} id="id" name="id" value={house._id}/>

									{session ? (
										<input type="text" hidden={true} id="userComment" name="_userComment" ref={userComment} value={loggedUser._id}/>
									) : (
										<input type="text" hidden={true} id="userComment" name="_userComment" ref={userComment} value={"63849607a19b1a6fb9746b83"}/>
									)}
									
										<div>
											<Textarea id="descriptionComment" 
												required={true}
												type="textarea" 
												rows={2} 
												name="_descriptionComment" 
												placeholder="Añadir Comentario" 
												className="text-sm"
												ref={descriptionComment}/>
										</div>

									<input type="text" hidden={true} 
										id="reviewComment" 
										name="_reviewComment" 
										ref={reviewComment} 
										value={review._id}/>
										
									<div className="">
										<Button type="submit" className="bg-slate-400 hover:bg-slate-500 ">
											Comentar
										</Button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
		)
	}

	
	return (
		<div className="flex flex-col w-full h-screen">
			<NavbarItem />
			<div className="flex flex-col w-full items-center">
				<div className="flex flex-col items-start w-auto h-full mx-96 my-12">
					<div className="flex flex-col w-full h-full space-y-4">
						<div>
							<p className="text-3xl font-semibold text-gray-800">{house.title}</p>
							<p className="text-base font-normal underline">{house.address}</p>
							<p className="text-base font-medium">{house.price}€ por noche</p>
						</div>		

						{/** Imagen Alojamiento y Mapa */}
						<div className="relative w-full">		
							<div className="flex flex-row gap-x-5">
								<AdvancedImage cldImg={myImage} />

								<div>
									<MapItem
										containerStyle={containerStyle}
										center={center}
										zoom={10}
									/>
								</div>
							</div>
						</div>

						<div className="w-full h-full flex flex-row">

							{/** Información, Reseñas y Comentarios. 1er div */}
							<div className="flex flex-col w-full space-y-2">
								{/** Informacion del alojamiento */}
								<div className="flex flex-col w-10/12 h-full divide-y divide-slate-200 space-y-4">
									<div className="flex flex-row items-center">
										<div className="flex flex-col">
											<Link href={`user/?id=${owner._id}`}>
												<AdvancedImage cldImg={myImage2} />
											</Link>	
										</div>

										<div className="flex flex-col pl-4">
											<p className="text-xl font-semibold text-grey-800">{owner.name + " " + owner.surname} </p>		
											<p className="text-grey-800 font-normal">{"@" + owner.username} </p>	
										</div>
									</div>

									<div className="flex flex-col w-full pt-4 space-y-4">
										<p className="text-base">{house.description}</p>
										<div className="flex flex-row space-x-2 mt-4">
											{(session) ? (
												(((session.user).email) === (owner.email)) ? ([
													<Button className="bg-blue-600 hover:bg-blue-800">
														<Link href={`edit-housing/?id=${house._id}`} passHref>Editar alojamiento</Link>
													</Button>,
													<Button onClick={deleteHousing} className="bg-amber-600 hover:bg-amber-800">
														Borrar alojamiento
													</Button>
												]) : (null)
											) : ([
												<Button className="bg-blue-600 hover:bg-blue-800">
													<Link href={`edit-housing/?id=${house._id}`} passHref>Editar alojamiento</Link>
												</Button>,
												<Button onClick={deleteHousing} className="bg-amber-600 hover:bg-amber-800">
													Borrar alojamiento
												</Button>
											])}

											<TwitterShareButton
												title={"¡Consulta este alojamiento!"}
												url={`http://${process.env.URL}/housing?id=${house._id}`}
												hashtags={["alojamientos"]}>
												<TwitterIcon size={40} round />
											</TwitterShareButton>
										</div>
									</div>
								</div>

								{/** Lista de Reseñas y Comentarios */}
								<div className="flex flex-col w-full space-y-2 pt-4">
									<p className="text-2xl font-semibold text-gray-800">Reseñas</p>
									<div>
										{reviews && reviews.length > 0 ? (
											reviews.map((review) => {
												{/** Imagen del usuario */}
												const reviewer = cld.image((review.user).public_id)
												reviewer.resize(thumbnail().width(50).height(50).gravity(focusOn(FocusOn.face()))).roundCorners(byRadius(100))	
												
												return (
													reviewsView(review)
												)
											})
										) : (
												<p className="flex flex-col w-full h-full items-left justify-center">No se han encontrado resultados en esta lista.</p>
										)}
									</div>
								</div>

								{/** Publicar reseñas */}				
								<div className="flex flex-col w-1/2">
									<p className="text-2xl font-semibold text-gray-800 pt-4 pb-2">Publicar reseña</p>

									<form onSubmit={submitReview} id="reviewForm" action={`http://${process.env.URL}/housing`} className="space-y-2">
										<input type="text" hidden={true} id="id" name="id" value={house._id}/>

										{session ? (
											<input type="text" hidden={true} id="userReview" name="_userReview" ref={userReview} value={loggedUser._id}/>
										) : (
											<input type="text" hidden={true} id="userReview" name="_userReview" ref={userReview} value={"63849607a19b1a6fb9746b83"}/>
										)}

											<div>
												<label className="text-gray-800"htmlFor="scoreReview"> Nota </label>
												<TextInput id="scoreReview" name="_scoreReview" placeholder="Nota" ref={scoreReview} style={{width: "60px"}}/>
											</div>
										
											<div>
												<label className="text-gray-800"htmlFor="titleReview"> Título </label>
												<TextInput id="titleReview" name="_titleReview" placeholder="Título" ref={titleReview}/>
											</div>
											
											<div>
												<label className="text-gray-800"htmlFor="descriptionReview"> Reseña </label>
												<Textarea id="descriptionReview" type="textarea" rows={4} name="_descriptionReview" placeholder="Reseña" className="text-sm" ref={descriptionReview}/>
											</div>
										
										<input type="text" hidden={true} id="housingReview" name="_housingReview" ref={housingReview} value={house._id}/>
										<input hidden={true} name="user_email" value={owner.email}  />
										<input hidden={true} name="user_name" value={owner.name}  />
										<input hidden={true} name="user_housing" value={`http://${process.env.URL}/housing?id=${house._id}`}/>

										<div className="flex items-left pt-1">
											<Button type="submit" className="bg-blue-600 hover:bg-blue-800">Publicar reseña</Button>
										</div>
									</form>			
								</div>

							</div>
							
							{/** Crear Reserva. 2o div */}
							<div className="w-auto pt-24">
								<div className="border border-gray-300 rounded-md space-y-2">
								<div className="m-4">
									{/** Precio y evaluaciones */}
									<div className="flex flex-row w-full space-x-2 pb-6">
												<p className="text-2xl font-semibold text-gray-800">{house.price + "€"}</p>
												<p className="text-xl font-normal  text-gray-700">noche</p>
									</div>

									<form onSubmit={submitBooking} action={`http://${process.env.URL}/bookings`}>	
										<input type="text" hidden={true} id="housing" name="_housing" placeholder="Identificador de alojamiento" ref={housingBooking} value={house._id}/>
										{session ? (
											<input type="text" hidden={true} id="userBooking" name="_userBooking" ref={userBooking} value={loggedUser._id}/>
										) : (
											<input type="text" hidden={true} id="userBooking" name="_userBooking" ref={userBooking} value={"63849607a19b1a6fb9746b83"}/>
										)}

										<div className="flex flex-row space-x-2 pb-2">
											<div className="flex flex-col items-center">
												<label htmlFor="startDate" className="text-base text-gray-500">LLEGADA</label>
												<input className="border border-gray-300 rounded-md" 
													required={true}
													type="date" 
													id="startDate" 
													name="_startDate"
													ref={startDateBooking}/>
											</div>	
											<div className="flex flex-col items-center">
												<label className="text-base text-gray-500">SALIDA</label>
												<input className="border border-gray-300 rounded-md" 
													required={true}
													type="date" 
													id="endDate" 
													name="_endDate"
													ref={endDateBooking}/>
											</div>	
										</div>						
										<div className="flex flex-col w-auto space-y-2">
											<TextInput required={true} 
												type="text"
												sizing="xl" 
												id="guests" 
												name="_guests" 
												placeholder="Número de huéspedes"
												ref={guestsBooking}/>

											<Button type="submit" id="createBooking" className="bg-blue-600 hover:bg-blue-800">
												Reservar sin pagar
											</Button>

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
												style={{ layout: "horizontal", color: "gold" }} />
										</PayPalScriptProvider>	

										</div>

									</form>	
								</div>
								</div>	
							</div>


						</div>
						
					</div>
				</div>
			</div>
		</div>
	)
}

export async function getServerSideProps(ctx){

	const {id} = ctx.query

	const house = await fetch(`http://${process.env.URL}/api/housings/${id}`)
		.then(response => response.json())

	const owner = await fetch(`http://${process.env.URL}/api/users/${house.owner}`)
		.then(response => response.json())

	const reviews = await fetch(`http://${process.env.URL}/api/reviews/housing/${id}`)
		.then(response => response.json())

	for(const review of reviews) {
		const user = await fetch(`http://${process.env.URL}/api/users/${review.user}`).then(response => response.json())
		review.user = user

		const comments = await fetch(`http://${process.env.URL}/api/comments/review/${review._id}`).then(response => response.json())
		for(const comment of comments) {
			const user = await fetch(`http://${process.env.URL}/api/users/${comment.user}`).then(response => response.json())
			comment.user = user
		}
		review.comments = comments
	}
		



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
				house,
				owner,
				reviews,
				loggedUser: loggedUser[0]
			}
		}
	}


	return {
		props: {
			house,
			owner,
			reviews,
			loggedUser: null
		}
	}
}

export default House
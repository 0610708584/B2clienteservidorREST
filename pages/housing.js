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


const House = ({
	house,
	owner,
	reviews,
	loggedUser
}) => {
	const { data: session } = useSession()
	const router = useRouter()

	const deleteHousing = async() => {
		await fetch(
			`https://${process.env.URL}/api/housings/${house._id}`,{
				method: 'DELETE'
			})
			.then(router.push('/housings'))
	}

	const deleteComment = async(comentario) => {
		await fetch(
			`https://${process.env.URL}/api/comments/${comentario}`,{
				method: 'DELETE'
			})
			.then(router.push(`/housing?id=${house._id}`))
	}

	const deleteReview = async(review) => {
		await fetch(
			`https://${process.env.URL}/api/reviews/${review}`,{
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

	const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.CLOUDINARY_URL
    }
  });
	const myImage = cld.image(house.public_id)
	myImage.resize(fill().width(1000).height(700)).roundCorners(byRadius(10))

	const myImage2 = cld.image(owner.public_id)
	myImage2.resize(thumbnail().width(75).height(75).gravity(focusOn(FocusOn.face()))).roundCorners(byRadius(100))

	const userReview = useRef()
	const scoreReview = useRef()
	const titleReview = useRef()
	const descriptionReview = useRef()
	const housingReview = useRef()

	const submitReview = async() => {
		await fetch(
			`https://${process.env.URL}/api/reviews`,{
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
	
	return (
		<div className="flex flex-col w-full h-screen">
			<NavbarItem />
			<div className="flex flex-col w-full items-center bg-red">
				<div className="flex flex-col items-start w-auto h-full mx-96 my-16">
					<div className="flex flex-col w-full h-full space-y-4">
						<div className="space-y-0">
							<p className="text-3xl font-semibold text-gray-800">{house.title}</p>
							<p className="text-base font-medium underline">{house.address}</p>
							<p className="text-base font-medium">{house.price}€ por noche</p>
							<p className="text-base text-gray-500">{house._id}</p>
						</div>		

						<div className="relative w-full">		
							<div className="flex flex-row gap-x-5">
								<AdvancedImage cldImg={myImage} />
								<MapItem
									containerStyle={containerStyle}
									center={center}
									zoom={9}
								/>
							</div>
						</div>

						<div className="flex flex-col w-10/12 h-full divide-y divide-slate-200 space-y-4">
							<div className="flex flex-row">
								<div className="flex flex-col">
									<Link href={`user/?id=${owner._id}`}>
									<AdvancedImage cldImg={myImage2} />
									</Link>	
								</div>
								<div className="flex flex-col pl-4">
									<p className="text-xl font-semibold underline text-grey-800">{owner.name + " " + owner.surname} </p>		
									<p className="text-grey-800 font-semibold">{owner.username} </p>	
									<p className="text-base text-gray-500">{owner._id}</p>
								</div>
							</div>

							<div className="flex flex-col w-full pt-4">
								<p className="text-base">{house.description}</p>
								<div className="flex flex-row space-x-2 mt-4">
									{(session) ? (
										(((session.user).email) === (owner.email)) ? ([
											<Button>
												<Link href={`edit-housing/?id=${house._id}`} passHref>Editar alojamiento</Link>
											</Button>,
											<Button onClick={deleteHousing} className="bg-orange-500 hover:bg-orange-700">
												Borrar alojamiento
											</Button>
										]) : (null)
									) : ([
										<Button>
											<Link href={`edit-housing/?id=${house._id}`} passHref>Editar alojamiento</Link>
										</Button>,
										<Button onClick={deleteHousing} className="bg-orange-500 hover:bg-orange-700">
											Borrar alojamiento
										</Button>
									])}

									<TwitterShareButton
										title={"¡Consulta este alojamiento!"}
										url={`https://${process.env.URL}/housing?id=${house._id}`}
										hashtags={["alojamientos"]}>
										<TwitterIcon size={40} round />
									</TwitterShareButton>
									</div>
							</div>
						</div>
						<p className="text-2xl font-semibold text-gray-800 pt-4 pb-1" style={{"line-height": "0"}}>Reseñas</p>
						<ul className="divide-y divide-gray-200 dark:divide-gray-700 w-10/12">
							{reviews && reviews.length > 0 ? (
								reviews.map((review) => {
									const reviewer = cld.image((review.user).public_id)
									reviewer.resize(thumbnail().width(50).height(50).gravity(focusOn(FocusOn.face()))).roundCorners(byRadius(100))		
																	
									const submitComment = async() => {
										await fetch(
											`https://${process.env.URL}/api/comments`,{
												body: JSON.stringify({
													user: document.getElementById("userComment").value,
													description: document.getElementById("descriptionComment").value,
													review: document.getElementById("reviewComment").value
												}),
												headers: {
													'Content-Type': 'application/json'
												},
												method: 'POST'
											})	
									}
									return (
										<li className="py-3 sm:py-4">
											<div className="flex items-center space-x-4">
												<div className="min-w-0 flex-1">
													<div className="flex flex-row">
														<div className="flex flex-col">
															<Link href={`user/?id=${(review.user)._id}`}>
															<AdvancedImage cldImg={reviewer} />
															</Link>
															
															{session ? (
																(loggedUser._id == (review.user)._id) ? (
																	<Button onClick={()=> deleteReview(review._id)} className="bg-orange-500 hover:bg-orange-700 mt-2 ml-1" size="xs" pill={true}>
																		<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
																	</Button>
																) : null
															) : (
																<Button onClick={()=> deleteReview(review._id)} className="bg-orange-500 hover:bg-orange-700 mt-2 ml-1" size="xs" pill={true}>
																	<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
																</Button>
															)}
														</div>
														<div className="flex flex-col pl-4">
															<p className="text-lg font-semibold underline text-grey-800">{(review.user).name + " " + (review.user).surname} </p>		
															<p className="text-sm font-light text-grey-800 pb-1">{review.score + " SOBRE 10"} </p>	
															<p className="font-semibold text-grey-800" style={{"line-height": "1"}}>{review.title} </p>
															<p className="text-grey-800 pb-2">{review.description} </p>

															<ul>
																{review.comments && (review.comments).length > 0 ? (
																	(review.comments).map((comment) => {
																		const responder = cld.image((comment.user).public_id)
																		responder.resize(thumbnail().width(50).height(50).gravity(focusOn(FocusOn.face()))).roundCorners(byRadius(100))		
																		return (
																			<li className="py-3 sm:pb-2">
																				<div className="flex items-center space-x-4">
																					<div className="min-w-0 flex-1">
																						<div className="flex flex-row">
																							<div className="flex flex-col">
																								<Link href={`user/?id=${(comment.user)._id}`}>
																								<AdvancedImage cldImg={responder} />
																								</Link>	
																							</div>
																							<div className="flex flex-col pl-4">
																								<p className="font-semibold underline text-grey-800">{(comment.user).name + " " + (comment.user).surname} </p>		
																								<p className="text-grey-800">{comment.description} </p>	
																							</div>
																							<div className="flex flex-col pl-4">
																								{session ? (
																									(loggedUser._id == (comment.user)._id) ? (
																										<Button onClick={()=> deleteComment(comment._id)} className="bg-orange-500 hover:bg-orange-700 mt-2" pill={true} size="xs">
																											<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
																										</Button>
																									) : null
																								) : (
																									<Button onClick={()=> deleteComment(comment._id)} className="bg-orange-500 hover:bg-orange-700 mt-2" pill={true} size="xs">
																										<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
																									</Button>
																								)}
																							</div>
																						</div>
																					</div>
																				</div>
																			</li>
																			
																		)
																	})) : null
																}
															</ul>
															<div className="pt-2">
																<form onSubmit={submitComment} action={`https://${process.env.URL}/housing`}>
																	<input type="text" hidden={true} id="id" name="id" value={house._id}/>
																	{session ? (
																		<input type="text" hidden={true} id="userComment" name="_userComment" value={loggedUser._id}/>
																	) : (
																		<input type="text" hidden={true} id="userComment" name="_userComment" value={"63849607a19b1a6fb9746b83"}/>
																	)}
																	<div className="pb-2">
																		<div>
																			<label className="text-gray-800"htmlFor="descriptionComment"> Comentario </label>
																		</div>
																		<Textarea id="descriptionComment" type="textarea" rows={2} name="_descriptionComment" placeholder="Comentario" className="text-sm"/>
																	</div>
																	<input type="text" hidden={true} id="reviewComment" name="_reviewComment" value={review._id}/>
																	<div className="flex items-left pt-1">
																		<Button type="submit" color="dark" outline={true}>
																			Comentar
																		</Button>
																	</div>
																</form>
															</div>
														</div>
													</div>
												</div>
											</div>
										</li>
									)
								}))
								:
								(
									<div className="flex flex-col w-full h-full items-left justify-center">
										<span>No se han encontrado resultados en esta lista.</span>
									</div>
								)
							}

						</ul>
						<hr class="h-px bg-gray-200 border-0 dark:bg-gray-700 w-4/12"></hr>
						<p className="text-2xl font-semibold text-gray-800 pt-4 pb-2" style={{"line-height": "0"}}>Publicar reseña</p>
						<div className="pt-2 w-4/12">
							<form onSubmit={submitReview} id="reviewForm" action={`https://${process.env.URL}/housing`}>
								<input type="text" hidden={true} id="id" name="id" value={house._id}/>
								{session ? (
									<input type="text" hidden={true} id="userReview" name="_userReview" ref={userReview} value={loggedUser._id}/>
								) : (
									<input type="text" hidden={true} id="userReview" name="_userReview" ref={userReview} value={"63849607a19b1a6fb9746b83"}/>
								)}
								<div className="pb-2">
									<div>
										<label className="text-gray-800"htmlFor="scoreReview"> Nota </label>
									</div>
									<TextInput id="scoreReview" name="_scoreReview" placeholder="Nota" ref={scoreReview} style={{width: "60px"}}/>
								</div>
								<div className="pb-2">
									<div>
										<label className="text-gray-800"htmlFor="titleReview"> Título </label>
									</div>
									<TextInput id="titleReview" name="_titleReview" placeholder="Título" ref={titleReview}/>
								</div>
								<div className="pb-2">
									<div>
										<label className="text-gray-800"htmlFor="descriptionReview"> Reseña </label>
									</div>
									<Textarea id="descriptionReview" type="textarea" rows={4} name="_descriptionReview" placeholder="Reseña" className="text-sm" ref={descriptionReview}/>
								</div>
								<input type="text" hidden={true} id="housingReview" name="_housingReview" ref={housingReview} value={house._id}/>

								<input hidden={true} name="user_email" value={owner.email}  />
								<input hidden={true} name="user_name" value={owner.name}  />
								<input hidden={true} name="user_housing" value={`https://${process.env.URL}/housing?id=${house._id}`}/>

								<div className="flex items-left pt-1">
									<Button type="submit" >
										Publicar reseña
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export async function getServerSideProps(ctx){

	const {id} = ctx.query

	const house = await fetch(`https://${process.env.URL}/api/housings/${id}`)
		.then(response => response.json())

	const owner = await fetch(`https://${process.env.URL}/api/users/${house.owner}`)
		.then(response => response.json())

	const reviews = await fetch(`https://${process.env.URL}/api/reviews/housing/${id}`)
		.then(response => response.json())

	for(const review of reviews) {
		const user = await fetch(`https://${process.env.URL}/api/users/${review.user}`).then(response => response.json())
		review.user = user

		const comments = await fetch(`https://${process.env.URL}/api/comments/review/${review._id}`).then(response => response.json())
		for(const comment of comments) {
			const user = await fetch(`https://${process.env.URL}/api/users/${comment.user}`).then(response => response.json())
			comment.user = user
		}
		review.comments = comments
	}
		



	const session = await getSession(ctx)

	if(session) {
		const loggedUser = await fetch(`https://${process.env.URL}/api/users/email/${(session.user).email}`).then(response => response.json())

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
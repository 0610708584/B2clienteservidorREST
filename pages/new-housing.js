import { ImageUpload } from "../components/cloudinary-upload-widget";
import { useSession, getSession } from "next-auth/react"
import { Button, TextInput, Textarea } from "flowbite-react"
import { useRef } from "react"
import { useState } from "react"
import NavbarItem from "../components/navbar"

const CreateHousing = ({loggedUser}) => {
	const { data: session } = useSession()

	const title = useRef()
	const description = useRef()
	const address = useRef()
	const price = useRef()
	const owner = useRef()
	const lat = useRef()
	const lng = useRef()
	const public_id = useRef()

	const handleSubmit = async() => {
		await fetch(`https://${process.env.URL}/api/housings`,{
			body: JSON.stringify({
				title: title.current.value,
				description: description.current.value,
				address: address.current.value,
				price: price.current.value,
				owner: document.getElementById("owner").value,
				lat: lat.current.value,
				lng: lng.current.value,
				public_id: public_id.current.value  
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

				<h1 className="text-2xl font-normal ">Crear alojamiento</h1>
				<form onSubmit={handleSubmit} action={`https://${process.env.URL}/housings`}>
				{/** Esto es temporal, hasta que tengamos la sesion del usuario 
					<input type="text" hidden={true} id="owner" name="owner" ref={owner} value={"636d57a75c1044b28b7fe9c8"}/>   */}
					<div className="pb-2 w-96">
						<div>
							<label className="text-gray-800"htmlFor="title"> Título </label>
						</div>
						<TextInput required={true} id="title" name="_title" placeholder="Título" ref={title}/>
					</div>
					<div className="pb-2">
						<div>
							<label className="text-gray-800"htmlFor="description"> Descripcion </label>
						</div>
						<Textarea id="description" type="textarea" rows={4} name="_description" placeholder="Descripcion" className="text-sm" ref={description}/>
					</div>
					<div className="pb-2">
						<div>
							<label className="text-gray-800"htmlFor="address"> Dirección </label>
						</div>
						<TextInput required={true} id="address" name="_address" placeholder="Dirección" ref={address}/>
					</div>
					<div className="pb-2">
						<div>
							<label className="text-gray-800"htmlFor="price"> Precio por noche </label>
						</div>
						<TextInput required={true} id="price" name="_price" placeholder="Precio por noche" ref={price}/>
					</div>
					{session ? (
						<div className="pb-2">
							<div>
								<label className="text-gray-800"htmlFor="price"> Identificador de propietario </label>
							</div>
							<TextInput required={true} id="owner" name="_owner" placeholder="Identificador de propietario" value={loggedUser._id} disabled={true}/>
						</div>
					) : (
						<div className="pb-2">
							<div>
								<label className="text-gray-800"htmlFor="price"> Identificador de propietario </label>
							</div>
							<TextInput required={true} id="owner" name="_owner" placeholder="Identificador de propietario" ref={owner}/>
						</div>
					)}
					<div className="pb-2">
						<div>
							<label className="text-gray-800"htmlFor="lat"> Latitud</label>
						</div>
						<TextInput required={true} id="lat" name="_lat" placeholder="Latitud" ref={lat}/>
					</div>
					<div className="pb-2">
						<div>
							<label className="text-gray-800"htmlFor="lng"> Longitud</label>
						</div>
						<TextInput required={true} id="lng" name="_lng" placeholder="Longitud" ref={lng}/>
					</div>
					<div className="pb-4">
						<div>
							<label className="text-gray-800"htmlFor="public_id"> Identificador de foto </label>
						</div>
						<TextInput required={true} id="public_id" name="_public_id" placeholder="Identificador de foto" ref={public_id} disabled={true}/>
						<div className="pt-4">
							<ImageUpload />
						</div>
					</div>
					<div className="flex flex-col items-center">
						<Button type="submit">
							Crear
						</Button>
					</div>
				</form>

		</div>
		</>
	)
}

export async function getServerSideProps(ctx){
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

export default CreateHousing
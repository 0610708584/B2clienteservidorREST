import { useState } from "react";
import { Button } from "flowbite-react"

export function ImageUpload() { 
  async function handleWidgetClick() {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.CLOUDINARY_URL,
        uploadPreset: process.env.CLOUDINARY_KEY,
        resourceType: "image",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          document.getElementById("public_id").value = result.info.public_id;
        } else if (error) {
          console.log(error);
        }
      }
    );
    widget.open();
  }

  return (
    <Button color="dark" outline={true} onClick={handleWidgetClick}>
      Subir imagen
    </Button>
  );
}
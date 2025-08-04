'use server';
import z from "zod";
import { safeParse } from "zod/v4-mini";
import { db } from "~/server/db";
import fs from "fs/promises";

const fileSchema = z.instanceof(File, { message: "Required" })
const imageSchema = fileSchema.refine(
  file => file.size === 0 || file.type.startsWith("image/")
)
export async function upload(formData: FormData) {
    
   

    const result=imageSchema.safeParse(formData.get("image"));

    if(!result.success){
        console.error("Image upload failed:", result.error);
        return new Response("Image upload failed");
    }

    const image=result.data;

    try {
        await fs.mkdir("public/uploads", { recursive: true });
        const filePath = `public/uploads/${image.name}`;

        await fs.writeFile(filePath, Buffer.from(await image.arrayBuffer()));
        console.log("Image uploaded successfully:", filePath);
    
    
    }

    catch (error) {
        console.error("Error uploading image:", error);
        return new Response("Error uploading image");
    }

    console.log("Image upload function called");
    

    return new Response("Wiw");
                 


}
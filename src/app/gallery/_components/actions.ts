'use server';
import z from "zod";
import { safeParse } from "zod/v4-mini";
import { db } from "~/server/db";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
import { NextResponse } from "next/server";


const fileSchema = z.custom<File>(
  (file) => file instanceof Blob, { message: "Invalid file" }
);

const imageSchema = fileSchema
  .refine(file => file.size <= MAX_FILE_SIZE, {
    message: "File too large"
  })
  .refine(file => file.size === 0 || file.type.startsWith("image/"), {
    message: "Only images allowed"
  });

export async function upload(formData: FormData) {
    
   

    const result=imageSchema.safeParse(formData.get("image"));

    if(!result.success){
        console.error("Image upload failed:", result.error);
        return new Response("Image upload failed");
    }

    const image=result.data;

    try {
        await fs.mkdir("public/uploads", { recursive: true });
        const filePath = `public/uploads/${randomUUID()}-${image.name}`;

         
        await fs.writeFile(filePath, Buffer.from(await image.arrayBuffer()));
        console.log("Image uploaded successfully:", filePath);
    
    
    }

    catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json({ message: "Error uploading image" }, { status: 500 });
    }

    console.log("Image upload function called");
    return NextResponse.json({ message: "Upload successful" }, { status: 200 });



}
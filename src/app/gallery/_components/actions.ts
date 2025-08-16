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
        //image goes to model and the category, type, name, color, pattern

        const category = "Top";
        const Type = "shirt";
        const Colors = [{ name: "unknown", hex: "#FFFFFF" }];
        const Name = "name";
        const userId = 123; // Replace with actual user ID logic

        if (category === "Top") {
          await db.top.create({
            data: {
              name: Name, 
              imageUrl: filePath, 
              
              topType: {
                connectOrCreate: {
                  where: { name: Type },   
                  create: { name: Type }
                }
              },

        // Link to Colors (can be multiple)
              colors: {
                connectOrCreate: Colors.map(c => ({
                  where: { name: c.name },
                  create: { name: c.name, hexCode: c.hex }
                }))
              },

        // You’ll also need user reference
        user: {
          connect: { id: userId }  // whoever uploaded this
        }
      }
    });
        }
        else if (category === "Bottom") {
          await db.bottom.create({
            data: {
              name: Name,
              imageUrl: filePath,

              bottomType: {
                connectOrCreate: {
                  where: { name: Type },
                  create: { name: Type }
                }
              },

              colors: {
                connectOrCreate: Colors.map(c => ({
                  where: { name: c.name },
                  create: { name: c.name, hexCode: c.hex }
                }))
              },

              user: {
                connect: { id: userId }
              }
      }
    });
        }

        else if (category === "OnePiece") {
          await db.onePiece.create({
            data: {
              name: Name,
              imageUrl: filePath,

              onePieceType: {
                connectOrCreate: {
                  where: { name: Type },
                  create: { name: Type }
                }
              },

              colors: {
                connectOrCreate: Colors.map(c => ({
                  where: { name: c.name },
                  create: { name: c.name, hexCode: c.hex }
                }))
              },

              user: {
                connect: { id: userId }
              }
            }
          });
        }

        else if (category === "Footwear") {
          await db.footwear.create({
            data: {
              name: Name,
              imageUrl: filePath,

              footwearType: {
                connectOrCreate: {
                  where: { name: Type },
                  create: { name: Type }
                }
              },

              colors: {
                connectOrCreate: Colors.map(c => ({
                  where: { name: c.name },
                  create: { name: c.name, hexCode: c.hex }
                }))
              },

              user: {
                connect: { id: userId }
              }
            }
          });
        }
    
    }

    catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json({ message: "Error uploading image" }, { status: 500 });
    }

    console.log("Image upload function called");
    return NextResponse.json({ message: "Upload successful" }, { status: 200 });



}
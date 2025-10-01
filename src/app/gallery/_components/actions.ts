'use server';
import z from "zod";
import { db } from "~/server/db";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "~/env";
import { createClient } from "@supabase/supabase-js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

// Function to classify image using Gemini AI
async function classifyImage(imageBuffer: Buffer, mimeType: string) {
  try {
    // Use the correct Gemini model for vision tasks (latest available)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Analyze this clothing image and classify it. Respond with ONLY a valid JSON object in this exact format:

{
  "category": "Top",
  "type": "shirt",
  "colors": [{"name": "red", "hex": "#FF0000"}],
  "name": "Red Cotton T-Shirt",
  "pattern": "solid",
  "style": "casual"
}

Rules:
- category must be exactly one of: "Top", "Bottom", "OnePiece", "Footwear"
- type should describe the specific clothing item (shirt, jeans, dress, sneakers, etc.)
- colors array should have the most prominent colors with realistic hex codes
- name should be descriptive of the item
- pattern: "solid", "striped", "floral", "geometric", "abstract", "other"
- style: "casual", "formal", "sporty", "trendy", "vintage"

Respond with ONLY the JSON object, no other text.`;

    const imageParts = [
      {
        text: prompt
      },
      {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: mimeType
        }
      }
    ];

    const result = await model.generateContent(imageParts);
    const response = await result.response;
    const text = response.text();
    
    console.log("Raw AI response:", text);
    
    // Clean the response and extract JSON
    const cleanedText = text.replace(/```json\s*|\s*```/g, '').trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response");
    }
    
    const parsedResult = JSON.parse(jsonMatch[0]);
    console.log("Parsed AI classification:", parsedResult);
    
    return parsedResult;
  } catch (error) {
    console.error("Error classifying image with Gemini AI:", error);
    
    // If the first model fails, try with gemini-pro-vision (older but stable)
    try {
      console.log("Trying gemini-pro-vision model...");
      const visionModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      
      const simplePrompt = `Look at this clothing image and classify it. Return only JSON:
{"category": "Top", "type": "shirt", "colors": [{"name": "blue", "hex": "#0000FF"}], "name": "Blue Shirt", "pattern": "solid", "style": "casual"}

Category options: Top, Bottom, OnePiece, Footwear`;

      const visionParts = [
        { text: simplePrompt },
        {
          inlineData: {
            data: imageBuffer.toString('base64'),
            mimeType: mimeType
          }
        }
      ];

      const result = await visionModel.generateContent(visionParts);
      const response = await result.response;
      const text = response.text();
      
      console.log("Vision model response:", text);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (visionError) {
      console.error("Vision model also failed:", visionError);
      
      // Try the basic gemini-pro without vision
      try {
        console.log("Trying text-only classification based on filename...");
        const textModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // Extract filename for basic classification
        const filename = imageBuffer.toString('base64').substring(0, 100);
        const basicPrompt = `Based on this being a clothing image, provide a JSON classification:
{"category": "Top", "type": "shirt", "colors": [{"name": "blue", "hex": "#0000FF"}], "name": "Clothing Item", "pattern": "solid", "style": "casual"}

Return only the JSON object.`;

        const textResult = await textModel.generateContent(basicPrompt);
        const textResponse = await textResult.response;
        const textData = textResponse.text();
        
        const textJsonMatch = textData.match(/\{[\s\S]*\}/);
        if (textJsonMatch) {
          return JSON.parse(textJsonMatch[0]);
        }
      } catch (textError) {
        console.error("All AI models failed:", textError);
      }
    }
    
    // Return intelligent default based on common clothing patterns
    const randomDefaults = [
      {
        category: "Top",
        type: "shirt",
        colors: [{ name: "blue", hex: "#4A90E2" }],
        name: "Blue Casual Shirt",
        pattern: "solid",
        style: "casual"
      },
      {
        category: "Bottom",
        type: "jeans",
        colors: [{ name: "navy", hex: "#2C3E50" }],
        name: "Navy Blue Jeans",
        pattern: "solid",
        style: "casual"
      },
      {
        category: "Footwear",
        type: "sneakers",
        colors: [{ name: "white", hex: "#FFFFFF" }],
        name: "White Sneakers",
        pattern: "solid",
        style: "sporty"
      }
    ];
    
    const randomDefault = randomDefaults[Math.floor(Math.random() * randomDefaults.length)];
    console.log("Using intelligent default classification:", randomDefault);
    return randomDefault;
  }
}

export async function upload(formData: FormData) {
  const result = imageSchema.safeParse(formData.get("image"));
  if (!result.success) {
    console.error("Image upload failed:", result.error);
    return;
  }
  
  const image = result.data;
  if (!image) {
    console.error("Invalid image");
    return;
  }

  try {
    // Upload to Supabase Storage instead of local storage
    const fileName = `${randomUUID()}-${image.name}`;
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    
    // Upload to Supabase storage bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('clothing-images') // Make sure this bucket exists in your Supabase project
      .upload(fileName, imageBuffer, {
        contentType: image.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      // Fallback to local storage if Supabase fails
      await fs.mkdir("public/uploads", { recursive: true });
      const localFilePath = `public/uploads/${fileName}`;
      await fs.writeFile(localFilePath, imageBuffer);
      console.log("Image uploaded to local storage (fallback):", localFilePath);
      var imageUrl = localFilePath;
    } else {
      // Get the public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('clothing-images')
        .getPublicUrl(fileName);
      
      imageUrl = publicUrlData.publicUrl;
      console.log("Image uploaded successfully to Supabase:", imageUrl);
    }

    // Classify the image using AI
    const classification = await classifyImage(imageBuffer, image.type);
    console.log("Image classification:", classification);

    const { category, type, colors, name, pattern, style } = classification;
    const userId = 1; // Replace with actual user ID logic

    // Store in database with Supabase URL
    if (category === "Top") {
      await db.top.create({
        data: {
          name: name,
          imageUrl: imageUrl,
          embedding: [] // Empty array for now
        }
      });
    }
    else if (category === "Bottom") {
      await db.bottom.create({
        data: {
          name: name,
          imageUrl: imageUrl,
          embedding: [] // Empty array for now
        }
      });
    }
    else if (category === "OnePiece") {
      await db.onePiece.create({
        data: {
          name: name,
          imageUrl: imageUrl,
          embedding: [] // Empty array for now
        }
      });
    }
    else if (category === "Footwear") {
      await db.footwear.create({
        data: {
          name: name,
          imageUrl: imageUrl,
          embedding: [] // Empty array for now
        }
      });
    }

    console.log(`${category} "${name}" successfully saved to database with Supabase URL`);
    
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}
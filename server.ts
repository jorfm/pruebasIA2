import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured. Please add your key in the AI Studio Secrets panel.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: "ok",
    hasApiKey: hasKey,
    defaultImageModel: "gemini-3.1-flash-lite-image",
  });
});

// Analyze and structure product into a Brand Profile + Canonical Anchor Prompt
app.post("/api/brand/analyze-product", async (req: Request, res: Response) => {
  try {
    const { productDescription, productName, category } = req.body;
    if (!productDescription) {
      return res.status(400).json({ error: "Product description is required." });
    }

    const ai = getGeminiClient();

    const analysisPrompt = `You are a world-class luxury brand director and industrial designer.
Analyze the following product input and structure it into a comprehensive Brand Identity Profile and tailored image prompts.

CRITICAL RULES:
1. All imagery MUST strictly forbid humans or people. Every prompt must specify inanimate product subject only with NO people, no models, no hands, no faces.
2. Formulate an exact visual identity (materials, colors, logo marks, shape silhouette, packaging texture).
3. Generate high-fidelity prompt descriptors for standard marketing mediums:
   - Canonical Studio Anchor Shot (1:1 aspect ratio, clean cyclorama, studio lighting)
   - City Billboard (16:9, architectural rooftop/highway billboard against dusk city skyline)
   - Broadsheet Newspaper Ad (3:4, tactile newsprint paper, crisp serif typography layout, product hero)
   - Social Media Post (1:1, curated modern podium staging, travertine stone, architectural shadows)
   - Vertical Social Story (9:16, dynamic vertical editorial composition)
   - Transit Shelter Poster (3:4, illuminated glass bus stop lightbox at blue hour)
   - Luxury Magazine Spread (16:9, double page editorial spread layout)
   - Boutique Retail Display (4:3, marble plinth showcase with museum spotlights)
   - Merch & Packaging Suite (1:1, branded rigid box, unboxing layout, canvas tote, canister)
   - Night Street Poster (3:4, wheatpaste poster in neon-lit urban alleyway)

User Input:
${productName ? `Suggested Name: ${productName}\n` : ''}${category ? `Suggested Category: ${category}\n` : ''}Product Description: ${productDescription}

Return a valid JSON object matching this schema:
{
  "productName": "string",
  "category": "string",
  "tagline": "string",
  "keyFeatures": ["string", "string", "string"],
  "materialsAndFinish": "string (e.g. frosted amber glass, knurled brass cap, matte ecru paper label)",
  "colorPalette": {
    "primary": "hex code (e.g. #B45309)",
    "secondary": "hex code",
    "accent": "hex code",
    "surface": "hex code"
  },
  "packagingStyle": "string",
  "typographyVibe": "string",
  "canonicalDescription": "Detailed 2-3 sentence visual description of the physical product object for consistency conditioning",
  "anchorPrompt": "Detailed prompt for 1:1 anchor product studio shot without people",
  "mediumPrompts": {
    "billboard": "Prompt for 16:9 city skyline billboard featuring this exact product, no people",
    "newspaper": "Prompt for 3:4 broadsheet newspaper ad featuring this exact product, no people",
    "social_post": "Prompt for 1:1 social media feed hero shot with stone plinths and botanical shadows, no people",
    "social_story": "Prompt for 9:16 vertical full-screen mobile story ad, no people",
    "transit_shelter": "Prompt for 3:4 illuminated glass bus stop lightbox at dusk, no people",
    "magazine_spread": "Prompt for 16:9 double-page magazine spread mockup, no people",
    "retail_display": "Prompt for 4:3 boutique retail shelf and pedestal display with spotlights, no people",
    "merch_suite": "Prompt for 1:1 branded unboxing packaging, rigid box and merch flat-lay, no people",
    "neon_street": "Prompt for 3:4 urban street wheatpaste poster bathed in neon lights, no people"
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: analysisPrompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const textOutput = response.text || "{}";
    const brandData = JSON.parse(textOutput);

    res.json({ success: true, data: brandData });
  } catch (error: any) {
    console.error("Error analyzing product:", error);
    res.status(500).json({
      error: error.message || "Failed to analyze product. Please check your API key.",
    });
  }
});

// Generate Canonical Anchor Product Image or Medium Shot using Nano-Banana model
app.post("/api/brand/generate-image", async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      aspectRatio = "1:1",
      referenceImage, // Base64 anchor product image for visual consistency conditioning
      model = "gemini-3.1-flash-lite-image", // Nano-Banana default
      mediumId,
      productSpecs,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const ai = getGeminiClient();

    // Map to valid aspect ratios
    const validAspectRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];
    const targetAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : "1:1";

    // Build parts payload
    const parts: any[] = [];

    // If we have an anchor reference image, inject it to maintain visual product consistency
    if (referenceImage && typeof referenceImage === "string" && referenceImage.includes("base64,")) {
      const cleanBase64 = referenceImage.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: "image/png",
        },
      });
    }

    // Build the final prompt with strict consistency and negative no-people conditioning
    let fullPromptText = prompt;
    if (referenceImage) {
      fullPromptText = `[PRODUCT CONSISTENCY REFERENCE PROVIDED]: You MUST replicate and preserve the exact product design, materials, colors, logos, bottle/container shape, and finishes shown in the reference image into this new scene.
${productSpecs ? `Product Details: ${productSpecs}\n` : ""}
Scene Description: ${prompt}

MANDATORY RULES:
- The product itself must look completely identical to the reference image in shape, branding, color shades, cap/accessories, and texture.
- STRICT NO-PEOPLE REQUIREMENT: Absolutely NO human models, NO people, NO hands, NO faces, NO human silhouettes, NO crowds. The scene must contain ONLY the inanimate product and environment.
- Commercial 8k photorealistic editorial advertising photography, crisp focus, pristine lighting.`;
    } else {
      fullPromptText = `${prompt}

MANDATORY RULES:
- STRICT NO-PEOPLE REQUIREMENT: Absolutely NO human beings, NO models, NO hands, NO faces, NO silhouettes. Inanimate commercial product subject ONLY.
- 8k photorealistic commercial advertising studio photography, pristine materials, crisp studio lighting.`;
    }

    parts.push({ text: fullPromptText });

    // Use requested nano banana model
    const selectedModel = model === "gemini-3.1-flash-image" ? "gemini-3.1-flash-image" : "gemini-3.1-flash-lite-image";

    console.log(`Generating image for medium: ${mediumId || 'custom'}, model: ${selectedModel}, aspectRatio: ${targetAspectRatio}`);

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: {
        parts,
      },
      config: {
        imageConfig: {
          aspectRatio: targetAspectRatio,
        },
      },
    });

    let generatedImageUrl: string | null = null;
    let textFeedback = "";

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || "image/png";
          generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textFeedback += part.text;
        }
      }
    }

    if (!generatedImageUrl) {
      console.warn("No image part returned in response:", textFeedback);
      return res.status(500).json({
        error: textFeedback || "The AI model completed without returning an image. Please try a slightly modified prompt.",
      });
    }

    res.json({
      success: true,
      imageUrl: generatedImageUrl,
      mediumId,
      aspectRatio: targetAspectRatio,
      modelUsed: selectedModel,
      promptUsed: fullPromptText,
    });
  } catch (error: any) {
    console.error("Error generating image:", error);
    res.status(500).json({
      error: error.message || "Failed to generate image with the Nano-Banana model. Please verify your Gemini API key.",
    });
  }
});

// Edit or refine an existing shot (e.g. adjust lighting, change background setting)
app.post("/api/brand/edit-shot", async (req: Request, res: Response) => {
  try {
    const {
      currentImage,
      anchorImage,
      modificationInstructions,
      aspectRatio = "1:1",
      model = "gemini-3.1-flash-lite-image",
    } = req.body;

    if (!modificationInstructions) {
      return res.status(400).json({ error: "Modification instructions are required." });
    }

    const ai = getGeminiClient();
    const parts: any[] = [];

    const baseImage = currentImage || anchorImage;
    if (baseImage && typeof baseImage === "string" && baseImage.includes("base64,")) {
      const cleanBase64 = baseImage.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: "image/png",
        },
      });
    }

    const editPrompt = `Modify and refine this commercial product image according to these specific instructions:
${modificationInstructions}

CRITICAL CONSTRAINTS:
1. Maintain exact product visual consistency (same logo, colors, materials, shape).
2. STRICT NO-PEOPLE REQUIREMENT: Absolutely NO people, NO human models, NO faces, NO hands. The scene must remain 100% inanimate.
3. Photorealistic 8k commercial quality, realistic lighting and reflections.`;

    parts.push({ text: editPrompt });

    const validAspectRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];
    const targetAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : "1:1";
    const selectedModel = model === "gemini-3.1-flash-image" ? "gemini-3.1-flash-image" : "gemini-3.1-flash-lite-image";

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: targetAspectRatio,
        },
      },
    });

    let imageUrl: string | null = null;
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: "Failed to apply edits to image." });
    }

    res.json({
      success: true,
      imageUrl,
      aspectRatio: targetAspectRatio,
    });
  } catch (error: any) {
    console.error("Error editing shot:", error);
    res.status(500).json({
      error: error.message || "Failed to edit image.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Brand Builder server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

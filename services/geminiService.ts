
import { GoogleGenAI, Type } from "@google/genai";
import { ProductData, PromptResponse, ProductType, VisualEmphasis } from "../types";

// Initialize the client with the API Key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePrompts = async (data: ProductData): Promise<PromptResponse> => {
  const modelName = 'gemini-2.5-flash'; 

  // --- SMART LOGIC FOR EMPHASIS ---
  let specificCameraActions = "";
  let specificModelActions = "";

  switch (data.visualEmphasis) {
    case VisualEmphasis.QUALITY_TEST:
      specificCameraActions = "Camera Position: Low angle looking up or side profile to capture depth. Start steady, then zoom in slightly during the movement.";
      specificModelActions = "CRITICAL ACTION: If this is legwear/activewear, she MUST perform a deep squat (squat test) or bend over slightly to prove the fabric is non-transparent (squat-proof) and stretchy. She should pull the fabric at the waist to show elasticity.";
      break;
    case VisualEmphasis.TEXTURE_ZOOM:
      specificCameraActions = "Camera Lens: Macro 100mm style. Use 'Rack Focus' shifting from her face to the product texture. Extreme close-ups on the material/fabric/surface.";
      specificModelActions = "She brings the product/fabric extremely close to the lens. She runs her manicured nails slowly over the surface to show texture (ribbed, silk, matte). She pinches the fabric to show thickness.";
      break;
    case VisualEmphasis.MOVEMENT:
      specificCameraActions = "Camera Movement: 'Orbital Shot' (circling the model) or 'Dolly Out' as she walks. Slow-motion segments (60fps style) when she turns.";
      specificModelActions = "She performs a full 360-degree spin (twirl) to show the back of the outfit. She walks forward, then turns her back to the camera and looks over her shoulder. She grabs the skirt/dress/fabric and lets it flow/drop to show how lightweight it is.";
      break;
    case VisualEmphasis.LIFESTYLE:
      specificCameraActions = "Camera Style: Handheld aesthetic (stabilized) for a vlog/POV feel. Dynamic and following her movement.";
      specificModelActions = "She is using the product in a real scenario (e.g., drinking from the cup, typing on the device, fixing her hair). It should feel candid and unposed, like a 'Get Ready With Me' snippet.";
      break;
    default: // Balanced
      specificCameraActions = "Mix of medium shots (waist up) and close-ups on hands.";
      specificModelActions = "Standard influencer presentation: holding product, pointing, smiling, and the 'Link' gesture.";
      break;
  }

  // --- TYPE LOGIC ---
  let lookInstruction = "";
  if (data.productType === ProductType.FASHION) {
    lookInstruction = `The "LOOK" section must describe the '${data.productName}' being WORN. Specify fit (high-waisted, compressive, loose), fabric finish (matte, glossy, ribbed), and color vibrancy.`;
  } else {
    lookInstruction = `The "LOOK" describes a stylish outfit fitting '${data.environment}', but the focus is on the '${data.productName}' she is holding/using.`;
  }

  const priceInstruction = data.hasPrice 
    ? `Include the price (${data.price}) naturally in the Portuguese dialogue.` 
    : `Do not mention a specific number. Use terms like "preço de fábrica", "super oferta", "queima de estoque".`;

  const systemInstruction = `
    You are a World-Class Director of Photography and Prompt Engineer for Veo3/Sora2.
    
    YOUR GOAL: Create hyper-realistic, high-converting video prompts for TikTok Shop.
    
    INPUT CONTEXT:
    - Product: ${data.productName}
    - Type: ${data.productType}
    - Features: ${data.features}
    - Environment: ${data.environment}
    - Visual Strategy: ${data.visualEmphasis}

    INSTRUCTIONS FOR REALISM:
    1. **Lighting:** Always specify how light hits the material (e.g., "Subsurface scattering on skin", "Specular highlights on the fabric", "Soft diffused daylight").
    2. **Camera:** Use cinematic terms: Depth of Field (Bokeh), Rack Focus, Dolly Zoom, Gimbal Smooth.
    3. **Fabric/Physics:** If fashion, describe how the cloth moves (heavy drape, lightweight flow, stretch tension).

    OUTPUT FORMAT (Strict Block Structure):

    CHARACTER:
    [Stunning influencer description. Skin texture, hair physics, expression.]

    LOOK:
    [${lookInstruction}]

    SCENE SETUP:
    Location: ${data.environment}.
    Background: [Depth and detail].
    Lighting: [Cinematic lighting description].
    Aspect ratio: 9:16 vertical, photorealistic 4K.

    CAMERA MOVEMENTS:
    [${specificCameraActions}]

    ACTIONS:
    [${specificModelActions}
     IN ADDITION: She gestures the specific sales pitch. She MUST point down or to the side repeatedly for the "Carrinho Laranja".]

    DIALOGUE (Portuguese): INFLUENCIADORA: "[Natural, fast-paced PT-BR script. Mention features + 'Carrinho Laranja'. ${priceInstruction}]"

    ENDING:
    She smiles broadly. After the main shot fades, a short animated outro appears featuring the TikTok logo in the lower right corner, followed by the glowing white text “@achadinhos_da_ellenr”.
    The animation lasts around 1.5 seconds, with a smooth fade-in and subtle pulse effect.

    --------------------------------------------------
    
    GENERATE 4 VARIATIONS.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Generate 4 professional, cinematic prompts for ${data.productName}. Focus on: ${data.visualEmphasis}. Follow the format.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Title describing the shot (e.g., 'Variation 1: The Squat Test')" },
                  fullPrompt: { type: Type.STRING, description: "The COMPLETE strict text block." },
                  strategy: { type: Type.STRING, description: "Strategy/Angle used." }
                },
                required: ["title", "fullPrompt", "strategy"]
              }
            }
          },
          required: ["prompts"]
        }
      }
    });

    const jsonText = response.text;
    return JSON.parse(jsonText) as PromptResponse;

  } catch (error) {
    console.error("Error generating prompts:", error);
    throw new Error("Falha ao gerar os prompts. Tente novamente.");
  }
};

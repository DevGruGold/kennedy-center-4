import { pipeline, type TextGenerationOutput, type TextGenerationSingle } from "@huggingface/transformers";

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    // Using a public model that doesn't require authentication
    const generator = await pipeline(
      "text-generation",
      "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
      { 
        device: "webgpu",
        // Add credentials: 'omit' to prevent authentication attempts
        credentials: 'omit'
      }
    );

    const output = await generator(prompt, {
      max_length: 100,
      num_return_sequences: 1,
    });

    // Handle both possible output types
    if (Array.isArray(output)) {
      const firstOutput = output[0] as TextGenerationSingle;
      return firstOutput.generated_text || "Could not generate response";
    }
    
    return (output as TextGenerationSingle).generated_text || "Could not generate response";
  } catch (error) {
    console.error("Error generating response:", error);
    return "I apologize, but I'm having trouble accessing my knowledge at the moment. Please try again later.";
  }
};
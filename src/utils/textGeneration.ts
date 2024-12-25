import { pipeline } from "@huggingface/transformers";

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    // Using a smaller, public model that doesn't require authentication
    const generator = await pipeline(
      "text-generation",
      "Xenova/tiny-random-gpt2",
      { device: "webgpu" }
    );

    const output = await generator(prompt, {
      max_length: 100,
      num_return_sequences: 1,
    });

    // Handle both possible output types
    if (Array.isArray(output)) {
      return output[0].generated_text || "Could not generate response";
    }
    return output.generated_text || "Could not generate response";
  } catch (error) {
    console.error("Error generating response:", error);
    return "I apologize, but I'm having trouble accessing my knowledge at the moment. Please try again later.";
  }
};
import { AzureOpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Send a user message to the Azure OpenAI chat deployment and return the raw result.
 * Default message is a simple test question.
 * @param {string} userMessage
 * @returns {Promise<any>}
 */
export async function generateChat(userMessage = "Test question: What is 2+2?") {
  const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "https://vchan-mhpvydh4-eastus2.cognitiveservices.azure.com/";
  const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<REPLACE_WITH_YOUR_KEY_VALUE_HERE>";
  const apiVersion = "2025-01-01-preview";
  const deployment = process.env["AZURE_OPENAI_DEPLOYMENT"] || "gpt-5-chat";

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

  const result = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are an AI assistant that helps people find information." },
      { role: "user", content: userMessage }
    ],
    max_completion_tokens: 800
  });

  return result;
}
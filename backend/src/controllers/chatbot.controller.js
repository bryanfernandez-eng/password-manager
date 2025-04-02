import dotenv from 'dotenv';
import { OpenAI } from 'openai'; 

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY, 
    
}); 

export const generateChatResponse = async (req, res) => {
 try {
   const { message, chatHistory } = req.body;
   
   if (!message) {
     return res.status(400).json({ success: false, message: "Message is required" });
   }

   const formattedHistory = chatHistory.map(msg => ({
     role: msg.isUser ? "user" : "assistant",
     content: msg.text
   }));

   const systemMessage = {
     role: "system",
     content: "You are a helpful assistant for a password manager application. You can provide tips on password security, help with using the application features, and answer general questions about password management best practices. You cannot access or modify any user passwords. Keep your responses concise and focused on password management."
   };
   
   console.log("Sending request to OpenAI API");

   const response = await openai.chat.completions.create({
     model: "gpt-3.5-turbo",
     messages: [systemMessage, ...formattedHistory, { role: "user", content: message }],
     max_tokens: 300,
     temperature: 0.7,
   });

   console.log("Response received:", response);

   const aiResponse = response.choices[0].message.content;

   return res.status(200).json({
     success: true,
     response: aiResponse
   });
 } catch (error) {
   console.error("Chatbot error:", error.response?.data || error.message);
   return res.status(500).json({ success: false, message: "Failed to generate response" });
 }
};
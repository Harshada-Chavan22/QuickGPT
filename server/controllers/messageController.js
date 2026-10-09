import Chat from "../models/Chat.js"
import User from "../models/User.js"
import openai from "../configs/openai.js"

//text based AI chat message controller

export const textMessageController = async (req, res) => {
    try{
        const userId = req.user._id

        if(req.user.credits<1)
        {
            return res.json({success: false, message: "You don't have enough credits to use this feature"})
        }

        const {chatId, prompt} = req.body

        const chat = await Chat.findOne({userId, _id: chatId})
        chat.messages.push({role: "user", content: prompt, timestamp: Date.now(), isImage: false})

        const {choices} = await openai.chat.completions.create({
    model: "gemini-3.8-flash",
    messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
});

    const reply = {...choices[0].message, timestamp: Date.now(), isImage: false}
    res.json({success: true, reply})

    chat.messages.push(reply)
    await chat.save()

    await User.updateOne({_id: userId}, {$inc: {credits: -1}})


    } catch(error) {
        res.json({success: false, message: error.message})
    }
}

// image generation message controller

export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;

        if (req.user.credits < 2) {
            return res.json({
                success: false,
                message: "You don't have enough credits to use this feature"
            });
        }

        const { prompt, chatId, isPublished } = req.body;

        const chat = await Chat.findOne({
            userId,
            _id: chatId
        });

        if (!chat) {
            return res.json({
                success: false,
                message: "Chat not found"
            });
        }

        // Save user message
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });

        // Encode prompt
        const encodedPrompt = encodeURIComponent(prompt);

        // Generate image directly using ImageKit
        const generatedImageUrl =
            `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png`;

        console.log("Generated Image URL:");
        console.log(generatedImageUrl);

        const reply = {
            role: "assistant",
            content: generatedImageUrl,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        };

        chat.messages.push(reply);

        await chat.save();

        await User.updateOne(
            { _id: userId },
            { $inc: { credits: -2 } }
        );

        return res.json({
            success: true,
            reply
        });

    } catch (error) {
        console.log("IMAGE ERROR:", error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};
//this is the solution for the actual workflow
//that's why the program is structured in this way, to ensure that the user has enough credits before proceeding with the AI generation and to handle the image generation and upload process seamlessly.
//so, the workflow is as follows:
//1. Check if the user has enough credits to use the feature (1 credit for text, 2 credits for image).
//2. If the user has enough credits, proceed with the AI generation (text or image).      
//3. For text messages, send the prompt to the OpenAI API and get the response, then save it to the chat and deduct 1 credit from the user.  
//4. For image messages, send the prompt to ImageKit for AI image generation, convert the response to base64, upload it to ImageKit's media library, save the URL to the chat, and deduct 2 credits from the user.    
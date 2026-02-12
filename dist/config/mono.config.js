import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export default async function monoApiConfig({ version, endpoint, data, }) {
    if (!process.env.MONO_SEC_KEY) {
        throw new Error("MONO_SEC_KEY environment variable is not set");
    }
    const url = `https://api.withmono.com/${version}/${endpoint}`;
    console.log("Request URL:", url);
    console.log("Request data:", JSON.stringify(data, null, 2));
    try {
        const options = {
            method: "POST",
            url,
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "mono-sec-key": process.env.MONO_SEC_KEY,
            },
            ...(data && { data }),
        };
        const response = await axios.request(options);
        return response.data;
    }
    catch (error) {
        console.error("Mono API Error:");
        console.error("Status:", error.response?.status);
        console.error("Error data:", JSON.stringify(error.response?.data, null, 2));
        throw error;
    }
}

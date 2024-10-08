import { NextApiRequest, NextApiResponse } from "next";

// API route handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Make a GET request to the Flask API to fetch available contexts
      const flaskApiUrl = "http://localhost:5000/users"; // Replace with your Flask API URL

      const flaskResponse = await fetch(flaskApiUrl, {
        method: "GET",
      });

      const flaskResponseData = await flaskResponse.json();

      if (flaskResponse.ok) {
        // Send Flask API response back to the client
        res.status(200).json({ contexts: flaskResponseData });
      } else {
        // Handle errors from Flask API
        res
          .status(flaskResponse.status)
          .json({ error: "Error fetching data from Flask API" });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Error fetching data from Flask API" });
    }
  } else {
    // If a method other than GET is used, return a 405 error (Method Not Allowed)
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

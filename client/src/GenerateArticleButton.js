import { useAuth } from "@clerk/clerk-react";

function GenerateArticleButton() {
  const { getToken } = useAuth();

  const callApi = async () => {
    try {
      const token = await getToken(); // 👈 fresh JWT from Clerk
      const res = await fetch("http://localhost:3000/api/ai/generate-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: "Write me an article" }),
      });

      const data = await res.json();
      console.log("API response:", data);
    } catch (err) {
      console.error("Error calling API:", err);
    }
  };

  return <button onClick={callApi}>Generate Article</button>;
}

export default GenerateArticleButton;

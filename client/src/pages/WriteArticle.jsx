import { useAuth } from "@clerk/clerk-react";

function WriteArticle() {
  const { getToken } = useAuth();

  const handleClick = async () => {
    const token = await getToken({ template: "default" }); // always fetch fresh
    const res = await fetch("http://localhost:3000/api/ai/generate-article", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: "Hello world" }),
    });

    const data = await res.json();
    console.log(data);
  };

  return <button onClick={handleClick}>Test API</button>;
}

export default WriteArticle
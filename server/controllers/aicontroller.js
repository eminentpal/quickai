

export const generateArticle = async(req, res) => {
    try {
        const {userId} = req.auth();
        const {prompt, length} = req.body;
        const plan = req.plan
    } catch (error) {
        
    }
}
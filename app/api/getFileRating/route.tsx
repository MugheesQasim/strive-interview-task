import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, disconnectDatabase } from '../../lib/mongoDbConnection';
import { Octokit } from '@octokit/rest';
import { ChatOpenAI } from '@langchain/openai';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OPENAI_TOKEN = process.env.OPENAI_API_KEY;

interface GitHubBlobResponse {
    content: string;
    encoding: string;
}

interface OpenAICompletionChoice {
    text: string;
}

interface OpenAICompletionResponse {
    choices: OpenAICompletionChoice[];
}

const hardcodedResponse = {
    choices: [
        {
            text: `### Code Analysis for Quality, Readability, and Efficiency

#### **Score: 4/10**

#### **Reasoning:**

##### **Quality:**
- **Component Design (2/10):** 
   - The code follows a modular approach by extracting the form into a separate \`GitForm\` component. This is a good practice for separating concerns and making the codebase more maintainable.
   - **Pros:** The design is clear and concise, focusing on a single responsibility within the \`Home\` component.
   - **Cons:** There's some unnecessary repetition in class names (e.g., \`row-start-X\`, \`flex\`, and \`gap\` across different sections), which could be reduced by defining reusable CSS classes or Tailwind configuration for common styles.

##### **Readability:**
- **Clarity (5/10):** 
   - The component is easy to understand. It’s visually structured with clear sections (header, main content, and footer).
   - Proper semantic HTML elements like \`<header>\`, \`<main>\`, and \`<footer>\` are used, making the structure self-explanatory.
   - The class names are readable and aligned with Tailwind's utility-first design philosophy.

- **Comments and Documentation (5/10):** 
   - There's a lack of inline comments or documentation. While the component is small and easy to understand, adding brief comments could enhance readability for other developers or collaborators unfamiliar with the code.

##### **Efficiency:**
- **CSS (2/10):** 
   - Tailwind CSS is used efficiently, providing responsive design, grid layout, and utility classes. However, certain class names like \`row-start-X\`, \`gap-16\`, and \`flex-wrap\` might not be necessary for such a small layout and could be simplified.
   - The \`min-h-screen\` and \`p-8 pb-20\` values may not always be optimal for mobile screens and could be adjusted for more responsive designs.

- **Performance (4/10):** 
   - The \`Home\` component has good separation of concerns and uses minimal DOM elements, which should not significantly affect performance.
   - The dynamic rendering of the copyright year is a nice touch and optimizes the content without needing to hardcode it.

##### **Suggestions for Improvement:**
1. **Refactor Class Names:**
   - Consider abstracting repeated styles into reusable Tailwind CSS classes or making use of the Tailwind configuration to define reusable styles for common layouts or themes.

2. **Add Comments:**
   - While the code is straightforward, adding a few comments explaining the purpose of certain sections (e.g., why you use specific utility classes) can improve maintainability in larger teams.

3. **Responsive Improvements:**
   - While the layout is responsive due to Tailwind's utilities, consider adding more specific breakpoints for better mobile or tablet optimization.

4. **Testing:**
   - Ensure that the \`GitForm\` component is tested for form validation, submission handling, and UI responsiveness.

##### **Conclusion:**
The code is well-written, easy to follow, and uses modern practices like utility-first CSS and modular component structure. It would benefit from minor improvements in reusability, comment usage, and further refinement in mobile optimization. Overall, it's clean, functional, and maintains a solid balance between readability and efficiency.`
        }
    ]
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const analyzeCodeQuality = async (code: string) => {
    const prompt = `Analyze the following code for quality, readability, and efficiency. Give a score out of 10 and explain your reasoning.\n\n${code}`;

    const chatModel = new ChatOpenAI({
        apiKey: OPENAI_TOKEN
    });

    const response = chatModel.invoke(prompt);

    // const data = await response.json() as OpenAICompletionResponse;
    await delay(2000);
    // return (await response).content.toString().trim();

    const scoreMatch = hardcodedResponse.choices[0].text.trim().match(/Score:\s*(\d+)\/10/i);

    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

    return {
        score: score,
        reasoning: hardcodedResponse.choices[0].text.trim()
    };
};

const fetchFileFromGitHub = async (repoOwner: string, repoName: string, sha: string) => {
    const octokit = new Octokit({
        auth: GITHUB_TOKEN,
    });

    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/git/blobs/{file_sha}', {
            owner: repoOwner,
            repo: repoName,
            file_sha: sha,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });

        return response.data as GitHubBlobResponse;
    } catch (error) {
        console.error('Failed to fetch file from GitHub', error);
        throw new Error('Failed to fetch file from GitHub');
    }
};

export async function POST(req: NextRequest) {
    const { repoOwner, repoName, sha } = await req.json();

    try {
        const db = await connectToDatabase();

        const collection = db.collection('promptResult');

        const existingResult = await collection.findOne({ sha });

        if (existingResult) {
            return NextResponse.json({
                score: existingResult.result.score,
                reasoning: existingResult.result.reasoning,
            });
        }

        const blobResponse: GitHubBlobResponse = await fetchFileFromGitHub(repoOwner, repoName, sha);

        const decodedCode = Buffer.from(blobResponse.content, 'base64').toString('utf-8');

        const analysisResult = await analyzeCodeQuality(decodedCode);

        const newResult = await collection.insertOne({
            sha,
            result: {
                score: analysisResult.score,
                reasoning: analysisResult.reasoning,
            },
        });

        return NextResponse.json({
            score: analysisResult.score,
            reasoning: analysisResult.reasoning,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to analyze code' }, { status: 500 });
    }
    //  finally {
    //     await disconnectDatabase();
    // }
}

import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { ChatOpenAI } from '@langchain/openai';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OPENAI_TOKEN = process.env.OPENAI_API_KEY;

const hardcodedResponse = {
  choices: [
    {
      text: `### Code Analysis for Quality, Readability, and Efficiency

#### **Score: 4/10**

#### **Reasoning:**

##### **Quality:**
- **Component Design (2/10):** 
- The code follows a modular `
    }
  ]
};

const fetchCommitData = async (owner: string, repo: string, sha: string) => {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${sha}`);
  const data = await response.json();
  return data;
};

const fetchFileContent = async (rawUrl: string) => {
  const response = await fetch(rawUrl);
  const data = await response.text();
  return data;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const analyzeCodeQuality = async (code: string) => {
  const prompt = `Analyze the following code for quality, readability, and efficiency. Give a score out of 10 and explain your reasoning.\n\n${code}`;

  const chatModel = new ChatOpenAI({
    apiKey: OPENAI_TOKEN
  });

  const response = chatModel.invoke(prompt);

  await delay(2000);

  const scoreMatch = hardcodedResponse.choices[0].text.trim().match(/Score:\s*(\d+)\/10/i);

  const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

  return {
    score: score,
    reasoning: hardcodedResponse.choices[0].text.trim()
  };

  // return (await response).content.toString().trim();
};

const getCommitRatings = async (owner: string, repo: string, sha: string) => {
  try {
    const commitData = await fetchCommitData(owner, repo, sha);

    const fileRatings = await Promise.all(commitData.files.map(async (file: any) => {
      const fileContent = await fetchFileContent(file.blob_url.replace("github.com", "raw.githubusercontent.com"));

      const rating = await analyzeCodeQuality(fileContent);

      return {
        filename: file.filename,
        rating,
        reasoning: rating
      };
    }));

    return fileRatings;
  } catch (error) {
    console.error("Error fetching or analyzing commit data", error);
  }
};

export async function POST(req: NextRequest) {
  const { repoOwner, repoName, sha } = await req.json();

  try {

    const fileRatings = await getCommitRatings(repoOwner as string, repoName as string, sha as string);

    return NextResponse.json({
      fileRatings
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze code' }, { status: 500 });
  }
}

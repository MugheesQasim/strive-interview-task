import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';

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

const analyzeCodeQuality = async (code: string) => {
  const prompt = `Analyze the following code for quality, readability, and efficiency. Give a score out of 10 and explain your reasoning.\n\n${code}`;

  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_TOKEN}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 200,
    }),
  });

  const data = await response.json() as OpenAICompletionResponse;
  return data.choices[0].text.trim();
};

const fetchFileFromGitHub = async (repoOwner: string, repoName: string, sha: string) => {
    const octokit = new Octokit({
      auth: GITHUB_TOKEN,
    });
  
    const githuburl = `https://api.github.com/repos/${repoOwner}/${repoName}/git/blobs/${sha}`;
    try {
      const response = await octokit.request('GET ', {
        owner: repoOwner,
        repo: repoName,
        file_sha: sha,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
  
      const code = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return code;
    } catch (error) {
      console.error('Failed to fetch file from GitHub', error);
      throw new Error('Failed to fetch file from GitHub');
    }
  };

export async function POST(req: NextRequest) {
  const { repoOwner, repoName, sha } = await req.json();

  try {
    const code = await fetchFileFromGitHub(repoOwner, repoName, sha);
    const analysisResult = await analyzeCodeQuality(code);

    return NextResponse.json({
      score: 8,
      reasoning: analysisResult,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze code' }, { status: 500 });
  }
}

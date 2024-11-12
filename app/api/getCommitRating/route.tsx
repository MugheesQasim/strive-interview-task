import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { ChatMistralAI } from "@langchain/mistralai";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface MistralMessage {
  content: string;
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const fetchCommitData = async (owner: string, repo: string, sha: string) => {
  try {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
      owner: owner,
      repo: repo,
      ref: sha,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    return {
      sha: data.sha,
      commitMessage: data.commit.message,
      author: data.commit.author,
      files: data.files,
    };
  } catch (error) {
    console.error("Error fetching commit data:", error);
    throw error;
  }
};


const fetchFileContent = async (rawUrl: string) => {
  const response = await fetch(rawUrl);
  const data = await response.text();
  return data;
};

const analyzeCodeQuality = async (code: string) => {
  const prompt = `Analyze the following code for quality, readability, and efficiency. Give a score out of 10 and explain your reasoning.\n\n${code}`;

  const chatModel = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    maxRetries: 2,
  });

  const response = await chatModel.invoke(prompt);

  const data = response as MistralMessage;

  const qualityMatch = data.content.trim().match(/Quality:\s*(\d+)\/10/i);
  const readabilityMatch = data.content.trim().match(/Readability:\s*(\d+)\/10/i);
  const efficiencyMatch = data.content.trim().match(/Efficiency:\s*(\d+)\/10/i);

  const qualityScore = qualityMatch ? parseInt(qualityMatch[1], 10) : 0;
  const readabilityScore = readabilityMatch ? parseInt(readabilityMatch[1], 10) : 0;
  const efficiencyScore = efficiencyMatch ? parseInt(efficiencyMatch[1], 10) : 0;

  const overallScore = ((qualityScore + readabilityScore + efficiencyScore) / 3).toFixed(1);

  return {
    score: overallScore,
    reasoning: data.content
  };
};

const getCommitRatings = async (owner: string, repo: string, sha: string) => {
  try {
    const commitData = await fetchCommitData(owner, repo, sha);
    if (!commitData.files || commitData.files.length === 0) {
      throw new Error("No files found in the commit.");
    }

    const fileRatings = await Promise.all(commitData.files.map(async (file: any) => {
      const fileContent = await fetchFileContent(file.raw_url);

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

    const commitRatings = await getCommitRatings(repoOwner as string, repoName as string, sha as string);

    return NextResponse.json({
      commitRatings
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze code' }, { status: 500 });
  }
}

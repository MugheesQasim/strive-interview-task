import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, disconnectDatabase } from '../../lib/mongoDbConnection';
import { Octokit } from '@octokit/rest';
import { ChatMistralAI } from "@langchain/mistralai";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface GitHubBlobResponse {
    content: string;
    encoding: string;
}

interface MistralMessage {
    content: string;
}

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
        const allDocuments = await collection.find().toArray();
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

        try {
            const newResult = await collection.insertOne({
                sha,
                result: {
                    score: analysisResult.score,
                    reasoning: analysisResult.reasoning,
                },
            });
        } catch (error) {
            console.error("Error inserting into MongoDB:", error);
        }

        return NextResponse.json({
            score: analysisResult.score,
            reasoning: analysisResult.reasoning,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to analyze code' }, { status: 500 });
    }
    //  finally {
    //     await disconnectDatabase();
    // }
}

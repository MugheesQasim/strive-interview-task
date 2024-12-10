"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface File {
  filename: string;
  status: 'modified' | 'added' | 'removed';
}

interface Result {
  files: File[];
  score?: number;
  reasoning?: string;
  error?: string;
};

// Separate the logic into its own component
const ResultContent: React.FC = () => {
  const searchParams = useSearchParams();

  const [repoOwner, setRepoOwner] = useState<string | null>(null);
  const [repoName, setRepoName] = useState<string | null>(null);
  const [sha, setSha] = useState<string | null>(null);

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const owner = searchParams.get('repoOwner');
    const name = searchParams.get('repoName');
    const shaParam = searchParams.get('sha');

    if (owner && name && shaParam) {
      setRepoOwner(owner);
      setRepoName(name);
      setSha(shaParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (repoOwner && repoName && sha) {
      fetchCommitDetails(repoOwner, repoName, sha);
    }
  }, [repoOwner, repoName, sha]);

  const fetchCommitDetails = async (repoOwner: string, repoName: string, sha: string) => {
    try {
      const response = await fetch('/api/getCommitRating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoOwner,
          repoName,
          sha,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        files: [],
        error: 'Failed to fetch commit details or analyze code.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!result) {
    return <div>Error: No result data available.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4 text-center">Commit Details</h1>

      {result.error ? (
        <div className="text-red-500 mb-4">{result.error}</div>
      ) : (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Changed Files</h2>
          <ul>
            {result.files.map((file, index) => (
              <li key={index} className="mb-2">
                <div className="flex justify-between items-center">
                  <span>{file.filename}</span>
                  <span className="text-sm text-gray-500">{file.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!result.error && result.score && result.reasoning && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-md">
          <h2 className="font-semibold text-lg">Analysis Result</h2>
          <p><strong>Score:</strong> {result.score}</p>
          <p><strong>Reasoning:</strong> {result.reasoning}</p>
        </div>
      )}
    </div>
  );
};

// Wrap the logic with suspense fallback
const ResultPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading Search Params...</div>}>
      <ResultContent />
    </Suspense>
  );
};

export default ResultPage;

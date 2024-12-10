"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BackButton from '../../components/BackButton';
import ReactMarkdown from 'react-markdown';

// Create the actual logic component to handle search params
const ResultContent: React.FC = () => {
  const searchParams = useSearchParams();

  const repoUrl = searchParams.get('repoUrl');
  const sha = searchParams.get('sha');
  const score = searchParams.get('score');
  const reasoning = searchParams.get('reasoning');

  // Guard clause if params are missing
  if (!repoUrl || !sha || !score || !reasoning) {
    return (
      <p>Could not load analysis results. Ensure the URL parameters are valid.</p>
    );
  }

  return (
    <div>
      <BackButton />
      <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">Code Analysis Result</h1>

        <div className="mb-4">
          <strong>Repository URL:</strong>
          <p>{repoUrl}</p>
        </div>

        <div className="mb-4">
          <strong>File SHA:</strong>
          <p>{sha}</p>
        </div>

        <div className="mb-4">
          <strong>Quality Score:</strong>
          <p>{score}</p>
        </div>

        <div className="mb-4">
          <strong>Reasoning:</strong>
          <ReactMarkdown className="whitespace-pre-wrap break-words">
            {reasoning}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

// Wrap with Suspense for fallback handling
const Result: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
};

export default Result;

"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BackButton from "../../components/BackButton";
import { useRouter } from "next/navigation";

const ResultContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const repoUrl = searchParams.get("repoUrl");
  const sha = searchParams.get("sha");
  const score = searchParams.get("score");
  const reasoning = searchParams.get("reasoning");

  if (!repoUrl || !sha || !score || !reasoning) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-red-100 p-4 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-center mb-4 text-red-600">Error</h1>
        <p className="text-center">
          Unable to load analysis data. Please return to the previous page or try again later.
        </p>
        <div className="text-center mt-4">
          <button
            onClick={() => router.back()}
            className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Go Back
          </button>
        </div>
      </div>
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
          <p className="whitespace-pre-wrap break-words">{reasoning}</p>
        </div>
      </div>
    </div>
  );
};

const Result: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
};

export default Result;

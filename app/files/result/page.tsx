"use client";

import { useSearchParams } from 'next/navigation';
import BackButton from '../../components/BackButton';
import React from 'react';
import ReactMarkdown from 'react-markdown';

const Result: React.FC = () => {
    const searchParams = useSearchParams();

    const repoUrl = searchParams.get('repoUrl');
    const sha = searchParams.get('sha');
    const score = searchParams.get('score');
    const reasoning = searchParams.get('reasoning');

    if (!repoUrl || !sha || !score || !reasoning) {
        return <p>Loading...</p>;
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

export default Result;

"use client"
import { useSearchParams } from 'next/navigation';
import BackButton from '../components/BackButton';
import { useRouter } from 'next/navigation';
import React from 'react';

const Result: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const repoUrl = searchParams.get('repoUrl');
    const sha = searchParams.get('sha');
    const score = searchParams.get('score');
    const reasoning = searchParams.get('reasoning');

    if (!repoUrl || !sha || !score || !reasoning) {
        return <p>Loading...</p>;
    }

    const handleBackClick = () => {
        router.back();
    };

    return (
        <div>
            <BackButton/>
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

export default Result;

"use client";

import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import { useRouter } from 'next/navigation';
import Heading from '../components/Heading';

const Files: React.FC = () => {
    const router = useRouter();
    const [repoUrl, setRepoUrl] = useState('');
    const [sha, setSha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<{ score: number; reasoning: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
        const match = repoUrl.match(regex);

        if (!match) {
            setError('Invalid GitHub URL format');
            setLoading(false);
            return;
        }

        const repoOwner = match[1];
        const repoName = match[2];

        try {
            const response = await fetch('/api/getFileRating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoOwner, repoName, sha }),
            });

            if (!response.ok) {
                throw new Error('Error fetching code analysis');
            }

            const data = await response.json();
            setResult(data);

            router.push(`/files/result?repoUrl=${encodeURIComponent(repoUrl)}&sha=${encodeURIComponent(sha)}&score=${data.score}&reasoning=${encodeURIComponent(data.reasoning)}`);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div>
                <BackButton />
            </div>
            <Heading text="Files"/>
            <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
                <header className="row-start-1 text-center">
                    <p className="text-gray-600 mt-2">Provide the repository URL and git blob file sha to proceed</p>
                </header>
                <h1 className="text-2xl font-bold text-center mb-4 text-black">GitHub Code Quality Analyzer</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700">Repo Url</label>
                        <input
                            type="url"
                            id="repoUrl"
                            name="repoUrl"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            required
                            placeholder="http://strive-startup-github.com"
                            className="mt-1 block w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="sha" className="block text-sm font-medium text-gray-700">File SHA</label>
                        <input
                            type="text"
                            id="sha"
                            name="sha"
                            value={sha}
                            placeholder="#2131212"
                            onChange={(e) => setSha(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Analyzing...' : 'Analyze Code'}
                    </button>
                </form>

                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default Files;

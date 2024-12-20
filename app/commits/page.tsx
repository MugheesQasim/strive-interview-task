"use client";

import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import { useRouter } from 'next/navigation';
import Heading from '../components/Heading';

const Commits: React.FC = () => {
    const router = useRouter();
    const [repoUrl, setRepoUrl] = useState('');
    const [sha, setSha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
        const match = repoUrl.match(regex);

        console.log(match);
        
        if (!match) {
            setError('Invalid GitHub URL format');
            setLoading(false);
            return;
        }

        const repoOwner = match[1];
        const repoName = match[2];

        try {
            router.push(`/commits/result?repoOwner=${repoOwner}&repoName=${repoName}&sha=${sha}`);
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
            <Heading text="Commits" />
            <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
                <header className="row-start-1 text-center">
                    <p className="text-gray-600 mt-2">Provide the repository URL and commit SHA ref id</p>
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
                        <label htmlFor="sha" className="block text-sm font-medium text-gray-700">Commit SHA</label>
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

export default Commits;

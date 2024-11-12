"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Result: React.FC = () => {
  const router = useRouter();
  const { repoUrl, sha } = router.query;
  const [ratings, setRatings] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

  useEffect(() => {
    if (repoUrl && sha) {
      const fetchRatings = async () => {
        const [owner, repo] = (repoUrl as string).split("/").slice(-2);

        const response = await fetch(`/api/getCommitRatings?owner=${owner}&repo=${repo}&sha=${sha}`);
        const data = await response.json();

        setRatings(data);
        setSelectedFile(data[0]);
      };

      fetchRatings();
    }
  }, [repoUrl, sha]);

  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4 border-r border-gray-300">
        <h2 className="text-xl font-semibold mb-4">Files Changed</h2>
        <ul className="space-y-2">
          {ratings.map((file) => (
            <li
              key={file.filename}
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => handleFileSelect(file)}
            >
              {file.filename}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 p-4">
        {selectedFile ? (
          <>
            <h2 className="text-xl font-semibold">{selectedFile.filename}</h2>
            <p className="mt-4">
              <strong>Rating:</strong> {selectedFile.rating}
            </p>
            <p className="mt-2">
              <strong>Reasoning:</strong> {selectedFile.reasoning}
            </p>
          </>
        ) : (
          <p>Select a file to see its rating.</p>
        )}
      </div>
    </div>
  );
};

export default Result;

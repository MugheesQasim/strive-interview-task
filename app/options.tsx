import Link from 'next/link';
import React from 'react';

interface Option {
  label: string;
  route: string;
}

const options: Option[] = [
  { label: 'Files', route: '/files' },
  { label: 'Pull Requests', route: '/pull-requests' },
  { label: 'Commits', route: '/commits' },
];

const OptionsBox: React.FC = () => {
  return (
    <div className="flex justify-center space-x-4">
      {options.map((option) => (
        <Link key={option.label} href={option.route} passHref>
          <div className="border-2 border-black rounded-lg p-6 w-48 text-center cursor-pointer hover:bg-gray-200 transition-colors duration-200 ease-in-out">
            <h2 className="text-xl font-semibold text-black">{option.label}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default OptionsBox;

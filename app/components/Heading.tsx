import React from "react"

interface HeadingProps {
    text: string;  // Define a prop named 'text' that will be a string
}

const Heading: React.FC<HeadingProps> = ({text}) => {
    return (
        <h1 className="mb-4 text-4xl text-center">{text}</h1>
    )
};

export default Heading;
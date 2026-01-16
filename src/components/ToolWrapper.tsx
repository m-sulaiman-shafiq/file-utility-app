import React from "react";
import { Button } from "../components/ui/button";

interface ToolWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const ToolWrapper: React.FC<ToolWrapperProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && <p className="mb-6 text-gray-600">{description}</p>}
      <div className="bg-white shadow-md rounded-lg p-6">{children}</div>
    </div>
  );
};

export default ToolWrapper;

import React from "react";
import { Button } from "../components/ui/button";

type ToolWrapperProps = {
  title: string;
  description?: string;
  afterDescription?: React.ReactNode; // 👈 add this
  children: React.ReactNode;
};

const ToolWrapper: React.FC<ToolWrapperProps> = ({
  title,
  description,
  afterDescription,
  children,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      {description && <p className="mb-2 text-gray-600">{description}</p>}
      {afterDescription && <div className="mb-2">{afterDescription}</div>}
      <div className="bg-white shadow-md rounded-lg p-6">{children}</div>
    </div>
  );
};
export default ToolWrapper;

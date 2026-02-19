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
    <div className="max-w-4xl mx-auto ">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      {description && <p className="mb-2 text-gray-600">{description}</p>}
      {afterDescription && <div className="mb-2">{afterDescription}</div>}
      <div>{children}</div>
    </div>
  );
};
export default ToolWrapper;

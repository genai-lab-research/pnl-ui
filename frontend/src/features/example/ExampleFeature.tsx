import React from 'react';
import { TextInputDemo, TabNavigationDemo } from '.';

const ExampleFeature: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">UI Component Examples</h1>
      <div className="space-y-6">
        <TabNavigationDemo />
        <TextInputDemo />
      </div>
    </div>
  );
};

export default ExampleFeature;
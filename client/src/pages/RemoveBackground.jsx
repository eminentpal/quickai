import { Sparkles } from 'lucide-react';
import React, { useState } from 'react';

const RemoveBackground = () => {
  const [selectedCategory, setSelectedCategory] = useState('General');

  const [input, setinput] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* left col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 "
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4938] " />
          <h1 className="text-xl font-semibold"> Background Remover</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          onChange={(e) => setinput(e.target.files[0])}
          accept="image/*"
          type="file"
          className="w-full p-2 px-3 mt-3 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          Supports JPG, PNG and other image formats
        </p>
        <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          <Hash className="w-5" />
          Generate Title
        </button>
      </form>
      {/* Right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Generated Titles</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Hash className="w-9 h-9" />
            <p>Enter a topic and click "Generate title" to get started </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;

import React, { useEffect, useState }  from 'react';
import { BarChart3 } from "lucide-react";
import CryptoJS from 'crypto-js';

// Analytics Page
export const HashDemo = () => {

  const [hash, setHash] = useState('');
  const [data, setData] = useState('');

  const handleData = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setData(value);
  };

  useEffect(() =>{

    if (!data){
      setHash('');
    }

    if (data){
      setHash(CryptoJS.SHA256(data).toString());
    }
  }, [data])



  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">SHA256 Hash</h1>
              <p className="text-slate-500 mt-1">SHA-256 plays a critical role in blockchain technology, ensuring security and integrity in digital transactions. One of its primary uses is in mining, the process of validating and adding new transactions to a blockchain.</p>
            </div>
          </div>
          <p className="text-slate-600">Experiment with the SHA256 Hash...</p>
        </div>
      </div>
      <div className="mt-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center gap-4 mb-6">

            <div className='flex flex-col gap-6 w-full'>
              <label htmlFor="data-message" className="block mb-2 text-sm font-medium text-gray-900">Input Data</label>
              <textarea id="data-message" className='w-full h-40 p-8 border border-gray-500 rounded-md' onChange={handleData} spellCheck={false} placeholder='Enter something here...'  ></textarea>

              <label htmlFor="hash-output" className="block mb-2 text-sm font-medium text-gray-900">Hash Output</label>
              <textarea id="hash-output" className='w-full h-40 p-8 border border-gray-500 rounded-md' value={hash} spellCheck={false}></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

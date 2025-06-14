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
      setHash(CryptoJS.SHA256('').toString());
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
            <label htmlFor="hash-output" className="block mb-2 text-sm font-medium text-gray-900">Hash Output</label>
            <textarea id="hash-output" className='w-full h-24 p-4 border border-gray-500 rounded-md bg-orange-100 resize-none' value={hash} spellCheck={false}></textarea>
         </div>


        <div className="bg-white rounded-2xl mt-6 shadow-lg p-8 border border-slate-200">
          <div className="flex items-center gap-4 mb-6">

            <div className='grid grid-cols-2 gap-6 w-full'>
              <label htmlFor="data-message" className="block mb-2 text-base font-medium text-gray-900">Input Data</label>
              <label htmlFor="index" className="block mb-2 text-base font-medium text-gray-900">Index</label>
              <textarea id="data-message" className='w-full h-24 p-4 text-left border border-gray-500 rounded-md resize-none' onChange={handleData} spellCheck={false} placeholder='Enter input block data...'  ></textarea>
              <textarea id="index" className='w-full h-24 p-4 border border-gray-500 rounded-md resize-none' onChange={handleData} spellCheck={false} placeholder='Enter index...'  ></textarea>

              <label htmlFor="previous-hash" className="block mb-2 text-base font-medium text-gray-900">Previous Hash</label>
              <label htmlFor="timestamp" className="block mb-2 text-base font-medium text-gray-900">Timestamp</label>
              <textarea id="previous-hash" className='w-full h-24 p-4 border border-gray-500 rounded-md resize-none' onChange={handleData} spellCheck={false} placeholder='Enter Previous Hash...'  ></textarea>
              <textarea id="timestamp" className='w-full h-24 p-4 border border-gray-500 rounded-md resize-none' onChange={handleData} spellCheck={false} placeholder='Timestamp...'  ></textarea>

              <label htmlFor="difficulty" className="block mb-2 text-base font-medium text-gray-900">Difficulty</label>
              <label htmlFor="nonce" className="block mb-2 text-base font-medium text-gray-900">Nonce</label>
              <textarea id="difficulty" className='w-full h-24 p-4 border border-gray-500 rounded-md resize-none' onChange={handleData} spellCheck={false} placeholder='Enter difficulty level...'  ></textarea>
              <textarea id="nonce" className='w-full h-24 p-4 border border-gray-500 rounded-md resize-none' onChange={handleData} spellCheck={false} placeholder='Enter nonce...'  ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

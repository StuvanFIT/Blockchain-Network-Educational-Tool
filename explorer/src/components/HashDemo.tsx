import React, { useEffect, useState }  from 'react';
import { BarChart3 } from "lucide-react";
import CryptoJS from 'crypto-js';

// Analytics Page
export const HashDemo = () => {

  const getCurrentTimestamp = (): number => Math.round(new Date().getTime() / 1000);

  const [hash, setHash] = useState('');

  const [data, setData] = useState('');
  const [index, setIndex] = useState(0);
  const [previousHash, setPreviousHash] = useState('');
  const [timestamp, setTimeStamp] = useState(getCurrentTimestamp());
  const [difficulty, setDifficulty] = useState('');
  const [nonce, setNonce] = useState('');
  

  const handleChange = (setter: Function) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setter(e.target.value)
  };

  const calcHashDemo = (index:number, previousHash:string, timestamp:number, data:string, difficulty:number, nonce: number):string =>
    CryptoJS.SHA256(`${index ?? ''}${previousHash ?? ''}${timestamp ?? ''}${data ?? ''}${difficulty ?? ''}${nonce ?? ''}`).toString();



  useEffect(() => {
    const allEmpty = [data, index, previousHash, timestamp, difficulty, nonce].every(f => !f);
    if (allEmpty) {
      setHash(CryptoJS.SHA256('').toString());
    } else {
      setHash(calcHashDemo(Number(index), previousHash, Number(timestamp), data, Number(difficulty), Number(nonce)));
    }
  }, [data, index, previousHash, timestamp, difficulty, nonce]);
    



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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>

              <div className='flex flex-col'>
                <label htmlFor="data-message" className="mb-2 text-base font-medium text-gray-900">Input Data</label>
                <textarea
                  id="data-message"
                  className="w-full h-24 p-4 text-left border border-gray-500 rounded-md resize-none"
                  onChange={handleChange(setData)}
                  value={data}
                  spellCheck={false}
                  placeholder="Enter input block data..."
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label htmlFor="index" className="mb-2 text-base font-medium text-gray-900">Index</label>
                <textarea
                  id="index"
                  className="w-full h-24 p-4 border border-gray-500 rounded-md resize-none"
                  onChange={handleChange(setIndex)}
                  value={index}
                  spellCheck={false}
                  placeholder="Enter index..."
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label htmlFor="previous-hash" className="mb-2 text-base font-medium text-gray-900">Previous Hash</label>
                <textarea
                  id="previous-hash"
                  className="w-full h-24 p-4 border border-gray-500 rounded-md resize-none"
                  onChange={handleChange(setPreviousHash)}
                  value={previousHash}
                  spellCheck={false}
                  placeholder="Enter Previous Hash..."
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label htmlFor="timestamp" className="mb-2 text-base font-medium text-gray-900">Timestamp</label>
                <textarea
                  id="timestamp"
                  className="w-full h-24 p-4 border border-gray-500 rounded-md resize-none"
                  onChange={handleChange(setTimeStamp)}
                  value={timestamp}
                  spellCheck={false}
                  placeholder="Timestamp..."
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label htmlFor="difficulty" className="mb-2 text-base font-medium text-gray-900">Difficulty</label>
                <textarea
                  id="difficulty"
                  className="w-full h-24 p-4 border border-gray-500 rounded-md resize-none"
                  onChange={handleChange(setDifficulty)}
                  value={difficulty}
                  spellCheck={false}
                  placeholder="Enter difficulty level..."
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label htmlFor="nonce" className="mb-2 text-base font-medium text-gray-900">Nonce</label>
                <textarea
                  id="nonce"
                  className="w-full h-24 p-4 border border-gray-500 rounded-md resize-none"
                  onChange={handleChange(setNonce)}
                  value={nonce}
                  spellCheck={false}
                  placeholder="Enter nonce..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

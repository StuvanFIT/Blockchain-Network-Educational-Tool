import React, { useEffect, useState, useRef }  from 'react';
import { BarChart3, Loader2, Pickaxe, Square, Wrench,ChartColumnIncreasing,
  Target, Hourglass, ChartNoAxesCombined, Trophy, Ban, Info, 
  TrendingUp,
  Activity} from "lucide-react";
import CryptoJS from 'crypto-js';

import { hexToBinary } from '../blockchain/utils';
import { InfoTooltip, tooltipContent } from './Tooltip';

// Analytics Page
export const HashDemo = () => {

  const getCurrentTimestamp = (): number => Math.round(new Date().getTime() / 1000);
  
  //Input fields
  const [hash, setHash] = useState('');
  const [hashBinary, setHashBinary] = useState('');
  const [data, setData] = useState('');
  const [index, setIndex] = useState(0);
  const [previousHash, setPreviousHash] = useState('');
  const [timestamp, setTimeStamp] = useState(getCurrentTimestamp());
  const [difficulty, setDifficulty] = useState(5);
  const [nonce, setNonce] = useState(0);

  //Mining Status
  const isMiningRef = useRef(false);
  const [isMining, setIsMining] = useState(false);

  const [miningStatus, setMiningStatus] = useState({attempts: 0, timeStarted: 0});
  const [miningSuccess, setMiningSuccess] = useState(false);
  const [estimatedTime , setEstimatedTime] = useState(0);

 
  //Handling user input data changes:
  const handleChange = (setter: Function) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    
    if (e.target.id === "difficulty"){
      const value = e.target.value;
      
      if (Number(value) > 100) {
        alert("Max difficulty: 100. Please try a lower difficulty level.");
        return;
      }
    }
    setter(e.target.value)
  };

  //Calculating the hash
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



  //Checking if the hash (binary form) matches the difficulty level
  const hashMatchesDifficulty = (hash: string, difficulty: number): boolean => {
      const hashInBinary: string = hexToBinary(hash);
      const requiredPrefix: string = '0'.repeat(difficulty);
      return hashInBinary.startsWith(requiredPrefix);
  };

  //Stop mining
  const stopMining = () => {
    isMiningRef.current = false;
    setIsMining(false);
  }

  //Start mining
  const startMining = () => {
    isMiningRef.current = true;
    setIsMining(true);
  }
  

  const mineBlock = async () =>{
    
    if (isMiningRef.current){
      return;
    };

    //Reset mining success state
    setMiningSuccess(false);


    //We are mining now
    startMining();
    const startTime = Date.now();
    setMiningStatus({attempts:0, timeStarted: startTime});

    //Calculate the estimated time based on the input difficulty
    const estimatedAttempts = Math.pow(2, Number(difficulty));
    setEstimatedTime(estimatedAttempts /10000) //rough estimate in seconds

    //Find the matching block
    let attempts = 0;
    let currNonce = 0;

    while (isMiningRef.current) {
      const currHash =  calcHashDemo(Number(index), previousHash, Number(timestamp), data, Number(difficulty), currNonce);
      attempts++;

      //Every 1000 attempts, update the UI
      if (attempts % 1000 ===0 ){
        setMiningStatus({attempts: attempts, timeStarted: startTime});
        setNonce(currNonce);
        setHash(currHash);
        setHashBinary(hexToBinary(currHash))

        //ALlow the UI to update
        await new Promise(resolve => setTimeout(resolve, 1));
      };

      //Check if we have a matching block --> zeroes match the difficulty level given
      if (hashMatchesDifficulty(currHash, Number(difficulty))) {
        setNonce(currNonce);
        setHash(currHash);
        setHashBinary(hexToBinary(currHash))
        setMiningStatus({attempts: attempts, timeStarted: startTime});
        setMiningSuccess(true);

        stopMining();
        return;
      };

      currNonce++;

      //Limit break
      if (attempts > 1000000){
        stopMining();
        setMiningStatus({attempts:attempts,  timeStarted: startTime});
        return;
      };

    };

  };

  //Total Mining Time
  const miningTime = miningStatus.timeStarted ? ((Date.now() - miningStatus.timeStarted)/1000): 0;
  //Mining Time Hash Rate
  const miningHashRate = miningTime > 0 ? (Math.round(miningStatus.attempts / miningTime)): 0;
  const progress = estimatedTime > 0 ? Math.min((miningTime / estimatedTime) * 100, 100) : 0;

  const formatTime = (seconds: number): string =>{
    if (seconds < 60){
      return `${seconds.toFixed(1)}s`
    };

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`
  };
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
     
      <div className="p-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-slate-500/50 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white shadow-lg">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Block Mining Simulator</h1>
                <p className="text-slate-300 mt-1">Experience proof-of-work mining and see how computational difficulty affects blockchain security</p>
              </div>
            </div>
          </div>

          {/* Hash Output Card */}
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-500/50 mb-6">
            <div className="flex items-center justify-between mb-6">
              <label htmlFor="hash-output" className="text-base font-semibold text-white">
                Hash Output (Hexadecimal)
              </label>
              <div className="flex items-center gap-3">
                {miningSuccess && (
                  <div className="flex items-center text-emerald-400 gap-2">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">Valid Block!</span>
                  </div>
                )}
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  miningSuccess 
                    ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' 
                    : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'
                }`}>
                  {miningSuccess ? 'Valid' : 'Invalid'}
                </span>
              </div>
            </div>
            
            <textarea 
              id="hash-output" 
              className={`w-full h-24 p-4 border rounded-xl resize-none font-mono text-sm transition-colors ${
                miningSuccess 
                  ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-300' 
                  : 'bg-amber-900/20 border-amber-500/30 text-amber-300'
              }`} 
              value={hash} 
              spellCheck={false} 
              readOnly 
            />

            <label htmlFor="hash-binary" className="block mt-6 mb-3 text-base font-semibold text-white">
              Hash Binary (Binary)
            </label>
            <textarea 
              id="hash-binary" 
              className={`w-full h-24 p-4 border rounded-xl resize-none font-mono text-sm transition-colors ${
                miningSuccess 
                  ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-300' 
                  : 'bg-amber-900/20 border-amber-500/30 text-amber-300'
              }`} 
              value={hashBinary} 
              spellCheck={false} 
              readOnly 
            />

            <div className="mt-4 p-4 bg-slate-700/50 rounded-xl border border-slate-500/50">
              <div className="text-base text-slate-300">
                <span className="font-semibold text-white">Target:</span> Hash must start with{' '}
                <span className="font-mono font-semibold text-orange-400">{difficulty}</span> zeros in binary →{' '}
                <span className="font-mono text-slate-400">{Number(difficulty) > 150 ? "0".repeat(150) : "0".repeat(Number(difficulty))}...</span>
              </div>
            </div>
          </div>
          
          {/* Mining Controls and Stats */}
          <div className='bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-500/50 mb-8'>
            <div className='flex flex-col lg:flex-row gap-8'>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-white mb-5 flex items-center gap-2'>
                  <Wrench className='w-4 h-4' />
                  Mining Controls
                </h3>

                <div className='flex gap-4'>
                  <button 
                    onClick={mineBlock}
                    disabled={isMiningRef.current}
                    className={`flex items-center gap-2 px-6 py-6 rounded-lg font-medium transition-all ${
                      isMiningRef.current
                        ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}>
                    {(isMiningRef.current || isMining) ? (
                      <>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        Mining...
                      </>
                    ) : (
                      <>
                        <Pickaxe className='w-4 h-4' />
                        Mine Block
                      </>
                    )}
                  </button>

                  {(isMiningRef.current || isMining) && (
                    <button
                      onClick={stopMining}
                      className='flex items-center gap-2 px-6 py-6 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-all transform hover:scale-105'>
                      <Square className='w-4 h-4'/>
                      Stop
                    </button>
                  )}
                </div>
              </div>

              {/* Mining Statistics */}
              {(isMiningRef.current || miningStatus.attempts > 0) && (
                <div className='flex-1'> 
                  <h3 className='text-lg font-semibold text-white mb-4 flex items-center gap-2'>
                    <TrendingUp className='w-4 h-4'/>
                    Mining Statistics
                  </h3>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                      <div className="flex items-center gap-2 text-blue-300 mb-1">
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-medium">Attempts</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-200">
                        {formatNumber(miningStatus.attempts)}
                      </div>
                    </div>
                    <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                      <div className="flex items-center gap-2 text-green-300 mb-1">
                        <Hourglass className="w-4 h-4" />
                        <span className="text-sm font-medium">Time Elapsed</span>
                      </div>
                      <div className="text-2xl font-bold text-green-200">
                        {formatTime(miningTime)}
                      </div>
                    </div>
                    <div className="bg-pink-500/20 p-4 rounded-lg border border-pink-500/30">
                      <div className="flex items-center gap-2 text-pink-300 mb-1">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm font-medium">Hash Rate</span>
                      </div>
                      <div className="text-2xl font-bold text-pink-200">
                        {formatNumber(miningHashRate)} H/s
                      </div>
                    </div>
                    <div className="bg-orange-500/20 p-4 rounded-lg border border-orange-500/30">
                      <div className="flex items-center gap-2 text-orange-300 mb-1">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm font-medium">Nonces</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-200">
                        {formatNumber(nonce)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {isMiningRef.current && estimatedTime > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-slate-300 mb-2">
                        <span>Estimated Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Est. total time: {formatTime(estimatedTime)} (based on difficulty {difficulty})
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {miningSuccess && (
                    <div className='mt-4 p-4 border border-green-500/30 rounded-lg bg-green-500/20'>
                      <div className='flex items-center gap-2 font-medium'>
                        <Trophy className='w-8 h-8 text-yellow-400'/>
                        <span className='text-green-300'>Block Mined Successfully!</span> 
                      </div>
                      <div className='text-sm text-green-300 font-medium'>
                        Found valid hash in {formatNumber(miningStatus.attempts)} attempts and {formatTime(miningTime)}
                      </div>
                    </div>
                  )}

                  {/* Unsuccessful Message */}
                  {(!miningSuccess && miningStatus.attempts > 1000000) && (
                    <div className='mt-4 p-4 border border-red-500/30 rounded-lg bg-red-500/20'>
                      <div className='flex items-center gap-2 font-medium'>
                        <Trophy className='w-8 h-8 text-yellow-400'/>
                        <span className='text-red-300'>Block Mining Unsuccessful..</span> 
                      </div>
                      <div className='text-sm text-red-300 font-medium'>
                        Mining has halted after 1,000,000 attempts. Maybe try reducing the difficulty.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Input Fields Card */}
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-500/50">
            <div className="flex items-center gap-4 mb-6">
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
                <div className='flex flex-col'>
                  <div className="flex items-center gap-2">
                    <label htmlFor="data-message" className="mb-2 text-base font-semibold text-white">
                      Input Data
                    </label>
                    <InfoTooltip 
                      content={tooltipContent['data-tool-tip']} 
                      id="data-tool-tip" 
                    />
                  </div>
                  <textarea
                    id="data-message"
                    className="w-full bg-slate-700/50 h-24 p-4 text-left border border-slate-600 rounded-md resize-none text-slate-200 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    onChange={handleChange(setData)}
                    value={data}
                    spellCheck={false}
                    placeholder="Enter input block data..."
                  ></textarea>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <label htmlFor="index" className="mb-2 text-base font-semibold text-white">
                      Index
                    </label>
                    <InfoTooltip 
                      content={tooltipContent['index-tool-tip']} 
                      id="index-tool-tip" 
                    />
                  </div>
                  <textarea
                    id="index"
                    className="w-full bg-slate-700/50 h-24 p-4 border border-slate-600 rounded-md resize-none text-slate-200 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    onChange={handleChange(setIndex)}
                    value={index.toString()}
                    spellCheck={false}
                    placeholder="Enter index..."
                  ></textarea>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <label htmlFor="previous-hash" className="mb-2 text-base font-semibold text-white">
                      Previous Hash
                    </label>
                    <InfoTooltip 
                      content={tooltipContent['prev-hash-tool-tip']} 
                      id="prev-hash-tool-tip" 
                    />
                  </div>
                  <textarea
                    id="previous-hash"
                    className="w-full bg-slate-700/50 h-24 p-4 border border-slate-600 rounded-md resize-none text-slate-200 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    onChange={handleChange(setPreviousHash)}
                    value={previousHash.toString()}
                    spellCheck={false}
                    placeholder="Enter Previous Hash..."
                  ></textarea>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <label htmlFor="timestamp" className="mb-2 text-base font-semibold text-white">
                      Timestamp
                    </label>
                    <InfoTooltip 
                      content={tooltipContent['timestamp-tool-tip']} 
                      id="timestamp-tool-tip" 
                    />
                  </div>
                  <textarea
                    id="timestamp"
                    className="w-full bg-slate-700/50 h-24 p-4 border border-slate-600 rounded-md resize-none text-slate-200 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    onChange={handleChange(setTimeStamp)}
                    value={timestamp.toString()}
                    spellCheck={false}
                    placeholder="Timestamp..."
                  ></textarea>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <label htmlFor="difficulty" className="mb-2 text-base font-semibold text-white">
                      Difficulty
                    </label>
                    <InfoTooltip 
                      content={tooltipContent['difficulty-tool-tip']} 
                      id="difficulty-tool-tip" 
                    />
                  </div>
                  <textarea
                    id="difficulty"
                    className="w-full bg-slate-700/50 h-24 p-4 border border-slate-600 rounded-md resize-none text-slate-200 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    onChange={handleChange(setDifficulty)}
                    value={difficulty.toString()}
                    spellCheck={false}
                    placeholder="Enter difficulty level..."
                  ></textarea>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <label htmlFor="nonce" className="mb-2 text-base font-semibold text-white">
                      Nonce
                    </label>
                    <InfoTooltip 
                      content={tooltipContent['nonce-tool-tip']} 
                      id="nonce-tool-tip" 
                    />
                  </div>
                  <textarea
                    id="nonce"
                    className="w-full bg-slate-700/50 h-24 p-4 border border-slate-600 rounded-md resize-none text-slate-200 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    onChange={handleChange(setNonce)}
                    value={nonce.toString()}
                    spellCheck={false}
                    placeholder="Enter nonce..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
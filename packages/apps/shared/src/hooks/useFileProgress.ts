import { useState } from 'react';

const useFileProgress = () => {
  const [progress, setProgress] = useState(0);

  const handleProgress = (e: ProgressEvent<EventTarget>) => {
    setProgress(Math.round((e.loaded * 100) / e.total));
  };

  return {
    progress,
    handleProgress,
    setProgress,
  };
};

export default useFileProgress;

import React, { useEffect, useState } from "react";

const LoadingScreen = ({ duration = 2000 }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, duration / 50);

    const timer = setTimeout(() => {
      setLoading(false);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-orange-50 z-50 px-4">
      {/* Loading text */}
      <h2 className="text-orange-800 text-lg sm:text-xl md:text-2xl font-medium mb-6 sm:mb-8 text-center">
        Loading...
      </h2>

      {/* Progress bar */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-orange-100 rounded-full h-2">
        <div
          className="bg-orange-500 h-2 rounded-full transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Progress percentage */}
      <p className="text-orange-700 text-sm sm:text-base mt-3 sm:mt-4">
        {progress}%
      </p>
    </div>
  );
};

export default LoadingScreen;

// import React, { useEffect, useState } from "react";

// const LoadingScreen = ({ duration = 2000, onComplete }) => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//       onComplete?.();
//     }, duration);

//     return () => {
//       clearTimeout(timer);
//     };
//   }, [duration, onComplete]);

//   if (!loading) return null;

//   return (
//     <div className="fixed inset-0 flex flex-col items-center justify-center bg-orange-50 z-50 px-4">
//       {/* Loading text */}
//       <h2 className="text-orange-600 text-lg sm:text-xl md:text-2xl font-medium mb-8 sm:mb-12 text-center">
//         Loading...
//       </h2>

//       {/* Animated Logo */}
//       <div className="relative">
//         <img
//           src="./src/assets/images/Logo.png"
//           alt="Logo"
//           className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 logo-animate drop-shadow-lg"
//         />
//       </div>

//       {/* Optional subtitle */}
//       <p className="text-orange-600 text-sm sm:text-base mt-6 sm:mt-8 text-center opacity-70">
//         Please wait...
//       </p>

//       <style jsx>{`
//         @keyframes logoFloat {
//           0%, 100% {
//             transform: translateY(0px) scale(1);
//             opacity: 0.9;
//           }
//           25% {
//             transform: translateY(-8px) scale(1.02);
//             opacity: 1;
//           }
//           50% {
//             transform: translateY(-5px) scale(1.05);
//             opacity: 0.95;
//           }
//           75% {
//             transform: translateY(-10px) scale(1.02);
//             opacity: 1;
//           }
//         }
        
//         @keyframes logoGlow {
//           0%, 100% {
//             filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.3));
//           }
//           50% {
//             filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6));
//           }
//         }
        
//         .logo-animate {
//           animation: logoFloat 3s ease-in-out infinite, logoGlow 2s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default LoadingScreen;
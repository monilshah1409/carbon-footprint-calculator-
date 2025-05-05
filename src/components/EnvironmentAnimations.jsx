import React from 'react';

const EnvironmentAnimations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Floating Leaves Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="leaf"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      {/* Growing Trees */}
      <div className="absolute bottom-0 w-full flex justify-around">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="tree-container" style={{ animationDelay: `${i * 0.5}s` }}>
            <div className="tree-trunk">
              <div className="tree-branches" />
            </div>
          </div>
        ))}
      </div>

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EnvironmentAnimations; 
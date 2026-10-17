import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <span>ProjectPulse Portfolio Roadmap</span>
          <span>•</span>
          <span>Built with React, Express, MongoDB & Tailwind CSS</span>
        </div>

        <div className="text-slate-600">
          All Rights Reserved &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

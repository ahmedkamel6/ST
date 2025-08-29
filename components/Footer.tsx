import React, { useMemo } from 'react';
import { FOOTER_TEXT, MOTIVATIONAL_QUOTES } from '../constants';
import { TwitterIcon, GithubIcon, LinkedinIcon } from './ResultsSection';
import { Tooltip } from './Tooltip';

export const Footer: React.FC = () => {
  const socialLinks = [
    { icon: TwitterIcon, href: '#', label: 'Twitter' },
    { icon: GithubIcon, href: '#', label: 'GitHub' },
    { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
  ];
  
  const motivationalQuote = useMemo(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)], []);

  return (
    <footer className="bg-slate-950/50 border-t border-slate-800/50 mt-auto">
      <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
           <p className="text-sm italic text-teal-400">"{motivationalQuote}"</p>
           <div className="flex items-center space-x-6">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Tooltip key={label} text={`Visit our ${label} page`}>
                <a
                  href={href}
                  aria-label={`Visit our ${label} page`}
                  className="text-slate-400 hover:text-blue-500 transition-colors duration-300"
                >
                  <Icon className="w-6 h-6" />
                </a>
              </Tooltip>
            ))}
          </div>
          <p className="text-xs text-slate-500">{FOOTER_TEXT}</p>
        </div>
      </div>
    </footer>
  );
};
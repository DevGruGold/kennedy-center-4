import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Key, Lock, Timer, Info } from 'lucide-react';

const KennedyPreviewSystem = () => {
  const [previewState, setPreviewState] = useState('locked');
  const [previewTime, setPreviewTime] = useState(45);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const gridSize = 16;

  useEffect(() => {
    let timer;
    if (previewState === 'preview' && previewTime > 0) {
      timer = setInterval(() => {
        setPreviewTime(prev => prev - 1);
        if (previewTime % 3 === 0) updateVisibleSections();
      }, 1000);
    } else if (previewTime === 0) {
      setPreviewState('locked');
      setPreviewTime(45);
      setVisibleSections(new Set());
    }
    return () => clearInterval(timer);
  }, [previewState, previewTime]);

  const updateVisibleSections = () => {
    const newSections = new Set();
    const sectionsToShow = Math.floor(gridSize * 0.6);
    while (newSections.size < sectionsToShow) {
      newSections.add(Math.floor(Math.random() * gridSize));
    }
    setVisibleSections(newSections);
  };

  const handlePreviewStart = () => {
    if (previewState === 'locked') {
      setPreviewState('preview');
      updateVisibleSections();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Main Preview Card */}
        <Card className="bg-black/30 backdrop-blur-xl border-gray-700 shadow-2xl">
          <CardContent className="p-6">
            {/* Artist Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                AC
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Alexandria Chen</h3>
                <p className="text-sm text-gray-400">Kennedy Center Featured Artist</p>
              </div>
            </div>

            {/* Dynamic Preview Container */}
            <div className="relative aspect-square rounded-xl overflow-hidden mb-6 shadow-2xl">
              <div className="grid grid-cols-4 grid-rows-4 h-full w-full transform hover:scale-102 transition-transform duration-500">
                {Array.from({ length: gridSize }).map((_, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden"
                  >
                    <div 
                      className="w-full h-full transition-all duration-700 ease-in-out"
                      style={{
                        backgroundImage: 'url("/api/placeholder/200/200")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: visibleSections.has(index) ? 1 : 0.08,
                        transform: visibleSections.has(index) ? 
                          'scale(1) rotate(0deg)' : 'scale(0.95) rotate(-3deg)',
                        filter: previewState === 'locked' ? 
                          'grayscale(1) brightness(0.7)' : 'none'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Preview Overlay */}
              {previewState === 'locked' ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">Premium Artwork</h4>
                    <p className="text-gray-300 text-sm">Begin interactive preview experience</p>
                  </div>
                </div>
              ) : (
                <div className="absolute top-4 right-4">
                  <div className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    <span className="font-mono">
                      {Math.floor(previewTime / 60)}:{(previewTime % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Artwork Details */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">Metamorphosis #23</h2>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">2.5 ETH</div>
                  <div className="text-sm text-gray-400">≈ $4,750 USD</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Part of the "Digital Transformations" series, exploring themes of change and rebirth.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handlePreviewStart}
                className={`flex-1 h-12 ${
                  previewState === 'preview' 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
                disabled={previewState === 'preview'}
              >
                {previewState === 'locked' ? (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Preview Experience
                  </>
                ) : (
                  <>
                    <Timer className="w-5 h-5 mr-2" />
                    Previewing...
                  </>
                )}
              </Button>
              <Button 
                className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white"
              >
                <Key className="w-5 h-5 mr-2" />
                Purchase Access
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              title: "Dynamic Preview",
              icon: Eye,
              description: "Experience artwork through our innovative section-reveal system"
            },
            {
              title: "Timed Access",
              icon: Timer,
              description: "45-second interactive preview with rotating viewable sections"
            },
            {
              title: "Ownership Perks",
              icon: Key,
              description: "Full resolution access + exhibition opportunities"
            }
          ].map((feature, index) => (
            <Card 
              key={index}
              className="bg-black/30 backdrop-blur-xl border-gray-700 shadow-xl"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <feature.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KennedyPreviewSystem;

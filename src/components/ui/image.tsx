"use client";

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  width?: number | string;
  height?: number | string;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '21:9' | 'none';
  fit?: 'cover' | 'contain' | 'fill' | 'none';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  loading?: 'eager' | 'lazy';
  quality?: number;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  size = 'md',
  width,
  height,
  aspectRatio = 'none',
  fit = 'cover',
  radius = 'none',
  loading = 'lazy',
  quality,
  blurDataURL,
  className,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-64 h-64',
    xl: 'w-96 h-96',
    full: 'w-full h-auto'
  };

  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-[16/9]',
    '21:9': 'aspect-[21/9]',
    'none': ''
  };

  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  const fitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none'
  };

  const handleLoad = () => {
    setIsLoading(false);
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Generate blur data URL if not provided
  const generateBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    
    // Create a tiny placeholder (1x1 pixel gray)
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, 1, 1);
    }
    return canvas.toDataURL();
  };

  const finalBlurDataURL = generateBlurDataURL();
  const displaySrc = hasError ? (finalBlurDataURL) : src;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-muted transition-all duration-300',
        size !== 'full' && sizeClasses[size],
        aspectRatioClasses[aspectRatio],
        radiusClasses[radius],
        className
      )}
      style={{
        width: width && size === 'full' ? width : undefined,
        height: height && size === 'full' ? height : undefined,
      }}
    >
      {/* Blur placeholder */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="text-xs text-gray-500">Loading...</span>
          </div>
        </div>
      )}

      {/* Blur image */}
      {!isLoaded && blurDataURL && !hasError && (
        <img
          src={blurDataURL}
          alt=""
          className={cn(
            'absolute inset-0 w-full h-full filter blur-md scale-110',
            fitClasses[fit]
          )}
          aria-hidden="true"
        />
      )}


      {/* Main image - ALWAYS has a valid src */}
      <img
        ref={imgRef}
        src={displaySrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full transition-all duration-500',
          fitClasses[fit],
          isLoading && !isLoaded ? 'opacity-0' : 'opacity-100',
        )}
        {...props}
      />

      {/* Loading overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-black bg-opacity-10" />
      )}
    </div>
  );
};

export { Image };
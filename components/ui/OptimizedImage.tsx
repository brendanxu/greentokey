/**
 * @fileoverview OptimizedImage Component - 高性能图像组件  
 * @version 1.0.0
 * 优化LCP、CLS，支持多种现代图像格式
 */

'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: number; // 宽高比，用于防止CLS
  priority?: boolean;
  quality?: number;
  className?: string;
  containerClassName?: string;
  showLoadingSkeleton?: boolean;
  fallbackSrc?: string;
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 800,
  height = 600,
  aspectRatio,
  priority = false,
  quality = 85,
  className = '',
  containerClassName = '',
  showLoadingSkeleton = true,
  fallbackSrc,
  onLoadComplete,
  onLoadError,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // 计算容器的宽高比样式
  const containerStyle = useMemo(() => {
    const ratio = aspectRatio || (height / width);
    return {
      position: 'relative' as const,
      width: '100%',
      paddingBottom: `${ratio * 100}%`
    };
  }, [aspectRatio, width, height]);

  // 处理图片加载完成
  const handleLoad = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  // 处理图片加载错误
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    } else {
      onLoadError?.(new Error(`Failed to load image: ${src}`));
    }
  };

  // 生成模糊占位符
  const blurDataURL = useMemo(() => {
    // 简单的base64编码模糊占位符
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYMChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAACAQMABAUGIWGRkqGx0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX';
  }, []);

  // 渲染错误状态
  if (hasError && !fallbackSrc) {
    return (
      <div 
        style={containerStyle}
        className={cn(
          'bg-gray-200 flex items-center justify-center',
          containerClassName
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs">Failed to load image</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={containerStyle}
      className={cn('overflow-hidden', containerClassName)}
    >
      {/* 加载骨架屏 */}
      {isLoading && showLoadingSkeleton && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
        </div>
      )}

      {/* 优化的Image组件 */}
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        {...props}
      />

      {/* 渐进式加载指示器 */}
      {isLoading && (
        <div className="absolute bottom-2 right-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};

// 预设的常用尺寸组件
export const HeroImage: React.FC<Omit<OptimizedImageProps, 'aspectRatio' | 'priority'>> = (props) => (
  <OptimizedImage
    {...props}
    aspectRatio={16 / 9}
    priority={true}
    sizes="100vw"
    quality={90}
  />
);

export const CardImage: React.FC<Omit<OptimizedImageProps, 'aspectRatio'>> = (props) => (
  <OptimizedImage
    {...props}
    aspectRatio={4 / 3}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
    quality={80}
  />
);

export const AvatarImage: React.FC<Omit<OptimizedImageProps, 'aspectRatio'>> = (props) => (
  <OptimizedImage
    {...props}  
    aspectRatio={1}
    sizes="(max-width: 768px) 64px, 96px"
    quality={75}
    className={cn('rounded-full', props.className)}
  />
);

export const ThumbnailImage: React.FC<Omit<OptimizedImageProps, 'aspectRatio'>> = (props) => (
  <OptimizedImage
    {...props}
    aspectRatio={1}
    sizes="(max-width: 768px) 80px, 120px"
    quality={70}
  />
);

// Gallery组件：优化多图片加载
interface GalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns?: number;
  className?: string;
}

export const OptimizedGallery: React.FC<GalleryProps> = ({
  images,
  columns = 3,
  className = ''
}) => {
  return (
    <div 
      className={cn(
        'grid gap-4',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {images.map((image, index) => (
        <div key={index} className="space-y-2">
          <CardImage
            src={image.src}
            alt={image.alt}
            priority={index < 4} // 前4张图片优先加载
            loading={index < 4 ? 'eager' : 'lazy'}
          />
          {image.caption && (
            <p className="text-sm text-gray-600 text-center">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

// 响应式背景图片组件
interface ResponsiveBackgroundProps {
  src: string;
  alt: string;
  children?: React.ReactNode;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

export const ResponsiveBackground: React.FC<ResponsiveBackgroundProps> = ({
  src,
  alt,
  children,
  className = '',
  overlay = false,
  overlayOpacity = 0.5
}) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        priority={true}
        quality={85}
        sizes="100vw"
        className="object-cover"
      />
      
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
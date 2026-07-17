'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ContentRendererProps {
  content: string;
  className?: string;
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Process images
    const images = contentRef.current.querySelectorAll('img');
    images.forEach((img) => {
      // Create a container for the image
      const container = document.createElement('div');
      container.className = 'my-4 relative rounded-lg overflow-hidden';
      
      // Set width and height based on the image attributes or default
      const width = img.getAttribute('width') || '800';
      const height = img.getAttribute('height') || '450';
      const aspectRatio = parseInt(height) / parseInt(width);
      
      container.style.paddingBottom = `${aspectRatio * 100}%`;
      container.style.position = 'relative';
      
      // Replace the img with the container
      if (img.parentNode) {
        img.parentNode.replaceChild(container, img);
        
        // Create a new image element that will use next/image under the hood
        const imgClone = document.createElement('img');
        imgClone.src = img.src;
        imgClone.alt = img.alt || 'Content image';
        imgClone.className = 'object-cover';
        imgClone.style.position = 'absolute';
        imgClone.style.top = '0';
        imgClone.style.left = '0';
        imgClone.style.width = '100%';
        imgClone.style.height = '100%';
        
        container.appendChild(imgClone);
      }
    });

    // Process iframes (e.g., YouTube embeds)
    const iframes = contentRef.current.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      const container = document.createElement('div');
      container.className = 'my-4 relative rounded-lg overflow-hidden aspect-video';
      
      // Replace the iframe with the container
      if (iframe.parentNode) {
        iframe.parentNode.replaceChild(container, iframe);
        
        // Clone the iframe and add it to the container
        const iframeClone = iframe.cloneNode(true) as HTMLIFrameElement;
        iframeClone.style.position = 'absolute';
        iframeClone.style.top = '0';
        iframeClone.style.left = '0';
        iframeClone.style.width = '100%';
        iframeClone.style.height = '100%';
        iframeClone.style.border = 'none';
        
        container.appendChild(iframeClone);
      }
    });

    // Add classes to elements
    const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
      heading.className = cn(
        heading.className,
        'scroll-m-20 font-semibold tracking-tight'
      );
      
      if (heading.tagName === 'H1') {
        heading.className = cn(heading.className, 'text-4xl lg:text-5xl mt-8 mb-4');
      } else if (heading.tagName === 'H2') {
        heading.className = cn(heading.className, 'text-3xl lg:text-4xl mt-8 mb-3');
      } else if (heading.tagName === 'H3') {
        heading.className = cn(heading.className, 'text-2xl lg:text-3xl mt-6 mb-3');
      } else if (heading.tagName === 'H4') {
        heading.className = cn(heading.className, 'text-xl lg:text-2xl mt-4 mb-2');
      } else {
        heading.className = cn(heading.className, 'text-lg mt-4 mb-2');
      }
    });

    const paragraphs = contentRef.current.querySelectorAll('p');
    paragraphs.forEach((p) => {
      p.className = cn(p.className, 'leading-7 [&:not(:first-child)]:mt-6');
    });

    const blockquotes = contentRef.current.querySelectorAll('blockquote');
    blockquotes.forEach((blockquote) => {
      blockquote.className = cn(
        blockquote.className,
        'mt-6 border-l-2 pl-6 italic'
      );
    });

    // Style lists
    const lists = contentRef.current.querySelectorAll('ul, ol');
    lists.forEach((list) => {
      list.className = cn(list.className, 'my-6 ml-6 list-disc [&>li]:mt-2');
    });

    // Style links
    const links = contentRef.current.querySelectorAll('a');
    links.forEach((link) => {
      link.className = cn(
        link.className,
        'font-medium underline underline-offset-4'
      );
      
      // Add target="_blank" for external links
      if (link.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Style tables
    const tables = contentRef.current.querySelectorAll('table');
    tables.forEach((table) => {
      table.className = cn(
        table.className,
        'w-full my-6 overflow-y-auto rounded-md border'
      );
      
      const tableHeaders = table.querySelectorAll('th');
      tableHeaders.forEach((th) => {
        th.className = cn(
          th.className,
          'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right'
        );
      });
      
      const tableCells = table.querySelectorAll('td');
      tableCells.forEach((td) => {
        td.className = cn(
          td.className,
          'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right'
        );
      });
    });

    // Style code blocks
    const codeBlocks = contentRef.current.querySelectorAll('pre');
    codeBlocks.forEach((pre) => {
      pre.className = cn(
        pre.className,
        'my-6 rounded-md bg-muted p-4 overflow-x-auto'
      );
      
      const code = pre.querySelector('code');
      if (code) {
        code.className = cn(code.className, 'font-mono text-sm');
      }
    });

    // Style inline code
    const inlineCodes = contentRef.current.querySelectorAll('code:not(pre code)');
    inlineCodes.forEach((code) => {
      code.className = cn(
        code.className,
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm'
      );
    });

  }, [content]);

  return (
    <div 
      ref={contentRef} 
      className={cn('wp-content', className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
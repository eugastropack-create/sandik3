import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdSenseBannerProps {
  slotId?: string;
  clientId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  label?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId = '1234567890',
  clientId = (import.meta as any).env?.VITE_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX',
  format = 'auto',
  responsive = true,
  className = '',
  label = 'Advertisement / Reklam',
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Dynamically inject Google AdSense script if not already present in the head
    const existingScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
    if (!existingScript && clientId && !clientId.includes('XXXX')) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Push ad request safely
    try {
      if (!isLoaded.current && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      }
    } catch (err) {
      // Catch duplicate push errors in dev mode / hot reload
      console.debug('AdSense push notice:', err);
    }
  }, [clientId, slotId]);

  const isPlaceholder = !clientId || clientId.includes('XXXX');

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      {/* Ad Label Header */}
      <div className="w-full flex items-center justify-between px-1 mb-1">
        <span className="text-[9px] uppercase tracking-widest text-[#5c5b57] font-semibold">
          {label}
        </span>
        <span className="text-[8px] uppercase tracking-widest text-[#385060]">
          Google AdSense
        </span>
      </div>

      {/* AdSense Container Box */}
      <div className="w-full min-h-[90px] bg-[#020b14] border border-[#1e2328] rounded-sm overflow-hidden flex flex-col items-center justify-center relative p-1.5 shadow-inner">
        {/* Actual Google AdSense Tag */}
        <ins
          ref={adRef}
          className="adsbygoogle w-full block"
          style={{ display: 'block', minHeight: '80px' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />

        {/* Display informative Hextech preview placeholder when publisher ID is not yet customized */}
        {isPlaceholder && (
          <div className="flex flex-col items-center justify-center text-center py-2 px-2 border border-dashed border-[#005a82]/40 rounded-xs w-full bg-[#0a1e28]/40">
            <div className="flex items-center gap-1.5 text-[#00c8c8] text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00c8c8] animate-pulse"></span>
              Google AdSense Banner
            </div>
            <p className="text-[8.5px] text-[#a09b8c] mt-0.5">
              Slot ID: {slotId} • Format: {format}
            </p>
            <p className="text-[8px] text-[#5c5b57] mt-0.5">
              Set <code className="text-[#c8aa6e]">VITE_ADSENSE_CLIENT_ID</code> in .env to go live
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

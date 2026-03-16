import React from 'react';

interface MobileFrameProps {
    children: React.ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 md:p-8">
            {/* Phone Case/Border */}
            <div className="relative w-[375px] h-[812px] bg-[#1e293b] rounded-[60px] shadow-[0_0_0_12px_#334155,0_20px_50px_rgba(0,0,0,0.5)] border-[8px] border-[#0f172a] overflow-hidden flex flex-col">

                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#0f172a] rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#1e293b]" />
                    <div className="w-8 h-1 rounded-full bg-[#1e293b]" />
                </div>

                {/* Status Bar Mockup */}
                <div className="h-10 w-full bg-transparent flex justify-between items-end px-8 pb-1 z-40">
                    <span className="text-[10px] font-bold text-white/40">9:41</span>
                    <div className="flex gap-1 items-center">
                        <div className="w-3 h-1.5 bg-white/30 rounded-sm" />
                        <div className="w-2 h-2 rounded-full bg-white/30" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 w-full relative bg-white isolate flex flex-col overflow-hidden">
                    {children}
                </div>

                {/* Home Indicator */}
                <div className="h-6 w-full flex justify-center items-center bg-white border-t border-gray-50 flex-shrink-0 relative z-50">
                    <div className="w-32 h-1 bg-gray-200 rounded-full" />
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="fixed -top-24 -left-24 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        </div>
    );
}

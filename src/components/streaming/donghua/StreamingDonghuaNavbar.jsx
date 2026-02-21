import { ChevronLeft } from 'lucide-react';

const StreamingDonghuaNavbar = ({
    title,
    episodeTitle,
    episodeNumber,
    onBack
}) => {
    return (
        <div className="sticky top-0 z-50 bg-dark-surface/95 backdrop-blur-sm border-b border-dark-border">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center h-16">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-dark-card flex items-center justify-center group-hover:bg-primary-400/10">
                            <ChevronLeft size={18} className="group-hover:text-primary-400" />
                        </div>
                        <span className="text-sm font-medium hidden sm:block">Back</span>
                    </button>

                    <div className="flex-1 mx-4 min-w-0">
                        <h1 className="text-base sm:text-lg font-bold text-white truncate">
                            {title || 'Donghua'}
                        </h1>
                        <p className="text-xs sm:text-sm text-primary-400 truncate">
                            {episodeTitle}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-500/20 text-red-400">
                            Episode {episodeNumber}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreamingDonghuaNavbar;
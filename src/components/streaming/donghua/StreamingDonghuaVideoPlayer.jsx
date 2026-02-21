import { forwardRef } from 'react';
import { MonitorPlay, AlertTriangle } from 'lucide-react';

const StreamingDonghuaVideoPlayer = forwardRef(({
    selectedServer,
    isLoading,
    showAdsWarning,
    onLoad,
    onError
}, ref) => {
    if (!selectedServer) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-bg">
                <div className="text-center">
                    <MonitorPlay size={48} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No stream available</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark-bg z-10">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-400">Loading player...</p>
                    </div>
                </div>
            )}

            {/* Ads Warning */}
            {showAdsWarning && selectedServer.hasAds && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-yellow-500/90 text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 animate-fade-in">
                    <AlertTriangle size={16} />
                    <span>This server may contain ads</span>
                </div>
            )}

            <iframe
                ref={ref}
                src={selectedServer.url}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
                frameBorder="0"
                title={selectedServer.server}
                onLoad={onLoad}
                onError={onError}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-top-navigation"
            />
        </>
    );
});

StreamingDonghuaVideoPlayer.displayName = 'StreamingDonghuaVideoPlayer';

export default StreamingDonghuaVideoPlayer;
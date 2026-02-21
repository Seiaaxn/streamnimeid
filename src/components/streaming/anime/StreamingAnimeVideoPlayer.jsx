import { forwardRef } from 'react';
import { MonitorPlay } from 'lucide-react';

const StreamingAnimeVideoPlayer = forwardRef(({
    selectedServer,
    isLoading,
    onLoad,
    onError
}, ref) => {
    return (
        <div className="fixed top-19 left-0 w-full z-40 bg-black aspect-video">
            {!selectedServer ? (
                <div className="absolute inset-0 flex items-center justify-center bg-dark-bg">
                    <div className="text-center">
                        <MonitorPlay size={48} className="text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No stream available</p>
                    </div>
                </div>
            ) : (
                <>
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-dark-bg z-10">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-gray-400">Loading player...</p>
                            </div>
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
            )}
        </div>
    );
});

StreamingAnimeVideoPlayer.displayName = 'StreamingAnimeVideoPlayer';

export default StreamingAnimeVideoPlayer;

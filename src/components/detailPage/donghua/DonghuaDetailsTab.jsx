import DonghuaRating from './DonghuaRating';

const DonghuaDetailsTab = ({
    description,
    status,
    type,
    totalEpisodes,
    studio,
    network,
    released,
    duration,
    season,
    country,
    fansub,
    postedBy,
    postedOn,
    updatedOn,
    genres = [],
    rating
}) => {
    const rows = [
        { label: 'Status', value: status },
        { label: 'Tipe', value: type },
        { label: 'Episode', value: totalEpisodes > 0 ? totalEpisodes : null },
        { label: 'Studio', value: studio && studio !== 'Unknown' ? studio : null },
        { label: 'Network', value: network },
        { label: 'Rilis', value: released },
        { label: 'Durasi', value: duration },
        { label: 'Season', value: season },
        { label: 'Negara', value: country },
        { label: 'Fansub', value: fansub },
        { label: 'Diposting', value: postedBy },
        { label: 'Tanggal Post', value: postedOn },
        { label: 'Diperbarui', value: updatedOn },
    ].filter(r => r.value);

    return (
        <div className="space-y-5">
            {/* Synopsis */}
            {description && (
                <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Sinopsis</p>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        {description}
                    </p>
                </div>
            )}

            {/* Information — full-width rows */}
            {rows.length > 0 && (
                <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Informasi</p>
                    <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
                        {rows.map((row, i) => (
                            <div
                                key={row.label}
                                className={`flex items-center justify-between px-4 py-3 ${i < rows.length - 1 ? 'border-b border-dark-border' : ''}`}
                            >
                                <span className="text-xs text-gray-500 flex-shrink-0 w-28">{row.label}</span>
                                <span className="text-xs text-white font-medium text-right flex-1 break-words">{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Genres */}
            {genres.length > 0 && (
                <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Genre</p>
                    <div className="flex flex-wrap gap-2">
                        {genres.map((genre, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-dark-card border border-dark-border rounded-full text-xs text-gray-300 hover:border-red-500/40 transition"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating */}
            <DonghuaRating rating={rating} />
        </div>
    );
};

export default DonghuaDetailsTab;

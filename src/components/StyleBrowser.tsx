import React, { useState, useMemo } from 'react';
import { RhythmStyle, RhythmCategory, CATEGORY_NAMES } from '../types/rhythm';
import { ALL_STYLES, searchStyles } from '../data';
import { Search, Star, Music, Filter, Play, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

interface StyleBrowserProps {
  currentStyle: RhythmStyle;
  isPlaying: boolean;
  onSelectStyle: (style: RhythmStyle) => void;
  onTogglePlay: () => void;
}

export const StyleBrowser: React.FC<StyleBrowserProps> = ({
  currentStyle,
  isPlaying,
  onSelectStyle,
  onTogglePlay
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<RhythmCategory | 'ALL' | 'FAVORITES'>('ALL');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('yamaha_drum_favs');
      return saved ? JSON.parse(saved) : ['00', '12', '20', '30', '40', '50', '60', '69', '82', '90'];
    } catch {
      return ['00', '12', '20', '30', '40', '50', '60', '69', '82', '90'];
    }
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('yamaha_drum_favs', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const categories: Array<{ id: RhythmCategory | 'ALL' | 'FAVORITES'; label: string; range?: string }> = [
    { id: 'ALL', label: 'Wszystkie 100', range: '00-99' },
    { id: 'FAVORITES', label: '★ Ulubione' },
    { id: '8BEAT', label: '8-Beat', range: '00-09' },
    { id: '16BEAT', label: '16-Beat', range: '10-19' },
    { id: 'ROCK_BLUES', label: 'Rock & Blues', range: '20-29' },
    { id: 'DISCO_DANCE', label: 'Disco & Dance', range: '30-39' },
    { id: 'FUNK_SOUL', label: 'Funk & Soul', range: '40-49' },
    { id: 'JAZZ_SWING', label: 'Jazz & Swing', range: '50-59' },
    { id: 'LATIN', label: 'Latin & Caribbean', range: '60-74' },
    { id: 'COUNTRY_FOLK', label: 'Country & Folk', range: '75-79' },
    { id: 'BALLAD', label: 'Ballady & 6/8', range: '80-89' },
    { id: 'TRADITIONAL', label: 'Traditional & Waltz', range: '90-99' }
  ];

  const filteredStyles = useMemo(() => {
    let result = searchQuery ? searchStyles(searchQuery) : ALL_STYLES;

    if (selectedCategory === 'FAVORITES') {
      result = result.filter((s) => favorites.includes(s.id));
    } else if (selectedCategory !== 'ALL') {
      result = result.filter((s) => s.category === selectedCategory);
    }

    return result;
  }, [searchQuery, selectedCategory, favorites]);

  return (
    <div className="bg-[#1c1e24] border-2 border-[#2b2f38] rounded-2xl p-4 sm:p-5 shadow-xl">
      {/* Header with Search and Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 pb-3 border-b border-gray-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-100 flex items-center space-x-2">
            <Music className="w-5 h-5 text-amber-400" />
            <span>KATALOG 100 RYTMÓW YAMAHA PSR-220/230</span>
          </h2>
          <p className="text-xs text-gray-400">
            Wybierz dowolny styl, aby załadować jego zestaw sekcji i wskazówek treningowych.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Szukaj (np. 30, Bossa, 6/8, Rock)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121316] border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-3 mb-3 scrollbar-thin">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1 ${
                isSelected
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                  : 'bg-[#252830] hover:bg-[#30343f] text-gray-300 border border-gray-800'
              }`}
            >
              <span>{cat.label}</span>
              {cat.range && (
                <span className={`text-[10px] ml-1 px-1 rounded ${isSelected ? 'bg-black/20 text-black' : 'text-gray-400'}`}>
                  {cat.range}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Style Grid / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[480px] overflow-y-auto pr-1">
        {filteredStyles.map((style) => {
          const isSelected = currentStyle.id === style.id;
          const isFav = favorites.includes(style.id);

          return (
            <div
              key={style.id}
              onClick={() => onSelectStyle(style)}
              className={`group relative p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-[#243328] to-[#1a251e] border-emerald-500/80 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/50'
                  : 'bg-[#22252c] border-gray-800/80 hover:bg-[#282d36] hover:border-gray-700'
              }`}
            >
              <div>
                {/* Top card row: ID, Name, Favorite Star */}
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-mono font-black px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-emerald-500 text-black'
                          : 'bg-[#15171b] text-amber-400 border border-gray-800'
                      }`}
                    >
                      {style.id}
                    </span>
                    <span className={`text-sm font-bold truncate ${isSelected ? 'text-emerald-300 font-extrabold' : 'text-gray-100'}`}>
                      {style.name}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(style.id, e)}
                    className="text-gray-500 hover:text-amber-400 transition-colors p-1"
                    title={isFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                {/* Subtitle / Description */}
                <p className="text-[11px] text-gray-400 line-clamp-2 mb-2 leading-relaxed">
                  {style.description}
                </p>
              </div>

              {/* Bottom Badges: BPM, Time Sig, Practice advice tag */}
              <div className="pt-2 border-t border-gray-800/60 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <div className="flex items-center space-x-1.5">
                  <span className="bg-black/30 px-1.5 py-0.5 rounded text-gray-300">
                    {style.defaultBpm} BPM
                  </span>
                  <span className="bg-black/30 px-1.5 py-0.5 rounded text-gray-300">
                    {style.timeSignature[0]}/{style.timeSignature[1]}
                  </span>
                </div>

                {isSelected ? (
                  <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>WYBRANY</span>
                  </span>
                ) : (
                  <span className="text-gray-400 group-hover:text-amber-400 flex items-center space-x-0.5">
                    <span>Graj</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredStyles.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400">
            Nie znaleziono stylów dla zapytania &quot;{searchQuery}&quot;.
          </div>
        )}
      </div>
    </div>
  );
};

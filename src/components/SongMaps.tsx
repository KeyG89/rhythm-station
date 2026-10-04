import { ExternalLink, Music2 } from 'lucide-react';
import { getSongMap, listSongMaps } from '../domain/songMaps';

export function SongMaps({grooveId, selected, onLoad}: {grooveId:string; selected:string; onLoad:(id:string)=>void}) {
  const current = selected ? getSongMap(selected,grooveId) : undefined;
  return <section className="song-panel panel-light" aria-label="Mapy utworów">
    <div className="panel-heading"><span className="eyebrow">05 MAP / ZAGRAJ ZNANY UTWÓR</span><Music2 size={18}/></div>
    <h3>Groove z nagrania</h3>
    <p className="muted">Krótkie mapy inspirowane utworami, dopasowane do zestawu. Tempo ≈, nagrania w YouTube i Spotify. Complexity prowadzi do partii docelowej na poziomie 4.</p>
    <div className="song-list">{listSongMaps(grooveId).map((song,i)=><div className={`song-row ${song.id === selected ? 'selected' : ''}`} key={song.id}>
      <span className="song-index">0{i+1}</span><div className="song-name"><b>{song.title}</b><small>{song.artist}</small></div>
      <span className="song-bpm">≈ {song.bpm}<small>{grooveId === '09' ? '♩. BPM' : '♩ BPM'}</small></span>
      <button className="small-action" aria-label={`Wczytaj: ${song.title}`} aria-pressed={song.id === selected} onClick={()=>onLoad(song.id)}>{song.id === selected ? 'Wczytaj ponownie' : 'Wczytaj'}</button>
      <a className="song-link" href={song.youtube} target="_blank" rel="noreferrer" aria-label={`YouTube: ${song.artist} — ${song.title}`} title="Posłuchaj nagrania w YouTube"><ExternalLink size={14}/><span>YouTube</span></a>
      <a className="song-link spotify-link" href={song.spotify || `https://open.spotify.com/search/${encodeURIComponent(`${song.artist} ${song.title}`)}`} target="_blank" rel="noreferrer" aria-label={`Spotify: ${song.artist} — ${song.title}`} title={song.spotify ? 'Nagranie w Spotify' : 'Wyszukaj ten utwór w Spotify'}><ExternalLink size={14}/><span>{song.spotify?'Spotify':'Spotify · szukaj'}</span></a>
    </div>)}</div>
    {current && <div className="song-context" role="status"><b>Ćwiczysz: {current.title}</b><p>{current.note}</p><span>{current.tempoNote} · <a href={current.tempoSource} target="_blank" rel="noreferrer">Źródło tempa</a> · <a href={current.referenceSource} target="_blank" rel="noreferrer">Referencja partii</a></span><small>Ładowanie przywraca mapę A i tempo oraz zeruje suwaki i własne nuty. Zapisz swój groove przed zmianą.</small></div>}
    {!current && <p className="song-footnote">Wczytaj mapę i tempo jednym kliknięciem. To pętla do ćwiczeń, nie pełna transkrypcja całego utworu. Wykonania live mogą wymagać Tap tempo.</p>}
  </section>;
}

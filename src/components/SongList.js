import { useList, ListStatus, Empty } from './PortalUI';
export default function SongList() {
  const list = useList('/getSongs');
  return <ListStatus list={list}>{list.items.length ? <ol className="portal-wheel-song-list">{list.items.map(s => <li key={s.id}><span>{s.VideoTitleShortened || s.VideoTitle}</span><a href={`https://www.youtube.com/watch?v=${encodeURIComponent(s.VideoSource)}`} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${s.VideoTitle}`}>↗</a></li>)}</ol> : !list.loading && !list.error && <Empty title="Your list is empty.">Invite members to share their favorite songs.</Empty>}</ListStatus>;
}

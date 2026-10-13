import { Link } from 'react-router-dom';
import CustomWheel from './CustomWheel';
import SongList from './SongList';
import { Page, Panel } from './PortalUI';
export default function SongSelector() {
  return <Page eyebrow="WORSHIP TOGETHER" title="Let the music begin." description="Spin the wheel and discover a song from your community’s submissions." action={<Link className="portal-btn secondary" to="/SongPicker">Find more songs ↗</Link>}><div className="portal-wheel-layout"><Panel title="The song wheel"><CustomWheel /></Panel><Panel title="On the list" description="Songs available for selection."><SongList /></Panel></div></Page>;
}

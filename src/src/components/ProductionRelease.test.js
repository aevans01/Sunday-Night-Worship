import {TextEncoder} from 'util';
global.TextEncoder=TextEncoder;
import {render,screen,fireEvent,waitFor} from '@testing-library/react';import {MemoryRouter} from 'react-router-dom';
import Sermons from './Sermons';import VisitorContact from './VisitorContact';import SongPicker from './SongPicker';import {api} from './PortalUI';import youtube from '../youtube';import {eventCalendar} from './eventCalendar';import RouteMetadata from '../layout/RouteMetadata';
jest.mock('axios',()=>({create:()=>({get:jest.fn(),put:jest.fn(),post:jest.fn(),delete:jest.fn()})}));
jest.mock('../youtube',()=>({get:jest.fn()}));
const wrap=c=>render(<MemoryRouter>{c}</MemoryRouter>);
beforeEach(()=>jest.clearAllMocks());
test('public sermon library renders the submitted message and YouTube link',async()=>{
 api.get.mockResolvedValue({data:[{id:1,title:'Hope in Christ',speaker:'Pastor',sermon_date:'2026-10-11',scripture:'John 3:16',description:'A message',youtube_id:'abcdefghijk'}]});
 wrap(<Sermons/>);expect(await screen.findByText('Hope in Christ')).toBeInTheDocument();expect(screen.getByRole('link',{name:/Watch message/})).toHaveAttribute('href','https://www.youtube.com/watch?v=abcdefghijk');
});
test('visitor contact sends consent and private details to the visitor endpoint',async()=>{
 api.post.mockResolvedValue({data:{success:true}});wrap(<VisitorContact/>);
 fireEvent.change(screen.getByRole('textbox',{name:'Your name'}),{target:{value:'Guest'}});fireEvent.change(screen.getByRole('textbox',{name:'Email'}),{target:{value:'guest@example.test'}});fireEvent.click(screen.getByRole('checkbox'));fireEvent.click(screen.getByRole('button',{name:/Send private request/}));
 await waitFor(()=>expect(api.post).toHaveBeenCalledWith('/planVisit',expect.objectContaining({name:'Guest',email:'guest@example.test',consent:true})));await screen.findByText(/Your request has been received/);
});
test('signed-out visitor enters explicit song name before submission',async()=>{
 youtube.get.mockResolvedValue({data:{items:[{id:{videoId:'abcdefghijk'},snippet:{title:'Man Of Sorrows - Hillsong Worship',description:'',channelTitle:'Hillsong',thumbnails:{medium:{url:'https://i.ytimg.com/vi/abcdefghijk/mqdefault.jpg'}}}}]}});api.post.mockResolvedValue({data:{success:true}});wrap(<SongPicker/>);
 fireEvent.change(screen.getByLabelText('Search songs or artists'),{target:{value:'Man of Sorrows'}});fireEvent.click(screen.getByRole('button',{name:/Search songs/}));await screen.findByText('Man Of Sorrows - Hillsong Worship');
 fireEvent.click(screen.getByRole('button',{name:/Add to song list/}));expect(api.post).not.toHaveBeenCalled();
 fireEvent.change(screen.getByLabelText('Song name (required)'),{target:{value:'Man of Sorrows'}});fireEvent.change(screen.getByLabelText('Artist (optional)'),{target:{value:'Hillsong Worship'}});fireEvent.click(screen.getByRole('button',{name:/Add to song list/}));
 await waitFor(()=>expect(api.post).toHaveBeenCalledWith('/addSongs',expect.objectContaining({SongName:'Man of Sorrows',Artist:'Hillsong Worship'})));await screen.findByText('Song added to the church song list.');
});
test('calendar includes Central timezone, escaped text and cancellation state',()=>{
 const result=eventCalendar({id:2,Date:'2026-11-01T10:00:00',endTime:'2026-11-01T11:30:00',Title:'Gather, together',Location:'Church; hall',Details:'Welcome\nBring friends',status:'cancelled'});
 expect(result).toContain('TZID:America/Chicago');expect(result).toContain('DTSTART;TZID=America/Chicago:20261101T100000');expect(result).toContain('SUMMARY:Gather\\, together');expect(result).toContain('STATUS:CANCELLED');expect(result).toContain('DTEND;TZID=America/Chicago:20261101T113000');
});
test('private routes get noindex metadata',()=>{render(<MemoryRouter initialEntries={['/VisitorRequests']}><RouteMetadata/></MemoryRouter>);expect(document.head.querySelector('meta[name="robots"]').content).toBe('noindex,nofollow');});

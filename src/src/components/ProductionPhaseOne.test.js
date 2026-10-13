import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import PlanVisit from './PlanVisit';
import About from './About';
import PrayerFollowups from './PrayerFollowups';
import {api} from './PortalUI';
jest.mock('axios',()=>({create:()=>({get:jest.fn(),put:jest.fn(),post:jest.fn()})}));
const wrap=component=>render(<MemoryRouter>{component}</MemoryRouter>);
beforeEach(()=>jest.clearAllMocks());
test('visitor page has published directions, office contact, and service times',()=>{
 wrap(<PlanVisit/>);expect(screen.getByText(/7701 Highway 271 South/)).toBeInTheDocument();
 expect(screen.getByText('Sunday · 10:45 AM')).toBeInTheDocument();
 expect(screen.getByRole('link',{name:'Call the church office'})).toHaveAttribute('href','tel:+14796467266');
 expect(screen.getByRole('link',{name:/Get directions/})).toHaveAttribute('href',expect.stringContaining('google.com/maps/dir'));
});
test('about page includes published leadership and a visitor path',()=>{
 wrap(<About/>);expect(screen.getByText('Dr. Steve Young')).toBeInTheDocument();
 expect(screen.getByRole('link',{name:/Plan your visit/})).toHaveAttribute('href','/PlanVisit');
});
test('follow-up dashboard saves a status and retries only after confirmation',async()=>{
 const row={id:7,name:'A guest',phone:'479-555-1234',description:'Please pray',careStatus:'new',acceptedEmails:0,pendingEmails:0,failedEmails:1};
 api.get.mockResolvedValue({data:[row]});api.put.mockResolvedValue({data:{success:true}});api.post.mockResolvedValue({data:{success:true}});
 wrap(<PrayerFollowups/>);await screen.findByText('A guest');
 fireEvent.change(screen.getByRole('combobox',{name:'Status for A guest'}),{target:{value:'assigned'}});
 await waitFor(()=>expect(api.put).toHaveBeenCalledWith('/prayerFollowups/7',{status:'assigned'}));
 await screen.findByText('Follow-up status saved.');
 fireEvent.click(screen.getByRole('button',{name:'Retry failed emails'}));expect(api.post).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Retry emails'}));
 await waitFor(()=>expect(api.post).toHaveBeenCalledWith('/prayerFollowups/7/retry'));
 await screen.findByText('Failed notifications queued for retry.');
});

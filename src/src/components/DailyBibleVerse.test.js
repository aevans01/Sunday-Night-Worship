import { render, screen, fireEvent } from '@testing-library/react';
import DailyBibleVerse from './DailyBibleVerse';
const daily={ok:true,json:async()=>({verse:{details:{text:'NIV text must never display',reference:'Psalm 32:8',version:'NIV'}}})};
const kjv={ok:true,json:async()=>({text:'KJV scripture',reference:'Psalm 32:8',translation_id:'kjv'})};
beforeEach(()=>localStorage.clear());
test('looks up daily reference in KJV and never displays provider NIV text',async()=>{
 global.fetch=jest.fn().mockResolvedValueOnce(daily).mockResolvedValueOnce(kjv);
 render(<DailyBibleVerse/>);
 expect(await screen.findByText('KJV scripture')).toBeInTheDocument();
 expect(screen.queryByText('NIV text must never display')).not.toBeInTheDocument();
 expect(global.fetch.mock.calls[1][0]).toBe('https://bible-api.com/Psalm%2032%3A8?translation=kjv');
 expect(screen.getByRole('link',{name:/Read in context/})).toHaveAttribute('href','https://www.biblegateway.com/passage/?search=Psalm%2032%3A8&version=KJV');
});
test('rejects a non-KJV response and non-KJV cached verse',async()=>{
 localStorage.setItem('hh-daily-verse-kjv-v2',JSON.stringify({day:new Date().toLocaleDateString('en-CA'),verse:{text:'Bad cached text',reference:'Psalm 32:8',version:'NIV'}}));
 global.fetch=jest.fn().mockResolvedValueOnce(daily).mockResolvedValueOnce({ok:true,json:async()=>({text:'Wrong version',reference:'Psalm 32:8',translation_id:'web'})});
 render(<DailyBibleVerse/>);
 expect(await screen.findByText(/Showing a selected KJV scripture/)).toBeInTheDocument();
 expect(screen.queryByText('Wrong version')).not.toBeInTheDocument();expect(screen.queryByText('Bad cached text')).not.toBeInTheDocument();
});
test('uses KJV fallback and recovers on retry',async()=>{
 global.fetch=jest.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(daily).mockResolvedValueOnce(kjv);
 render(<DailyBibleVerse/>);expect(await screen.findByText(/Showing a selected KJV scripture/)).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Try again'}));expect(await screen.findByText('KJV scripture')).toBeInTheDocument();
});

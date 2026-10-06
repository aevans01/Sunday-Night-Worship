import { render, screen, fireEvent } from '@testing-library/react';
import DailyBibleVerse from './DailyBibleVerse';
beforeEach(() => localStorage.clear());
test('loads API verse and creates reading link', async () => {
  global.fetch = jest.fn().mockResolvedValue({ok:true,json:async()=>({verse:{details:{text:'Test scripture',reference:'Psalm 32:8',version:'NIV'}}})});
  render(<DailyBibleVerse/>);
  expect(await screen.findByText('Test scripture')).toBeInTheDocument();
  expect(screen.getByRole('link',{name:/Read in context/})).toHaveAttribute('href','https://www.biblegateway.com/passage/?search=Psalm%2032%3A8&version=NIV');
});
test('labels fallback and recovers on retry', async () => {
  global.fetch = jest.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ok:true,json:async()=>({verse:{details:{text:'Recovered verse',reference:'John 3:16',version:'KJV'}}})});
  render(<DailyBibleVerse/>);
  expect(await screen.findByText(/Showing a selected KJV scripture/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Try again'}));
  expect(await screen.findByText('Recovered verse')).toBeInTheDocument();
});
test('rejects malformed response',async()=>{
  global.fetch = jest.fn().mockResolvedValue({ok:true,json:async()=>({verse:{details:{text:'incomplete'}}})});
  render(<DailyBibleVerse/>);
  expect(await screen.findByText(/Showing a selected KJV scripture/)).toBeInTheDocument();
});

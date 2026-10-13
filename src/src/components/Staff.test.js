import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import Staff from './Staff';
import ManageStaff from './ManageStaff';
import {api} from './PortalUI';
jest.mock('axios',()=>({create:()=>({get:jest.fn(),put:jest.fn()})}));
const rows=[{id:9,name:'Michael Oldham',role:'Custodian',photo:''},{id:10,name:'Michael Oldham',role:'Grounds Keeper',photo:''}];
beforeEach(()=>{jest.clearAllMocks();api.get.mockResolvedValue({data:rows});});
test('directory keeps two positions with separate placeholder photos',async()=>{
 render(<MemoryRouter><Staff/></MemoryRouter>);await screen.findByText('Custodian');
 expect(screen.getByText('Grounds Keeper')).toBeInTheDocument();expect(screen.getAllByText('Michael Oldham')).toHaveLength(2);
 expect(document.querySelectorAll('img[src="/images/staff-placeholder.svg"]')).toHaveLength(2);
});
test('admin updates only selected position',async()=>{
 api.put.mockResolvedValue({data:{success:true}});
 render(<MemoryRouter><ManageStaff/></MemoryRouter>);await screen.findByText('Custodian');
 fireEvent.change(screen.getAllByLabelText(/Name/)[0],{target:{value:'New Custodian'}});
 fireEvent.click(screen.getAllByRole('button',{name:'Save position'})[0]);
 await waitFor(()=>expect(api.put).toHaveBeenCalledWith('/manageStaff/9',{name:'New Custodian',role:'Custodian',photo:''}));
 expect(screen.getAllByLabelText(/Name/)[1]).toHaveValue('Michael Oldham');
});

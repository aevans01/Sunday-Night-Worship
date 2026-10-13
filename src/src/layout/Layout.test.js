import {render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import Layout from './Layout';
jest.mock('./MainNavigation',()=>()=> <nav aria-label="Main navigation">Navigation</nav>);
test('mounts page controls in accessible shared layout',()=>{render(<MemoryRouter><Layout><h1>My page</h1><button>Existing action</button></Layout></MemoryRouter>);expect(screen.getByRole('main')).toHaveAttribute('id','main-content');expect(screen.getByRole('link',{name:'Skip to content'})).toHaveAttribute('href','#main-content');expect(screen.getByRole('button',{name:'Existing action'})).toBeInTheDocument();expect(screen.getAllByRole('heading',{level:1})).toHaveLength(1);});
test('removes modal body theme on unmount',()=>{const {unmount}=render(<MemoryRouter><Layout>Content</Layout></MemoryRouter>);expect(document.body).toHaveClass('portal-body');unmount();expect(document.body).not.toHaveClass('portal-body');});

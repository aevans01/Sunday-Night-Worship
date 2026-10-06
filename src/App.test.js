import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Axios from 'axios';
import { UserProvider, useUser } from './UserContext';
import ProtectedRoute from './ProtectedRoute';

jest.mock('axios', () => ({ get: jest.fn(), post: jest.fn() }));
const admin = { id: 7, firstName: 'Austin', role: 1 };
function Controls() {
    const { user, login, logout, sessionError, refreshSession } = useUser();
    return <>
        <span>{user ? user.firstName : 'signed out'}</span>
        <button onClick={() => login(admin)}>Log in</button>
        <button onClick={() => logout().catch(() => {})}>Log out</button>
        {sessionError && <button onClick={refreshSession}>Retry</button>}
    </>;
}
function mount() {
    return render(<MemoryRouter initialEntries={['/admin']}>
        <UserProvider><Controls /><Routes>
            <Route path="/admin" element={<ProtectedRoute roles={['1']}><p>Admin page</p></ProtectedRoute>} />
            <Route path="/Login" element={<p>Login page</p>} />
            <Route path="/AdminError" element={<p>Access denied</p>} />
        </Routes></UserProvider>
    </MemoryRouter>);
}
beforeEach(() => { jest.resetAllMocks(); localStorage.clear(); });
test('refresh waits for server session and restores numeric admin role', async () => {
    let resolve;
    Axios.get.mockReturnValue(new Promise(r => { resolve = r; }));
    mount();
    expect(screen.getByRole('status')).toHaveTextContent('Checking');
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
    await act(async () => resolve({ data: { loggedIn: true, user: admin } }));
    expect(screen.getByText('Admin page')).toBeInTheDocument();
    expect(Axios.get).toHaveBeenCalledWith('/api/session', { withCredentials: true });
});
test('expired session redirects to actual login route', async () => {
    Axios.get.mockResolvedValue({ data: { loggedIn: false } });
    mount();
    expect(await screen.findByText('Login page')).toBeInTheDocument();
});
test('localStorage cannot grant admin access', async () => {
    localStorage.setItem('user', JSON.stringify(admin));
    Axios.get.mockResolvedValue({ data: { loggedIn: false } });
    mount();
    expect(await screen.findByText('Login page')).toBeInTheDocument();
    expect(localStorage.getItem('user')).toBeNull();
});
test('network failure allows retry without redirecting', async () => {
    Axios.get.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ data: { loggedIn: true, user: admin } });
    mount();
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to check');
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Retry'));
    expect(await screen.findByText('Admin page')).toBeInTheDocument();
});
test('logout clears user only after server destroys session', async () => {
    Axios.get.mockResolvedValue({ data: { loggedIn: true, user: admin } });
    Axios.post.mockResolvedValue({ data: { success: true } });
    mount();
    await screen.findByText('Admin page');
    fireEvent.click(screen.getByText('Log out'));
    expect(await screen.findByText('Login page')).toBeInTheDocument();
    expect(Axios.post).toHaveBeenCalledWith('/api/logout', {}, { withCredentials: true });
});
test('failed logout preserves signed-in state', async () => {
    Axios.get.mockResolvedValue({ data: { loggedIn: true, user: admin } });
    Axios.post.mockRejectedValue(new Error('offline'));
    mount();
    await screen.findByText('Admin page');
    await act(async () => fireEvent.click(screen.getByText('Log out')));
    expect(screen.getByText('Admin page')).toBeInTheDocument();
});
test('late startup response cannot undo a new login', async () => {
    let resolve;
    Axios.get.mockReturnValue(new Promise(r => { resolve = r; }));
    mount();
    fireEvent.click(screen.getByText('Log in'));
    await act(async () => resolve({ data: { loggedIn: false } }));
    expect(screen.getByText('Admin page')).toBeInTheDocument();
});

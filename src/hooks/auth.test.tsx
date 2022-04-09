import fetchMock from 'jest-fetch-mock';
import { renderHook, act } from '@testing-library/react-hooks';

import { useAuth, AuthProvider } from './auth';

fetchMock.enableMocks();

const userTest = {
    id: 'any_id',
    email: 'ruangoio01@gmail.com',
    given_name: 'Ruan',
    photo: 'any_photo.png'
};

jest.mock('expo-auth-session', () => {
    return {
        startAsync: () => ({
            type: 'success',
            params: {
                access_token: 'any_token',
            }
        }),
    }
});

describe('Auth Hook', () => {
    it('should be able to sign in with Google account existing', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(userTest));

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(() => result.current.signInWithGoogle());

        expect(result.current.user.email)
            .toBe(userTest.email);
    });
});
import fetchMock from 'jest-fetch-mock';
import { renderHook, act } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';

import { useAuth, AuthProvider } from './auth';
import { startAsync } from 'expo-auth-session';

fetchMock.enableMocks();

const userSuccess = {
    id: 'any_id',
    email: 'ruangoio01@gmail.com',
    given_name: 'Ruan',
    photo: 'any_photo.png'
};

const userFailed = {};

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
    it('should be able to sign in with google account existing', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(userSuccess));

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(() => result.current.signInWithGoogle());

        expect(result.current.user.email)
            .toBe(userSuccess.email);
    });

    it('user cancel signIn with google account', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(userFailed));

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(() => result.current.signInWithGoogle());

        expect(result.current.user).toEqual({});
    });
});
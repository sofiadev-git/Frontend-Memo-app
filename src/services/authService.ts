import type {
  AuthRequest,
  AuthResponse
} from '../types';

import api from './api.ts';

const authService = {

  async login(
      request: AuthRequest
  ): Promise<AuthResponse> {

    const response =
        await api.post<AuthResponse>(
            '/auth/login',
            request
        );

    return response.data;
  },

  async deleteAccount(): Promise<void> {
    await api.delete('/users/me');
  }

};

export default authService;
'use client';
import { createContext, useContext } from 'react';

export const AuthReadyContext = createContext(false);
export function useAuthReady() {
  return useContext(AuthReadyContext);
}

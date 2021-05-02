import { Message } from '../models';
import { FAKE_USER, FAKE_USER1 } from './fake-account';

export const FAKE_MESSAGE: Message = {
  id: '789',
  message: 'Coucou',
  user: FAKE_USER,
  time: new Date(),
};

export const FAKE_MESSAGE1: Message = {
  id: '790',
  message: 'Hi',
  user: FAKE_USER1,
  time: new Date(),
};

export const FAKE_MESSAGES: Message[] = [FAKE_MESSAGE, FAKE_MESSAGE1];


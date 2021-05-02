/* import { Observer, Observable } from 'rxjs';
import { Message, User } from '../models';
import { FAKE_USER } from './fake-account.service';
import { FAKE_MESSAGE } from './fake-chat.service';

export class FakeWebSocketService {
  socket: any;
  observerMessage!: Observer<Message>;
  observerUser!: Observer<User>;

  public getMessage(): Observable<Message> {
    return this.createObservableMessage();
  }

  public getUser(): Observable<User> {
    return this.createObservableUser();
  }

  createObservableMessage(): Observable<Message> {
    return new Observable((observer) => {
      this.observerMessage = observer;
    });
  }

  createObservableUser(): Observable<User> {
    return new Observable((observer) => {
      this.observerUser = observer;
    });
  }
}
 */

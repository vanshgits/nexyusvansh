import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginRequest {
  identifier: string; // email OR username
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  register(body: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, body);
  }

  login(body: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, body);
  }
}

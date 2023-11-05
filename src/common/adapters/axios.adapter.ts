import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    let response;

    try {
      response = await this.axios.get<T>(url);
    } catch (error) {
      console.error(error);
      throw new Error('This is an error - Check logs');
    }

    return response.data;
  }
}

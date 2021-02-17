import { AxiosError } from 'axios';

class BatchCallResponseAsError extends Error {
  config: AxiosError['config'];
  request?: AxiosError['request'];
  response?: AxiosError['response'];
  status?: number;
  code?: string;
  constructor(request: any, response: any) {
    super('BatchCallResponseAsError');
    this.code = '200';
    this.request = request;
    this.response = response;
    this.name = 'BatchCallResponseAsError';
  }
}

export default BatchCallResponseAsError;

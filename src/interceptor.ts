import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import BatchCallResponseAsError from './axios.error';
import { BatchHandler } from './batch.handler';
interface IFilteredRequest {
  status: boolean;
  res: [];
}
interface IResponseId {
  id: string;
}

interface IResponseIdMap {
  [key: string]: IResponseId;
}

interface IFilteredResponse {
  list: string[];
  resultMap: IResponseIdMap;
}
const batchInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    async (request: AxiosRequestConfig) => {
      // Add your code here
      throw new BatchCallResponseAsError(
        request,
        BatchHandler.updateBatch(request.params.ids),
      );
    },
    async (error: AxiosError) => {
      await Promise.reject(error);
    },
  );
  instance.interceptors.response.use(
    async (response) => response,
    async (error: AxiosError): Promise<any> => {
      if (isBatchResultReceived(error)) {
        const awaitedResponse = await Promise.resolve(error.response);
        const arr: IFilteredResponse = reduceResponseToFinalObject(
          awaitedResponse,
        );
        const filterResponse: IFilteredRequest = reduceRequestToQueryObject(
          error,
          arr,
        );
        return filterResponse.status
          ? { ...awaitedResponse, data: filterResponse.res }
          : await Promise.reject(error);
      } else {
        return error;
      }
    },
  );
};
const isBatchResultReceived = (error: AxiosError<any>): boolean => {
  return error instanceof BatchCallResponseAsError;
};
const reduceRequestToQueryObject = (
  error: AxiosError<any>,
  arr: IFilteredResponse,
): IFilteredRequest => {
  return error.request.params.ids.reduce(
    (acc: IFilteredRequest, id: string) => {
      const status = acc.status && arr.list.includes(id);
      return {
        status,
        res: [...acc.res, arr.resultMap[id]],
      };
    },
    { status: true, res: [] },
  );
};

const reduceResponseToFinalObject = (awaitedResponse): IFilteredResponse => {
  return awaitedResponse.data.items.reduce(
    (acc: IFilteredResponse, curr: IResponseId) => {
      const list = [...acc.list, curr.id];
      const resultMap = { ...acc.resultMap, [curr.id]: curr };
      return { list, resultMap };
    },
    { list: [], resultMap: {} },
  );
};
export default batchInterceptor;

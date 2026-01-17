/* eslint-disable @typescript-eslint/no-explicit-any */

import { TGenericErrorResponse, TErrorSources } from '../interfaces/error';

const handleZeptoMailError = (err: any): TGenericErrorResponse => {
  const statusCode = err?.response?.status || 500;
  let message = 'ZeptoMail service error';
  let errorSources: TErrorSources = [];

  if (err?.response?.data) {
    const zeptoData = err.response.data;

    message = zeptoData?.error?.message || zeptoData?.message || message;

    errorSources = [
      {
        path: '',
        message:
          zeptoData?.error?.message ||
          zeptoData?.message ||
          'Unknown ZeptoMail error occurred.',
      },
    ];
  } else if (err?.request) {
    message =
      'No response received from ZeptoMail. Please check your network or API key.';
    errorSources = [
      {
        path: '',
        message,
      },
    ];
  } else if (err?.message) {
    message = err.message;
    errorSources = [
      {
        path: '',
        message,
      },
    ];
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handleZeptoMailError;

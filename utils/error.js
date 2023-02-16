export const getError = (error) =>
  error.response && error.response.data && error.response.data.message
    ? error.response.data.message
    : error.message;

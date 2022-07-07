/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */
import fetchIntercept from 'fetch-intercept';

export const unregister = fetchIntercept.register({
  request(url, config) {
    // Modify the url or config here
    config = config || {};
    config.headers = config.headers || {};
    config.headers.token = localStorage.getItem('x-auth-token');
    return [url, config];
  },

  requestError(error) {
    // Called when an error occured during another 'request' interceptor call
    return Promise.reject(error);
  },

  response(response) {
    // Modify the reponse object
    return response;
  },

  responseError(error) {
    // Handle an fetch error
    return Promise.reject(error);
  },
});

// Call fetch to see your interceptors in action.
// fetch('http://google.com');

// // Unregister your interceptor
// unregister();

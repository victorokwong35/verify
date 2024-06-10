const handleAPIErrors = (err) => {
    if (!err.response) {
      // 'You are offline. Please reconnect to the internet'))
      throw err;
    } else if (err.response.status === 401) {
      let error = new Error(err.response.message);
      error.statusCode = 401;
      throw error;
    }else if (err.response.status === 403) {
      let error = new Error(err.response.message);
      error.statusCode = 403;
      throw error;
    }else if (err.response.status === 404) {
      let error = new Error(err.response.message);
      error.statusCode = 404;
      throw error;
    }else if (err.response.status === 429) {
      // check for linkedin account not connected error
      let error = new Error(err.response.message);
      error.statusCode = 429;
      throw error;
    }
    else {
      throw err;
    }
};

module.exports = handleAPIErrors;
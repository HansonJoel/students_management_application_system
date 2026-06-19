// creating a wrapper function to catch the error in async functions and pass it to the global error handler
const catchAsync = (handler) => {
  return function (req, res, next) {
    handler(req, res, next).catch((error) => next(error));
  };
};
module.exports = catchAsync;

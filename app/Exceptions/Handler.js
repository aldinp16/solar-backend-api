'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response }) {
    // send error by name
    switch (error.name) {
      case 'ValidationException':
        return response.badRequest({ status: 400, error: true, data: error.messages })
      case 'UnauthorizedAccessException':
        return response.forbidden({ status: 403, error: true, message: error.message })
      case 'InvalidJwtToken':
        return response.forbidden({ status: 403, error: true, message: error.message })      
      case 'PasswordMisMatchException':
        return response.unauthorized({ status: 401, error: true, message: 'invalid email or password' })
      case 'UserNotFoundException':
        return response.unauthorized({ status: 401, error: true, message: 'invalid email or password' })
      case 'ModelNotFoundException':
        const modelName = error.message.split(' ')[6]
        return response.notFound({ status: 404, error: true, message: `${modelName} not found` })
    }

    // send error by status if error name HttpException
    if (error.name === 'HttpException') {
      switch (error.status) {
        case 404: return response.notFound({ status: 404, error: true, message: 'route not found' })
      }
    }

    return response.internalServerError({ status: 500, error: true, message: 'something wrong! try again later' })
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  // async report (error, { request }) {
  //   console.error(error)
  //   console.error(error.name)
  //   console.error(error.status)
  // }
}

module.exports = ExceptionHandler

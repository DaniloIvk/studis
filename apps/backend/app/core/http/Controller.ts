import { Request, Response, NextFunction } from 'express';

export interface ControllerContract {
  [key: string]: any; // Additional data passed to the controller method
  readonly request: Request;
  readonly response: Response;
  readonly next: NextFunction;
}

abstract class Controller {
  readonly [key: string]: (request: ControllerContract) => void;
}

export default Controller;

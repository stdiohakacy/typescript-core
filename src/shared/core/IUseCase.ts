import { ICommand, IQuery } from './ICQRS';
export interface IUseCaseCQRS {
    handler()
}
export interface IUseCaseCommandCQRS<TIn extends ICommand, TOut> extends IUseCaseCQRS {
    handler(param?: TIn): Promise<TOut> | TOut;
}
export interface IUseCaseQueryCQRS<TIn extends IQuery, TOut> extends IUseCaseCQRS {
    handler(param?: TIn): Promise<TOut> | TOut;
}

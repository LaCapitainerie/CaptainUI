export type CustomResponseType<Element> = 
    | ResponseErrorType
    | ResponseSuccessType<Element>;

type ResponseErrorType = {
    success: false;
    error: string;
};

type ResponseSuccessType<Element> = {
    success: true;
    data: Element;
};

export function isResponseErrorType<Element>(
    response: CustomResponseType<Element>
): response is ResponseErrorType {
    return !response.success;
}
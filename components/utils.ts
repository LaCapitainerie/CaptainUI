export type AuthorizedKey<T, TValue> = {
    [K in keyof T]: T[K] extends TValue ? K : never
}[keyof T]
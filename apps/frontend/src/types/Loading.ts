export type LoadingContext = {
  readonly loading: boolean;
  setLoading(loading: boolean | ((loading: boolean) => any)): void;
};

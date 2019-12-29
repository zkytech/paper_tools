/// <reference types="react-scripts" />
declare module '*.module.less';
declare type CalcResult = {
  W: number[];
  W_normalization: number[];
  lambda: number[];
  lambda_max: number;
  CI: number;
  CR: number;
};

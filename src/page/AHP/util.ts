/**
 * 层次分析计算
 * @param imp
 */
export function calcW(imp: (string | number)[][]): CalcResult {
  const n = imp.length;
  const imp_: number[][] = imp.map(nums =>
    nums.map(val => {
      const isStr = typeof val === 'string';
      if (isStr) {
        val = val as string;
        const isInt = val.indexOf('/') === -1;
        if (isInt) {
          return parseInt(val);
        } else {
          return 1 / parseInt((val as string).split('/')[1]);
        }
      } else {
        val = val as number;
        return val;
      }
    })
  );
  // 计算权重
  const W = imp_.map(nums => Math.pow(multiplication(nums), 1 / n));
  const W_sum = sum(W);
  const W_normalization = W.map(val => val / W_sum);

  // 计算λ
  const lambda = imp_.map(
    (nums, i) => sum(nums.map((val, j) => val * W[j])) / W[i]
  );
  const lambda_max = sum(lambda) / n;

  // 计算CR
  const CI = (lambda_max - n) / (n - 1);
  const CR = CI / RI[n];
  return { W, W_normalization, lambda, lambda_max, CI, CR };
}

/** 平均随机一致性指标 */
const RI = [
  0,
  0,
  0.52,
  0.89,
  1.12,
  1.26,
  1.36,
  1.41,
  1.46,
  1.49,
  1.52,
  1.54,
  1.56,
  1.58
];

/**
 * 数组累乘
 * @param nums
 */
function multiplication(nums: number[]) {
  let result = 1;
  nums.forEach(val => (result *= val as number));
  return result;
}

/**
 * 数组求和
 * @param nums
 */
function sum(nums: number[]) {
  let result = 0;
  nums.forEach(val => (result += val));
  return result;
}

import React, { useState, useEffect } from 'react';
import { Tag, Input, Row, Col } from 'antd';
import { calcW } from './util';

interface Props {}

function Index() {
  const [metrics, setMetrics] = useState<string[]>([]); // 指标列表
  const [eMetric, setEMetric] = useState<string>(''); // 指标输入框中的值
  const [imp, setImp] = useState<string[][]>([]); // 重要性矩阵
  const [update, setUpdate] = useState<boolean>(true); //  用于强制更新
  const [calcResult, setCalcResult] = useState<CalcResult>(); // 计算结果
  const [readyToCalc, setReadyToCalc] = useState<boolean>(false);
  useEffect(() => {
    if (metrics.length < 3) return;
    if (
      imp.every(nums =>
        nums.every(val => {
          if (val === '') {
            return false;
          } else {
            return true;
          }
        })
      )
    ) {
      setReadyToCalc(true);
      setCalcResult(calcW(imp));
    } else {
      setReadyToCalc(false);
    }
  }, [update, metrics, imp]);
  /**
   * 添加指标
   * @param metric
   */
  function addMetric(metric: string) {
    setMetrics(metrics.concat(metric));
    // 先更新矩阵形状
    for (let i = 0; i < imp.length; i++) {
      imp[i].push('');
    }
    imp.push(metrics.map(() => ''));
    // 修正对称中心的值
    for (let i = 0; i < imp.length; i++) {
      imp[i][i] = '1';
    }
    // 重置输入框
    setEMetric('');
    // 强制刷新
    setUpdate(!update);
  }

  /**
   * 删除指标
   * @param metric
   */
  function delMetric(metric: string) {
    const targetIndex = metrics.indexOf(metric);
    metrics.splice(targetIndex, 1);
    setMetrics(metrics);
    // 删除矩阵中对应的值
    // 先删除对应的行
    imp.splice(targetIndex, 1);
    // 再删除对应的列
    for (let i = 0; i < imp.length; i++) {
      imp[i].splice(targetIndex, 1);
    }
    // 强制刷新
    setUpdate(!update);
  }

  /**
   * 修改矩阵的值
   * @param row
   * @param col
   * @param value
   */
  function changeImp(row: number, col: number, value: string) {
    imp[row][col] = value;
    const isInt = value.indexOf('/') === -1;
    // 显示分数
    if (isInt) {
      imp[col][row] = `1/${value}`;
    } else {
      imp[col][row] = value.split('/')[1];
    }
    setImp(imp);
    setUpdate(!update);
  }
  return (
    <div>
      <Row style={{ height: 50, marginTop: 10 }}>
        {/* 把所有指标单独列出来 */}
        <Col>
          {metrics.map((metric, index) => (
            <Tag
              key={metric + index}
              closable
              onClose={(e: any) => {
                e.preventDefault();
                delMetric(metric);
              }}
            >
              {metric}
            </Tag>
          ))}
        </Col>
      </Row>
      <Row style={{ height: 100 }}>
        <Col>
          <Input
            style={{ width: 200 }}
            addonAfter={
              <span
                onClick={() => addMetric(eMetric)}
                style={{ cursor: 'pointer' }}
              >
                添加指标
              </span>
            }
            placeholder="请输入指标名称"
            value={eMetric}
            onChange={e => setEMetric(e.target.value)}
            onPressEnter={e => addMetric(eMetric)}
          />
        </Col>
      </Row>
      <Row>
        <Col style={{ alignContent: 'center' }}>
          {/* 层次分析表格 */}
          <table
            style={{
              margin: 'auto'
            }}
          >
            <tbody>
              <tr>
                <td></td>
                {metrics.map((metric, index) => (
                  <td key={metric + index}>{metric}</td>
                ))}
                {metrics.length > 2 ? <td>权重</td> : null}
              </tr>
              {metrics.map((metric, row) => (
                <tr key={metric + row}>
                  <td>{metric}</td>
                  {metrics.map((metric, col) => (
                    <td key={metric + col}>
                      <Input
                        disabled={row === col}
                        onChange={e => changeImp(row, col, e.target.value)}
                        value={imp[row][col] as string}
                        style={{ textAlign: 'center' }}
                      />
                    </td>
                  ))}
                  <td>
                    {readyToCalc && calcResult
                      ? Math.round(calcResult.W_normalization[row] * 100) / 100
                      : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Col>
      </Row>
      <Row>
        <Col>
          {calcResult ? `CI=${Math.round(calcResult.CI * 100) / 100}` : ''}
        </Col>
        <Col>
          {calcResult ? (
            <div>
              {calcResult.CI < 0.1 ? (
                <span style={{ color: 'green' }}>Pass</span>
              ) : (
                <span style={{ color: 'red' }}>
                  Please adjust the parameters
                </span>
              )}
            </div>
          ) : (
            ''
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Index;

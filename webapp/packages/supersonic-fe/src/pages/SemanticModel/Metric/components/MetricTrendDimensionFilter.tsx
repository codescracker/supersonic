import { Form, Select, Space, Tag, Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useRef } from 'react';
import RemoteSelect, { RemoteSelectImperativeHandle } from '@/components/RemoteSelect';
import { queryDimValue } from '@/pages/SemanticModel/service';
import { OperatorEnum } from '@/pages/SemanticModel/enum';
import { isString } from 'lodash';
import styles from '../style.less';

const FormItem = Form.Item;

type Props = {
  dimensionOptions: { value: string; label: string }[];
  modelId: number;
  value?: FormData;
  onChange?: (value: FormData) => void;
};

export type FormData = {
  dimensionBizName: string;
  operator: OperatorEnum;
  dimensionValue: string | string[];
};

const MetricTrendDimensionFilter: React.FC<Props> = ({
  dimensionOptions,
  modelId,
  value,
  onChange,
}) => {
  const [form] = Form.useForm();

  const dimensionValueSearchRef = useRef<RemoteSelectImperativeHandle>();
  const queryParams = useRef<{ dimensionBizName?: string }>({});

  const [formData, setFormData] = useState<FormData>({ operator: OperatorEnum.IN } as FormData);

  useEffect(() => {
    if (!value) {
      return;
    }
    form.setFieldsValue(value);
    setFormData(value);
  }, [value]);

  useEffect(() => {
    if (formData.dimensionBizName) {
      queryParams.current = { dimensionBizName: formData.dimensionBizName };
      dimensionValueSearchRef.current?.emitSearch('');
    }
  }, [formData.dimensionBizName]);

  const loadSiteName = async (searchValue: string) => {
    if (!queryParams.current?.dimensionBizName) {
      return;
    }
    const { dimensionBizName } = queryParams.current;
    const { code, data } = await queryDimValue({
      ...queryParams.current,
      value: searchValue,
      modelId,
      limit: 50,
    });
    if (code === 200 && Array.isArray(data?.resultList)) {
      return data.resultList.slice(0, 50).map((item: any) => ({
        value: item[dimensionBizName],
        label: item[dimensionBizName],
      }));
    }
    return [];
  };
  const multipleValueOperator = [OperatorEnum.IN];
  return (
    <Form
      layout="inline"
      form={form}
      colon={false}
      initialValues={{
        ...formData,
      }}
      onValuesChange={(value, values) => {
        const { operator, dimensionValue } = values;

        if (multipleValueOperator.includes(operator) && isString(dimensionValue)) {
          const tempDimensionValue = [dimensionValue];
          setFormData({ ...values, dimensionValue: tempDimensionValue });
          form.setFieldValue('dimensionValue', tempDimensionValue);
          return;
        }
        if (!multipleValueOperator.includes(operator) && Array.isArray(dimensionValue)) {
          const tempDimensionValue = dimensionValue[0];
          setFormData({ ...values, dimensionValue: tempDimensionValue });
          form.setFieldValue('dimensionValue', tempDimensionValue);
          return;
        }
        setFormData(values);
      }}
    >
      <Space>
        <FormItem name="dimensionBizName" noStyle>
          <Select
            style={{ minWidth: 150 }}
            options={dimensionOptions}
            showSearch
            filterOption={(input, option) =>
              ((option?.label ?? '') as string).toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            placeholder="请选择筛选维度"
          />
        </FormItem>
        <Tag color="processing" style={{ margin: 0, padding: 0 }}>
          <FormItem name="operator" noStyle>
            <Select
              style={{ minWidth: 72 }}
              bordered={false}
              options={Object.values(OperatorEnum).map((operator: string) => {
                return {
                  value: operator,
                  label: operator,
                };
              })}
            />
          </FormItem>
        </Tag>
        <FormItem name="dimensionValue" noStyle>
          <RemoteSelect
            placeholder={formData.dimensionBizName ? '请输入维度值搜索' : '请先选择一个维度'}
            ref={dimensionValueSearchRef}
            style={{ minWidth: 150 }}
            maxTagCount={3}
            mode={multipleValueOperator.includes(formData.operator) ? 'multiple' : undefined}
            fetchOptions={loadSiteName}
          />
        </FormItem>
        <Tooltip title={'添加筛选条件'}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              const formValues = form.getFieldsValue();
              onChange?.(formValues);
            }}
          />
        </Tooltip>
      </Space>
    </Form>
  );
};

export default MetricTrendDimensionFilter;

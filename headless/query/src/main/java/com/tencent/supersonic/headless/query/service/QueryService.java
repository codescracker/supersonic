package com.tencent.supersonic.headless.query.service;

import com.tencent.supersonic.auth.api.authentication.pojo.User;
import com.tencent.supersonic.headless.common.model.response.ExplainResp;
import com.tencent.supersonic.headless.common.model.response.QueryResultWithSchemaResp;
import com.tencent.supersonic.headless.common.query.request.ExplainSqlReq;
import com.tencent.supersonic.headless.common.query.request.ItemUseReq;
import com.tencent.supersonic.headless.common.query.request.MetricReq;
import com.tencent.supersonic.headless.common.query.request.QueryDimValueReq;
import com.tencent.supersonic.headless.common.query.request.QueryS2SQLReq;
import com.tencent.supersonic.headless.common.query.request.QueryMultiStructReq;
import com.tencent.supersonic.headless.common.query.request.QueryStructReq;
import com.tencent.supersonic.headless.common.query.response.ItemUseResp;
import com.tencent.supersonic.headless.query.persistence.pojo.QueryStatement;
import java.util.List;

public interface QueryService {

    Object queryBySql(QueryS2SQLReq querySqlCmd, User user) throws Exception;

    QueryResultWithSchemaResp queryByStruct(QueryStructReq queryStructCmd, User user) throws Exception;

    QueryResultWithSchemaResp queryByStructWithAuth(QueryStructReq queryStructCmd, User user)
            throws Exception;

    QueryResultWithSchemaResp queryByMultiStruct(QueryMultiStructReq queryMultiStructCmd, User user) throws Exception;

    QueryResultWithSchemaResp queryDimValue(QueryDimValueReq queryDimValueReq, User user);

    Object queryByQueryStatement(QueryStatement queryStatement);

    List<ItemUseResp> getStatInfo(ItemUseReq itemUseCommend);

    <T> ExplainResp explain(ExplainSqlReq<T> explainSqlReq, User user) throws Exception;

    QueryStatement parseMetricReq(MetricReq metricReq) throws Exception;

}

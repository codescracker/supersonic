package com.tencent.supersonic.headless.common.materialization.response;

import com.google.common.collect.Lists;
import com.tencent.supersonic.common.pojo.enums.TypeEnums;
import com.tencent.supersonic.headless.common.model.pojo.Measure;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MaterializationElementModelResp {
    private Long id;
    private TypeEnums type;
    private String bizName;
    private String expr;
    private List<Measure> measures = Lists.newArrayList();
}

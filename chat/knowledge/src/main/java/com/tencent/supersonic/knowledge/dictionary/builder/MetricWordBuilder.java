package com.tencent.supersonic.knowledge.dictionary.builder;

import com.google.common.collect.Lists;

import java.util.List;

import com.tencent.supersonic.chat.api.pojo.SchemaElement;
import com.tencent.supersonic.knowledge.dictionary.DictWord;
import com.tencent.supersonic.knowledge.dictionary.DictWordType;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Metric DictWord
 */
@Service
public class MetricWordBuilder extends BaseWordBuilder {

    @Value("${nlp.metric.use.suffix:true}")
    private boolean nlpMetricUseSuffix = true;

    @Override
    public List<DictWord> doGet(String word, SchemaElement schemaElement) {
        List<DictWord> result = Lists.newArrayList();
        result.add(getOnwWordNature(word, schemaElement, false));
        if (nlpMetricUseSuffix) {
            String reverseWord = StringUtils.reverse(word);
            if (!word.equalsIgnoreCase(reverseWord)) {
                result.add(getOnwWordNature(reverseWord, schemaElement, true));
            }
        }
        return result;
    }

    private DictWord getOnwWordNature(String word, SchemaElement schemaElement, boolean isSuffix) {
        DictWord dictWord = new DictWord();
        dictWord.setWord(word);
        Long domainId = schemaElement.getDomain();
        String nature = DictWordType.NATURE_SPILT + domainId + DictWordType.NATURE_SPILT + schemaElement.getId()
                + DictWordType.METRIC.getType();
        if (isSuffix) {
            nature = DictWordType.NATURE_SPILT + domainId + DictWordType.NATURE_SPILT + schemaElement.getId()
                    + DictWordType.SUFFIX.getType() + DictWordType.METRIC.getType();
        }
        dictWord.setNatureWithFrequency(String.format("%s " + DEFAULT_FREQUENCY, nature));
        return dictWord;
    }

}
# -*- coding:utf-8 -*-

import asyncio

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from util.logging_utils import logger

from sql.constructor import FewShotPromptTemplate2
from sql.sql_agent import Text2DSLAgent, Text2DSLAgentConsistency, Text2DSLAgentWrapper

from instances.llm_instance import llm
from instances.text2vec import Text2VecEmbeddingFunction
from instances.chromadb_instance import client
from instances.logging_instance import logger

from few_shot_example.sql_exampler import examplars as sql_examplars
from config.config_parse import (TEXT2DSLAGENT_COLLECTION_NAME, TEXT2DSLAGENTCS_COLLECTION_NAME, 
                    TEXT2DSL_EXAMPLE_NUM, TEXT2DSL_FEWSHOTS_NUM, TEXT2DSL_SELF_CONSISTENCY_NUM,
                    TEXT2DSL_IS_SHORTCUT, TEXT2DSL_IS_SELF_CONSISTENCY)


emb_func = Text2VecEmbeddingFunction()
text2dsl_agent_collection = client.get_or_create_collection(name=TEXT2DSLAGENT_COLLECTION_NAME,
                                            embedding_function=emb_func,
                                            metadata={"hnsw:space": "cosine"})
text2dsl_agentcs_collection = client.get_or_create_collection(name=TEXT2DSLAGENTCS_COLLECTION_NAME,
                                            embedding_function=emb_func,
                                            metadata={"hnsw:space": "cosine"})

text2dsl_agent_example_prompter = FewShotPromptTemplate2(collection=text2dsl_agent_collection,
                                            few_shot_examples=sql_examplars,
                                            retrieval_key="question",
                                            few_shot_seperator='\n\n')

text2dsl_agentcs_example_prompter = FewShotPromptTemplate2(collection=text2dsl_agentcs_collection,
                                            few_shot_examples=sql_examplars,
                                            retrieval_key="question",
                                            few_shot_seperator='\n\n')

text2sql_agent = Text2DSLAgent(num_fewshots=TEXT2DSL_EXAMPLE_NUM, 
                               sql_example_prompter=text2dsl_agent_example_prompter, llm=llm)

text2sql_cs_agent = Text2DSLAgentConsistency(num_fewshots=TEXT2DSL_FEWSHOTS_NUM, num_examples=TEXT2DSL_EXAMPLE_NUM, num_self_consistency=TEXT2DSL_SELF_CONSISTENCY_NUM,
                                            sql_example_prompter=text2dsl_agentcs_example_prompter, llm=llm)

text2sql_agent.update_examples(sql_examplars, TEXT2DSL_EXAMPLE_NUM)

text2sql_cs_agent.update_examples(sql_examplars, TEXT2DSL_EXAMPLE_NUM, TEXT2DSL_FEWSHOTS_NUM, TEXT2DSL_SELF_CONSISTENCY_NUM)


text2sql_agent_router = Text2DSLAgentWrapper(sql_agent=text2sql_agent, sql_agent_cs=text2sql_cs_agent,
                                            is_shortcut=TEXT2DSL_IS_SHORTCUT, is_self_consistency=TEXT2DSL_IS_SELF_CONSISTENCY) 
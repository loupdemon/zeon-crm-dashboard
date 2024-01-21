import os
from typing import Dict, Any
from typing import List

from langchain.docstore.document import Document
from qdrant_client import models

from entities.action_entity import ActionDTO
from shared.utils.opencopilot_utils import get_vector_store
from shared.utils.opencopilot_utils.interfaces import StoreOptions
from utils.llm_consts import initialize_qdrant_client

client = initialize_qdrant_client()

actions_collection = get_vector_store(StoreOptions("actions"))


def get_action(point_id: str):
    points = client.retrieve(
        collection_name="actions",
        ids=[point_id],
    )

    return points[0]


def create_actions(actions: List[ActionDTO]):
    documents: List[Document] = []
    for action in actions:
        description = action.description if action.description else ""
        document = Document(page_content=description + action.name)
        document.metadata.update(action.model_dump())

        documents.append(document)

    vector_ids = actions_collection.add_documents(documents)
    return vector_ids


# @deprecated, using create_actions
def create_action(action: ActionDTO):
    documents: List[Document] = []

    description = str(action.description) if action.description else ""
    name = str(action.name) if action.name else ""

    document = Document(page_content=description + " " + name)

    document.metadata.update(action.model_dump())

    documents.append(document)

    vector_ids = actions_collection.add_documents(documents)
    return vector_ids


Payload = Dict[str, Any]


def get_all_actions(chatbot_id: str, limit: int = 20, offset: int = 0) -> List[Payload]:
    [records, pointId] = client.scroll(
        collection_name="actions",
        scroll_filter=models.Filter(
            must=[
                models.FieldCondition(
                    key="metadata.chatbot_id",
                    match=models.MatchValue(value=str(chatbot_id)),
                )
            ],
        ),
        limit=limit,
        offset=offset,
        with_payload=True,
        with_vectors=False,
    )

    actions: List[Payload] = []
    for record in records:
        payload = record.payload

        if payload is not None:
            actions.append({"payload": payload, "id": record.id})

    return actions


def update_action(action: ActionDTO, point_id: str):
    client.set_payload(
        collection_name="actions",
        payload={"metadata": action},
        points=[point_id],
    )


def delete_action(point_id: str):
    client.clear_payload(
        collection_name="actions",
        points_selector=models.PointIdsList(
            points=[point_id],
        ),
    )

import asyncio
import os
from enum import Enum
from logging import getLogger
from typing import Any, Mapping, Optional, Union

from bson import CodecOptions
from motor.core import AgnosticClient, AgnosticDatabase
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, Field

from utils.hackathon_context import hackathon_name_ctx

log = getLogger(__name__)

STAGING_ENV = os.getenv("DEPLOYMENT") == "STAGING"

MONGODB_URI = os.getenv("MONGODB_URI")

# Mypy thinks AgnosticClient is a generic type, but providing type parameters to it
# raises a TypeError.
MONGODB_CLIENT: AgnosticClient = AsyncIOMotorClient(MONGODB_URI)  # type: ignore



async def insert(
    collection: Collection, data: Mapping[str, object]
) -> Union[str, bool]:
    """Insert a document into the specified collection of the database"""
    pass


async def retrieve_one(
    collection: Collection, query: Mapping[str, object], fields: list[str] = []
) -> Optional[dict[str, Any]]:
    """Search for and retrieve the specified fields of all documents (if any exist)
    that satisfy the provided query."""
    pass


async def retrieve(
    collection: Collection, query: Mapping[str, object], fields: list[str] = []
) -> list[dict[str, object]]:
    """Search for and retrieve the specified fields of a document (if any exist)
    that satisfy the provided query."""
    pass

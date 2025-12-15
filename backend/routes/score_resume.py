from fastapi import APIRouter

router = APIRouter()


@router.post("/score")
async def score_resume():
    return {"message": "Score resume endpoint"}


@router.get("/status")
async def get_score_status():
    return {"message": "Get score status"}


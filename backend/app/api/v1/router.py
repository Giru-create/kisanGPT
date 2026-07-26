from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.chat import router as chat_router
from app.api.v1.disease import router as disease_router
from app.api.v1.health import router as health_router
from app.api.v1.market import router as market_router
from app.api.v1.voice import router as voice_router
from app.api.v1.weather import router as weather_router

router = APIRouter()

router.include_router(health_router, prefix="/health", tags=["health"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(chat_router, prefix="/chat", tags=["chat"])
router.include_router(weather_router, prefix="/weather", tags=["weather"])
router.include_router(disease_router, prefix="/disease", tags=["disease"])
router.include_router(market_router, prefix="/market", tags=["market"])
router.include_router(voice_router, prefix="/voice", tags=["voice"])

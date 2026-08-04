from pydantic import model_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "KisanGPT"
    VERSION: str = "0.1.0"
    DEBUG: bool = False

    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GEMINI_ORCHESTRATOR_MODEL: str = "gemini-2.5-flash"
    FIREBASE_SERVICE_ACCOUNT_KEY: str = ""
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000

    OPENWEATHERMAP_API_KEY: str = ""
    OPEN_METEO_BASE_URL: str = "https://api.open-meteo.com/v1"
    WEATHER_TIMEOUT: float = 10.0
    WEATHER_CACHE_TTL: int = 600

    GEMINI_VISION_MODEL: str = "gemini-2.0-flash"
    MAX_IMAGE_SIZE_MB: int = 10
    MAX_UPLOAD_SIZE_MB: int = 50
    DISEASE_TIMEOUT: float = 60.0
    DISEASE_CACHE_TTL: int = 3600

    MARKET_PROVIDER: str = "mock"  # "mock" | "live"
    MARKET_LIVE_URL: str = ""
    MARKET_CACHE_TTL: int = 300
    MARKET_TIMEOUT: float = 10.0

    CACHE_TTL: int = 600
    RETRY_COUNT: int = 3
    RETRY_BASE_DELAY: float = 0.5
    REQUEST_TIMEOUT: float = 10.0

    RAG_TOP_K: int = 5
    RAG_CHUNK_SIZE: int = 500
    RAG_CHUNK_OVERLAP: int = 100
    RAG_MIN_SCORE: float = 0.3
    RAG_COLLECTION: str = "farm_knowledge"
    DOCUMENTS_PATH: str = "data"

    VOICE_STT_TIMEOUT: float = 30.0
    VOICE_TTS_TIMEOUT: float = 30.0
    VOICE_SUPPORTED_LANGUAGES: list[str] = ["hi-IN", "pa-IN", "en-US"]

    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_DEFAULT_PER_MINUTE: int = 60
    RATE_LIMIT_CHAT_PER_MINUTE: int = 20
    RATE_LIMIT_DISEASE_PER_MINUTE: int = 10
    RATE_LIMIT_VOICE_PER_MINUTE: int = 20
    RATE_LIMIT_WEATHER_PER_MINUTE: int = 30
    RATE_LIMIT_MARKET_PER_MINUTE: int = 30

    # Production security settings
    TRUSTED_HOSTS: list[str] = ["localhost", "127.0.0.1"]
    SESSION_COOKIE_SECURE: bool = False
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SAMESITE: str = "lax"

    @model_validator(mode="after")
    def _validate_production_settings(self) -> "Settings":
        """Validate security-critical settings on startup."""
        if not self.DEBUG:
            if not self.GEMINI_API_KEY:
                import warnings

                warnings.warn(
                    "GEMINI_API_KEY is empty — AI features will fail",
                    stacklevel=2,
                )
            if not self.FIREBASE_SERVICE_ACCOUNT_KEY:
                import warnings

                warnings.warn(
                    "FIREBASE_SERVICE_ACCOUNT_KEY is empty — auth will be rejected",
                    stacklevel=2,
                )
            if self.SESSION_COOKIE_SECURE is False:
                import warnings

                warnings.warn(
                    "SESSION_COOKIE_SECURE is False in production — "
                    "cookies will be sent over HTTP",
                    stacklevel=2,
                )
        return self

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()

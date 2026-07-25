from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "KisanGPT"
    VERSION: str = "0.1.0"
    DEBUG: bool = False

    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"
    FIREBASE_SERVICE_ACCOUNT_KEY: str = ""
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000

    OPENWEATHERMAP_API_KEY: str = ""
    WEATHER_TIMEOUT: float = 10.0
    WEATHER_CACHE_TTL: int = 600

    GEMINI_VISION_MODEL: str = "gemini-2.0-flash"
    MAX_IMAGE_SIZE_MB: int = 10
    DISEASE_TIMEOUT: float = 60.0
    DISEASE_CACHE_TTL: int = 3600

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()

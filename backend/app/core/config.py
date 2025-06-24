from typing import Any, Dict, List, Optional, Union
import os

from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SERVER_NAME: str = os.getenv("SERVER_NAME", "localhost")
    SERVER_HOST: AnyHttpUrl = os.getenv("SERVER_HOST", "http://localhost")

    # Azure App Service sets WEBSITE_HOSTNAME
    AZURE_WEBSITE_HOSTNAME: Optional[str] = os.getenv("WEBSITE_HOSTNAME")
    
    # Get CORS origins from environment variable or use defaults
    _cors_origins_env = os.getenv("BACKEND_CORS_ORIGINS", "")
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = (
        [origin.strip() for origin in _cors_origins_env.split(",") if origin.strip()]
        if _cors_origins_env
        else [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:8080",
            "https://pnl-ui-gen-eyghekgzc3fxfbf3.centralus-01.azurewebsites.net",
            "https://*.azurewebsites.net"
        ]
    )

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    @classmethod
    def assemble_cors_origins(cls, value: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(value, str) and not value.startswith("["):
            return [i.strip() for i in value.split(",")]
        if isinstance(value, (list, str)):
            return value
        raise ValueError(value)

    PROJECT_NAME: str = "Container Management Backend"

    # Database configuration with Azure defaults
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "password")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "demo")
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    @classmethod
    def assemble_db_connection(cls, value: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(value, str):
            return value
        
        # Check for Azure Database for PostgreSQL connection string
        azure_conn_string = os.getenv("AZURE_POSTGRESQL_CONNECTIONSTRING")
        if azure_conn_string:
            return azure_conn_string
            
        # Check for direct database URL
        database_url = os.getenv("DATABASE_URL")
        if database_url:
            return database_url
            
        # Build connection string from individual components
        postgres_server = values.get('POSTGRES_SERVER')
        postgres_user = values.get('POSTGRES_USER')
        postgres_password = values.get('POSTGRES_PASSWORD')
        postgres_db = values.get('POSTGRES_DB')
        postgres_port = os.getenv('POSTGRES_PORT', '5432')
        
        # Add SSL mode for Azure PostgreSQL
        ssl_mode = os.getenv('POSTGRES_SSL_MODE', 'require')
        
        dsn = (
            f"postgresql://{postgres_user}:"
            f"{postgres_password}@{postgres_server}:"
            f"{postgres_port}/{postgres_db}"
        )
        
        # Add SSL parameter if not localhost
        if postgres_server != 'localhost':
            dsn += f"?sslmode={ssl_mode}"
            
        return dsn

    @property
    def all_cors_origins(self) -> List[str]:
        return self.BACKEND_CORS_ORIGINS

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"  # Ignore extra environment variables


settings = Settings()

# Add Azure-specific CORS origins if deployed
if settings.AZURE_WEBSITE_HOSTNAME:
    settings.BACKEND_CORS_ORIGINS.extend([
        f"https://{settings.AZURE_WEBSITE_HOSTNAME}",
        f"http://{settings.AZURE_WEBSITE_HOSTNAME}",
    ])
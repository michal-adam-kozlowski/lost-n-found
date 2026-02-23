# Build context: apps/api/
# Works both with Railway (Root Directory = apps/api) and docker compose (context: ../apps/api)

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Restore layer — cached unless .csproj changes
COPY LostNFound.Api.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish LostNFound.Api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# ── Runtime image ─────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# PORT is injected by Railway at runtime; Program.cs reads it.
# No hardcoded ASPNETCORE_URLS here.
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "LostNFound.Api.dll"]

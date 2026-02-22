# Build context: repository root  (docker compose sets context: ..)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY apps/api/LostNFound.Api.csproj apps/api/
RUN dotnet restore apps/api/LostNFound.Api.csproj

COPY apps/api/ apps/api/
RUN dotnet publish apps/api/LostNFound.Api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# ── Runtime image ─────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "LostNFound.Api.dll"]

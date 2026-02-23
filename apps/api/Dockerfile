# Compatible with Railway (Root Directory = apps/api) and docker compose (context: ../apps/api).

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY LostNFound.Api.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish LostNFound.Api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Railway injects PORT at runtime; ASPNETCORE_URLS is intentionally not hardcoded.
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "LostNFound.Api.dll"]

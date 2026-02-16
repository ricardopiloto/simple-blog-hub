# Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish BlogApi.csproj -c Release -o /app/publish

# Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
RUN groupadd --gid 10000 app && useradd --uid 10000 --gid app --shell /bin/false app \
    && chown -R app:app /app
ENV ASPNETCORE_URLS=http://+:5001
EXPOSE 5001
USER app
ENTRYPOINT ["dotnet", "BlogApi.dll"]

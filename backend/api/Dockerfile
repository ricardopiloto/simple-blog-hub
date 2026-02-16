# Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish BlogApi.csproj -c Release -o /app/publish

# Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
RUN groupadd --gid 10000 blogapp && useradd --uid 10000 --gid blogapp --shell /bin/false blogapp \
    && chown -R blogapp:blogapp /app
ENV ASPNETCORE_URLS=http://+:5001
EXPOSE 5001
USER blogapp
ENTRYPOINT ["dotnet", "BlogApi.dll"]

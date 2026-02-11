# Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish BlogBff.csproj -c Release -o /app/publish

# Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
RUN adduser --disabled-password --gecos "" --uid 1000 app && chown -R app:app /app
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
USER app
ENTRYPOINT ["dotnet", "BlogBff.dll"]

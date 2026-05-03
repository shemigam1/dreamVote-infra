# syntax=docker/dockerfile:1.7

# ---- Build stage ----------------------------------------------------------
# Use the official Maven image with Temurin 25 so the build container has
# both Maven and a matching JDK. We discard this whole stage at the end.
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app

# Copy only pom.xml first and pre-resolve dependencies. This isolates the
# (slow, network-heavy) dep download into its own layer that gets cached
# until pom.xml changes. The cache mount on /root/.m2 reuses Maven's
# local repo across builds for additional speed.
COPY pom.xml ./
RUN --mount=type=cache,target=/root/.m2 mvn -B -e -ntp dependency:go-offline

# Now copy sources and build the fat jar. -DskipTests because tests should
# run in CI, not in the image build.
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -e -ntp clean package -DskipTests

# ---- Runtime stage --------------------------------------------------------
# JRE-only image (no Maven, no JDK tools) - smaller and less attack surface.
FROM eclipse-temurin:25-jre
WORKDIR /app

# curl is needed for HEALTHCHECK below. eclipse-temurin:25-jre is Ubuntu-based
# and ships with neither curl nor wget. --no-install-recommends avoids
# suggested packages; clearing /var/lib/apt/lists keeps the apt cache out
# of the final image (~10 MB saved).
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*

# Dedicated non-root user. uid 1001 is conventional for the first app user;
# --system marks it as a non-login service account.
RUN useradd --system --uid 1001 --no-create-home --shell /usr/sbin/nologin spring

# Activate the docker Spring profile so application-docker.yml is loaded.
# Compose / Kubernetes can still override SPRING_PROFILES_ACTIVE if needed.
ENV SPRING_PROFILES_ACTIVE=docker

# --chown ensures the jar is owned by the spring user.
COPY --from=build --chown=spring:spring /app/target/dreamVote.jar app.jar

USER spring

EXPOSE 8080

# Container is "healthy" only once /actuator/health/readiness reports UP -
# i.e., the JVM started AND Mongo is reachable. Compose uses this to gate
# the frontend's startup (depends_on: service_healthy).
HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=5 \
  CMD curl -fsS http://localhost:8080/actuator/health/readiness || exit 1

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

FROM ubuntu:latest

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    curl \
    && curl -sL https://deb.nodesource.com/setup_20.x | bash \
    && apt-get install -y nodejs \
    && node -v \
    && npm -v

# Set the working directory
WORKDIR /usr/src/app

# Copy the entrypoint script
COPY entrypoint.sh .

# Ensure the entrypoint script is executable
RUN chmod +x entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

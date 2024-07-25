FROM ubuntu:latest

# Install Java
RUN apt-get update && apt-get install -y openjdk-17-jdk

# Set the working directory
WORKDIR /usr/src/app

# Copy the entrypoint script
COPY entrypoint.sh .

# Ensure the entrypoint script is executable
RUN chmod +x entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

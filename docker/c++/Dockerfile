FROM ubuntu:latest

# Install C++ compiler
RUN apt-get update && apt-get install -y \
    g++ \
    make

# Set the working directory
WORKDIR /usr/src/app

# Copy the entrypoint script
COPY entrypoint.sh .

# Ensure the entrypoint script is executable
RUN chmod +x entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
